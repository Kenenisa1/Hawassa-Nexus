import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaArrowLeft, 
  FaArrowRight, 
  FaShareAlt, 
  FaTicketAlt,
  FaLayerGroup
} from "react-icons/fa";
import { HiOutlineBadgeCheck, HiOutlineInformationCircle } from "react-icons/hi";
import Link from "next/link";
import { connection } from "next/server";

import BookEvent from "@/components/BookEvent";
import SaveButton from "@/components/SaveButton";
import EventCard from "@/components/EventCard";
import LText from "@/components/LanguageFriendlyText";

import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";
import { IEvent } from "@/types";
import { cookies } from "next/headers"; // Used to get your custom session/user ID

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const ui = {
  verified: { en: "Verified Pulse Event", am: "የተረጋገጠ ኩነት" },
  joinGrid: { en: "Join the Grid", am: "ይመዝገቡ" },
  insight: { en: "The Insight", am: "ዝርዝር መረጃ" },
  archive: { en: "Visual Archive", am: "ፎቶዎች" },
  sequence: { en: "Pulse Sequence", am: "የኩነቱ ቅደም ተከተል" },
  extend: { en: "Extend the Pulse", am: "ተቀራራቢ ኩነቶች" },
  related: { en: "Related Operations", am: "ተያያዥ መርሃ ግብሮች" },
  viewAll: { en: "View All Events", am: "ሁሉንም ይመልከቱ" },
  host: { en: "Host", am: "አዘጋጅ" },
  target: { en: "Target", am: "ለማን" },
  location: { en: "Location", am: "ቦታ" },
  tags: { en: "Operation Tags", am: "መለያዎች" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${BASE_URL}/api/events/${slug}`);
  const data = await res.json();
  const titleString = typeof data.event?.title === 'object' ? data.event.title.en : data.event?.title || 'Event';
  return { title: `${titleString} | Hawassa Nexus` };
}

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>; }) => {
  await connection();
  const { slug } = await params;
  
  // 1. Fetch Auth Session (Custom MERN Logic)
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value; // Or however you store your session ID

  await connectToDatabase();
  
  // 2. Fetch Event Data
  const request = await fetch(`${BASE_URL}/api/events/${slug}`, { 
    next: { revalidate: 3600 } 
  });
  const data = await request.json();
  if (!data.event) return notFound();

  const event: IEvent = data.event;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  // 3. Fetch User Data for the Save/Like Button
  let mongoUser = null;
  let hasSaved = false;

  if (userId) {
    mongoUser = await User.findById(userId);
    hasSaved = mongoUser?.saved?.includes(event._id);
  }

  const sS = (field: { en: string; am?: string; si?: string } | string | null | undefined) =>
    typeof field === 'object' && field !== null ? (field.en || "") : (field || "");
  const mapTarget = event.location || event.venue || "Hawassa, Ethiopia";
  const mapQuery = encodeURIComponent(mapTarget);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const openStreetMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${mapQuery}&zoom=15&size=640x320&markers=${mapQuery},red-pushpin`;
  const staticMapUrl = googleMapsApiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${mapQuery}&zoom=15&size=640x320&maptype=roadmap&markers=color:red%7C${mapQuery}&key=${googleMapsApiKey}`
    : openStreetMapUrl;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 pb-32 selection:bg-sky-500/30">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        <Image
          src={event.image}
          alt={sS(event.title)}
          fill
          className="object-cover scale-105 brightness-[0.4] contrast-[1.1]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#000000] via-[#000000]/20 to-transparent" />
        
        <div className="absolute top-24 left-0 w-full px-6 flex justify-between items-center z-20">
          <Link href="/explore" className="group p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:border-sky-500/50 transition-all">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex gap-4">
            {mongoUser && (
              <SaveButton userId={mongoUser._id.toString()} eventId={event._id.toString()} hasSaved={hasSaved} />
            )}
            <button className="p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:text-sky-400 transition-colors">
              <FaShareAlt />
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-0 w-full px-8 max-w-7xl mx-auto">
          <div className="space-y-6">
             <div className="flex flex-wrap gap-3">
               <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                 {event.hub}
               </span>
               <span className="bg-white/5 text-zinc-300 border border-white/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                 {event.category}
               </span>
             </div>
             
             <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.85]">
               <LText content={event.title} />
             </h1>
             
             <div className="hidden md:block text-zinc-400 text-xl font-medium max-w-3xl border-l-4 border-sky-500 pl-8 py-2 leading-relaxed">
               <LText content={event.description} />
             </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 -mt-15 relative z-10">
        
        <div className="lg:col-span-8 space-y-24">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl">
            {[
              { icon: <FaCalendarAlt />, label: {en: "Date", am: "ቀን"}, value: event.date },
              { icon: <FaClock />, label: {en: "Time", am: "ሰዓት"}, value: event.time },
              { icon: <FaMapMarkerAlt />, label: {en: "Venue", am: "ቦታ"}, value: event.venue },
              { 
                icon: <FaTicketAlt />, 
                label: {en: "Access", am: "መግቢያ"}, 
                value: event.price === 0 ? "FREE" : `${event.price} ETB` 
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-black/60 rounded-4xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 text-lg">{item.icon}</div>
                <div>
                  <p className="text-[9px] uppercase text-zinc-500 font-black tracking-widest leading-none mb-1">
                    <LText content={item.label} />
                  </p>
                  <div className="text-xs font-bold text-white uppercase italic truncate max-w-27.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Event Overview Section */}
          <section className="space-y-8 px-4">
            <div className="flex items-center gap-6">
               <h2 className="text-3xl font-black text-white uppercase italic flex items-center gap-4 shrink-0">
                 <HiOutlineInformationCircle className="text-sky-500" /> <LText content={ui.insight} />
               </h2>
               <div className="h-px w-full bg-linear-to-r from-white/10 to-transparent" />
            </div>
            <div className="text-zinc-400 leading-relaxed text-lg font-medium">
              <LText content={event.overview} />
            </div>
          </section>

          {/* ... (Visual Gallery & Pulse Sequence remains the same) ... */}

          {/* 4. PULSE SEQUENCE (Agenda) */}
          <section className="relative overflow-hidden bg-white/2 border border-white/5 rounded-[3.5rem] p-12">
            <h2 className="text-2xl font-black text-white uppercase italic mb-12 tracking-widest flex items-center gap-4">
              <span className="w-8 h-0.5 bg-sky-500" /> <LText content={ui.sequence} />
            </h2>
            <div className="space-y-12 relative">
              <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-sky-500/50 via-sky-500/10 to-transparent" />
              {event.agenda.map((item, index) => (
                <div key={index} className="flex gap-12 items-start relative group">
                  <div className="w-6 h-6 rounded-full bg-black border-2 border-sky-500 z-10 shadow-[0_0_15px_rgba(14,165,233,0.4)] group-hover:scale-125 transition-all" />
                  <div className="space-y-2">
                    <span className="text-sky-500/60 font-black text-[10px] uppercase tracking-[0.3em]">Phase 0{index + 1}</span>
                    <div className="text-zinc-200 font-bold text-2xl leading-tight group-hover:text-white transition-colors uppercase italic">
                      <LText content={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 5. SIDEBAR / BOOKING */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-32 space-y-8">
            <div className="bg-zinc-950/50 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-2 text-sky-400 mb-8 bg-sky-500/5 w-fit px-4 py-2 rounded-2xl border border-sky-500/10">
                <HiOutlineBadgeCheck className="text-xl" />
                <span className="text-[10px] font-black uppercase tracking-widest"><LText content={ui.verified} /></span>
              </div>
              
              <h2 className="text-4xl font-black text-white uppercase italic mb-4 leading-none"><LText content={ui.joinGrid} /></h2>
              <div className="space-y-2 mb-10">
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  <LText content={ui.host} />: <span className="text-zinc-200">{event.organizer}</span>
                </p>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  <LText content={ui.target} />: <span className="text-zinc-200">{event.audience}</span>
                </p>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-tighter">
                  <LText content={ui.location} />: <span className="text-sky-400">{event.location}</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* Standardized BookEvent */}
                <BookEvent eventId={event._id.toString()} slug={event.slug} price={event.price ?? 0} />

                <div className="mt-8 rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 shadow-xl shadow-sky-500/5">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={staticMapUrl}
                        alt={`Map location for ${sS(event.location)}`}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 360px"
                      />
                    </div>
                  </a>
                  <div className="p-5 bg-black/60">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black mb-2">Get Location</p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center justify-between w-full rounded-2xl bg-sky-500/10 border border-sky-500/20 px-4 py-3 text-sky-300 text-sm font-black uppercase tracking-[0.2em] hover:bg-sky-500/20 transition"
                    >
                      Open in Google Maps
                      <FaArrowRight />
                    </a>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                   <div className="flex items-center gap-2 text-zinc-500 mb-4">
                     <FaLayerGroup className="text-xs" />
                     <span className="text-[10px] font-black uppercase tracking-widest"><LText content={ui.tags} /></span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {event.tags.map(tag => (
                       <span key={tag} className="bg-white/5 px-3 py-1 rounded-lg text-[9px] text-zinc-400 uppercase font-bold border border-white/5">#{tag}</span>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* 6. RECOMMENDATIONS */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
        <div className="flex items-end justify-between mb-16 px-4">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter"><LText content={ui.extend} /></h2>
            <p className="text-sky-500/60 text-xs font-black uppercase tracking-[0.3em] mt-2"><LText content={ui.related} /></p>
          </div>
          <Link href="/Event" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
            <LText content={ui.viewAll} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {similarEvents.slice(0, 3).map((e: IEvent) => (
            <EventCard key={e.slug} {...e} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventDetailsPage;