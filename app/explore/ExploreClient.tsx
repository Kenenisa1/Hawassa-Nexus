"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HiSearch, HiFilter } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import type { IEvent } from "@/database/event.model";
import { useLanguage } from "@/context/LanguageContext";

const categories = ["All", "Technology", "Culture", "Business", "Sports"];

const content = {
  en: {
    heading: "Explore",
    subheading: "Filter by category and find your next operation.",
    searchPlaceholder: "Search by name or location...",
    selectType: "Select Type",
    noEvents: "No events found",
    pulseOffline: "The pulse for this category is currently offline.",
    reset: "Reset Pulse",
    categories: ["All", "Technology", "Culture", "Business", "Sports"]
  },
  am: {
    heading: "ያስሱ",
    subheading: "በምድብ ይለዩ እና የሚቀጥለውን ዝግጅት ያግኙ።",
    searchPlaceholder: "በስም ወይም በቦታ ይፈልጉ...",
    selectType: "ዓይነት ይምረጡ",
    noEvents: "ምንም ዝግጅት አልተገኘም",
    pulseOffline: "ለዚህ ምድብ በአሁኑ ጊዜ ምንም ዝግጅት የለም።",
    reset: "እንደገና አስጀምር",
    categories: ["ሁሉም", "ቴክኖሎጂ", "ባህል", "ቢዝነስ", "ስፖርት"]
  },
  si: {
    heading: "Hasawa",
    subheading: "Kiirotenni doodhe qixxaawo 'Pulse' afi.",
    searchPlaceholder: "Su'munni woy qeechenni hasi...",
    selectType: "Gosa doodhi",
    noEvents: "Mittu qixxaawoonni afamannokki",
    pulseOffline: "Tini gosa xaano tirtino.",
    reset: "Pulse haroomsi",
    categories: ["Baqado", "Tekinolojiye", "Budde", "Niguse", "Isporite"]
  }
};

// Animation Variants preserved from your original code
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 5, ease: "easeOut" } }
} as const;

const ExplorePage = ({ initialEvents }: { initialEvents?: IEvent[] }) => {
  const { language, t: translateObj } = useLanguage();
  const ui = content[language as keyof typeof content] || content.en;
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [events, setEvents] = useState<IEvent[]>(initialEvents || []);
  const [loading, setLoading] = useState(!initialEvents);
  const [activeCategory, setActiveCategory] = useState(urlCategory || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setLoading(false);
      return;
    }
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = (events || []).filter((event: IEvent) => {
    if (!event) return false;
    const eventCategory = translateObj(event.category);
    const matchesCategory = activeCategory === "All" || eventCategory === activeCategory;
    const eventTitle = translateObj(event.title).toLowerCase();
    const eventLocation = translateObj(event.location).toLowerCase();
    const query = (searchQuery || "").toLowerCase();
    return matchesCategory && (eventTitle.includes(query) || eventLocation.includes(query));
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#000000] pt-24 md:pt-32 pb-20 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Animated Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"
        />

        {/* 1. Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 md:mb-16">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center lg:text-left"
          >
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic ${language !== 'en' ? 'leading-tight' : 'leading-[0.9]'}`}>
              {ui.heading} <span className="text-sky-500">Pulse</span>
            </h1>
            <p className="text-zinc-500 font-medium mt-2 text-xs sm:text-sm tracking-tight uppercase">
              {ui.subheading}
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative group w-full lg:max-w-md"
          >
            <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-sky-500 transition-colors" size={22} />
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-zinc-600 text-sm font-medium"
            />
          </motion.div>
        </div>

        {/* 2. Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12"
        >
          {/* MOBILE VIEW */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(true)} className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] text-white">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-sky-500/10 rounded-lg text-sky-500"><HiFilter size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{ui.selectType}</p>
                  <p className="text-sm font-black uppercase italic tracking-tight text-white">{ui.categories[categories.indexOf(activeCategory)]}</p>
                </div>
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
                  <motion.div
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative bg-[#07070f] border-t border-white/10 rounded-t-[2.5rem] p-8 pb-12"
                  >
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
                    <div className="grid grid-cols-1 gap-3">
                      {categories.map((cat, idx) => (
                        <button key={cat} onClick={() => { setActiveCategory(cat); setIsOpen(false); }} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${activeCategory === cat ? "bg-sky-500 border-sky-400 text-black font-black" : "bg-white/[0.03] border-white/5 text-zinc-400"}`}>
                          <span className="uppercase tracking-widest text-xs italic">{ui.categories[idx]}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex shrink-0 items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 text-sky-500"><HiFilter size={20} /></div>
            {categories.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 cursor-pointer py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative ${activeCategory === cat ? "text-cyan-600 italic border border-cyan-600" : "bg-indigo-400/2 border border-white/5 text-olive-500 hover:text-white"}`}
              >
                {activeCategory === cat && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-sky-500 rounded-2xl shadow-[0_0_25px_rgba(14,165,233,0.3)]" style={{ zIndex: -1 }} />
                )}
                {ui.categories[idx]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 3. Events Grid */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white/5 border border-white/5 rounded-[2.5rem] aspect-[4/5]" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event: IEvent) => (
                  <motion.div
                    layout
                    key={event.slug}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group"
                  >
                    <EventCard {...event} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] px-6"
                >
                  <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">{ui.noEvents}</h3>
                  <p className="text-zinc-500 mt-3 mb-10 font-medium">{ui.pulseOffline}</p>
                  <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="px-10 py-4 bg-sky-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl">
                    {ui.reset}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
};

export default ExplorePage;