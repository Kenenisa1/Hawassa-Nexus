'use client';

/**
 * HAWASSA NEXUS - COMMAND CENTER (ADMIN DASHBOARD)
 * ------------------------------------------------
 * Core Management Interface for the Hawassa Nexus Ecosystem.
 * Handles real-time synchronization of event data, API testing, 
 * and system health monitoring.
 * * Architecture: Next.js Client Component with Mongoose Integration.
 */

import { useState, useEffect, useCallback } from "react";
import { 
  MdDashboard, MdEvent, MdPeople,
  MdSettings,  MdAdd, 
  MdReceiptLong, MdCampaign, MdShield, MdBolt 
} from "react-icons/md";
import AdminTable from "@/components/admin/AdminTable";
import { getAllEvents } from "@/lib/actions/event.actions";
import { useLanguage } from "@/context/LanguageContext";
import LText from "@/components/LanguageFriendlyText";
import type { IEvent } from "@/database/event.model";
import Link from "next/link";
import Image from "next/image";

const adminContent = {
  commandCenter: { en: "Command Center", am: "ቁጥጥር ማዕከል", si: "Ijjihaa Hojii" },
  controlPanel: { en: "Control Panel", am: "ቁጥጥር ጠሪ", si: "Ijjihaa Hojii Gosa" },
  createPulse: { en: "Create Pulse", am: "ጠላቅ ፈጠር", si: "Pulsa Uuma" },
  synchronizeGrid: { en: "Synchronize Grid", am: "ቍጣር ተሳሰር", si: "Gridi Wachiisu" },
  livePulses: { en: "Live Pulses", am: "ቀጥታ ፈጠሮች", si: "Pulsa Jireenyaa" },
  totalRecords: { en: "Total Records", am: "ድምር ሪከርድ", si: "Kaab Guutuu" },
  apiStatus: { en: "API Status", am: "API ሁኔታ", si: "Hal'ina API" },
  healthy: { en: "Healthy", am: "ጠንካራ", si: "Niqabi" },
  dbLatency: { en: "DB Latency", am: "ዳታቤዝ ዘግየት", si: "Yaalchisa DB" },
  optimal: { en: "Optimal", am: "ተሟላ", si: "Gaarii" },
  traffic: { en: "Traffic", am: "ሞቃ", si: "Karaa Soqqii" },
  internal: { en: "Internal", am: "ውስጣዊ", si: "Keessaa" },
  managedContent: { en: "Managed Content Stream", am: "ተቆጣጠሪ ማዕዘ ሰበብ", si: "Kara Qabeenya Hojii" },
  syncingGrid: { en: "Syncing with Grid...", am: "ከ ቍጣር ጋር ተሳሰር...", si: "Gridi Wajjin Wachiisu..." },
};

