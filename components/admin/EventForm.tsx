"use client";

import { useState } from "react";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { useRouter } from "next/navigation";
import {
  MdOutlinePhotoSizeSelectActual,
  MdCheckCircle,
  MdLanguage,
  MdEventNote,
  MdStar,
  MdErrorOutline,
  MdClose,
  MdLabelOutline,
  MdArrowBack,
  MdListAlt,
  MdLocationOn,
  MdPerson,
  MdAttachMoney,
  MdPeople,
  MdAccessTime,
  MdCalendarToday,
  MdRocketLaunch,
  MdAutorenew,
  MdEdit,
} from "react-icons/md";
import Image from "next/image";
import type { IEvent } from "@/types";

interface EventFormProps {
  initialData?: IEvent;
  type: "Create" | "Update";
}

type FormState = {
  title_en: string; title_am: string; title_si: string;
  desc_en: string; desc_am: string; desc_si: string;
  overview_en: string; overview_am: string; overview_si: string;
  agenda: string; tags: string;
  date: string; time: string; mode: string; category: string;
  status: string; hub: string; venue: string; location: string;
  audience: string; organizer: string; price: number; totalCapacity: number;
};

const CATEGORIES = ["Technology", "Culture", "Business", "Sports"] as const;
const MODES = ["offline", "online", "hybrid"] as const;
const STATUSES = ["draft", "published", "sold-out", "archived"] as const;

const STATUS_COLORS: Record<string, string> = {
  draft: "text-zinc-400",
  published: "text-emerald-400",
  "sold-out": "text-amber-400",
  archived: "text-red-400",
};

