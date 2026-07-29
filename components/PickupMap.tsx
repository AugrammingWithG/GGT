"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
import type { BasePoint, PickupPoint } from "@/lib/pickups";

const pinSvg = (fill: string) => `
<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 0C6.7 0 0 6.7 0 15c0 11.3 15 25 15 25s15-13.7 15-25C30 6.7 23.3 0 15 0z" fill="${fill}"/>
  <circle cx="15" cy="15" r="6" fill="#fff"/>
</svg>`;

export default function PickupMap({
  points,
  basePoint,
}: {
  points: PickupPoint[];
  /** Our depot, shown as a distinct gold marker alongside the pickup pins. */
  basePoint?: BasePoint;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const pickupIcon = L.divIcon({
        html: pinSvg("#6E1E2E"),
        className: "pickup-map-pin",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -36],
      });
      const baseIcon = L.divIcon({
        html: pinSvg("#C0902B"),
        className: "pickup-map-pin",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -36],
      });

      const map = L.map(containerRef.current, { scrollWheelZoom: false });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markers = points.map((p) =>
        L.marker([p.lat, p.lng], { icon: pickupIcon }).addTo(map).bindPopup(
          `<strong>${p.name}</strong><br>Pick-up ${p.time}<br><a href="${p.mapLink}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`,
        ),
      );

      if (basePoint) {
        markers.push(
          L.marker([basePoint.lat, basePoint.lng], { icon: baseIcon }).addTo(map).bindPopup(
            `<strong>${basePoint.name}</strong><br>${basePoint.address}<br><a href="${basePoint.mapLink}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`,
          ),
        );
      }

      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.25));
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points, basePoint]);

  return <div ref={containerRef} className="pickup-map" />;
}
