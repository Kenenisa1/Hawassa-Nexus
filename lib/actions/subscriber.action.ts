"use server";

import connectToDatabase from "@/lib/mongodb";
import Subscriber from "@/database/subscriber.model";
import { Resend } from "resend";
import { createSystemLog } from "@/lib/actions/log.actions";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function getAllSubscribers() {
  try {
    await connectToDatabase();
    const subs = await Subscriber.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(subs));
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await connectToDatabase();
    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) return { success: false, message: "Subscriber not found" };
    return { success: true, message: "Subscriber successfully removed from list" };
  } catch (error: any) {
    console.error("Error deleting subscriber:", error);
    return { success: false, message: error.message || "Failed to remove subscriber" };
  }
}

export async function broadcastAlert(subject: string, content: string) {
  try {
    await connectToDatabase();
    
    const activeSubscribers = await Subscriber.find({ active: true }).select("email").lean();
    const emails = activeSubscribers.map(sub => sub.email);

    if (emails.length === 0) {
      return { success: false, message: "No active subscribers found on the mailing list." };
    }

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Hawassa Nexus Alerts <updates@hawassanexus.com>',
        to: emails,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #030014; color: #f4f4f5; border-color: #1e1b4b;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em;">Hawassa Nexus</h1>
              <p style="color: #e0f2fe; font-size: 12px; text-transform: uppercase; letter-spacing: 0.25em; margin: 5px 0 0 0;">City Alert Broadcast</p>
            </div>
            <div style="padding: 30px; line-height: 1.6; font-size: 15px; background-color: #030014; color: #e4e4e7;">
              <h2 style="color: white; font-weight: bold; margin-top: 0; font-size: 18px;">${subject}</h2>
              <p style="white-space: pre-wrap; color: #a1a1aa;">${content}</p>
              <hr style="border: 0; border-top: 1px solid #27272a; margin: 25px 0;" />
              <p style="font-size: 11px; color: #71717a;">This is an automated broadcast to the registered network of Hawassa Nexus. If you wish to opt-out, please contact support.</p>
            </div>
            <div style="background-color: #09090b; padding: 20px; text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid #18181b;">
              © ${new Date().getFullYear()} Hawassa Nexus Network. All rights reserved.
            </div>
          </div>
        `,
      });
      await createSystemLog({
        action: "Broadcast Sent",
        description: `Alert "${subject}" was sent to ${emails.length} subscribers.`,
        type: "success",
      });
      return { success: true, message: `Successfully broadcasted to ${emails.length} subscribers via Resend!` };
    } else {
      // Mock mode - no RESEND_API_KEY set
      console.log(`[MOCK BROADCAST] Sent to ${emails.length} subscribers. Subject: ${subject}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      await createSystemLog({
        action: "Broadcast Simulated",
        description: `Alert "${subject}" was simulated for ${emails.length} subscribers (no API key).`,
        type: "info",
      });
      return { success: true, isMock: true, message: `Simulated broadcast completed successfully to ${emails.length} subscribers!` };
    }
  } catch (error: any) {
    console.error("Error broadcasting alert:", error);
    return { success: false, message: error.message || "Broadcast failed" };
  }
}
