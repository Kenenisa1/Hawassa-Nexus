"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { HiLocationMarker, HiLightningBolt } from "react-icons/hi";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { IEvent } from "@/database/event.model";
import { useLanguage } from "@/context/LanguageContext";
import { HAWASSA_HUBS } from "@/lib/hubs.data";
import Link from "next/link";

const PulseMap = dynamic(() => import("@/components/PulseMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-[3rem] flex items-center justify-center">
      <p className="text-zinc-600 font-black uppercase tracking-widest text-xs italic">Syncing Regional Nodes...</p>
    </div>
  )
});

const content = {
  en: {
    heading: "Regional",
    subheading: "Community Hubs & Density Map",
    statsLabel: "Live Nodes",
    clusterLabel: "Active Clusters",
    description: "Hubs provide a bird's eye view of the community's physical activity. Use the map to identify event clusters in your city.",
  },
  am: {
    heading: "ክልላዊ",
    subheading: "የማህበረሰብ ማዕከላት እና የካርታ ስርጭት",
    statsLabel: "ንቁ ማዕከላት",
    clusterLabel: "ንቁ ስብስቦች",
    description: "ማዕከላት የማህበረሰቡን አካላዊ እንቅስቃሴ ከፍ ባለ እይታ ያሳያሉ። በከተማዎ ውስጥ የዝግጅት ስብስቦችን ለመለየት ካርታውን ይጠቀሙ።",
  },
  si: {
    heading: "Geere",
    subheading: "Qixxaawo 'Pulse' Qeechenni afi",
    statsLabel: "Baqado Nodes",
    clusterLabel: "Active Clusters",
    description: "Hubs qeechenni qixxaawoonni hiikko nooro la'i. Mittu mittunku 'Node' xa noo qixxaawo leellishanno.",
  }
};

interface HubsPageProps {
  hubs?: any[];
}

// Continuously-scrolling marquee hub ticker
const HubMarquee = () => {
  // Duplicate the hubs array for seamless infinite scroll
  const items = [...HAWASSA_HUBS, ...HAWASSA_HUBS, ...HAWASSA_HUBS];

  return (
    <div className="relative overflow-hidden w-full py-2">
      {/* Fade masks on left and right */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
      >
        {items.map((hub, i) => (
          <Link
            key={`${hub.id}-${i}`}
            href={`/hubs/${hub.slug}`}
            className="group flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-sky-500/30 transition-all duration-300"
          >
            <div
              className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:ring-sky-500/50 transition-all"
              style={{ background: hub.accentColor + "22" }}
            >
              <img src={hub.image} alt={hub.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-white font-black uppercase italic text-sm tracking-tight leading-none group-hover:text-sky-400 transition-colors whitespace-nowrap">
                {hub.name}
              </p>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">
                {hub.tagline}
              </p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: hub.accentColor }} />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

const HubsPage = ({ hubs }: HubsPageProps) => {
  const { language } = useLanguage();
  const ui = content[language as keyof typeof content] || content.en;
  
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const uniqueLocations = Array.from(new Set(events.map(e => e.location))).length;

  return (
    <main className="min-h-screen bg-[#000000] pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto relative space-y-10">
        
        {/* 1. Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
              {ui.heading} <span className="text-sky-500">Hubs</span>
            </h1>
            <p className="text-zinc-500 font-medium mt-3 text-xs sm:text-sm tracking-tight uppercase border-l border-white/10 pl-6 max-w-xl">
              {ui.description}
            </p>
          </motion.div>

          {/* Key Community Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem]">
              <HiLightningBolt className="text-sky-500 mb-2" size={24} />
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{ui.statsLabel}</p>
              <p className="text-3xl font-black text-white italic">{loading ? "..." : events.length}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem]">
              <HiLocationMarker className="text-sky-500 mb-2" size={24} />
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{ui.clusterLabel}</p>
              <p className="text-3xl font-black text-white italic">{loading ? "..." : uniqueLocations}</p>
            </div>
          </div>
        </div>

        {/* 2. ANIMATED SCROLLING HUBS MARQUEE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/5 rounded-[2rem] overflow-hidden bg-white/[0.01] py-4"
        >
          <HubMarquee />
        </motion.div>

        {/* 3. THE HUBS GRID */}
        <div className="pt-4 pb-4">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-white font-black uppercase italic tracking-tighter text-3xl">
              Explore <span className="text-sky-500">Nodes</span>
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HAWASSA_HUBS.map((hub, i) => (
              <motion.div
                key={hub.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link
                  href={`/hubs/${hub.slug}`}
                  className="group block relative bg-[#07070f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-2xl"
                  style={{ "--hub-color": hub.accentColor } as any}
                >
                  {/* Glowing top border on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to right, transparent, ${hub.accentColor}, transparent)` }}
                  />

                  {/* Subtle glow overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${hub.accentColor}10, transparent 60%)` }}
                  />

                  {/* Image container */}
                  <div className="relative h-52 w-full overflow-hidden bg-black">
                    <img
                      src={hub.image}
                      alt={hub.name}
                      className="object-cover w-full h-full opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md border"
                        style={{
                          background: hub.accentColor + "30",
                          borderColor: hub.accentColor + "50",
                          color: hub.accentColor,
                        }}
                      >
                        {hub.am}
                      </span>
                    </div>

                    {/* Live pulse dot */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: hub.accentColor }} />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: hub.accentColor }} />
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Live</span>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="p-7 relative z-20">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: hub.accentColor }}>
                      {hub.tagline}
                    </p>
                    <h4 className="text-2xl font-black uppercase italic text-white group-hover:text-white/90 transition-colors mb-3 leading-none">
                      {hub.name}
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-6 line-clamp-2">
                      {hub.description.en}
                    </p>

                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors"
                      >
                        Enter Hub
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 group-hover:scale-110"
                          style={{
                            background: hub.accentColor + "20",
                            color: hub.accentColor,
                          }}
                        >
                          →
                        </span>
                      </div>
                      <div className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
                        {hub.lat.toFixed(2)}°N
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. THE MAIN HUB MAP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-8 border-t border-white/5"
        >
          <div className="flex items-center gap-4 mb-8">
            <HiLocationMarker className="text-sky-500 text-2xl" />
            <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">
              City <span className="text-sky-500">Node Map</span>
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest shrink-0">Hawassa, Ethiopia</p>
          </div>

          <div className="relative group">
            {/* Neon Glow around map */}
            <div className="absolute -inset-1 bg-sky-500/10 blur-2xl rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10">
              <PulseMap />
            </div>
          </div>
          <p className="text-zinc-700 text-[10px] font-medium mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse flex-shrink-0" />
            Click on any marker to view hub details and navigate there directly.
          </p>
        </motion.div>

      </div>
    </main>
  );
};

export default HubsPage;