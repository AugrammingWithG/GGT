/**
 * Purely decorative — the four region cards below already state their
 * direction in accessible text, so this is hidden from assistive tech.
 */
export default function CompassRose() {
  return (
    <svg
      className="compass-rose"
      width="110"
      height="110"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="60" cy="60" r="3.5" fill="var(--gold-muted)" />

      {/* North — emphasised, tip points up (smaller y) */}
      <line x1="60" y1="60" x2="60" y2="18" stroke="var(--wine)" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 10 L66 22 L54 22 Z" fill="var(--wine)" />
      <text x="60" y="10" textAnchor="middle" className="compass-label">N</text>

      {/* East — tip points right (larger x) */}
      <line x1="60" y1="60" x2="98" y2="60" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M106 60 L96 66 L96 54 Z" fill="var(--ink-soft)" />
      <text x="112" y="64" textAnchor="middle" className="compass-label">E</text>

      {/* South — tip points down (larger y) */}
      <line x1="60" y1="60" x2="60" y2="98" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 106 L54 96 L66 96 Z" fill="var(--ink-soft)" />
      <text x="60" y="112" textAnchor="middle" className="compass-label">S</text>

      {/* West — tip points left (smaller x) */}
      <line x1="60" y1="60" x2="22" y2="60" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 60 L24 54 L24 66 Z" fill="var(--ink-soft)" />
      <text x="8" y="64" textAnchor="middle" className="compass-label">W</text>
    </svg>
  );
}
