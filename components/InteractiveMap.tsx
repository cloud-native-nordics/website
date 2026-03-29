"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import type { GroupWithData } from "@/lib/types";

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export function InteractiveMap({ groups }: { groups: GroupWithData[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const tileLayer = useRef<L.TileLayer | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [62, 15],
        zoom: 4,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      const isDark = document.documentElement.classList.contains("dark");
      const tiles = L.tileLayer(
        isDark ? DARK_TILES : LIGHT_TILES,
        { attribution: TILE_ATTRIBUTION }
      ).addTo(map);

      tileLayer.current = tiles;

      const markerIcon = L.divIcon({
        html: `<img src="/logo-icon.svg" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        className: "",
      });

      groups.forEach((group) => {
        const nextEvent = group.upcoming_events[0];
        const popupContent = `
          <div style="font-family: Raleway, sans-serif; min-width: 180px;">
            <strong style="font-size: 14px;">${group.name}</strong>
            <div style="color: #6B7280; font-size: 12px; margin: 4px 0;">
              ${group.member_count ? group.member_count.toLocaleString() + " members" : ""}
            </div>
            ${nextEvent ? `<div style="font-size: 12px; margin: 4px 0;">Next: ${nextEvent.title}<br/>${new Date(nextEvent.start_date).toLocaleDateString()}</div>` : ""}
            <a href="/groups/${group.slug}" style="color: #326CE5; font-size: 12px; text-decoration: none;">View group &rarr;</a>
          </div>
        `;

        L.marker([group.latitude, group.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      const bounds = L.latLngBounds(groups.map((g) => [g.latitude, g.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstance.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [groups]);

  useEffect(() => {
    if (tileLayer.current) {
      tileLayer.current.setUrl(theme === "dark" ? DARK_TILES : LIGHT_TILES);
    }
  }, [theme]);

  return (
    <section id="map" className="py-16 bg-warm-white dark:bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-navy dark:text-white">
          Our Communities
        </h2>
        <div className="p-[2px] rounded-xl bg-gradient-to-r from-brand-pink to-brand-gold shadow-lg">
          <div
            ref={mapRef}
            className="h-[400px] sm:h-[500px] rounded-[10px] overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}
