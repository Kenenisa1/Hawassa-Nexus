"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import LText from "@/components/LanguageFriendlyText";
import ExploreBtn from "./ExploreBtn";

/**
 * Enhanced translation object including Sidaamu Afo.
 * Professional terminology used to maintain the high-end brand feel.
 */
const heroT = {
  badge: { 
    en: "Hawassa City Community Guide", 
    am: "የሀዋሳ ከተማ ማህበረሰብ መሪ",
    si: "Hawassa Quchi Miidiyadii Giddu" 
  },
  titleMain: { 
    en: "HAWASSA ", 
    am: "ሀዋሳ ",
    si: "HAWASSA" 
  },
  titlePulse: { 
    en: "Nexus", 
    am: "ኔክሰስ",
    si: "Nexus" 
  },
  description: {
    en: "Empowering the community by bridging the gap between events, hubs, and people. Save time. Save energy. Grow together.",
    am: "ኩነቶችን፣ ማዕከላትን እና ሰዎችን በማገናኘት ማህበረሰቡን እናበረታታለን። ጊዜዎን ይቆጥቡ። ጉልበትዎን ይቆጥቡ። አብረን እንደግ።",
    si: "Woyitoota, gidduubbanna manna vashshatenni miidiyadii jawaante ikka. Yanna gatisi. Wolqa gatisiri. Mittenni lophino."
  }
};

const transition = { duration: 1, ease: [0.16, 1, 0.3, 1] } as const;

const Hero = () => {
  const { language } = useLanguage();
  
  // Adjusted logic to include Sidaamu for font-size scaling
  const isNonEnglish = language === "am" || language === "si";

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#000000] pt-32 pb-20">
      
      {/* 1. The Animated Hawassa Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ 
            scale: [1.08, 1.15, 1.08],
            opacity: 0.65
          }}
          transition={{ 
            scale: { duration: 30, repeat: Infinity, ease: "linear" },
            opacity: { duration: 1.5 }
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Hawassa.jpg')" }}
        />
        
        {/* Dark overlays to maintain premium look & text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-[#000000] z-0" />
        
        {/* Ambient Glowing Auroras */}
        <div className="absolute inset-0 opacity-35">
          <div 
            className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-sky-500/25 via-indigo-500/10 to-transparent blur-[130px]" 
            style={{ animation: "aurora 25s ease-in-out infinite" }}
          />
          <div 
            className="absolute -bottom-[10%] -right-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-indigo-500/25 via-sky-500/10 to-transparent blur-[130px]" 
            style={{
              animation: "aurora 30s ease-in-out infinite",
              animationDelay: "-5s",
            }}
          />
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="inline-flex items-center rounded-full border border-white/5 bg-white/[0.03] px-6 py-2 text-[10px] font-display uppercase tracking-[0.3em] text-sky-400 mb-10 shadow-2xl backdrop-blur-md"
        >
           <LText content={heroT.badge} />
        </motion.div>

        {/* Main Title - Responsive sizing for Ge'ez & Latin scripts */}
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...transition, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight font-display tracking-normal text-white uppercase mb-6"
        >
          <LText content={heroT.titleMain} /> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-indigo-600 inline-block">
            <LText content={heroT.titlePulse} />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.4 }}
          className="max-w-xl mx-auto text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 tracking-wide font-normal"
        >
          <LText content={heroT.description} />
        </motion.p>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition, delay: 0.6 }}
          className="relative inline-block w-full max-w-xs transition-transform hover:scale-105 active:scale-95 group"
        >
          {/* Reactive Glow */}
          <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <ExploreBtn />
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom Gradient - Smooth Blend into Page Content */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000000] to-transparent z-10" />
    </section>
  );
};

export default Hero;