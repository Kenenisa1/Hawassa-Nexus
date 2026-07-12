"use server";

import connectToDatabase from "@/lib/mongodb";
import SystemLog from "@/database/log.model";
import type { ISystemLog } from "@/types";

/**
 * Fetch the most recent system logs for the admin dashboard.
 */
export async function getSystemLogs(limit = 50): Promise<ISystemLog[]> {
  try {
    await connectToDatabase();
    const logs = await SystemLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to fetch system logs:", error);
    return [];
  }
}

/**
 * Create a system log entry. Call this from other server actions.
 */
export async function createSystemLog({
  action,
  description,
  type = "info",
  adminEmail = "system@hawassanexus.com",
}: {
  action: string;
  description: string;
  type?: "info" | "warning" | "error" | "success";
  adminEmail?: string;
}): Promise<void> {
  try {
    await connectToDatabase();
    await SystemLog.create({ action, description, type, adminEmail });
  } catch (error) {
    // Log creation failure should never break the main operation
    console.error("Failed to create system log:", error);
  }
}
