"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HiCalendar, HiLocationMarker, HiArrowRight, HiArrowLeft, HiClock } from "react-icons/hi";
import type { IEvent } from "@/database";
import LText from "@/components/LanguageFriendlyText";

interface Props {
  events: IEvent[];
}

/** Resolve a multilingual field or plain string to a displayable string */
const resolveField = (field: any, lang: string = "en"): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return (field as any)[lang] || (field as any).en || "";
};

/** Format ISO date string to a readable form */
const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

/** Compute a simple countdown to the event date */
const useCountdown = (dateStr: string) => {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const compute = () => {
      const now = Date.now();
      const target = new Date(dateStr).getTime();
      const delta = target - now;
      if (delta <= 0) return setDiff({ days: 0, hours: 0, minutes: 0 });
      const days = Math.floor(delta / (1000 * 60 * 60 * 24));
      const hours = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
      setDiff({ days, hours, minutes });
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, [dateStr]);

  return diff;
};

const EVENTS_PER_PAGE = 1;

/* ───────────────────────── Single slide card ───────────────────────── */
const EventSlide = ({ event, direction }: { event: IEvent; direction: number }) => {
  const countdown = useCountdown(event.date);
  const isUpcoming = new Date(event.date).getTime() > Date.now();
  const isToday = new Date(event.date).toDateString() === new Date().toDateString();

  return (
    <motion.div
      key={event._id?.toString()}
      custom={direction}
      initial={{ opacity: 0, x: direction * 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -direction * 80 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    >
      <Link href={`/events/${event.slug}`} className="group block h-full">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <Image
            src={event.image || "/placeholder-event.jpg"}
            alt={resolveField(event.title)}
            fill
            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10">
          {/* Category & Free badge */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-xl border border-sky-500/30 bg-sky-500/10 text-[9px] font-black uppercase tracking-widest text-sky-400 backdrop-blur-md">
              {resolveField(event.category)}
            </span>
            {isToday && (
              <span className="px-3 py-1 rounded-xl border border-rose-500/30 bg-rose-500/10 text-[9px] font-black uppercase tracking-widest text-rose-400 backdrop-blur-md animate-pulse">
                LIVE NOW
              </span>
            )}
            {event.isFeatured && (
              <span className="px-3 py-1 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[9px] font-black uppercase tracking-widest text-amber-400 backdrop-blur-md">
                Featured
              </span>
            )}
            {(event.price === 0) && (
              <span className="px-3 py-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-black uppercase tracking-widest text-emerald-400 backdrop-blur-md">
                Free
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none mb-4 group-hover:text-sky-400 transition-colors duration-300 line-clamp-2">
            {resolveField(event.title)}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[11px] font-bold uppercase tracking-wide mb-6">
            <span className="flex items-center gap-1.5">
              <HiCalendar className="text-sky-500" size={14} />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <HiClock className="text-sky-500" size={14} />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <HiLocationMarker className="text-sky-500" size={14} />
              <span className="truncate max-w-[160px]">{resolveField(event.location)}</span>
            </span>
          </div>

          {/* Countdown + CTA row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Countdown chips */}
            {isUpcoming && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mr-1">In</span>
                {[
                  { label: "d", value: countdown.days },
                  { label: "h", value: countdown.hours },
                  { label: "m", value: countdown.minutes },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[48px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={value}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 8, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-base font-black text-white tabular-nums leading-none"
                      >
                        {String(value).padStart(2, "0")}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[8px] text-zinc-500 font-black uppercase mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA arrow */}
            <div className="ml-auto flex items-center gap-2 text-sky-400 text-[11px] font-black uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
              View Event
              <div className="w-9 h-9 rounded-full border border-sky-500/40 bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-300">
                <HiArrowRight className="group-hover:translate-x-0.5 transition-transform" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Edge glow on hover */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-sky-500/0 group-hover:border-sky-500/30 transition-colors duration-500 pointer-events-none" />
      </Link>
    </motion.div>
  );
};

/* ───────────────────────── Dot indicator ───────────────────────── */
const PaginationDots = ({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`Go to event ${i + 1}`}
        className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500 focus:outline-none"
        style={{ width: i === current ? "2rem" : "0.5rem" }}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full" />
        {i === current && (
          <motion.div
            layoutId="dot-fill"
            className="absolute inset-0 bg-sky-500 rounded-full"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </button>
    ))}
  </div>
);

/* ───────────────────────── Main section ───────────────────────── */
const UpcomingEvents = ({ events }: Props) => {
  // Filter to upcoming/published events only, sorted by date ascending
  const upcoming = (events || [])
    .filter((e) => {
      const d = new Date(e.date).getTime();
      return d >= Date.now() - 86400000; // allow events from today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8); // cap at 8

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);

  const total = upcoming.length;

  const goTo = useCallback(
    (next: number) => {
      const clamped = (next + total) % total;
      setDirection(clamped > page ? 1 : -1);
      setPage(clamped);
    },
    [page, total]
  );

  // Autoplay
  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const id = setInterval(() => goTo(page + 1), 6000);
    return () => clearInterval(id);
  }, [autoplay, page, total, goTo]);

  if (total === 0) return null;

  const current = upcoming[page];

  return (
    <section className="relative z-10 w-full px-4 md:px-6 lg:px-8 pb-8 -mt-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[9px] font-black text-sky-500 uppercase tracking-[0.5em] mb-1.5 flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
              </span>
              <LText content={{ en: "Upcoming Events", am: "መጪ ዝግጅቶች", si: "Ha'lammo Woyitoota" }} />
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter">
              <LText content={{ en: "What's Next in", am: "ቀጣይ ዝግጅቶች", si: "Ha'lammo" }} />{" "}
              <span className="text-sky-500">Hawassa</span>
            </h2>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <PaginationDots total={total} current={page} onSelect={(i) => { setAutoplay(false); goTo(i); }} />
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => { setAutoplay(false); goTo(page - 1); }}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-300"
                aria-label="Previous event"
              >
                <HiArrowLeft size={15} />
              </button>
              <button
                onClick={() => { setAutoplay(false); goTo(page + 1); }}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-300"
                aria-label="Next event"
              >
                <HiArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Slide area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
          style={{ height: "clamp(320px, 42vw, 520px)" }}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Ambient glow behind slide */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 rounded-[3rem] bg-gradient-to-br from-sky-600/30 to-indigo-600/20 scale-95" />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <EventSlide key={current._id?.toString()} event={current} direction={direction} />
          </AnimatePresence>

          {/* Progress bar at bottom */}
          {autoplay && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 rounded-b-[2.5rem] overflow-hidden z-20">
              <motion.div
                key={page}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-sky-500 origin-left"
              />
            </div>
          )}
        </motion.div>

        {/* Counter text */}
        <div className="mt-4 text-right">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
