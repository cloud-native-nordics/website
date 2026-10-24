"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const LIGHT_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const DARK_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTRIBUTION = "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors";

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

      const isDark = document.documentElement.classList.contains("dark");
      const tiles = L.tileLayer(
        isDark ? DARK_TILES : LIGHT_TILES,
        { attribution: TILE_ATTRIBUTION, maxZoom: 16 }
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
    <div className="p-[2px] rounded-xl bg-gradient-to-r from-nord12 to-nord12">
      <div
        ref={mapRef}
        className="h-[200px] rounded-[10px] overflow-hidden"
      />
    </div>
  );
}
