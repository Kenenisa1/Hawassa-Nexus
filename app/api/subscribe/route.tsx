import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // REAL WORLD ACTIONS:
    // 1. Save to your DB (e.g., Prisma: db.subscriber.create({ data: { email } }))
    // 2. Or send to Mailchimp/Resend API
    console.log(`New Subscriber to Hawassa Nexus: ${email}`);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}