"use client";

import { useState } from "react";
import { sendEmail } from "@/lib/actions/contact.action";
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import LText from "@/components/LanguageFriendlyText";

const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useLanguage();

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await sendEmail(formData);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error || t({ en: "Something went wrong.", am: "ችግር ተከስቷል", si: "Garaqi kalaqamino" }));
      }
    } catch (e) {
      setStatus("error");
      setErrorMessage(t({ en: "Failed to connect to the server.", am: "ከሰርቨር ጋር መገናኘት አልተቻለም", si: "Serveru xaada hooggino" }));
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <FaCheckCircle className="text-sky-400 text-4xl" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          <LText content={{ en: "Message Received", am: "መልዕክትዎ ደርሶናል", si: "Sokka Adhino" }} />
        </h3>
        <p className="text-zinc-400">
          <LText content={{ en: "The Hub has received your inquiry. We'll be in touch soon.", am: "ማዕከሉ ጥያቄዎን ተቀብሏል። በቅርቡ እናገኝዎታለን።", si: "Gidduubba xa'mookki adhino. Muli yanna giddo xaadammokki." }} />
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium underline underline-offset-4"
        >
          <LText content={{ en: "Send another message", am: "ሌላ መልዕክት ይላኩ", si: "Wole sokka soki" }} />
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
          <FaExclamationCircle />
          {errorMessage}
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-zinc-300 ml-1">
            <LText content={{ en: "Full Name", am: "ሙሉ ስም", si: "Su'ma" }} />
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder={t({ en: "Kenenisa Mieso", am: "ቀነኒሳ ሚኤሶ", si: "Kenenisa Mieso" })}
            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all hover:border-zinc-700 shadow-inner"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-zinc-300 ml-1">
            <LText content={{ en: "Email", am: "ኢሜይል", si: "Imeel" }} />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="example@amu.edu.et"
            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all hover:border-zinc-700 shadow-inner"
          />
        </div>
      </div>

      {/* Row 2: Category & Subject (The missing sections) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-semibold text-zinc-300 ml-1">
            <LText content={{ en: "Inquiry Type", am: "የጥያቄ ዓይነት", si: "Xa'mo Gara" }} />
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all hover:border-zinc-700 cursor-pointer shadow-inner"
            >
              <option value="general" className="bg-zinc-900">{t({ en: "General Inquiry", am: "አጠቃላይ ጥያቄ", si: "Wo'ma Xa'mo" })}</option>
              <option value="membership" className="bg-zinc-900">{t({ en: "Joining the Hub", am: "ማዕከሉን መቀላቀል", si: "Gidduubba E'a" })}</option>
              <option value="partnership" className="bg-zinc-900">{t({ en: "Partnership", am: "አጋርነት", si: "Tuma" })}</option>
              <option value="support" className="bg-zinc-900">{t({ en: "Support", am: "ድጋፍ", si: "Irko" })}</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-xs" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-semibold text-zinc-300 ml-1">
            <LText content={{ en: "Subject", am: "ጉዳዩ", si: "Hajo" }} />
          </label>
          <input
            id="subject"
            name="subject"
            required
            placeholder={t({ en: "e.g. Workshop Registration", am: "ለምሳሌ የስልጠና ምዝገባ", si: "Lawishsha Worshop galcho" })}
            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all hover:border-zinc-700 shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-zinc-300 ml-1">
          <LText content={{ en: "Your Message", am: "መልዕክትዎ", si: "Sokkanki" }} />
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={t({ en: "How can we help?", am: "እንዴት ልንረዳዎ እንችላለን?", si: "Hiitto kaa'linohe?" })}
          className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all hover:border-zinc-700 shadow-inner"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full relative group overflow-hidden bg-sky-500 hover:bg-sky-400 disabled:bg-zinc-800 text-black font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] active:scale-[0.98]"
      >
        <div className="relative z-10 flex items-center justify-center gap-2">
          {status === "loading" ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LText content={{ en: "Send Message", am: "መልዕክት ላክ", si: "Sokka Soki" }} />
              <FaPaperPlane className="text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default ContactForm;