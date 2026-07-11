"use client";

import Link from "next/link";
import Image from "next/image";
import { FaTelegramPlane, FaFacebookF } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiArrowRight } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      description: "Saving energy and time for the Hawassa community. The central source for city events, industrial hubs, and community gatherings.",
      status: "Systems Nominal",
      sections: { discover: "Discover", org: "Organization", contact: "Contact" },
      contactInfo: {
        emailLabel: "Email",
        phoneLabel: "Phone",
        locationLabel: "Location",
        buttonText: "Get in Touch"
      },
      madeIn: "Made in Hawassa"
    },
    am: {
      description: "ለሀዋሳ ማህበረሰብ ጉልበትና ጊዜን መቆጠብ። ለከተማ ዝግጅቶች፣ ለኢንዱስትሪ ማዕከላት እና ለማህበረሰብ ስብሰባዎች ማዕከላዊ ምንጭ።",
      status: "ሲስተም በጥሩ ሁኔታ ላይ ነው",
      sections: { discover: "ይቃኙ", org: "ድርጅት", contact: "ያግኙን" },
      contactInfo: {
        emailLabel: "ኢሜይል",
        phoneLabel: "ስልክ",
        locationLabel: "አድራሻ",
        buttonText: "መልዕክት ይላኩ"
      },
      madeIn: "ሀዋሳ የተሰራ"
    },
    si: {
      description: "Hawassa miidiyadii yannanna wolqa gatisate. Quchi woyitoota, industire gidduubbanna mannu gambooshshe mereero.",
      status: "Olluu Giddo",
      sections: { discover: "La'i", org: "Uurrinsha", contact: "Ninke Xaadi" },
      contactInfo: {
        emailLabel: "Imeel",
        phoneLabel: "Silke",
        locationLabel: "Gidduubba",
        buttonText: "Sokka Soki"
      },
      madeIn: "Hawassa Loonsanni"
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
                className="group rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-center transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:-translate-y-1"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 transition-all group-hover:bg-sky-500/20 group-hover:scale-110">
                  <FaTelegramPlane className="text-xl" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Telegram</p>
              </Link>

              <Link
                href="https://www.facebook.com/HawassaNexus"
                target="_blank"
                rel="noreferrer"
                title="Hawassa Nexus on Facebook"
                className="group rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-center transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:-translate-y-1"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 transition-all group-hover:bg-blue-600/20 group-hover:scale-110">
                  <FaFacebookF className="text-xl" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Facebook</p>
              </Link>

              <Link
                href="https://www.tiktok.com/@hawassanexus"
                target="_blank"
                rel="noreferrer"
                title="Hawassa Nexus on TikTok"
                className="group rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-center transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:-translate-y-1"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10 text-pink-400 transition-all group-hover:bg-pink-500/20 group-hover:scale-110">
                  <SiTiktok className="text-xl" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">TikTok</p>
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
                  <Link href={link.href} className="group flex items-center text-zinc-500 hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-tight">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                       <HiArrowRight className="text-sky-500" />
                    </span>
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
                  <Link href={link.href} className="group flex items-center text-zinc-500 hover:text-sky-400 transition-colors text-xs font-bold uppercase tracking-tight">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                       <HiArrowRight className="text-sky-500" />
                    </span>
                    {language === "am" ? link.am : language === "si" ? link.si : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT DETAILS */}
          <div className="md:col-span-4">
            <div className="p-8 rounded-3xl bg-linear-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all duration-500" />
              
              <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                {t.sections.contact}
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-sky-500/30 transition-all">
                    <HiOutlineMail className="text-sky-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.15em] text-[9px] mb-1">{t.contactInfo.emailLabel}</p>
                    <a href="mailto:hello@hawassapulse.com" className="text-zinc-100 text-sm font-medium hover:text-sky-400 transition-colors">hello@hawassapulse.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-sky-500/30 transition-all">
                    <HiOutlinePhone className="text-sky-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.15em] text-[9px] mb-1">{t.contactInfo.phoneLabel}</p>
                    <a href="tel:+251912345678" className="text-zinc-100 text-sm font-medium hover:text-sky-400 transition-colors">+251 912 345 678</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-sky-500/30 transition-all">
                    <HiOutlineLocationMarker className="text-sky-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.15em] text-[9px] mb-1">{t.contactInfo.locationLabel}</p>
                    <p className="text-zinc-100 text-sm font-medium">Hawassa City Center, Southern Ethiopia</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/contact" className="w-full group/btn relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500 hover:border-sky-500 transition-all duration-300">
                  <span className="text-sky-400 group-hover/btn:text-black text-[10px] font-black uppercase tracking-[0.2em] transition-colors">{t.contactInfo.buttonText}</span>
                  <HiArrowRight className="text-sky-400 group-hover/btn:text-black group-hover/btn:-rotate-45 transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Hawassa Nexus • {t.madeIn}
          </p>

          <div className="flex items-center gap-3 py-2 px-5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
              {t.status}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;