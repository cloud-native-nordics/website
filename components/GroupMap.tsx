"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

interface GroupMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function GroupMap({ latitude, longitude, name }: GroupMapProps) {
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
        center: [latitude, longitude],
        zoom: 11,
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: false,
      });

      const tiles = L.tileLayer(
        theme === "dark" ? DARK_TILES : LIGHT_TILES,
        { attribution: TILE_ATTRIBUTION }
      ).addTo(map);

      tileLayer.current = tiles;

      const markerIcon = L.divIcon({
        html: `<img src="/logo-icon.svg" style="width: 40px; height: 40px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: "",
      });

      L.marker([latitude, longitude], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<strong>${name}</strong>`);

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
  }, [latitude, longitude, name]);

  useEffect(() => {
    if (tileLayer.current) {
      tileLayer.current.setUrl(theme === "dark" ? DARK_TILES : LIGHT_TILES);
    }
  }, [theme]);

  return (
    <div className="p-[2px] rounded-xl bg-gradient-to-r from-brand-pink to-brand-gold">
      <div
        ref={mapRef}
        className="h-[200px] rounded-[10px] overflow-hidden"
      />
    </div>
  );
}
