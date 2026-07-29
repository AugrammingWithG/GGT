"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Volume2, VolumeX } from "lucide-react";

/**
 * Autoplaying, looping hero background, embedded from the client's own
 * YouTube upload. Self-hosting would give a cleaner player (no chrome to
 * suppress at all) but the master file is far too large to commit — `*.mp4`
 * is gitignored — so the embed is what actually ships.
 *
 * Two things keep it looking like a backdrop rather than a video player:
 * `controls=0` and friends strip the UI, and the iframe only fades in once
 * the IFrame Player API reports PLAYING, so the poster frame covers
 * YouTube's black box and spinner instead of the visitor watching it load.
 *
 * The element is only mounted once the hero scrolls into view
 * (IntersectionObserver) so the embed never blocks the initial page load.
 *
 * Sound: the embed URL always requests `mute=1` because that's the only
 * combination YouTube reliably autoplays across browsers when `controls=0`
 * hides its own native "tap to unmute" fallback prompt. Once the player
 * reports PLAYING — i.e. the muted autoplay actually took — we call
 * `unMute()` once. Doing this before playback starts would turn the
 * autoplay attempt into an unmuted-autoplay request, which browsers'
 * autoplay policies block outright (the player gets stuck in UNSTARTED and
 * the poster never fades); unmuting an already-playing embed doesn't trip
 * that policy. `isMuted()`/`getVolume()` tell us the real state, which
 * drives the control cluster's icons, and those controls let a visitor
 * mute/unmute or nudge the volume by hand at any point.
 */

