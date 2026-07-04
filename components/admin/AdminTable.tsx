"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteEvent } from "@/lib/actions/event.actions";
import Pagination from "@/components/Pagination";
import {
  MdEdit,
  MdDeleteSweep,
  MdSearch,
  MdOpenInNew,
  MdWarning,
} from "react-icons/md";
import type { IEvent } from "@/database/event.model";
import { toast } from "sonner";

interface AdminTableProps {
  events: IEvent[];
}

const AdminTable = ({ events }: AdminTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localEvents, setLocalEvents] = useState<IEvent[]>(events || []);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, localEvents]);

  useEffect(() => {
    if (Array.isArray(events)) {
      setLocalEvents(events);
    }
  }, [events]);

  useEffect(() => {
    if (deleteId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    }
  }, [deleteId]);

  /**
   * FIX: Safe Filter Logic
   * Handles both new object titles {en, am, si} and legacy string titles.
   */
  const filteredEvents = (localEvents || []).filter((event) => {
    if (!event) return false;
    // 1. Resolve title safely: prioritize English, fallback to string, or empty string
    const resolvedTitle = typeof event?.title === 'string' 
      ? event.title 
      : (event?.title?.en || "");

    const title = resolvedTitle.toLowerCase();
    
    // Safely handle category which might be an object
    const resolvedCategory = typeof event?.category === 'string'
      ? event.category
      : (event?.category?.en || "");
    const category = resolvedCategory.toLowerCase();
    
    const search = (searchTerm || "").toLowerCase();

    return title.includes(search) || category.includes(search);
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const result = await deleteEvent(deleteId);
      if (result.success) {
        setLocalEvents((prev) =>
          prev.filter((e) => String(e._id) !== deleteId),
        );
        toast.success("Pulse Erased", {
          description: "The event has been permanently removed from the grid.",
          icon: <MdDeleteSweep className="text-sky-500" size={20} />,
        });
      } else {
        toast.error("Operation Failed", { description: result.message });
      }
    } catch (err) {
      toast.error("System Error", {
        description: "Could not sync with the database.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <MdSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search pulses by title or category..."
            className="w-full bg-black border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-sky-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-6 px-4">
          <div className="text-center">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              Active Pulses
            </p>
            <p className="text-xl font-black text-sky-500">
              {localEvents.length}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Pulse Identity
              </th>
              <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Category & Mode
              </th>
              <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Schedule
              </th>
              <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedEvents.map((event) => {
              // Resolved title for display
              const displayTitle = typeof event.title === 'string' ? event.title : event.title?.en;

              return (
                <tr
                  key={String(event._id)}
                  className="group hover:bg-white/1 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-black">
                        <Image
                          src={event.image || "/placeholder.png"}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          alt="Event"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                          {displayTitle}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">
                          ID: {String(event._id).slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-sky-500/80 uppercase bg-sky-500/5 border border-sky-500/10 px-2 py-0.5 rounded-md w-fit">
                        {typeof event.category === 'string' ? event.category : (event.category?.en || "Unknown")}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase px-2">
                        {typeof event.mode === 'string' ? event.mode : (event.mode?.en || "Unknown")}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-xs text-zinc-300 font-medium">
                      {event.date}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                      {event.time}
                    </p>
                  </td>
                  <td className="p-6 relative ">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/explore`}
                        className="p-2.5 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <MdOpenInNew size={18} />
                      </Link>
                      <Link
                        href={`/admin/edit/${event._id}`}
                        className="p-2.5 bg-sky-500/10 rounded-xl text-sky-500 hover:bg-sky-500 hover:text-black transition-all"
                      >
                        <MdEdit size={18} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(String(event._id))}
                        className="p-3 bg-white/5 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <MdDeleteSweep size={18} />
                      </button>
                    </div>

                    {deleteId === String(event._id) && (
                      <div className="absolute right-20 top-1/2 -translate-y-1/2 z-50 w-72 bg-black/90 backdrop-blur-xl border border-red-500/20 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(239,68,68,0.15)] animate-in fade-in zoom-in-95 slide-in-from-right-4 duration-200">
                        <div className="flex flex-col gap-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
                              <MdWarning size={20} className="animate-pulse" />
                            </div>
                            <div>
                              <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">
                                Confirm Erasure
                              </h4>
                              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
                                Action is irreversible
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-relaxed font-medium px-1">
                            Are you sure you want to delete <span className="text-white font-bold italic">{displayTitle}</span>? This will wipe all associated data from the pulse grid.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDeleteId(null)}
                              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={confirmDelete}
                              disabled={isDeleting}
                              className="flex-1 py-3 rounded-xl bg-red-500 text-black text-[9px] font-black uppercase hover:bg-red-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                            >
                              {isDeleting ? "Erasing..." : "Delete Pulse"}
                            </button>
                          </div>
                        </div>
                        <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-black border-t border-r border-red-500/20 rotate-45 shadow-[2px_-2px_5px_rgba(239,68,68,0.05)]" />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminTable;