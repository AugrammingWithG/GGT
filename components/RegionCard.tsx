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
  return (
    <div className={className ? `region-card ${className}` : "region-card"}>
      <div
        className="region-photo"
        style={{
          background: mediaBg(region.photo.bg, region.photo.image, region.photo.focus),
        }}
      >
        <span className="region-photo-label">{region.photo.label}</span>
      </div>
      <div className="region-body">
        <h3 className="region-lead">
          {region.direction} leads to: <span>{region.title}</span>
        </h3>
        <ul className="region-list">
          {region.destinations.map((d) => (
            <li key={d.name}>
              <strong>{d.name}</strong> — {d.highlights}
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
