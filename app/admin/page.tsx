'use client';

/**
 * HAWASSA NEXUS - COMMAND CENTER (ADMIN DASHBOARD)
 * ------------------------------------------------
 * Core Management Interface for the Hawassa Nexus Ecosystem.
 * Handles real-time synchronization of event data, ticket sales,
 * alert broadcasts, user moderation, and system settings.
 */

import { useState, useEffect, useCallback } from "react";
import { 
  MdDashboard, MdEvent, MdPeople, MdSettings, MdAdd, 
  MdReceiptLong, MdCampaign, MdShield, MdBolt, MdCheckCircle,
  MdClose, MdDelete, MdMarkEmailRead, MdMarkEmailUnread,
  MdArchive, MdNotificationsActive, MdHelpOutline, MdPerson,
  MdMenu, MdOutlineCheckCircleOutline
} from "react-icons/md";
import AdminTable from "@/components/admin/AdminTable";
import { getAllEvents } from "@/lib/actions/event.actions";
import { getAllBookings, deleteBooking, verifyBookingPayment, rejectBookingPayment } from "@/lib/actions/booking.action";
import { getAllContacts, updateContactStatus, deleteContact } from "@/lib/actions/contact.action";
import { getAllSubscribers, deleteSubscriber, broadcastAlert } from "@/lib/actions/subscriber.action";
import { getAllUsers, updateUserRole } from "@/lib/actions/user.actions";
import { getSystemLogs } from "@/lib/actions/log.actions";
import { useLanguage } from "@/context/LanguageContext";
import LText from "@/components/LanguageFriendlyText";
import type { IEvent, IBooking, IContact, ISubscriber, IUser, ISystemLog } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const adminContent = {
  commandCenter: { en: "Admin Dashboard", am: "ቁጥጥር ማዕከል", si: "Ijjihaa Hojii" },
  controlPanel: { en: "Admin Dashboard", am: "ቁጥጥር ጠሪ", si: "Ijjihaa Hojii Gosa" },
  createPulse: { en: "Create Event", am: "ጠላቅ ፈጠር", si: "Pulsa Uuma" },
  livePulses: { en: "Active Events", am: "ቀጥታ ፈጠሮች", si: "Pulsa Jireenyaa" },
  totalRecords: { en: "Total Records", am: "ድምር ሪከርድ", si: "Kaab Guutuu" },
  apiStatus: { en: "API Status", am: "API ሁኔታ", si: "Hal'ina API" },
  healthy: { en: "Healthy", am: "ጠንካራ", si: "Niqabi" },
  dbLatency: { en: "DB Latency", am: "ዳታቤዝ ዘግየት", si: "Yaalchisa DB" },
  optimal: { en: "Optimal", am: "ተሟላ", si: "Gaarii" },
  traffic: { en: "Traffic Status", am: "የኔትወርክ ፍሰት", si: "Tiraafika" },
  internal: { en: "Internal", am: "ውስጣዊ", si: "Keessaa" },
  syncingGrid: { en: "Syncing Data...", am: "ከዳታቤዝ ጋር በማመሳሰል ላይ...", si: "Syncing..." },
};

