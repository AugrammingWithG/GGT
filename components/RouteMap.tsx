"use client";

import { useEffect, useRef, useState } from "react";

export default function RouteMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setDrawn(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={drawn ? "route-map drawn" : "route-map"}>
      <svg
        viewBox="0 0 760 300"
        role="img"
        aria-label="Map of the tour route from Sydney through three vineyards and back"
      >
        <path
          className="route-line"
          d="M 70 240 C 160 120, 240 120, 300 90 C 360 60, 430 90, 470 130 C 520 180, 600 180, 690 90"
        />
        <g className="route-node">
          <circle cx="70" cy="240" r="9" />
          <text x="70" y="270" textAnchor="middle">Sydney</text>
          <text x="70" y="287" textAnchor="middle" className="rn-sub">6:35am pickup</text>
        </g>
        <g className="route-node">
          <circle cx="300" cy="90" r="9" />
          <text x="300" y="66" textAnchor="middle">Vineyard one</text>
          <text x="300" y="49" textAnchor="middle" className="rn-sub">first tasting</text>
        </g>
        <g className="route-node">
          <circle cx="470" cy="130" r="9" />
          <text x="470" y="162" textAnchor="middle">Vineyard two</text>
          <text x="470" y="179" textAnchor="middle" className="rn-sub">progressive lunch</text>
        </g>
        <g className="route-node">
          <circle cx="600" cy="150" r="9" />
          <text x="600" y="182" textAnchor="middle">Vineyard three</text>
          <text x="600" y="199" textAnchor="middle" className="rn-sub">final cellar door</text>
        </g>
        <g className="route-node">
          <circle cx="690" cy="90" r="9" />
          <text x="690" y="66" textAnchor="middle">Home</text>
          <text x="690" y="49" textAnchor="middle" className="rn-sub">~6:30pm</text>
        </g>
      </svg>
    </div>
  );
}
