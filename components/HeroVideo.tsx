"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, autoplaying, looping hero background, embedded from the client's own
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
 */

/** The slice of the YouTube IFrame Player API this component touches. */
type YTPlayer = {
  playVideo: () => void;
  destroy: () => void;
};
type YTApi = {
  Player: new (
    el: HTMLIFrameElement,
    opts: {
      events: {
        onReady: (e: { target: YTPlayer }) => void;
        onStateChange: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number };
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
 * Embed URL for a background video: no controls, no keyboard, no annotations,
 * no fullscreen affordance. Only ever called client-side (the iframe mounts
 * after IntersectionObserver fires), so `window` is safe to read.
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
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // Reduced-motion visitors get the still poster frame only.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
          onReady: (e) => e.target.playVideo(),
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setLoaded(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [inView]);

  return (
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
  );
}