const EventForm = ({ initialData, type }: EventFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "am" | "si">("en");
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>({
    title_en: initialData?.title?.en || "",
    title_am: initialData?.title?.am || "",
    title_si: initialData?.title?.si || "",
    desc_en: initialData?.description?.en || "",
    desc_am: initialData?.description?.am || "",
    desc_si: initialData?.description?.si || "",
    overview_en: initialData?.overview?.en || "",
    overview_am: initialData?.overview?.am || "",
    overview_si: initialData?.overview?.si || "",
    agenda: initialData?.agenda?.map((a) => a.en || "").join("\n") || "",
    tags: initialData?.tags?.join(", ") || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    mode: initialData?.mode || "offline",
    category: initialData?.category || "Technology",
    status: initialData?.status || "draft",
    hub: initialData?.hub || "",
    venue: initialData?.venue || "",
    location: initialData?.location || "",
    audience: initialData?.audience || "",
    organizer: initialData?.organizer || "Kenenisa Mieso",
    price: initialData?.price ?? 0,
    totalCapacity: initialData?.totalCapacity ?? 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleUpload = () => {
    if (typeof window !== "undefined" && window.cloudinary) {
      window.cloudinary
        .createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            folder: "hawassa_pulse/events",
            styles: {
              palette: {
                window: "#030014",
                sourceBg: "#07070f",
                windowBorder: "#0ea5e9",
                tabIcon: "#0ea5e9",
                textLight: "#fff",
              },
            },
          },
          (error, result) => {
            if (!error && result?.event === "success")
              setImageUrl(result.info.secure_url);
          }
        )
        .open();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return showToast("Cover image is required", "error");
    if (!formState.title_en) return showToast("English title is required", "error");
    if (!formState.desc_en) return showToast("English description is required", "error");
    if (!formState.overview_en) return showToast("English overview is required", "error");

    setIsPending(true);

    const dataToSend = new FormData();
    dataToSend.append("title_en", formState.title_en);
    dataToSend.append("title_am", formState.title_am);
    dataToSend.append("title_si", formState.title_si);
    dataToSend.append("desc_en", formState.desc_en);
    dataToSend.append("desc_am", formState.desc_am);
    dataToSend.append("desc_si", formState.desc_si);
    dataToSend.append("overview_en", formState.overview_en);
    dataToSend.append("overview_am", formState.overview_am);
    dataToSend.append("overview_si", formState.overview_si);
    dataToSend.append("agenda", formState.agenda);
    dataToSend.append("tags", formState.tags);
    dataToSend.append("date", formState.date);
    dataToSend.append("time", formState.time);
    dataToSend.append("mode", formState.mode);
    dataToSend.append("category", formState.category);
    dataToSend.append("status", formState.status);
    dataToSend.append("hub", formState.hub);
    dataToSend.append("venue", formState.venue);
    dataToSend.append("location", formState.location);
    dataToSend.append("audience", formState.audience);
    dataToSend.append("organizer", formState.organizer);
    dataToSend.append("price", String(formState.price));
    dataToSend.append("totalCapacity", String(formState.totalCapacity));
    dataToSend.append("image", imageUrl);
    dataToSend.append("isFeatured", String(isFeatured));

    try {
      const result =
        type === "Update" && initialData?._id
          ? await updateEvent(initialData._id as string, dataToSend)
          : await createEvent(dataToSend);

      if (result.success) {
        showToast(
          type === "Create" ? "Event deployed successfully!" : "Event updated successfully!",
          "success"
        );
        if (type === "Create") {
          setTimeout(() => router.push("/admin"), 1500);
        }
      } else {
        showToast(result.message || "Something went wrong", "error");
      }
    } catch {
      showToast("Server connection failed", "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative text-zinc-300">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400"
              : "bg-red-950/80 border-red-500/30 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <MdCheckCircle size={20} />
          ) : (
            <MdErrorOutline size={20} />
          )}
          <p className="text-xs font-bold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <MdClose size={16} />
          </button>
        </div>
      )}

      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="group cursor-pointer mb-10 flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 px-5 py-3 rounded-2xl transition-all"
      >
        <MdArrowBack className="text-sky-500 group-hover:-translate-x-1 transition-transform" size={18} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white">
          Back to Admin
        </span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── COVER IMAGE ── */}
        <div
          onClick={handleUpload}
          className="group relative h-[360px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-950 border border-white/5 hover:border-sky-500/30 cursor-pointer transition-all"
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                fill
                className="object-cover brightness-60 group-hover:brightness-70 transition-all"
                alt="Event Cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                  <MdEdit size={18} className="text-sky-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Change Cover
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 group-hover:border-sky-500/30 group-hover:text-sky-500 transition-all">
                <MdOutlinePhotoSizeSelectActual size={36} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">
                  Upload Cover Image
                </p>
                <p className="text-[10px] text-zinc-700 mt-1">Recommended: 1600 × 900px</p>
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ─── LEFT: Content Editor ─── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Content Panel */}
            <div className="bg-zinc-950/60 border border-white/5 p-8 rounded-[2rem] backdrop-blur-2xl space-y-8">

              {/* Top bar: Language + Featured */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Language Tabs */}
                <div className="flex gap-1 bg-black/60 p-1 rounded-xl border border-white/5">
                  {(["en", "am", "si"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveTab(lang)}
                      className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                        activeTab === lang
                          ? "bg-sky-500 text-black shadow-lg shadow-sky-500/20"
                          : "text-zinc-500 hover:text-zinc-200"
                      }`}
                    >
                      {lang === "en" ? "English" : lang === "am" ? "አማርኛ" : "Sidaamu"}
                    </button>
                  ))}
                </div>

                {/* Featured Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                    isFeatured
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-white/[0.02] border-white/5 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <MdStar size={16} className={isFeatured ? "text-amber-400" : ""} />
                  {isFeatured ? "Featured" : "Mark as Featured"}
                </button>
              </div>

              {/* Title */}
              <div className="relative group">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-0.5 h-10 bg-sky-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-all" />
                <input
                  name={`title_${activeTab}`}
                  value={formState[`title_${activeTab}` as keyof FormState] as string}
                  onChange={handleInputChange}
                  required={activeTab === "en"}
                  placeholder={
                    activeTab === "en"
                      ? "Event Title (English) *"
                      : activeTab === "am"
                      ? "የዝግጅቱ ርዕስ"
                      : "Maqaa Woyitoo"
                  }
                  className="w-full bg-transparent text-4xl font-black text-white outline-none italic uppercase tracking-tight placeholder:text-zinc-800"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black text-sky-500/70 uppercase tracking-[0.2em]">
                  <MdLanguage size={14} />
                  Short Description [{activeTab.toUpperCase()}]
                  {activeTab === "en" && <span className="text-red-400">*</span>}
                </label>
                <textarea
                  name={`desc_${activeTab}`}
                  value={formState[`desc_${activeTab}` as keyof FormState] as string}
                  onChange={handleInputChange}
                  required={activeTab === "en"}
                  rows={3}
                  placeholder="Write a captivating hook for this event..."
                  className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-sm text-white outline-none focus:border-sky-500/40 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Overview */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black text-sky-500/70 uppercase tracking-[0.2em]">
                  <MdListAlt size={14} />
                  Full Overview [{activeTab.toUpperCase()}]
                  {activeTab === "en" && <span className="text-red-400">*</span>}
                </label>
                <textarea
                  name={`overview_${activeTab}`}
                  value={formState[`overview_${activeTab}` as keyof FormState] as string}
                  onChange={handleInputChange}
                  required={activeTab === "en"}
                  rows={8}
                  placeholder="Describe the full experience, schedule, and highlights..."
                  className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-sky-500/40 transition-all resize-none leading-[1.9] font-light"
                />
              </div>
            </div>

            {/* Agenda + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-950/60 border border-white/5 p-7 rounded-[1.8rem] backdrop-blur-xl space-y-4">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdEventNote className="text-sky-500" size={16} />
                  Agenda
                  <span className="text-zinc-700 ml-auto font-normal normal-case tracking-normal">one item per line</span>
                </label>
                <textarea
                  name="agenda"
                  value={formState.agenda}
                  onChange={handleInputChange}
                  rows={7}
                  placeholder={"09:00 — Opening Keynote\n10:30 — Panel Discussion\n12:00 — Networking Lunch"}
                  className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-800 resize-none leading-relaxed"
                />
              </div>

              <div className="bg-zinc-950/60 border border-white/5 p-7 rounded-[1.8rem] backdrop-blur-xl space-y-4">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdLabelOutline className="text-sky-500" size={16} />
                  Tags
                  <span className="text-zinc-700 ml-auto font-normal normal-case tracking-normal">comma separated</span>
                </label>
                <textarea
                  name="tags"
                  value={formState.tags}
                  onChange={handleInputChange}
                  rows={7}
                  placeholder={"AI, Technology, Hawassa,\nStartups, Community"}
                  className="w-full bg-transparent text-sm text-sky-400 font-mono outline-none placeholder:text-zinc-800 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Sidebar ─── */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">

            {/* Publish Panel */}
            <div className="bg-zinc-950/80 border border-white/5 p-6 rounded-[1.8rem] backdrop-blur-2xl space-y-5">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Publication
              </p>

              {/* Status */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Status
                </label>
                <select
                  name="status"
                  value={formState.status}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500/40 transition-all appearance-none"
                  style={{ color: STATUS_COLORS[formState.status] || "#fff" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} style={{ background: "#000", color: STATUS_COLORS[s] }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Category
                </label>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#000" }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Event Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormState((p) => ({ ...p, mode: m }))}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        formState.mode === m
                          ? "bg-sky-500/10 border-sky-500/40 text-sky-400"
                          : "border-white/5 text-zinc-600 hover:text-zinc-300 hover:border-white/10"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-zinc-950/80 border border-white/5 p-6 rounded-[1.8rem] backdrop-blur-2xl space-y-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Schedule
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdCalendarToday size={12} className="text-sky-500" />
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formState.date}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdAccessTime size={12} className="text-sky-500" />
                  Time (HH:mm) <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formState.time}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-zinc-950/80 border border-white/5 p-6 rounded-[1.8rem] backdrop-blur-2xl space-y-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Location
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdLocationOn size={12} className="text-sky-500" />
                  City Hub <span className="text-red-400">*</span>
                </label>
                <input
                  name="hub"
                  value={formState.hub}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Hawassa City"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Venue Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="venue"
                  value={formState.venue}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Lewi Resort Hall"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Full Address / Maps Link <span className="text-red-400">*</span>
                </label>
                <input
                  name="location"
                  value={formState.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Hawassa, SNNPR, Ethiopia"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="bg-zinc-950/80 border border-white/5 p-6 rounded-[1.8rem] backdrop-blur-2xl space-y-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Capacity & Pricing
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdPeople size={12} className="text-sky-500" />
                  Total Capacity <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={formState.totalCapacity}
                  onChange={handleInputChange}
                  required
                  min={0}
                  placeholder="500"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdAttachMoney size={12} className="text-sky-500" />
                  Ticket Price (ETB)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formState.price}
                  onChange={handleInputChange}
                  min={0}
                  placeholder="0 for free"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdPeople size={12} className="text-sky-500" />
                  Target Audience <span className="text-red-400">*</span>
                </label>
                <input
                  name="audience"
                  value={formState.audience}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Students, Entrepreneurs"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-zinc-950/80 border border-white/5 p-6 rounded-[1.8rem] backdrop-blur-2xl space-y-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Organizer
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  <MdPerson size={12} className="text-sky-500" />
                  Organizer Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="organizer"
                  value={formState.organizer}
                  onChange={handleInputChange}
                  required
                  placeholder="Kenenisa Mieso"
                  className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <MdAutorenew size={18} className="animate-spin" />
                  Deploying...
                </>
              ) : type === "Create" ? (
                <>
                  <MdRocketLaunch size={18} />
                  Deploy Event
                </>
              ) : (
                <>
                  <MdCheckCircle size={18} />
                  Save Changes
                </>
              )}
            </button>

          </aside>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
