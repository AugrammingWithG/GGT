import Link from "next/link";
import type { Region } from "@/lib/regions";
import { mediaBg } from "@/lib/media";

export default function RegionCard({
  region,
  className,
}: {
  region: Region;
  className?: string;
}) {
  const [main, inset] = region.photos;

  return (
    <div className={className ? `region-card ${className}` : "region-card"}>
      <div className="region-photos">
        <div className="region-photo-main-wrap">
          <div
            className="region-photo region-photo-main"
            style={{ background: mediaBg(main.bg, main.image, main.focus) }}
          >
            <span className="region-photo-label">{main.label}</span>
          </div>
        </div>
        <div
          className="region-photo region-photo-inset"
          style={{ background: mediaBg(inset.bg, inset.image, inset.focus) }}
        >
          <span className="region-photo-label">{inset.label}</span>
        </div>
      </div>
      <div className="region-body">
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
    </div>
  );
}
