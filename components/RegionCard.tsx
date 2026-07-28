import Link from "next/link";
import type { Region } from "@/lib/regions";

export default function RegionCard({
  region,
  className,
}: {
  region: Region;
  className?: string;
}) {
  return (
    <div className={className ? `region-card ${className}` : "region-card"}>
      <span className="region-badge" aria-hidden="true">
        {region.arrow}
      </span>
      <span className="region-direction">{region.direction}</span>
      <h3>{region.title}</h3>
      <ul className="region-list">
        {region.destinations.map((d) => (
          <li key={d.name}>
            <b>{d.name}</b> — {d.highlights}
          </li>
        ))}
      </ul>
      <Link href="/contact" className="region-enquire">
        Enquire →
      </Link>
    </div>
  );
}
