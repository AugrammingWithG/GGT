"use client";

import { useState } from "react";

type Pairing = {
  wine: string;
  wineNote: string;
  dish: string;
  desc: string;
  image: string;
  label: string;
};

const PAIRINGS: Pairing[] = [
  {
    wine: "Hunter Semillon",
    wineNote: "Crisp, citrusy, unoaked",
    dish: "Fresh Sydney rock oysters",
    desc: "Shucked to order with a squeeze of lemon — the Semillon's citrus lift is made for briny, cold oysters.",
    image: "/images/SYDNEY080118_0119.jpg",
    label: "Oysters",
  },
  {
    wine: "Shiraz",
    wineNote: "Bold, peppery, warm",
    dish: "Slow-cooked lamb shoulder",
    desc: "Pulled, sticky and rich, with rosemary and garlic — a bold Shiraz stands right up to it.",
    image: "/images/SYDNEY080118_0120.jpg",
    label: "Lamb shoulder",
  },
  {
    wine: "Chardonnay",
    wineNote: "Rounded, gently oaked",
    dish: "Roast chicken & mushrooms",
    desc: "Buttery, herby and comforting — a gently oaked Chardonnay rounds out every bite.",
    image: "/images/SYDNEY080118_0161.jpg",
    label: "Roast chicken",
  },
  {
    wine: "Verdelho",
    wineNote: "Bright, tropical, fresh",
    dish: "Grilled prawns & mango",
    desc: "Sweet, charred and fresh — the tropical notes of Verdelho echo the mango perfectly.",
    image: "/images/SYDNEY080118_0168.jpg",
    label: "Prawns & mango",
  },
];

export default function WineFoodPairing() {
  const [active, setActive] = useState(0);
  const pairing = PAIRINGS[active];

  return (
    <div className="pair-grid">
      <div className="pair-list">
        {PAIRINGS.map((p, i) => (
          <button
            key={p.wine}
            type="button"
            className={i === active ? "pair-opt active" : "pair-opt"}
            onClick={() => setActive(i)}
          >
            <b>{p.wine}</b>
            <span>{p.wineNote}</span>
          </button>
        ))}
      </div>
      <div className="pair-plate">
        <div
          className="pair-photo fade-swap"
          key={pairing.wine}
          style={{ backgroundImage: `url(${pairing.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <span>{pairing.label}</span>
        </div>
        <div className="pair-plate-body">
          <h3>{pairing.dish}</h3>
          <p>{pairing.desc}</p>
          <span className="pair-match">Paired with {pairing.wine}</span>
        </div>
      </div>
    </div>
  );
}
