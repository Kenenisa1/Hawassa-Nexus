"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LText from "./LanguageFriendlyText";
import {
  HiMenuAlt3,
  HiX,
  HiChevronDown,
  HiLogout,
  HiShieldCheck,
} from "react-icons/hi";
import Image from "next/image";

/**
 * Navigation links with English, Amharic, and Sidaamu Afo translations.
 */
const navLinks = [
  { name: { en: "Home", am: "መነሻ", si: "Hagarra" }, href: "/" },
  { name: { en: "Explore", am: "ኩነቶች", si: "Woyitoota" }, href: "/explore" },
  { name: { en: "City Hubs", am: "ማዕከላት", si: "Gidduubba" }, href: "/hubs" },
  { name: { en: "Vision", am: "ራዕይ", si: "Illacha" }, href: "/about" },
  { name: { en: "Support", am: "እገዛ", si: "Irko" }, href: "/support" },
];

/**
 * Supported language configurations.
 */
const languages = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "si", label: "Sidaamu" },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const isLoading = status === "loading";

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  /**
   * Font size adjustment for Ge'ez or longer Sidaamu scripts
   */
  const isNonEnglish = language === "am" || language === "si";
  const getFontSize = (baseSize: string, largeSize: string) =>
    isNonEnglish ? largeSize : baseSize;

  const currentLangLabel =
    languages.find((l) => l.code === language)?.label || "English";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
        setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node))
        setUserMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "mt-0" : "mt-2 md:mt-4"}`}>
        <header className="mx-auto max-w-7xl px-3 md:px-6 lg:px-8">
          <nav className={`flex items-center justify-between transition-all duration-500 border border-white/10 px-4 md:px-6 py-3 ${
              scrolled
                ? "bg-black/95 backdrop-blur-2xl rounded-none md:rounded-full py-4 shadow-[0_0_50px_rgba(0,0,0,1)]"
                : "bg-white/[0.03] backdrop-blur-md rounded-2xl md:rounded-[28px]"
            }`}
          >
            {/* Branding */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-16 w-16 md:h-20 md:w-20 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Hawassa Nexus Logo"
                  height={150}
                  width={150}
                  loading="eager"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm md:text-lg tracking-tight text-white uppercase italic leading-none">
                  Hawassa<span className="text-sky-500 group-hover:text-white transition-colors">Nexus</span>
                </span>
                <span className={`${getFontSize("text-[7px]", "text-[8px]")} text-zinc-500 font-bold tracking-widest uppercase mt-1`}>
                  <LText content={{ en: "City Events", am: "የከተማ ኩነቶች", si: "Qucha Woyitoota" }} />
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${getFontSize("text-[10px]", "text-[12px]")} font-black transition-all uppercase tracking-[0.2em] ${
                      pathname === link.href ? "text-sky-400" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <LText content={link.name} />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {/* Language Picker */}
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors"
                >
                  {currentLangLabel} <HiChevronDown className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code as any); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors ${language === l.code ? "bg-sky-500 text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Identity Section */}
              {isLoading ? (
                <div className="h-9 w-9 rounded-full bg-white/5 animate-pulse border border-white/10" />
              ) : !user ? (
                <Link href="/login" className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all">
                  <LText content={{ en: "Login", am: "ይግቡ", si: "Ein" }} />
                </Link>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`h-9 w-9 rounded-full border ${user?.role === "admin" ? "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-white/10"} bg-zinc-950 overflow-hidden flex items-center justify-center hover:border-sky-500 transition-all`}
                  >
                    {!user?.image || user.image.includes("dicebear.com") ? (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                        <span className="text-[13px] font-black text-sky-400 italic">
                          {user?.name?.charAt(0).toUpperCase() || "H"}
                        </span>
                      </div>
                    ) : (
                      <Image src={user.image} alt={user.name} width={36} height={36} className="w-full h-full object-cover" />
                    )}
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-52 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors rounded-t-xl group"
                      >
                        <p className="text-[10px] font-black text-white truncate flex items-center gap-1.5 uppercase italic">
                          {user.name} {user?.role === "admin" && <HiShieldCheck className="text-indigo-400" />}
                        </p>
                        <p className="text-[8px] font-bold text-zinc-500 truncate italic group-hover:text-sky-500 transition-colors uppercase">
                          <LText content={{ en: "View Profile", am: "መገለጫን ይመልከቱ", si: "Mekela" }} />
                        </p>
                      </Link>
                      {user?.role === "admin" && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-500/10 transition-all">
                          <HiShieldCheck size={14} /> <LText content={{ en: "Admin", am: "አስተዳዳሪ", si: "Admin" }} />
                        </Link>
                      )}
                      <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-all mt-1">
                        <HiLogout size={14} /> <LText content={{ en: "Logout", am: "ውጣ", si: "Fula" }} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsOpen(true)} className="lg:hidden text-white p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <HiMenuAlt3 size={20} />
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[100] bg-black transition-transform duration-500 ${isOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex justify-between items-center p-6">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <div className="relative h-11 w-11">
              <Image
                src="/logo.png"
                alt="Hawassa Nexus Logo"
                fill
                sizes="(max-width: 768px) 64px, 150px"
                loading="eager"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-lg text-white uppercase italic leading-none">
              Hawassa<span className="text-sky-500">Nexus</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="p-3 text-white bg-white/5 rounded-2xl active:scale-90 transition-transform">
            <HiX size={24} />
          </button>
        </div>

        <div className="px-6 space-y-3 overflow-y-auto max-h-[80vh]">
          {/* Mobile Language Selector */}
          <div className="flex gap-2 mb-6">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as any)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                  language === l.code ? "bg-sky-500 border-sky-500 text-black shadow-[0_0_20px_rgba(14,165,233,0.3)]" : "bg-white/5 border-white/10 text-zinc-500"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile Profile Link */}
          {user && (
            <Link
              href={`/profile/${user.id}`}
              onClick={() => setIsOpen(false)}
              className="block p-5 bg-white/[0.03] border border-sky-500/20 rounded-3xl text-white font-black uppercase tracking-widest italic flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden border border-sky-500 flex items-center justify-center bg-zinc-950">
                {!user?.image || user.image.includes("dicebear.com") ? (
                  <span className="text-sm text-sky-400 font-black italic">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <Image src={user.image} alt={user.name} width={40} height={40} className="w-full h-full object-cover" />
                )}
              </div>
              <span className={getFontSize("text-sm", "text-base")}>
                <LText content={{ en: "My Profile", am: "መገለጫዬ", si: "Mekela" }} />
              </span>
            </Link>
          )}

          {/* Mobile Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-zinc-400 font-black uppercase tracking-widest italic active:bg-white/5 transition-colors"
            >
              <span className={getFontSize("text-xs", "text-sm")}>
                <LText content={link.name} />
              </span>
            </Link>
          ))}

          {/* Admin and Auth Buttons */}
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setIsOpen(false)} className="block p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl text-indigo-400 font-black uppercase tracking-widest italic flex items-center gap-3">
              <HiShieldCheck size={20} />
              <span className={getFontSize("text-xs", "text-sm")}>
                <LText content={{ en: "Admin Dashboard", am: "የአስተዳዳሪ ፓነል", si: "Admin" }} />
              </span>
            </Link>
          )}

          {!user ? (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full py-6 bg-white text-black text-center font-black uppercase rounded-3xl mt-4 italic text-sm shadow-xl active:scale-95 transition-transform">
              <LText content={{ en: "Access the Grid", am: "ይግቡ", si: "Ein" }} />
            </Link>
          ) : (
            <button onClick={() => signOut()} className="block w-full py-6 bg-red-500/5 text-red-500 border border-red-500/10 text-center font-black uppercase rounded-3xl mt-4 text-xs">
              <LText content={{ en: "Terminate Session", am: "ውጣ", si: "Fula" }} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;