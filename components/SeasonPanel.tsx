"use client";

import { useMemo } from "react";

type Season = {
  name: string;
  blurb: string;
  wine: string;
  food: string;
  gradient: string;
};

const SEASONS: Record<"summer" | "autumn" | "winter" | "spring", Season> = {
  summer: {
    name: "Summer",
    blurb:
      "Long, warm days — bright whites and fresh, lighter plates are the pick right now.",
    wine: "Chilled Semillon & Verdelho",
    food: "Stone fruit, tomatoes & seafood",
    gradient: "linear-gradient(135deg,#C0902B,#E7C878)",
  },
  autumn: {
    name: "Autumn",
    blurb:
      "Vintage season in the vines — fresh reds and earthy, comforting food come into their own.",
    wine: "Young Shiraz & vintage reds",
    food: "Figs, mushrooms & olives",
    gradient: "linear-gradient(135deg,#9a4a2a,#c06a2a)",
  },
  winter: {
    name: "Winter",
    blurb:
      "Cool and cosy — big reds by the fire and slow-cooked, hearty plates are the order of the day.",
    wine: "Bold Shiraz & fortifieds",
    food: "Truffles, root veg & slow roasts",
    gradient: "linear-gradient(135deg,#551520,#8a2a3a)",
  },
  spring: {
    name: "Spring",
    blurb:
      "The valley greens up — crisp whites, rosé and fresh spring produce lead the menu.",
    wine: "Crisp whites & rosé",
    food: "Asparagus, herbs & spring lamb",
    gradient: "linear-gradient(135deg,#4A5D3A,#7a8a3a)",
  },
};

/** Southern-hemisphere season for the current month, in Sydney. */
function currentSeason(): keyof typeof SEASONS {
  const m = new Date().getMonth();
  if (m === 11 || m < 2) return "summer";
  if (m < 5) return "autumn";
  if (m < 8) return "winter";
  return "spring";
}

export default function SeasonPanel() {
  const season = useMemo(() => SEASONS[currentSeason()], []);

  return (
    <div className="season">
      <div className="season-badge" style={{ background: season.gradient }}>
        {season.name}
        <small>in the Hunter</small>
      </div>
      <div className="season-body">
        <span className="eyebrow">Right now in wine country</span>
        <h3>At its best this {season.name.toLowerCase()}</h3>
        <p>
          What&apos;s in the glass and on the plate changes through the year
          — here&apos;s what you&apos;ll likely find on tour right now.
        </p>
        <div className="season-cols">
          <div className="season-col">
            <span>In the glass</span>
            <b>{season.wine}</b>
          </div>
          <div className="season-col">
            <span>On the plate</span>
            <b>{season.food}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
