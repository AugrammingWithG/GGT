"use client";

import { useRef, useState } from "react";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.q} className={isOpen ? "faq-item open" : "faq-item"}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              {item.q}
            </button>
            <div
              className="faq-a"
              ref={(el) => {
                refs.current[i] = el;
              }}
              style={{
                maxHeight: isOpen ? `${refs.current[i]?.scrollHeight ?? 500}px` : undefined,
              }}
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