const AdminDashboard = () => {
  const { language } = useLanguage();
  
  // --- TABS & NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "events" | "sales" | "alerts" | "moderation" | "security">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- DATA REGISTRY STATES ---
  const [events, setEvents] = useState<IEvent[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [systemLogs, setSystemLogs] = useState<ISystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- BROADCAST STATE ENGINE ---
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // --- MODERATION SELECTION STAGE ---
  const [selectedMessage, setSelectedMessage] = useState<IContact | null>(null);
  const [moderationCategoryFilter, setModerationCategoryFilter] = useState<string>("all");

  // --- SYSTEM MOCK CONFIG CONFIGURATION ---
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState(true);
  const [rateLimiterMode, setRateLimiterMode] = useState("60 req/min");

  /**
   * MEMOIZED CENTRAL DATA SYNC
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventsData, bookingsData, contactsData, subscribersData, usersData, logsData] = await Promise.all([
        getAllEvents(),
        getAllBookings(),
        getAllContacts(),
        getAllSubscribers(),
        getAllUsers(),
        getSystemLogs(50),
      ]);
      setEvents(eventsData);
      setBookings(bookingsData);
      setContacts(contactsData);
      setSubscribers(subscribersData);
      setUsers(usersData);
      setSystemLogs(logsData);
    } catch (error) {
      console.error("[SYSTEM ERROR] Failed to sync registry databases:", error);
      toast.error("Registry Sync Failed", {
        description: "Could not fetch updated system tables."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  // Load saved rate limiter mode on mount
  useEffect(() => {
    const savedRateLimit = localStorage.getItem("nexus_rate_limiter_mode");
    if (savedRateLimit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRateLimiterMode(savedRateLimit);
    }
  }, []);

  // --- CANCEL BOOKING PROTOCOL ---
  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel and erase this pass purchase?")) return;
    try {
      const res = await deleteBooking(id);
      if (res.success) {
        setBookings(prev => prev.filter(b => b._id !== id));
        toast.success("Pass Revoked", { description: "The ticket entry was deleted successfully." });
      } else {
        toast.error("Revocation Failed", { description: res.message });
      }
    } catch {
      toast.error("Database Connection Failure");
    }
  };

  // --- VERIFY PAYMENT PROTOCOL ---
  const handleVerifyPayment = async (id: string) => {
    try {
      const res = await verifyBookingPayment(id);
      if (res.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: "verified" } : b));
        toast.success("Payment Verified", { description: "Booking has been confirmed." });
      } else {
        toast.error("Verification Failed", { description: res.message });
      }
    } catch {
      toast.error("Database Connection Failure");
    }
  };

  // --- REJECT PAYMENT PROTOCOL ---
  const handleRejectPayment = async (id: string) => {
    try {
      const res = await rejectBookingPayment(id);
      if (res.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: "failed" } : b));
        toast.warning("Payment Rejected", { description: "Booking marked as failed." });
      } else {
        toast.error("Rejection Failed", { description: res.message });
      }
    } catch {
      toast.error("Database Connection Failure");
    }
  };

  // --- UPDATE CONTACT MESSAGE STATUS ---
  const handleUpdateContact = async (id: string, newStatus: string) => {
    try {
      const res = await updateContactStatus(id, newStatus);
      if (res.success) {
        setContacts(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage((prev: any) => ({ ...prev, status: newStatus }));
        }
        toast.success("Inquiry Updated", { description: `Status set to: ${newStatus}` });
      } else {
        toast.error("Update Failed", { description: res.message });
      }
    } catch {
      toast.error("Database Connection Failure");
    }
  };

  // --- DELETE CONTACT MESSAGE ---
  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message record?")) return;
    try {
      const res = await deleteContact(id);
      if (res.success) {
        setContacts(prev => prev.filter(c => c._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        toast.success("Inquiry Deleted", { description: "The message has been removed." });
      } else {
        toast.error("Deletion Failed", { description: res.message });
      }
    } catch {
      toast.error("Database Connection Failure");
    }
  };

  // --- DELETE SUBSCRIBER ---
  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("Unsubscribe this email address from alerts list?")) return;
    try {
      const res = await deleteSubscriber(id);
      if (res.success) {
        setSubscribers(prev => prev.filter(s => s._id !== id));
        toast.success("Subscriber Erased", { description: "Removed from registry." });
      } else {
        toast.error("Operation Failed", { description: res.message });
      }
    } catch {
      toast.error("Database Connection Failure");
    }
  };

  // --- TRIGGER BROADCAST DISPATCH ---
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastContent.trim()) {
      toast.error("Validation Error", { description: "Subject and message content cannot be empty." });
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await broadcastAlert(broadcastSubject, broadcastContent);
      if (res.success) {
        toast.success("Broadcast Dispatched", { 
          description: res.message,
          duration: 5000
        });
        setBroadcastSubject("");
        setBroadcastContent("");
      } else {
        toast.error("Broadcast Failed", { description: res.message });
      }
    } catch {
      toast.error("Server connection failed");
    } finally {
      setIsBroadcasting(false);
    }
  };

  // --- PROMOTE/DEMOTE USER ROLE ---
  const handleUserRoleChange = async (userId: string, newRole: any) => {
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        toast.success("Role Updated", { description: res.message });
      } else {
        toast.error("Failed to change role", { description: res.message });
      }
    } catch {
      toast.error("Database update connection failed.");
    }
  };

  const getUnreadInquiryCount = () => contacts.filter(c => c.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-300 selection:bg-sky-500/30 font-sans antialiased overflow-x-hidden">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-zinc-950/80 border-b border-white/5 fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg text-white uppercase italic tracking-tighter">
            Admin<span className="text-sky-500">Pulse</span>
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-sky-400 transition-colors p-2"
        >
          <MdMenu size={24} />
        </button>
      </div>

      <div className="flex pt-16 lg:pt-24 min-h-screen">
        
        {/* --- PERSISTENT NAVIGATION SIDEBAR --- */}
        <aside className={`
          fixed lg:sticky top-0 lg:top-28 bottom-0 left-0 z-40 
          w-72 bg-zinc-950/90 lg:bg-slate-950/40 border-r lg:border border-white/5 p-6 backdrop-blur-2xl
          flex flex-col justify-between transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:ml-8 lg:rounded-[2.5rem] lg:mb-8 lg:h-[calc(100vh-9rem)]
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div>
            <div className="mb-10 hidden lg:flex items-center gap-3 px-2">
              <div className="relative h-10 w-10 transition-transform duration-300 hover:rotate-12">
                <Image src="/logo.png" alt="Admin Logo" fill sizes="40px" className="object-contain" />
              </div>
              <span className="font-black text-lg text-white uppercase italic tracking-tighter">
                Admin<span className="text-sky-500">Pulse</span>
              </span>
            </div>
            
            <nav className="space-y-1.5">
              <button 
                onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === "dashboard" 
                    ? "bg-sky-500 text-black font-bold shadow-lg shadow-sky-500/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <MdDashboard size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
              </button>

              <button 
                onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === "events" 
                    ? "bg-sky-500 text-black font-bold shadow-lg shadow-sky-500/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <MdEvent size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Events</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${activeTab === "events" ? "bg-black/10 text-black" : "bg-white/5 text-zinc-500"}`}>
                  {events.length}
                </span>
              </button>

              <button 
                onClick={() => { setActiveTab("sales"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === "sales" 
                    ? "bg-sky-500 text-black font-bold shadow-lg shadow-sky-500/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <MdReceiptLong size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ticket Sales</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${activeTab === "sales" ? "bg-black/10 text-black" : "bg-white/5 text-zinc-500"}`}>
                  {bookings.length}
                </span>
              </button>

              <button 
                onClick={() => { setActiveTab("alerts"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === "alerts" 
                    ? "bg-sky-500 text-black font-bold shadow-lg shadow-sky-500/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <MdCampaign size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Notifications</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${activeTab === "alerts" ? "bg-black/10 text-black" : "bg-white/5 text-zinc-500"}`}>
                  {subscribers.length}
                </span>
              </button>

              <button 
                onClick={() => { setActiveTab("moderation"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === "moderation" 
                    ? "bg-sky-500 text-black font-bold shadow-lg shadow-sky-500/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <MdPeople size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Messages</span>
                </div>
                {getUnreadInquiryCount() > 0 && (
                  <span className="bg-sky-500 text-black font-black text-[9px] px-2 py-0.5 rounded-full animate-pulse">
                    {getUnreadInquiryCount()}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="space-y-1.5 pt-6 border-t border-white/5">
            <button 
              onClick={() => { setActiveTab("security"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                activeTab === "security" 
                  ? "bg-sky-500 text-black font-bold shadow-lg shadow-sky-500/10" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <MdShield size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Settings</span>
            </button>
          </div>
        </aside>

        {/* --- MAIN INTERACTIVE VIEW AREA --- */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 lg:pl-10 pb-20 pt-6 lg:pt-0 overflow-x-hidden">
          
          {/* CONTROL BAR HEADER */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_#0ea5e9]" />
                <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.4em]">System Status: Online</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                <LText content={adminContent.controlPanel} />
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/admin/create" 
                className="flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-sky-500/10 active:scale-[0.98]"
              >
                <MdAdd size={18} />
                <LText content={adminContent.createPulse} />
              </Link>

              {/* RE-SYNC ACTION */}
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="flex cursor-pointer items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-sky-500 hover:border-sky-500 transition-all duration-300 disabled:opacity-50"
                title="Synchronize Database"
              >
                <MdBolt size={20} className={isLoading ? "animate-spin text-sky-500" : ""} />
              </button>
            </div>
          </header>

          {/* DYNAMIC TELEMETRY LOADING STATE */}
          {isLoading && (
            <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-sky-950/20 border border-sky-500/10 rounded-xl w-fit">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
                <LText content={adminContent.syncingGrid} />
              </span>
            </div>
          )}

          {/* ────── VIEW SWITCHER ENGINE ────── */}
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              {/* Dynamic Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <div className="p-7 rounded-[2rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-400 transition-colors">
                    Active Events
                  </p>
                  <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">
                    {isLoading ? "..." : events.length}
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    Total Events
                  </p>
                </div>

                <div className="p-7 rounded-[2rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-400 transition-colors">
                    Tickets Sold
                  </p>
                  <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">
                    {isLoading ? "..." : bookings.length}
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    Event Bookings
                  </p>
                </div>

                <div className="p-7 rounded-[2rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-400 transition-colors">
                    Subscribers
                  </p>
                  <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">
                    {isLoading ? "..." : subscribers.length}
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    Newsletter List
                  </p>
                </div>

                <div className="p-7 rounded-[2rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-400 transition-colors">
                    Registered Users
                  </p>
                  <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">
                    {isLoading ? "..." : users.length}
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    Total Accounts
                  </p>
                </div>

                <div className="p-7 rounded-[2rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all group shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 group-hover:text-sky-400 transition-colors">
                    Support Queue
                  </p>
                  <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter">
                    {isLoading ? "..." : getUnreadInquiryCount()}
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    Unread Messages
                  </p>
                </div>
              </div>

              {/* Chart & Quick Action Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* SVG Visual Conversion Chart */}
                <div className="lg:col-span-8 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Activity Overview
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                        Recent event statistics
                      </p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20">
                      LIVE
                    </span>
                  </div>

                  {/* SVG Chart Design */}
                  <div className="w-full h-64 relative flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area Path */}
                      <path 
                        d="M 50 180 Q 150 70 250 130 T 450 60 T 550 100 L 550 200 L 50 200 Z" 
                        fill="url(#chartGlow)"
                      />
                      {/* Stroke Path */}
                      <path 
                        d="M 50 180 Q 150 70 250 130 T 450 60 T 550 100" 
                        fill="none" 
                        stroke="#0ea5e9" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                      />
                      {/* Interactive Grid Lines */}
                      <line x1="50" y1="200" x2="550" y2="200" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      <line x1="50" y1="150" x2="550" y2="150" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      <line x1="50" y1="100" x2="550" y2="100" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      <line x1="50" y1="50" x2="550" y2="50" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
                      
                      {/* Indicator Dots */}
                      <circle cx="50" cy="180" r="5" fill="#0ea5e9" stroke="#030014" strokeWidth="2" />
                      <circle cx="150" cy="100" r="5" fill="#0ea5e9" stroke="#030014" strokeWidth="2" />
                      <circle cx="250" cy="130" r="5" fill="#0ea5e9" stroke="#030014" strokeWidth="2" />
                      <circle cx="350" cy="95" r="5" fill="#0ea5e9" stroke="#030014" strokeWidth="2" />
                      <circle cx="450" cy="60" r="5" fill="#0ea5e9" stroke="#030014" strokeWidth="2" />
                      <circle cx="550" cy="100" r="5" fill="#0ea5e9" stroke="#030014" strokeWidth="2" />
                    </svg>
                    
                    {/* X-Axis Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                      <span>Event 01</span>
                      <span>Event 02</span>
                      <span>Event 03</span>
                      <span>Event 04</span>
                      <span>Event 05</span>
                      <span>Event 06</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Hub */}
                <div className="lg:col-span-4 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-7 space-y-6 shadow-2xl">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Quick Actions
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                      Common administrative tasks
                    </p>
                  </div>
                  
                  <div className="grid gap-3">
                    <Link 
                      href="/admin/create"
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-sky-500/10 hover:border-sky-500/30 text-zinc-400 hover:text-white transition-all group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">Create Event</span>
                      <MdAdd className="group-hover:translate-x-1 transition-transform" size={16} />
                    </Link>

                    <button 
                      onClick={() => setActiveTab("alerts")}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-sky-500/10 hover:border-sky-500/30 text-zinc-400 hover:text-white transition-all group text-left"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">Compose Alert</span>
                      <MdCampaign className="group-hover:translate-x-1 transition-transform" size={16} />
                    </button>

                    <button 
                      onClick={() => setActiveTab("moderation")}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-sky-500/10 hover:border-sky-500/30 text-zinc-400 hover:text-white transition-all group text-left"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">Review Messages</span>
                      <MdPeople className="group-hover:translate-x-1 transition-transform" size={16} />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-zinc-500">Maintenance Mode</span>
                      <button 
                        onClick={() => {
                          setMaintenanceMode(!maintenanceMode);
                          toast.success("Config Updated", { description: `Maintenance mode: ${!maintenanceMode ? "ENABLED" : "DISABLED"}` });
                        }}
                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${maintenanceMode ? 'bg-sky-500' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 ${maintenanceMode ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-zinc-500">Public Registration</span>
                      <button 
                        onClick={() => {
                          setPublicRegistration(!publicRegistration);
                          toast.success("Config Updated", { description: `User signups: ${!publicRegistration ? "ENABLED" : "DISABLED"}` });
                        }}
                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${publicRegistration ? 'bg-sky-500' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 ${publicRegistration ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS MANAGER */}
          {activeTab === "events" && (
            <div className="bg-slate-950/20 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8 px-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                    Event Management
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                    Manage active events on the website
                  </p>
                </div>
              </div>
              
              <AdminTable events={events} />
            </div>
          )}

          {/* TAB 3: TICKET SALES (BOOKINGS) */}
          {activeTab === "sales" && (
            <div className="bg-slate-950/20 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl animate-in fade-in duration-300 space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                  Ticket Sales & Bookings
                </h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                  Manage event tickets and user bookings
                </p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-white/5 bg-zinc-950/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/2">
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Event</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Tickets</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Amount</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Payment</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                          No tickets sold yet
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => {
                        const eventTitle = booking.eventId && typeof booking.eventId === 'object'
                          ? ((booking.eventId as { title?: { en?: string } }).title?.en || "Referenced Event")
                          : "Event";
                        const statusColors: Record<string, string> = {
                          free: "bg-zinc-700/50 text-zinc-300",
                          pending: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                          verified: "bg-green-500/20 text-green-400 border border-green-500/30",
                          failed: "bg-red-500/20 text-red-400 border border-red-500/30",
                        };
                        return (
                          <tr key={booking._id} className="hover:bg-white/[0.015] transition-colors">
                            <td className="p-5 text-white font-medium">
                              <div>{booking.email}</div>
                              {booking.txReference && (
                                <div className="text-[9px] font-mono text-zinc-600 mt-0.5">Ref: {booking.txReference}</div>
                              )}
                            </td>
                            <td className="p-5">
                              <span className="text-sky-400 font-bold">{eventTitle}</span>
                            </td>
                            <td className="p-5 text-center text-zinc-300 font-bold">
                              {booking.ticketsCount ?? 1}
                            </td>
                            <td className="p-5 text-center font-black">
                              {booking.totalAmount > 0 ? (
                                <span className="text-green-400">{booking.totalAmount.toLocaleString()} ETB</span>
                              ) : (
                                <span className="text-zinc-500">Free</span>
                              )}
                            </td>
                            <td className="p-5 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColors[booking.paymentStatus ?? 'free'] ?? ''}`}>
                                {booking.paymentStatus ?? "free"}
                              </span>
                            </td>
                            <td className="p-5">
                              <div className="flex items-center justify-center gap-2">
                                {booking.paymentStatus === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleVerifyPayment(booking._id)}
                                      className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500 hover:text-black rounded-lg text-green-400 transition-all text-[9px] font-black uppercase tracking-widest"
                                      title="Verify Payment"
                                    >
                                      ✓ Verify
                                    </button>
                                    <button
                                      onClick={() => handleRejectPayment(booking._id)}
                                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-black rounded-lg text-red-400 transition-all text-[9px] font-black uppercase tracking-widest"
                                      title="Reject Payment"
                                    >
                                      ✗ Reject
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg text-red-500/60 hover:text-red-400 transition-all"
                                  title="Delete Booking"
                                >
                                  <MdDelete size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === "alerts" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
              
              {/* Broadcast Controller */}
              <div className="lg:col-span-7 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                    Broadcast System
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                    Send alerts and updates to subscribed users
                  </p>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
                      Broadcast Subject Header
                    </label>
                    <input 
                      type="text" 
                      value={broadcastSubject}
                      onChange={(e) => setBroadcastSubject(e.target.value)}
                      placeholder="e.g. Hawassa Tech Summit: Live updates page is open"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
                      Alert Content (Rich text layout)
                    </label>
                    <textarea 
                      rows={6}
                      value={broadcastContent}
                      onChange={(e) => setBroadcastContent(e.target.value)}
                      placeholder="Write your email body here..."
                      className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-sky-500/40 transition-all placeholder:text-zinc-700 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-sky-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <MdNotificationsActive size={16} />
                    {isBroadcasting ? "Broadcasting Alert..." : "Dispatch Broadcast Alert"}
                  </button>
                </form>
              </div>

              {/* Subscribers Registry */}
              <div className="lg:col-span-5 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-7 space-y-6 shadow-2xl">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Subscribers List
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                    Manage newsletter and alert subscriptions
                  </p>
                </div>

                <div className="max-h-[400px] overflow-y-auto rounded-2xl border border-white/5 bg-black/30 divide-y divide-white/5">
                  {subscribers.length === 0 ? (
                    <p className="p-8 text-center text-zinc-600 font-bold uppercase tracking-widest text-[9px]">
                      No subscribers registered
                    </p>
                  ) : (
                    subscribers.map((sub) => (
                      <div key={sub._id} className="flex items-center justify-between p-4 hover:bg-white/1 transition-all">
                        <div className="overflow-hidden pr-2">
                          <p className="text-xs text-white font-medium truncate">{sub.email}</p>
                          <p className="text-[8px] font-mono text-zinc-600 uppercase mt-0.5">
                            Joined: {new Date(sub.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSubscriber(sub._id)}
                          className="text-zinc-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Erase Subscriber"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === "moderation" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
              
              {/* Message Feed List */}
              <div className="lg:col-span-5 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                      Message Inbox
                    </h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                      Filter and manage incoming messages
                    </p>
                  </div>
                  
                  {/* Category Filter */}
                  <select
                    value={moderationCategoryFilter}
                    onChange={(e) => setModerationCategoryFilter(e.target.value)}
                    className="bg-black border border-white/5 rounded-xl px-3 py-1.5 text-[9px] font-bold text-sky-400 uppercase tracking-widest outline-none"
                  >
                    <option value="all">All Channels</option>
                    <option value="general">General</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="membership">Membership</option>
                  </select>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {contacts
                    .filter(c => moderationCategoryFilter === "all" ? true : c.category === moderationCategoryFilter)
                    .length === 0 ? (
                      <p className="p-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-[9px]">
                        No messages found
                      </p>
                    ) : (
                      contacts
                        .filter(c => moderationCategoryFilter === "all" ? true : c.category === moderationCategoryFilter)
                        .map((msg) => (
                          <div 
                            key={msg._id}
                            onClick={() => setSelectedMessage(msg)}
                            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden ${
                              selectedMessage && selectedMessage._id === msg._id
                                ? 'bg-sky-500/10 border-sky-500/40' 
                                : 'bg-black/20 border-white/5 hover:bg-white/2 hover:border-white/10'
                            }`}
                          >
                            {msg.status === 'unread' && (
                              <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_#0ea5e9]" />
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5">
                                {msg.category}
                              </span>
                              <span className="text-[8px] font-mono text-zinc-500">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white truncate">{msg.subject || "No Subject Header"}</h4>
                            <p className="text-[10px] text-zinc-500 truncate mt-1">From: {msg.name}</p>
                          </div>
                        ))
                    )}
                </div>
              </div>

              {/* Message Details Pane */}
              <div className="lg:col-span-7 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl min-h-[400px] flex flex-col justify-between">
                {selectedMessage ? (
                  <div className="space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-white/5">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1 rounded-lg">
                              Channel: {selectedMessage.category}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${
                              selectedMessage.status === 'unread' 
                                ? 'bg-sky-950/50 border-sky-500/20 text-sky-400' 
                                : selectedMessage.status === 'read' 
                                ? 'bg-emerald-950/50 border-emerald-500/20 text-emerald-400'
                                : 'bg-zinc-900 border-white/5 text-zinc-500'
                            }`}>
                              Status: {selectedMessage.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-white mt-4 italic uppercase tracking-tight">
                            {selectedMessage.subject || "No Subject Header"}
                          </h3>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 bg-white/2 px-3 py-1.5 rounded-lg border border-white/5">
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sender Name</p>
                          <p className="text-white font-bold">{selectedMessage.name}</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Email Endpoint</p>
                          <p className="text-sky-400 font-mono font-medium truncate">{selectedMessage.email}</p>
                        </div>
                      </div>

                      <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Message Message</p>
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2.5">
                      {selectedMessage.status === 'unread' ? (
                        <button
                          onClick={() => handleUpdateContact(selectedMessage._id, 'read')}
                          className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          <MdMarkEmailRead size={14} />
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateContact(selectedMessage._id, 'unread')}
                          className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          <MdMarkEmailUnread size={14} />
                          Mark Unread
                        </button>
                      )}

                      {selectedMessage.status !== 'archived' && (
                        <button
                          onClick={() => handleUpdateContact(selectedMessage._id, 'archived')}
                          className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5"
                        >
                          <MdArchive size={14} />
                          Archive Message
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteContact(selectedMessage._id)}
                        className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500 hover:text-black text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ml-auto"
                      >
                        <MdDelete size={14} />
                        Delete Record
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 text-center my-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600">
                      <MdHelpOutline size={30} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                        No Inquiry Selected
                      </p>
                      <p className="text-[9px] text-zinc-700 mt-1">Select a ticket from the left panel feed to view message details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM SETTINGS & USERS */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
              
              {/* Telemetry Logs & Config Toggles */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Security Config */}
                <div className="bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-7 space-y-6 shadow-2xl">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Security Settings
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                      Configure system security
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-white">Rate Limit Regulator</p>
                        <p className="text-[8px] text-zinc-500 uppercase mt-0.5">Threshold request cap</p>
                      </div>
                      <select 
                        value={rateLimiterMode} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setRateLimiterMode(val);
                          localStorage.setItem("nexus_rate_limiter_mode", val);
                          toast.success("Security Mode Updated", { description: `Rate limit set to: ${val}` });
                        }}
                        className="bg-[#030014] border border-white/5 rounded-lg px-2 py-1 text-[9.5px] font-bold text-sky-400 outline-none"
                      >
                        <option value="60 req/min">60 req/min</option>
                        <option value="120 req/min">120 req/min</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <p className="text-[10px] font-black uppercase text-white mb-2">Security Status</p>
                      <div className="space-y-2 text-[9px] font-bold text-zinc-500 uppercase">
                        <div className="flex justify-between"><span>SSL Certification:</span><span className="text-emerald-400">Operational</span></div>
                        <div className="flex justify-between"><span>Threat Shield:</span><span className="text-emerald-400">Armed</span></div>
                        <div className="flex justify-between"><span>Database Cluster:</span><span className="text-sky-400">Replica Set</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Audit Logs */}
                <div className="bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-7 space-y-6 shadow-2xl">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      System Logs
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                      Recent system activity logs
                    </p>
                  </div>

                  <div className="bg-black border border-white/5 rounded-xl p-4 font-mono text-[9px] space-y-1.5 h-44 overflow-y-auto leading-relaxed">
                    {systemLogs.length === 0 ? (
                      <p className="text-zinc-600 text-center py-6">No system logs yet. Actions like deleting events or sending broadcasts will appear here.</p>
                    ) : (
                      systemLogs.map((log) => {
                        const colors: Record<string, string> = {
                          info: "text-sky-400/80",
                          success: "text-green-400/80",
                          warning: "text-amber-400/80",
                          error: "text-red-400/80",
                        };
                        const ts = new Date(log.createdAt).toLocaleTimeString("en-ET", {
                          hour: "2-digit", minute: "2-digit", second: "2-digit",
                        });
                        return (
                          <p key={log._id} className={colors[log.type] || "text-zinc-400"}>
                            [{ts}] {log.type.toUpperCase()}: {log.description}
                          </p>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Users & Permissions Panel */}
              <div className="lg:col-span-8 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                    User Management
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                    Manage user accounts and roles
                  </p>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-white/5 bg-black/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2">
                        <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          User Name
                        </th>
                        <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          Email Address
                        </th>
                        <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          Account Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-zinc-600 font-bold uppercase tracking-widest text-[9px]">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((usr) => (
                          <tr key={usr._id} className="hover:bg-white/1 transition-colors">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/5 flex items-center justify-center bg-zinc-900 text-sky-400 font-bold uppercase text-[10px]">
                                  {usr.picture && usr.picture !== "/assets/default-avatar.png" ? (
                                    <Image src={usr.picture} alt={usr.name} fill className="object-cover" />
                                  ) : (
                                    usr.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-bold">{usr.name}</p>
                                  <p className="text-[9px] text-zinc-500">@{usr.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 font-mono text-zinc-400">{usr.email}</td>
                            <td className="p-5">
                              <select
                                value={usr.role}
                                onChange={(e) => handleUserRoleChange(usr._id, e.target.value as any)}
                                className={`bg-[#030014] border border-white/5 rounded-xl px-3 py-1.5 text-[9.5px] font-black uppercase tracking-widest outline-none ${
                                  usr.role === 'admin' 
                                    ? 'text-amber-400' 
                                    : usr.role === 'organizer' 
                                    ? 'text-sky-400' 
                                    : 'text-zinc-500'
                                }`}
                              >
                                <option value="user" className="text-zinc-500">User</option>
                                <option value="organizer" className="text-sky-400">Organizer</option>
                                <option value="admin" className="text-amber-400">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;