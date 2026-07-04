'use client';

import Link from "next/link";
import Image from "next/image";
import { 
  HiLocationMarker, 
  HiCalendar, 
  HiClock, 
  HiArrowRight, 
} from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";

// Interface strictly aligned with IEvent model
interface Props {
  title: string | { en: string; am?: string; si?: string };
  description?: string | { en: string; am?: string; si?: string };
  image: string;
  slug: string;
  location: string | { en: string; am?: string; si?: string };
  date: string;
  time: string;
  category: string | { en: string; am?: string; si?: string };
  hub?: string; // Usually a name or ID
  price?: string | number;
  isFree?: boolean;
}

const EventCard = ({ 
  title, 
  image, 
  slug, 
  location, 
  date, 
  time, 
  category, 
  price, 
  isFree 
}: Props) => {
  const { t } = useLanguage();

  // Safe fallback for image alt tags and non-JSX attributes
  const getPlainString = (field: any) => {
    if (typeof field === "object") return field.en || "";
    return field || "";
  };

  return (
    <Link
      href={`/events/${slug}`}
      className="group relative block rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-sky-500/30 shadow-2xl"
    >
      {/* Cinematic Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-[#030014] rounded-[2.5rem] overflow-hidden z-10">
        {/* --- IMAGE SECTION --- */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image || "/placeholder-event.jpg"}
            alt={getPlainString(title)}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/10 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-5 left-5 flex gap-2">
            <div className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-sky-400">
              {t(category)}
            </div>
            {isFree && (
              <div className="px-3 py-1.5 rounded-xl border border-green-500/20 bg-green-500/10 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-green-400">
                Free Access
              </div>
            )}
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="p-7 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-[0.15em]">
              <HiLocationMarker className="text-sky-500 text-sm" />
              <span className="truncate max-w-[180px]">{t(location)}</span>
            </div>
            <div className="text-sky-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <HiArrowRight size={18} />
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-6 line-clamp-1 group-hover:text-sky-400 transition-colors tracking-tighter uppercase italic">
            {t(title)}
          </h3>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-500/5 text-sky-500/60">
                <HiCalendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-600 font-black uppercase">Date</span>
                <span className="text-[11px] text-zinc-300 font-bold">{date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 justify-end text-right">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-600 font-black uppercase">Beat</span>
                <span className="text-[11px] text-zinc-300 font-bold">{time}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-zinc-500">
                <HiClock size={16} />
              </div>
            </div>
          </div>

          {/* New: Price/Entry Badge for UI consistency */}
          {!isFree && price && (
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
              <span className="text-[10px] font-bold text-zinc-400 uppercase italic">
                {price} ETB <span className="text-[8px] opacity-50">Entry</span>
              </span>
            </div>
          )}
        </div>

        {/* OLED Bottom Border Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
      </div>
    </Link>
  );
};

export default EventCard;