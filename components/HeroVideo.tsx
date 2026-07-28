"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, autoplaying, looping hero background — self-hosted (see
 * public/videos/hero.mp4, pulled from the client's own YouTube upload)
 * rather than embedded from YouTube. A plain `<video>` has no player UI at
 * all to suppress: no logo, no transient play/pause flash on autoplay start
 * or on each loop restart, which an embedded YouTube iframe can't fully
 * avoid. `object-fit:cover` handles the crop-to-fill directly, no manual
 * sizing math needed.
 *
 * The element is only mounted once the hero scrolls into view
 * (IntersectionObserver) so the video file never blocks the initial page
 * load; a poster frame covers the gap until then and until playback is
 * ready.
 */
export default function HeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Belt and suspenders: some browsers still won't honour the `autoplay`
  // attribute alone, even muted, if the element mounts after user gesture
  // heuristics have already run.
  useEffect(() => {
    if (!inView) return;
    videoRef.current?.play().catch(() => {
      // Autoplay blocked — the poster frame stays put, which is fine.
    });
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
        <video
          ref={videoRef}
          className={loaded ? "hero-video-el loaded" : "hero-video-el"}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
