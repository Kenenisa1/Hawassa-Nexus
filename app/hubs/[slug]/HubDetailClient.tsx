"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { HiArrowLeft, HiLocationMarker, HiCalendar, HiLightningBolt, HiClock, HiTicket, HiExternalLink } from "react-icons/hi";
import type { IEvent } from "@/database/event.model";
import type { IHubData } from "@/lib/hubs.data";
import { useLanguage } from "@/context/LanguageContext";

const PulseMap = dynamic(() => import("@/components/PulseMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-[3rem] flex items-center justify-center">
      <p className="text-zinc-600 font-black uppercase tracking-widest text-xs italic">Syncing GPS Node...</p>
    </div>
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const uiStrings = {
  en: {
    backBtn: "All Hubs",
    hubEvents: "Hub Events",
    exactLocation: "Exact Location",
    openInMaps: "Open in Maps",
    totalEvents: "Total Events",
    liveEvents: "Live Events",
    gpsNode: "GPS Node",
    categories: "Categories",
    noEventsTitle: "No Events Yet",
    noEventsDesc: (filter: string) => `No ${filter !== "All" ? filter : ""} events scheduled for this hub.`,
    browseAll: "Browse All Events",
    liveLabel: "Live",
    filters: ["All", "Technology", "Culture", "Business", "Sports"],
  },
  am: {
    backBtn: "ወደ ሁሉም ማዕከላት",
    hubEvents: "የማዕከሉ ዝግጅቶች",
    exactLocation: "ትክክለኛ ቦታ",
    openInMaps: "ካርታ ላይ ክፈት",
    totalEvents: "ጠቅላላ ዝግጅቶች",
    liveEvents: "ቀጥታ ዝግጅቶች",
    gpsNode: "GPS ኖድ",
    categories: "ምድቦች",
    noEventsTitle: "ዝግጅቶች የሉም",
    noEventsDesc: (filter: string) => `ለዚህ ማዕከል ${filter !== "All" ? filter : ""} ዝግጅቶች አልተያዙም።`,
    browseAll: "ሁሉንም ዝግጅቶች ፍለጋ",
    liveLabel: "ቀጥታ",
    filters: ["ሁሉም", "ቴክኖሎጂ", "ባህል", "ንግድ", "ስፖርት"],
  },
  si: {
    backBtn: "Hubs Wole",
    hubEvents: "Hub Qixxaawoonni",
    exactLocation: "Qineessi Bado",
    openInMaps: "Kaartaanni Diimi",
    totalEvents: "Qixxaawo Wole",
    liveEvents: "Baqado Qixxaawo",
    gpsNode: "GPS Node",
    categories: "Gattete",
    noEventsTitle: "Qixxaawo Dino",
    noEventsDesc: (filter: string) => `${filter !== "All" ? filter : ""} qixxaawo hub kuni noo dino.`,
    browseAll: "Qixxaawo Wole La'i",
    liveLabel: "Baqado",
    filters: ["Wole", "Tekinoloji", "Kultuur", "Dalda", "Ispoort"],
  },
};

interface HubDetailClientProps {
  hub: IHubData;
  initialEvents: IEvent[];
}

// English category keys used internally for DB matching
const EN_FILTERS = ["All", "Technology", "Culture", "Business", "Sports"];

export default function HubDetailClient({ hub, initialEvents }: HubDetailClientProps) {
  const { language, t } = useLanguage();
  const ui = uiStrings[language as keyof typeof uiStrings] || uiStrings.en;

  // activeFilter always stores the English key so DB matching works regardless of language
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredEvents = activeFilter === "All"
    ? initialEvents
    : initialEvents.filter((e) => e.category === activeFilter);

  const accentHex = hub.accentColor || "#0ea5e9";

  return (
    <main className="min-h-screen bg-[#000000] text-slate-300 overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-60 left-1/4 w-[700px] h-[700px] blur-[180px] rounded-full opacity-20"
          style={{ background: accentHex }}
        />
        <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      {/* ─── PROMINENT BACK BUTTON (fixed top-left, below navbar) ─── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-28 left-4 md:left-8 z-40"
      >
        <Link
          href="/hubs"
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl text-zinc-400 hover:text-white hover:border-white/30 transition-all duration-300 shadow-xl"
          style={{ boxShadow: `0 0 20px ${accentHex}15` }}
        >
          <HiArrowLeft
            className="text-sm group-hover:-translate-x-1 transition-transform duration-200"
            style={{ color: accentHex }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {ui.backBtn}
          </span>
        </Link>
      </motion.div>

      {/* ─── HERO ─── */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img
          src={hub.image}
          alt={hub.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Multi-stop gradient overlay */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to top, #000 0%, #000 15%, transparent 60%), linear-gradient(to bottom, #00000099 0%, transparent 25%)`
        }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 pb-16 pt-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {/* Category badge */}
            <span
              className="inline-block mb-4 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border backdrop-blur-sm"
              style={{ background: accentHex + "25", borderColor: accentHex + "50", color: accentHex }}
            >
              {hub.tagline}
            </span>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-4">
              {hub.name.split(" ").map((word, i) => (
                <span key={i} style={{ color: i % 2 !== 0 ? accentHex : "white" }}>
                  {word}{" "}
                </span>
              ))}
            </h1>

            {/* Native name */}
            <p className="text-zinc-400 text-sm font-medium">{hub.am} · {hub.si}</p>
            <p className="text-zinc-500 text-xs md:text-sm font-medium max-w-xl leading-relaxed mt-3">
              {language === "am" ? hub.description.am : language === "si" ? hub.description.si : hub.description.en}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 md:px-10 mt-8 relative z-20 mb-16"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <HiLightningBolt />, label: ui.totalEvents, value: initialEvents.length },
            { icon: <HiTicket />, label: ui.liveEvents, value: initialEvents.filter(e => e.status === "published").length },
            { icon: <HiLocationMarker />, label: ui.gpsNode, value: `${hub.lat.toFixed(3)}°N` },
            { icon: <HiCalendar />, label: ui.categories, value: [...new Set(initialEvents.map(e => e.category))].length || "—" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#07070f] border border-white/5 rounded-[2rem] p-6 flex flex-col gap-2 transition-colors hover:border-opacity-30"
              style={{ "--accent": accentHex } as any}
            >
              <span style={{ color: accentHex }} className="text-lg">{stat.icon}</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
              <p className="text-xl font-black text-white italic">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── EVENTS GRID ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10"
        >
          <div className="flex items-center gap-3">
            <HiCalendar style={{ color: accentHex }} className="text-2xl" />
            <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
              <span style={{ color: accentHex }}>{ui.hubEvents}</span>
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {EN_FILTERS.map((enKey, idx) => (
              <button
                key={enKey}
                onClick={() => setActiveFilter(enKey)}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
                style={activeFilter === enKey ? {
                  background: accentHex,
                  color: "#000",
                  borderColor: accentHex,
                } : {
                  background: "rgba(255,255,255,0.03)",
                  color: "#71717a",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                {ui.filters[idx]}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={activeFilter}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event) => (
                <motion.div key={event._id as string} variants={fadeUp}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="group block bg-[#07070f] border border-white/5 rounded-[2rem] overflow-hidden hover:-translate-y-1.5 transition-all duration-500"
                    style={{ "--accent": accentHex } as any}
                  >
                    {/* Top accent line on hover */}
                    <div
                      className="h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(to right, transparent, ${accentHex}, transparent)` }}
                    />
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"}
                        alt={t(event.title)}
                        className="object-cover w-full h-full opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] to-transparent" />
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm"
                        style={{ background: accentHex + "25", borderColor: accentHex + "50", color: accentHex }}
                      >
                        {event.category}
                      </span>
                      {event.status === "published" && (
                        <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {ui.liveLabel}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-base font-black uppercase italic text-white group-hover:text-opacity-80 transition-colors mb-3 leading-tight line-clamp-2">
                        {t(event.title)}
                      </h3>
                      <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <HiCalendar style={{ color: accentHex + "80" }} />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HiClock style={{ color: accentHex + "80" }} />
                          {event.time}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6 border border-white/5 rounded-[3rem] bg-white/[0.01]"
            >
              <div
                className="w-16 h-16 rounded-full border flex items-center justify-center"
                style={{ borderColor: accentHex + "30", background: accentHex + "10" }}
              >
                <HiCalendar style={{ color: accentHex }} className="text-2xl" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-black uppercase italic tracking-widest text-zinc-500">{ui.noEventsTitle}</h3>
                <p className="text-xs text-zinc-700 mt-1">{ui.noEventsDesc(activeFilter)}</p>
              </div>
              <Link
                href="/explore"
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border"
                style={{ background: accentHex + "15", borderColor: accentHex + "40", color: accentHex }}
              >
                {ui.browseAll}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── MAP SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <HiLocationMarker style={{ color: accentHex }} className="text-2xl" />
              <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                <span style={{ color: accentHex }}>{ui.exactLocation}</span>
              </h2>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <a
              href={`https://www.google.com/maps?q=${hub.lat},${hub.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-sky-400 transition-colors flex items-center gap-1.5 shrink-0"
            >
              {ui.openInMaps} <HiExternalLink />
            </a>
          </div>

          <div className="relative group">
            <div
              className="absolute -inset-1 blur-2xl rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: accentHex + "15" }}
            />
            <div className="relative">
              <PulseMap focusedHubSlug={hub.slug} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-zinc-600 text-xs font-medium">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ background: accentHex }} />
            GPS: {hub.lat}, {hub.lng} — {hub.name}, Hawassa, Ethiopia
          </div>
        </motion.div>
      </section>
    </main>
  );
}
