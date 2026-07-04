import { HAWASSA_HUBS } from "@/lib/hubs.data";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";
import HubDetailClient from "./HubDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params;
  
  const hubData = HAWASSA_HUBS.find(h => h.slug === slug);
  if (!hubData) {
    notFound();
  }

  await connectToDatabase();
  
  // Fetch events associated with this hub name
  const events = await Event.find({ hub: hubData.name }).sort({ createdAt: -1 });

  return (
    <HubDetailClient 
      hub={hubData} 
      initialEvents={JSON.parse(JSON.stringify(events))} 
    />
  );
}
