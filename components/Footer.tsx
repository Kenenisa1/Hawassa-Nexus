"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTelegramPlane, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { HiOutlineLightningBolt, HiCheckCircle } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { language } = useLanguage();

  const content = {
    en: {
      description: "Saving energy and time for the Hawassa community. The central source for city events, industrial hubs, and community gatherings.",
      newsletterTitle: "Stay Updated",
      newsletterSub: "Never miss a major event in the Lake City.",
      btnJoin: "Join Newsletter",
      status: "Systems Nominal",
      sections: { discover: "Discover", org: "Organization" },
    },
    am: {
      description: "ለሀዋሳ ማህበረሰብ ጉልበትና ጊዜን መቆጠብ። ለከተማ ዝግጅቶች፣ ለኢንዱስትሪ ማዕከላት እና ለማህበረሰብ ስብሰባዎች ማዕከላዊ ምንጭ።",
      newsletterTitle: "አዳዲስ መረጃዎች",
      newsletterSub: "በሐይቁ ከተማ ዋና ዋና ዝግጅቶችን እንዳያመልጥዎ።",
      btnJoin: "ይመዝገቡ",
      status: "ሲስተም በጥሩ ሁኔታ ላይ ነው",
      sections: { discover: "ይቃኙ", org: "ድርጅት" },
    },
    si: {
      description: "Hawassa miidiyadii yannanna wolqa gatisate. Quchi woyitoota, industire gidduubbanna mannu gambooshshe mereero.",
      newsletterTitle: "Haaro Mashalaqqe",
      newsletterSub: "Baaru quchi woyitoota dihuluullitooti.",
      btnJoin: "Xaadi",
      status: "Olluu Giddo",
      sections: { discover: "La'i", org: "Uurrinsha" },
    },
  };

  const routes = {
    discover: [
      { href: "/explore", en: "City Events", am: "የከተማ ዝግጅቶች", si: "Quchi Woyitoota" },
      { href: "/hubs", en: "Event Hubs", am: "የዝግጅት ማዕከላት", si: "Woyitu Gidduubba" },
      { href: "/map", en: "City Map", am: "የከተማ ካርታ", si: "Quchi Kaarta" },
    ],
    organization: [
      { href: "/about", en: "Our Vision", am: "ራዕያችን", si: "Hax'iine" },
      { href: "/contact", en: "Partner With Us", am: "አብረውን ይስሩ", si: "Mittenni Loonsummo" },
      { href: "/privacy", en: "Privacy", am: "ግላዊነት", si: "Giddu Heere" },
    ],
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 5000);
      } else { setStatus("error"); }
    } catch (err) { setStatus("error"); }
  };

  // Language helper logic
  const t = content[language as keyof typeof content] || content.en;

  return (
    <footer className="relative bg-[#000000] border-t border-white/5 overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-16 w-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Hawassa Nexus Logo"
                    fill
                    sizes="(max-width: 768px) 64px, 150px"
                    loading="eager"
                    className="object-contain drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl tracking-tight text-white uppercase italic leading-none">
                  Hawassa<span className="text-sky-500 group-hover:text-white transition-colors">Nexus</span>
                </span>
                <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mt-1">City Events & Hubs</span>
              </div>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
              {t.description}
            </p>
            <div className="flex gap-3">
              {[FaTelegramPlane, FaLinkedinIn, FaFacebookF].map((Icon, i) => (
                <Link key={i} href="#" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-sky-400 transition-all hover:bg-white/10">
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* DYNAMIC QUICK LINKS */}
          <div className="md:col-span-2">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">
              {t.sections.discover}
            </h3>
            <ul className="space-y-4">
              {routes.discover.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-500 hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-tight">
                    {language === "am" ? link.am : language === "si" ? link.si : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DYNAMIC ORGANIZATION LINKS */}
          <div className="md:col-span-2">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">
              {t.sections.org}
            </h3>
            <ul className="space-y-4">
              {routes.organization.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-500 hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-tight">
                    {language === "am" ? link.am : language === "si" ? link.si : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="md:col-span-4">
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-2 flex items-center gap-2">
                <HiOutlineLightningBolt className="text-sky-500" />
                {t.newsletterTitle}
              </h3>
              <p className="text-xs text-zinc-500 mb-6 font-medium">
                {t.newsletterSub}
              </p>
              <form className="space-y-3 relative z-10" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "si" ? "Emailenke..." : language === "am" ? "ኢሜይል ያስገቡ..." : "pulse@example.com"}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-sky-500 transition-all placeholder:text-zinc-700 font-medium disabled:opacity-50"
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`w-full text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2
                    ${status === "success" ? "bg-emerald-500 text-white" : "bg-sky-500 hover:bg-sky-400 text-black"} 
                    disabled:cursor-not-allowed`}
                >
                  {status === "loading" ? (
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : status === "success" ? (
                    <HiCheckCircle className="text-lg" />
                  ) : t.btnJoin}
                </button>

                {status === "success" && (
                  <p className="text-[10px] text-emerald-500 font-bold mt-3 uppercase tracking-tight text-center">
                    {language === "si" ? "Xaadole ninkera emailatenni kullummo!" : language === "am" ? "አዳዲስ ዝግጅቶች ሲኖሩ በኢሜይል እንገልጽልዎታለን!" : "We'll email you when new events drop!"}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Hawassa Nexus • Made in Hawassa
          </p>

          <div className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-[0.2em] italic">
              {t.status}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;