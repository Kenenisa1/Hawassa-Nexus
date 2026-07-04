import ExploreClient from "@/app/explore/ExploreClient";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

export default async function Page() {
  await connectToDatabase();
  
  // Fetch events directly - much faster than a client-side fetch
  const events = await Event.find({}).sort({ createdAt: -1 });

  return (
    <ExploreClient initialEvents={JSON.parse(JSON.stringify(events))} />
  );
}