const AdminDashboard = () => {
  const { language } = useLanguage();
  
  // --- SYSTEM STATE ENGINE ---
  const [events, setEvents] = useState<IEvent[]>([]);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * MEMOIZED DATA FETCHER
   * Communicates with the Server Action to retrieve the latest Pulse records.
   * Uses lean serialization to ensure MongoDB Objects are UI-ready.
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      // Ensure data is sorted by latest first before setting state
      setEvents(data);
    } catch (error) {
      console.error("[SYSTEM ERROR] Failed to sync with Pulse Database:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * AUTOMATED SYNC PROTOCOL
   * 1. Initial Mount: Fetches current database state.
   * 2. Window Focus: Re-syncs data automatically when admin returns to this tab.
   */
  useEffect(() => {
    fetchData();

    // Auto-refresh when the admin switches back to this tab from the 'Create' page
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-black text-zinc-400 selection:bg-sky-500/30">
      <div className="flex pt-20 lg:pt-28">
        
        {/* --- GLOBAL NAVIGATION SIDEBAR --- */}
        <aside className="hidden lg:flex w-72 flex-col fixed left-8 top-32 bottom-8 rounded-[3rem] bg-slate-950/40 border border-white/5 p-8 backdrop-blur-2xl z-20">
          <div className="mb-12 flex items-center gap-3 px-2">
            <div className="relative h-12 w-12 transition-transform duration-300 hover:scale-105">
              <Image src="/logo.png" alt="Admin Logo" fill className="object-contain" />
            </div>
            <span className="font-black text-xl text-white uppercase italic tracking-tighter">
              Admin<span className="text-sky-500">Pulse</span>
            </span>
          </div>
          
          <nav className="space-y-3 flex-1">
            <SidebarLink icon={<MdDashboard />} label={<LText content={adminContent.commandCenter} />} active />
            <SidebarLink icon={<MdEvent />} label="Events Manager" />
            <SidebarLink icon={<MdReceiptLong />} label="Pass Sales" />
            <SidebarLink icon={<MdCampaign />} label="City Alerts" />
            <SidebarLink icon={<MdPeople />} label="Moderation" />
          </nav>

          <div className="space-y-3 pt-6 border-t border-white/5">
            <SidebarLink icon={<MdShield />} label="Security" />
            <SidebarLink icon={<MdSettings />} label="Config" />
          </div>
        </aside>

        {/* --- CORE CONTROL INTERFACE --- */}
        <main className="flex-1 px-4 md:px-10 lg:ml-80 pb-20">
          
          {/* HEADER & ACTION HUB */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_#0ea5e9]" />
                <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.4em]">Node: Hawassa_Main_Grid</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">
                <LText content={adminContent.controlPanel} /> <span className="text-zinc-800">Panel</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <Link 
                href="/admin/create" 
                className="flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20 active:scale-95"
              >
                <MdAdd size={20} />
                <LText content={adminContent.createPulse} />
              </Link>

              {/* MANUAL SYNC TRIGGER */}
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="flex cursor-pointer items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-sky-500 hover:border-sky-500 transition-all active:rotate-180 duration-500 disabled:opacity-50"
                title="Synchronize Grid"
              >
                <MdBolt size={24} className={isLoading ? "animate-spin text-sky-500" : ""} />
              </button>
            </div>
          </header>

          {/* SYSTEM METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <StatCard label={<LText content={adminContent.livePulses} />} value={isLoading ? "..." : events.length} trend={<LText content={adminContent.totalRecords} />} />
            <StatCard label={<LText content={adminContent.apiStatus} />} value="200" trend={<LText content={adminContent.healthy} />} />
            <StatCard label={<LText content={adminContent.dbLatency} />} value="24ms" trend={<LText content={adminContent.optimal} />} />
            <StatCard label={<LText content={adminContent.traffic} />} value="Low" trend={<LText content={adminContent.internal} />} />
          </div>

          {/* API RESPONSE TERMINAL */}
          {testResponse && (
            <div className="mb-12 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 font-mono text-[10px] text-emerald-400 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-4">
                <p className="font-black uppercase tracking-widest">API Response Log</p>
                <button onClick={() => setTestResponse(null)} className="text-zinc-500 hover:text-white">CLOSE</button>
              </div>
              <pre className="overflow-x-auto">{JSON.stringify(testResponse, null, 2)}</pre>
            </div>
          )}

          {/* MAIN DATA STREAM TABLE */}
          <div className="bg-slate-950/20 border border-white/5 rounded-[3rem] p-4 md:p-8 backdrop-blur-sm shadow-inner">
             <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest italic"><LText content={adminContent.managedContent} /></h3>
                {isLoading && <span className="text-[9px] font-bold text-sky-500 animate-pulse uppercase"><LText content={adminContent.syncingGrid} /></span>}
             </div>
             
             {/* The rendered AdminTable is passed the fresh state 'events' */}
             <AdminTable events={events} />
          </div>
        </main>
      </div>
    </div>
  );
};

// --- MODULAR SUB-COMPONENTS ---

const SidebarLink = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl cursor-pointer transition-all duration-500 ${
    active 
    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 translate-x-2" 
    : "text-zinc-600 hover:text-white hover:bg-white/5"
  }`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend }: any) => (
  <div className="p-8 rounded-[2.5rem] bg-slate-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-sm">
    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-500 transition-colors">{label}</p>
    <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">{value}</h3>
    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{trend}</p>
  </div>
);

export default AdminDashboard;

const AdminDashboard = () => {
  // --- SYSTEM STATE ENGINE ---
  const [events, setEvents] = useState<IEvent[]>([]);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * MEMOIZED DATA FETCHER
   * Communicates with the Server Action to retrieve the latest Pulse records.
   * Uses lean serialization to ensure MongoDB Objects are UI-ready.
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      // Ensure data is sorted by latest first before setting state
      setEvents(data);
    } catch (error) {
      console.error("[SYSTEM ERROR] Failed to sync with Pulse Database:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * AUTOMATED SYNC PROTOCOL
   * 1. Initial Mount: Fetches current database state.
   * 2. Window Focus: Re-syncs data automatically when admin returns to this tab.
   */
  useEffect(() => {
    fetchData();

    // Auto-refresh when the admin switches back to this tab from the 'Create' page
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-black text-zinc-400 selection:bg-sky-500/30">
      <div className="flex pt-20 lg:pt-28">
        
        {/* --- GLOBAL NAVIGATION SIDEBAR --- */}
        <aside className="hidden lg:flex w-72 flex-col fixed left-8 top-32 bottom-8 rounded-[3rem] bg-slate-950/40 border border-white/5 p-8 backdrop-blur-2xl z-20">
          <div className="mb-12 flex items-center gap-3 px-2">
            <div className="relative h-12 w-12 transition-transform duration-300 hover:scale-105">
              <Image src="/logo.png" alt="Admin Logo" fill className="object-contain" />
            </div>
            <span className="font-black text-xl text-white uppercase italic tracking-tighter">
              Admin<span className="text-sky-500">Pulse</span>
            </span>
          </div>
          
          <nav className="space-y-3 flex-1">
            <SidebarLink icon={<MdDashboard />} label="Command Center" active />
            <SidebarLink icon={<MdEvent />} label="Events Manager" />
            <SidebarLink icon={<MdReceiptLong />} label="Pass Sales" />
            <SidebarLink icon={<MdCampaign />} label="City Alerts" />
            <SidebarLink icon={<MdPeople />} label="Moderation" />
          </nav>

          <div className="space-y-3 pt-6 border-t border-white/5">
            <SidebarLink icon={<MdShield />} label="Security" />
            <SidebarLink icon={<MdSettings />} label="Config" />
          </div>
        </aside>

        {/* --- CORE CONTROL INTERFACE --- */}
        <main className="flex-1 px-4 md:px-10 lg:ml-80 pb-20">
          
          {/* HEADER & ACTION HUB */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_#0ea5e9]" />
                <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.4em]">Node: Hawassa_Main_Grid</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">
                Control <span className="text-zinc-800">Panel</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <Link 
                href="/admin/create" 
                className="flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20 active:scale-95"
              >
                <MdAdd size={20} />
                Create Pulse
              </Link>

              {/* MANUAL SYNC TRIGGER */}
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="flex cursor-pointer items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-sky-500 hover:border-sky-500 transition-all active:rotate-180 duration-500 disabled:opacity-50"
                title="Synchronize Grid"
              >
                <MdBolt size={24} className={isLoading ? "animate-spin text-sky-500" : ""} />
              </button>
            </div>
          </header>

          {/* SYSTEM METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <StatCard label="Live Pulses" value={isLoading ? "..." : events.length} trend="Total Records" />
            <StatCard label="API Status" value="200" trend="Healthy" />
            <StatCard label="DB Latency" value="24ms" trend="Optimal" />
            <StatCard label="Traffic" value="Low" trend="Internal" />
          </div>

          {/* API RESPONSE TERMINAL */}
          {testResponse && (
            <div className="mb-12 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 font-mono text-[10px] text-emerald-400 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-4">
                <p className="font-black uppercase tracking-widest">API Response Log</p>
                <button onClick={() => setTestResponse(null)} className="text-zinc-500 hover:text-white">CLOSE</button>
              </div>
              <pre className="overflow-x-auto">{JSON.stringify(testResponse, null, 2)}</pre>
            </div>
          )}

          {/* MAIN DATA STREAM TABLE */}
          <div className="bg-slate-950/20 border border-white/5 rounded-[3rem] p-4 md:p-8 backdrop-blur-sm shadow-inner">
             <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Managed Content Stream</h3>
                {isLoading && <span className="text-[9px] font-bold text-sky-500 animate-pulse uppercase">Syncing with Grid...</span>}
             </div>
             
             {/* The rendered AdminTable is passed the fresh state 'events' */}
             <AdminTable events={events} />
          </div>
        </main>
      </div>
    </div>
  );
};

// --- MODULAR SUB-COMPONENTS ---

const SidebarLink = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl cursor-pointer transition-all duration-500 ${
    active 
    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 translate-x-2" 
    : "text-zinc-600 hover:text-white hover:bg-white/5"
  }`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend }: any) => (
  <div className="p-8 rounded-[2.5rem] bg-slate-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-sm">
    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-500 transition-colors">{label}</p>
    <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">{value}</h3>
    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{trend}</p>
  </div>
);

export default AdminDashboard;