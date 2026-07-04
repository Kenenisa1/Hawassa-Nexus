"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HAWASSA_HUBS, IHubData } from '@/lib/hubs.data';
import Link from 'next/link';

// Fix for default Leaflet icon not showing up in Next.js/React
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PulseMapProps {
  focusedHubSlug?: string;
}

export default function PulseMap({ focusedHubSlug }: PulseMapProps) {
  // If focused on a specific hub, center the map there, otherwise default center
  const focusedHub = focusedHubSlug ? HAWASSA_HUBS.find(h => h.slug === focusedHubSlug) : null;
  const center: [number, number] = focusedHub 
    ? [focusedHub.lat, focusedHub.lng] 
    : [7.062, 38.478];
  
  const zoomLevel = focusedHub ? 15 : 13;

  return (
    <div className="h-[600px] w-full rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative z-0">
      <MapContainer
        key={`${center[0]}-${center[1]}-${zoomLevel}`} // Force re-render if center changes
        center={center} 
        zoom={zoomLevel} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        zoomControl={false}
      >
        {/* The Dark Mode Secret: We use a standard map but apply a CSS filter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        <ZoomControl position="bottomright" />

        {HAWASSA_HUBS.map((hub) => (
          <Marker key={hub.id} position={[hub.lat, hub.lng]} icon={customIcon}>
            <Popup>
              <div className="p-2 text-zinc-900 min-w-[150px]">
                <h4 className="font-bold uppercase tracking-tighter text-sm mb-0.5">{hub.name}</h4>
                <p className="text-[10px] text-sky-600 font-bold mb-3">{hub.am}</p>
                <Link 
                  href={`/hubs/${hub.slug}`}
                  className="block text-center w-full text-[10px] bg-black text-white p-2 rounded uppercase font-black hover:bg-sky-500 hover:text-black transition-colors"
                >
                  Enter Hub
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* CSS to make the Map "OLED Dark" */}
      <style jsx global>{`
        .map-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .leaflet-container {
          background: #000 !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
        }
        .leaflet-popup-content {
          margin: 10px;
        }
      `}</style>
    </div>
  );
}