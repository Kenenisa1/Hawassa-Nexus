export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
      {/* The Pulse Core */}
      <div className="relative flex items-center justify-center">
        
        {/* Expanding Pulse Rings */}
        <div className="absolute w-16 h-16 border border-amber-500/30 rounded-full animate-[ping_2s_linear_infinite]" />
        <div className="absolute w-24 h-24 border border-amber-500/20 rounded-full animate-[ping_2.5s_linear_infinite]" />
        
        {/* The Central Icon (Symbolizing the Portal) */}
        <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <div className="w-4 h-4 bg-black rounded-full animate-pulse" />
        </div>
      </div>

      {/* Modern Status Text */}
      <div className="mt-12 text-center space-y-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-500 italic">
          Hawassa Nexus
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest animate-pulse">
            Establishing Secure Link
          </p>
          <span className="flex gap-1">
            <span className="w-1 h-1 bg-zinc-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-zinc-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-zinc-700 rounded-full animate-bounce" />
          </span>
        </div>
      </div>

      {/* Bottom Scanning Line (Visual Detail) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-pulse" />
    </div>
  );
}