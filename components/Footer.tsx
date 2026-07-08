"use client";

import Link from "next/link";
import Image from "next/image";
import { FaTelegramPlane, FaFacebookF } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { HiOutlineLightningBolt, HiCheckCircle } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      description: "Saving energy and time for the Hawassa community. The central source for city events, industrial hubs, and community gatherings.",
      status: "Systems Nominal",
      sections: { discover: "Discover", org: "Organization" },
    },
    am: {
      description: "ለሀዋሳ ማህበረሰብ ጉልበትና ጊዜን መቆጠብ። ለከተማ ዝግጅቶች፣ ለኢንዱስትሪ ማዕከላት እና ለማህበረሰብ ስብሰባዎች ማዕከላዊ ምንጭ።",
      status: "ሲስተም በጥሩ ሁኔታ ላይ ነው",
      sections: { discover: "ይቃኙ", org: "ድርጅት" },
    },
    si: {
      description: "Hawassa miidiyadii yannanna wolqa gatisate. Quchi woyitoota, industire gidduubbanna mannu gambooshshe mereero.",
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

  const t = content[language as keyof typeof content] || content.en;

  return (
    <footer className="relative bg-[#000000] border-t border-white/5 overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-sky-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-16 w-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="https://t.me/HawassaNexus"
                target="_blank"
                rel="noreferrer"
                title="Hawassa Nexus on Telegram"
                className="group rounded-4xl border border-white/10 bg-slate-950/80 p-5 text-center transition-all hover:border-sky-500/30 hover:bg-sky-500/10"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 transition-all group-hover:bg-sky-500/20">
                  <FaTelegramPlane className="text-2xl" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Telegram</p>
                <p className="mt-1 text-[11px] text-zinc-500">@HawassaNexus</p>
              </Link>

              <Link
                href="https://www.facebook.com/HawassaNexus"
                target="_blank"
                rel="noreferrer"
                title="Hawassa Nexus on Facebook"
                className="group rounded-4xl border border-white/10 bg-slate-950/80 p-5 text-center transition-all hover:border-sky-500/30 hover:bg-sky-500/10"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 transition-all group-hover:bg-blue-600/20">
                  <FaFacebookF className="text-2xl" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Facebook</p>
                <p className="mt-1 text-[11px] text-zinc-500">facebook.com/HawassaNexus</p>
              </Link>

              <Link
                href="https://www.tiktok.com/@hawassanexus"
                target="_blank"
                rel="noreferrer"
                title="Hawassa Nexus on TikTok"
                className="group rounded-4xl border border-white/10 bg-slate-950/80 p-5 text-center transition-all hover:border-sky-500/30 hover:bg-sky-500/10"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-400 transition-all group-hover:bg-pink-500/20">
                  <SiTiktok className="text-2xl" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white">TikTok</p>
                <p className="mt-1 text-[11px] text-zinc-500">@hawassanexus</p>
              </Link>
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

          {/* CONTACT DETAILS */}
          <div className="md:col-span-4">
            <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5">
              <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-4">Contact</h3>
              <div className="space-y-5 text-sm text-zinc-400">
                <div>
                  <p className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Email</p>
                  <p>hello@hawassapulse.com</p>
                </div>
                <div>
                  <p className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Phone</p>
                  <p>+251 912 345 678</p>
                </div>
                <div>
                  <p className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Location</p>
                  <p>Hawassa City Center, Southern Ethiopia</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-sky-400 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Hawassa Nexus • Made in Hawassa
          </p>

          <div className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-white/3 border border-white/5 backdrop-blur-md">
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