"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import HeroSection from "@/components/HeroSection"; 
import UpcomingEvents from "@/components/UpcomingEvents";
import type { IEvent } from "@/database";
import LoadingSpinner from "@/components/LoadingSpinner";
import LText from "@/components/LanguageFriendlyText";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

const PulseHomeUI = ({ events }: { events: IEvent[] }) => {
  const hasEvents = Array.isArray(events) && events.length > 0;
  const featuredEvents = hasEvents ? events.slice(0, 3) : [];
  
  const isLoading = events === undefined || events === null;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* Ambient Background - Subtle OLED Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-sky-600/5 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-indigo-600/5 blur-[140px] rounded-full" />
      </div>

      <HeroSection />

      <UpcomingEvents events={events} />

      <section id="events" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* Section Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.5em] mb-3">
              <LText content={{ 
                en: "The Latest Pulse", 
                am: "የቅርብ ጊዜ ኩነቶች", 
                si: "Haaro Woyitoota" 
              }} />
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">
              <LText content={{ 
                en: "Featured", 
                am: "ተለይተው የቀረቡ", 
                si: "Baxxe" 
              }} /> 
              <span className="text-sky-500 ml-2">
                <LText content={{ 
                  en: "Events", 
                  am: "ዝግጅቶች", 
                  si: "Woyitoota" 
                }} />
              </span>
            </h2>
          </motion.div>

          <Link href="/events">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="text-[10px] font-black text-zinc-400 hover:text-white transition-all bg-white/5 px-8 py-4 rounded-full border border-white/10 uppercase tracking-[0.2em]"
            >
              <LText content={{ 
                en: "Explore All →", 
                am: "ሁሉንም ይመልከቱ →", 
                si: "Duucha La'i →" 
              }} />
            </motion.button>
          </Link>
        </div>

        {/* The Grid Logic */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {hasEvents ? (
            featuredEvents.map((event: IEvent, index: number) => (
              <motion.div 
                key={event._id?.toString() || `event-${index}`} 
                variants={itemVariants}
                className="group"
              >
                <div className="relative transform group-hover:-translate-y-4 transition-all duration-700 ease-[0.16, 1, 0.3, 1]">
                  {/* High-end Glow Effect */}
                  <div className="absolute inset-0 bg-sky-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px]" />
                  <div className="relative">
                    <EventCard {...event} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : isLoading ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center border border-white/5 rounded-[40px] bg-white/[0.01] backdrop-blur-sm">
               <LoadingSpinner />
               <p className="mt-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] animate-pulse italic">
                 <LText content={{ 
                   en: "Synchronizing...", 
                   am: "መረጃዎች በመጫን ላይ ናቸው...", 
                   si: "Ha'lamanni no..." 
                 }} />
               </p>
            </div>
          ) : (
            <div className="col-span-full py-40 text-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
               <p className="text-zinc-600 font-black uppercase tracking-[0.3em] italic text-sm">
                 <LText content={{ 
                   en: "Pulse is quiet", 
                   am: "ምንም የተገኙ ዝግጅቶች የሉም", 
                   si: "Woyitootu dino" 
                 }} />
               </p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default PulseHomeUI;