/** The slice of the YouTube IFrame Player API this component touches. */
type YTPlayer = {
  playVideo: () => void;
  unloadModule: (module: string) => void;
  destroy: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
};
type YTApi = {
  Player: new (
    el: HTMLIFrameElement,
    opts: {
      events: {
        onReady: (e: { target: YTPlayer }) => void;
        onStateChange: (e: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTApi> | null = null;

/**
 * Loads the IFrame Player API once per page. Never rejects: if the script is
 * blocked (ad blockers do reach for youtube.com), the promise simply stays
 * pending, the fade-in never fires and the poster frame stays put. Playback
 * itself doesn't depend on this — the embed autoplays from its URL params.
 */
function loadPlayerApi(): Promise<YTApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise<YTApi>((resolve) => {
      window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

/**
 * Strips the caption track. `cc_load_policy=0` only means "don't force them
 * on" — a visitor whose own YouTube settings enable captions still gets them
 * burned over the hero — so the module has to be unloaded outright. Both
 * names are tried: the HTML5 player answers to "captions", older ones to
 * "cc". Cheap enough to re-run on every loop restart as insurance.
 */
function hideCaptions(player: YTPlayer) {
  for (const name of ["captions", "cc"]) {
    try {
      player.unloadModule(name);
    } catch {
      // Module was never loaded for this video — nothing to unload.
    }
  }
}

/**
 * Embed URL for a background video: no controls, no keyboard, no annotations,
 * no captions, no fullscreen affordance. Only ever called client-side (the
 * iframe mounts after IntersectionObserver fires), so `window` is safe to read.
 */
function embedSrc(videoId: string) {
  const q = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    // `loop` is a no-op on a single video unless the video is also its own
    // one-item playlist. Quirk of the embed API, not a typo.
    loop: "1",
    playlist: videoId,
    controls: "0",
    cc_load_policy: "0",
    disablekb: "1",
    fs: "0",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
    // Required for the Player API to talk to the frame.
    enablejsapi: "1",
    origin: window.location.origin,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${q.toString()}`;
}

export default function HeroVideo({
  videoId,
  poster,
}: {
  videoId: string;
  poster: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const autoUnmuteAttempted = useRef(false);
  const awaitingUnmuteOutcome = useRef(false);
  const unmuteConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Attach to the already-rendered iframe (rather than letting the API build
  // one) so the element keeps its class and attributes. The API is used only
  // as a "frames are on screen now" signal for the fade-in.
  useEffect(() => {
    if (!inView) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    let player: YTPlayer | undefined;
    let cancelled = false;

    loadPlayerApi().then((YT) => {
      if (cancelled) return;
      player = new YT.Player(iframe, {
        events: {
          // Belt and suspenders: some browsers ignore `autoplay=1` when the
          // frame mounts after their gesture heuristics have already run.
          // Blocked autoplay just leaves the poster frame up, which is fine.
          onReady: (e) => {
            hideCaptions(e.target);
            playerRef.current = e.target;
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PAUSED && awaitingUnmuteOutcome.current) {
              // Chrome (and Chromium-based browsers) don't just decline an
              // unmute attempted without prior page interaction — they pause
              // the video outright ("Unmuting failed and the element was
              // paused instead..."). Recover by muting and resuming rather
              // than leaving the hero frozen. The button never showed
              // "unmuted" in the first place (see below), so there's nothing
              // to revert here — just resume playback.
              awaitingUnmuteOutcome.current = false;
              if (unmuteConfirmTimer.current) clearTimeout(unmuteConfirmTimer.current);
              e.target.mute();
              e.target.playVideo();
              return;
            }
            if (e.data !== YT.PlayerState.PLAYING) return;
            // The captions module can load with playback rather than before
            // it, so onReady alone isn't always early enough.
            hideCaptions(e.target);
            setLoaded(true);
            // Only on the first PLAYING transition — the loop restarts this
            // video via the playlist trick, and re-firing unMute() on every
            // restart would stomp a visitor's manual mute.
            if (!autoUnmuteAttempted.current) {
              autoUnmuteAttempted.current = true;
              awaitingUnmuteOutcome.current = true;
              e.target.unMute();
              // Don't flip the button to "unmuted" yet: if the browser is
              // going to force-pause this attempt, that PAUSED event lands
              // a beat later, and reflecting the unmute immediately would
              // just flash unmuted-then-muted-again. Wait to see whether
              // the pause actually arrives before believing it worked.
              const target = e.target;
              unmuteConfirmTimer.current = setTimeout(() => {
                if (!awaitingUnmuteOutcome.current) return;
                awaitingUnmuteOutcome.current = false;
                setMuted(false);
                setVolume(target.getVolume());
              }, 400);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
      if (unmuteConfirmTimer.current) clearTimeout(unmuteConfirmTimer.current);
      player?.destroy();
    };
  }, [inView]);

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      // Unmuting into silence (volume dragged to 0 earlier) would look like
      // the button did nothing.
      if (player.getVolume() === 0) {
        player.setVolume(50);
        setVolume(50);
      }
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }

  function adjustVolume(delta: number) {
    const player = playerRef.current;
    if (!player) return;
    const current = player.isMuted() ? 0 : player.getVolume();
    const next = Math.min(100, Math.max(0, current + delta));
    if (next > 0 && player.isMuted()) player.unMute();
    if (next === 0 && !player.isMuted()) player.mute();
    player.setVolume(next);
    setVolume(next);
    setMuted(player.isMuted());
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="video-bg"
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {inView && (
          <iframe
            ref={iframeRef}
            className={loaded ? "hero-video-el loaded" : "hero-video-el"}
            src={embedSrc(videoId)}
            title="Gourmet Getaway Tours hero video"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>
      {inView && (
        // Deliberately a sibling of .video-bg, not a child — .video-bg carries
        // the Ken Burns `scale()` animation, and a child would drift with it,
        // sliding in and out of the visible frame as the zoom oscillates.
        <div className="hero-video-controls">
          <button
            type="button"
            onClick={() => adjustVolume(-10)}
            aria-label="Decrease volume"
            disabled={muted || volume <= 0}
          >
            <Minus size={13} />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            type="button"
            onClick={() => adjustVolume(10)}
            aria-label="Increase volume"
            disabled={!muted && volume >= 100}
          >
            <Plus size={13} />
          </button>
        </div>
      )}
    </>
  );
}
