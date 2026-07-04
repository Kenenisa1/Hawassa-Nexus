// lib/actions/stats.actions.ts
"use server";

import  connectToDatabase  from "@/lib/mongodb";
import Event from "@/database/event.model";
import User from "@/database/user.model";

export async function getCityPulseStats() {
  try {
    await connectToDatabase();

    // Use countDocuments 
    const [eventCount, userCount] = await Promise.all([
      Event.countDocuments({ status: "published" }),
      User.countDocuments({}),
    ]);

    return {
      events: eventCount || 0,
      users: userCount || 0,
      hubs: 6, 
      partners: 45,
    };
  } catch (error) {
    console.error("Error fetching city stats:", error);
    return { events: 0, users: 0, hubs: 0, partners: 0 };
  }
}