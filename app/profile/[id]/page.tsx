"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import LText from "@/components/LanguageFriendlyText";
import {
  HiCalendar,
  HiMail,
  HiShieldCheck,
  HiX,
  HiBadgeCheck,
  HiCube,
} from "react-icons/hi";
import { useParams } from "next/navigation";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = session?.user as any;
  const isAmharic = language === "am" || language === "si";

  const userImage = currentUser?.image;
  const showInitial = !userImage || userImage.includes("dicebear.com");
  const isOwnProfile = currentUser?.id === params.id;

  if (!currentUser) return <AuthLoading />;

  return (
    <div className="min-h-screen bg-[#000] text-zinc-100 pt-28 pb-24 px-4 sm:px-8 font-sans">
      {/* Cinematic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-sky-500/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 border-b border-white/5 pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Minimalist Avatar */}
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden group">
              {showInitial ? (
                <span className="text-5xl font-black text-sky-500 italic drop-shadow-sm">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </span>
              ) : (
                <Image src={userImage} alt={currentUser.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              )}
            </div>

            {/* Profile Identity */}
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded">
                   {currentUser.role || "Member"}
                 </span>
                 {currentUser.role === "admin" && <HiShieldCheck className="text-indigo-400" />}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                {currentUser.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-500 text-xs font-medium tracking-wide">
                <span className="flex items-center gap-1.5"><HiMail className="text-sky-500/50" /> {currentUser.email}</span>
                <span className="flex items-center gap-1.5"><HiCalendar className="text-sky-500/50" /> Joined 2026</span>
              </div>
            </div>
          </div>

          {/* Action Button - Scaled down for elegance */}
          <button
            onClick={() => isOwnProfile && setIsEditing(true)}
            className="px-8 py-3 rounded-xl bg-white text-black text-[11px] font-black uppercase italic tracking-widest hover:bg-sky-400 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            {isOwnProfile ? <LText content={{en: "Edit Identity", am: "መገለጫ ያርሙ"}} /> : "Send Message"}
          </button>
        </div>

        {/* BENTO STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Pulse Metrics */}
          <div className="md:col-span-2 bg-zinc-950/40 border border-white/5 rounded-[32px] p-8 hover:bg-zinc-900/40 transition-colors group">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Network Statistics</p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-3xl font-black italic text-white group-hover:text-sky-500 transition-colors">04</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Active Events</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black italic text-white group-hover:text-indigo-500 transition-colors">852</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Pulse Credits</p>
              </div>
            </div>
          </div>

          {/* Card: Achievement */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
            <HiBadgeCheck className="text-indigo-500 text-3xl" />
            <div>
              <p className="text-xl font-black italic text-white uppercase leading-none mb-1">Elite</p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-pretty">Tier 1 Contributor Status</p>
            </div>
          </div>

          {/* Card: Activity Feed (Full width) */}
          <div className="md:col-span-3 bg-zinc-950/40 border border-white/5 rounded-[32px] p-10 flex flex-col items-center text-center space-y-4">
             <div className="p-4 bg-white/[0.02] rounded-full border border-white/5">
                <HiCube className="text-zinc-700 text-2xl animate-pulse" />
             </div>
             <div className="space-y-1">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">Data Stream Pending</h3>
               <p className="text-[10px] text-zinc-600 font-medium max-w-[200px]">Synchronizing your digital footprint with the Hawassa Nexus node...</p>
             </div>
          </div>

        </div>
      </div>

      {/* Modal - Same as previous but with tighter text */}
      {isEditing && <EditModal user={currentUser} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

const AuthLoading = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-10 h-10 border-2 border-sky-500/10 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-500 italic animate-pulse">Initializing Interface</p>
    </div>
  </div>
);

const EditModal = ({ user, onClose }: any) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-300">
        <div className="bg-zinc-950 border border-white/10 w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><HiX size={20}/></button>
            <h2 className="text-lg font-black italic uppercase text-white mb-6 tracking-tight">Identity Update</h2>
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500 transition-all font-bold" />
                </div>
                <button className="w-full py-4 bg-sky-500 text-black font-black uppercase rounded-xl hover:bg-white transition-all italic text-[11px] tracking-widest">
                    Confirm Sync
                </button>
            </div>
        </div>
    </div>
);

export default ProfilePage;