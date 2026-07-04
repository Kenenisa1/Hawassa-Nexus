"use client";

import { motion } from "framer-motion";
import { FaHeartbeat, FaMapMarkedAlt, FaCity, FaChartLine } from "react-icons/fa";
import { HiMail, HiArrowRight } from "react-icons/hi";
import CountUp from "@/components/CountUp";
import LText from "@/components/LanguageFriendlyText";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

// Functional Subscribe Form component
const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-4 px-5 rounded-2xl bg-white/10 border border-white/20 max-w-md">
        <span className="text-white text-sm font-black uppercase italic tracking-widest">✓ You're on the list!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-0 max-w-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all">
      <div className="flex items-center gap-2 pl-4 flex-1">
        <HiMail className="text-white/50 shrink-0" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="bg-transparent text-white text-xs font-medium placeholder:text-white/40 outline-none py-4 w-full"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-4 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest shrink-0 hover:bg-sky-400 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {status === "loading" ? "..." : <><span>Join</span><HiArrowRight /></>}
      </button>
    </form>
  );
};

// Animation Settings
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.5 }
  }
};

export default function AboutClient({ statsData }: { statsData: any }) {
  const { language } = useLanguage();

  const content = {
    heroTag: { en: "Live from the Southern Capital", am: "ከደቡቧ መዲና በቀጥታ" },
    title: { en: "Hawassa Nexus", am: "ሀዋሳ ነክሰስ" },
    description: { 
      en: "We are the digital heartbeat of Hawassa. Our mission is to connect the city’s residents, visitors, and businesses through a real-time ecosystem.",
      am: "እኛ የሀዋሳ ዲጂታል የልብ ትርታ ነን። ዓላማችን የከተማዋን ነዋሪዎች፣ ጎብኝዎች እና የንግድ ተቋማትን በቅጽበታዊ የመረጃ መረብ ማገናኘት ነው።"
    },
    visionTitle: { en: "Digitizing the Lake City", am: "የሐይቋን ከተማ ዲጂታላይዝ ማድረግ" },
    visionDesc: {
        en: "Hawassa Nexus is more than an app; it’s a commitment to making our city the most digitally connected hub in Ethiopia.",
        am: "ሀዋሳ ነክሰስ ከመተግበሪያ በላይ ነው፤ ከተማችንን በኢትዮጵያ ውስጥ በዲጂታል የተገናኘች ቀዳሚ ማዕከል ለማድረግ የገባነው ቃል ነው።"
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-slate-300 pt-32 pb-20 selection:bg-sky-500/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* 1. The Pulse Hero */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="text-center mb-32 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-black uppercase tracking-[0.3em] mb-8">
            <FaHeartbeat className="animate-pulse" />
            <LText content={content.heroTag} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic leading-tight">
             Hawassa <span className="text-sky-500 text-glow">Nexus</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            <LText content={content.description} />
          </p>
        </motion.section>

        {/* 2. Live Data Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32"
        >
          {[
            { label: { en: "Active Users", am: "ንቁ ተጠቃሚዎች" }, value: statsData.users, suffix: "+" },
            { label: { en: "City Hubs", am: "የከተማ ማዕከላት" }, value: statsData.hubs, suffix: "" },
            { label: { en: "Live Events", am: "ቀጥታ ኩነቶች" }, value: statsData.events, suffix: "+" },
            { label: { en: "Partners", am: "አጋሮች" }, value: statsData.partners, suffix: "" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center hover:border-sky-500/30 hover:bg-white/[0.04] transition-all group"
            >
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2 italic uppercase group-hover:text-sky-400 transition-colors">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                <LText content={stat.label} />
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 3. Core Pillars */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-32"
        >
          {[
            {
              icon: <FaMapMarkedAlt />,
              title: { en: "Hub Discovery", am: "ማዕከላትን ማሰስ" },
              desc: { en: "From the Industrial Park to the Lake Front, we map the city’s key zones.", am: "ከኢንዱስትሪ ፓርክ እስከ ሐይቅ ዳርቻ ድረስ የከተማዋን ቁልፍ ቦታዎች እናሳያለን።" }
            },
            {
              icon: <FaCity />,
              title: { en: "Urban Pulse", am: "የከተማው ትርታ" },
              desc: { en: "Real-time updates on workshops, jazz nights, and community gatherings.", am: "ስለ ስልጠናዎች፣ የጃዝ ምሽቶች እና የማህበረሰብ ስብሰባዎች ወቅታዊ መረጃ።" }
            },
            {
              icon: <FaChartLine />,
              title: { en: "Economic Growth", am: "የኢኮኖሚ እድገት" },
              desc: { en: "Empowering local businesses by giving them a high-end digital stage.", am: "ለአካባቢው ንግዶች ዘመናዊ የዲጂታል መድረክ በመስጠት አቅማቸውን ማሳደግ።" }
            }
          ].map((pillar, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              className="p-10 rounded-[3rem] bg-[#07070f] border border-white/5 hover:bg-white/[0.03] hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="text-3xl text-sky-500 mb-6 group-hover:scale-110 transition-transform">{pillar.icon}</div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic">
                <LText content={pillar.title} />
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                <LText content={pillar.desc} />
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 4. The Vision */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] md:rounded-[5rem] bg-gradient-to-br from-sky-600 to-indigo-900 p-8 md:p-24 overflow-hidden text-white shadow-2xl"
        >
          {/* Background Decorative Blob */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-6 leading-tight">
              <LText content={content.visionTitle} />
            </h2>
            
            <p className="text-base md:text-lg font-medium mb-10 opacity-80 leading-relaxed max-w-2xl">
              <LText content={content.visionDesc} />
            </p>

            {/* Functional Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/hubs" 
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-400 transition-all"
              >
                <span>Explore Hub Map</span>
                <div className="w-2 h-2 rounded-full bg-sky-500 group-hover:bg-black group-hover:animate-ping transition-colors" />
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/60 transition-all"
              >
                Partner With Us
              </Link>
            </div>

            {/* Email Subscription */}
            <SubscribeForm />
          </div>
        </motion.section>
      </div>
    </main>
  );
}