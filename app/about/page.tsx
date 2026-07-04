import { connection } from "next/server";
import { getCityPulseStats } from "@/lib/actions/stats.actions"; 
import AboutClient from "@/app/about/AboutClient";

export default async function AboutPage() {
  await connection();
  // Fetching real-time stats from your MERN backend
  const statsData = await getCityPulseStats();

  // If statsData is null/undefined, provide fallbacks
  const safeStats = {
    users: statsData?.users || 0,
    hubs: statsData?.hubs || 0,
    events: statsData?.events || 0,
    partners: statsData?.partners || 0,
  };

  return <AboutClient statsData={safeStats} />;
}