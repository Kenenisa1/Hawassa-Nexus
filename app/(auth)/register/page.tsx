"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth.actions";
import { FaUser, FaAt, FaEnvelope, FaLock, FaRocket } from "react-icons/fa";
import { toast } from "sonner";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await registerUser(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success("Profile Created. Redirecting to Login...");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white uppercase italic">Join the <span className="text-sky-500">Pulse</span></h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">New Identity Protocol</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="relative group">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="text"
              placeholder="FULL NAME"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 transition-all font-bold text-sm"
            />
          </div>

          {/* Username */}
          <div className="relative group">
            <FaAt className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="text"
              placeholder="USERNAME"
              required
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 transition-all font-bold text-sm"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 transition-all font-bold text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="password"
              placeholder="CREATE PASSWORD"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 transition-all font-bold text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-black font-black py-4 rounded-2xl transition-all uppercase italic tracking-widest flex items-center justify-center gap-2"
          >
            {isLoading ? "Processing..." : <><FaRocket /> Create Account</>}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-[10px] font-black uppercase">
          Already verified? <Link href="/login" className="text-sky-500">Access Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;