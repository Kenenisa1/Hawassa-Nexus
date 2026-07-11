import EventForm from "@/components/admin/EventForm";

export const metadata = {
  title: "Create Event — Admin | Hawassa Nexus",
};

export default function CreateEventPage() {
  return (
    <main className="min-h-screen bg-[#030014] pt-28 pb-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest mb-5">
            <span>🚀</span>
            New Event
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">
            Initialize <span className="text-sky-500">Pulse</span>
          </h1>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.25em] mt-3">
            Broadcast a new event to the Hawassa Network
          </p>
        </header>

        <EventForm type="Create" />
      </div>
    </main>
  );
}