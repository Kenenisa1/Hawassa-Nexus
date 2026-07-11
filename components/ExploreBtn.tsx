"use client";

import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import LText from "@/components/LanguageFriendlyText";

const ExploreBtn = () => { 
  return (
    <div className="relative group w-full sm:w-auto">
      {/* High-End Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
      
      <Link
        href="/explore"
        className="relative z-10 flex items-center justify-between gap-8 bg-gradient-to-br from-sky-500 to-sky-600 text-white px-7 py-4 rounded-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        {/* Dynamic Text */}
        <span className="font-sans text-lg font-bold tracking-tight">
          <LText content={{ en: "Discover Events", am: "ኩነቶችን ያግኙ", si: "Woyitoota La'i" }} />
        </span>
        
        {/* Animated Icon Circle */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white group-hover:text-sky-600 transition-all duration-500">
          <HiArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45" />
        </div>

        {/* Premium "Glass Flash" Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-[shine_0.75s_ease-in-out]" />
        </div>
      </Link>
    </div>
  );
};

export default ExploreBtn;