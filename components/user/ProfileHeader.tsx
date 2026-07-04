"use client";
import Image from "next/image";
import LText from "@/components/LanguageFriendlyText";
import {
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineIdentification,
} from "react-icons/hi";
import { signOut } from "next-auth/react";

export default function ProfileHeader({ user }: { user: any }) {
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="relative p-8 md:p-12 rounded-[3rem] border border-white/10 bg-gradient-to-br from-zinc-900/50 to-black overflow-hidden">
        {/* Abstract Background Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/10 p-1 bg-black overflow-hidden relative">
              <Image
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                {user.name}
              </h1>
              <span className="px-4 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-500 text-[10px] font-black uppercase tracking-widest self-center">
                Verified Resident
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-400">
                <HiOutlineMail className="text-sky-500" size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-400">
                <HiOutlineCalendar className="text-sky-500" size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  <LText
                    content={{
                      en: `Joined ${joinDate}`,
                      am: `ከ ${joinDate} ጀምሮ`,
                    }}
                  />
                </span>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="text-zinc-500 hover:text-red-500 transition-colors text-xs font-black uppercase"
            >
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
