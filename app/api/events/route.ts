import connectToDatabase from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import Subscriber from "@/database/subscriber.model"; 
import { notifySubscribers } from "@/lib/email-service"; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();

    // 1. Manually build the event object to match your Schema exactly
    // Use the exact names from your form input fields (e.g., 'titleEn', 'titleAm')
    const eventData = {
      title: {
        en: formData.get("titleEn") as string,
        am: formData.get("titleAm") as string,
      },
      description: {
        en: formData.get("descriptionEn") as string,
        am: formData.get("descriptionAm") as string,
      },
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      organizer: formData.get("organizer") as string,
      category: formData.get("category") as string,
      tags: JSON.parse((formData.get("tags") as string) || "[]"),
      // Ensure agenda is parsed as an array of objects
      agenda: JSON.parse((formData.get("agenda") as string) || "[]"),
    };

    // Validation Check
    if (!eventData.title.en || !eventData.date) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    // Cloudinary Upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "events" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const imageUrl = (uploadResult as { secure_url: string }).secure_url;

    // 2. Save to Database using the mapped object
    const createdEvent = await Event.create({
      ...eventData,
      image: imageUrl,
    });

    // Notify Subscribers (Background)
    try {
      const subscribers = await Subscriber.find({ active: true }, "email");
      const emailList = subscribers.map((s) => s.email);
      if (emailList.length > 0) {
        notifySubscribers(emailList, {
          title: createdEvent.title.en,
          date: createdEvent.date,
          location: createdEvent.location,
          image: createdEvent.image,
        });
      }
    } catch (err) {
      console.error("Notification failed", err);
    }

    return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        message: "Event creation failed", 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      }, 
      { status: 500 }
    );
  }
}


export async function GET() {

  try {

    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(

      { message: "Events fetched successfully", events },

      { status: 200 },

    );

  } catch (e) {

    return NextResponse.json(

      {

        message: "Failed to fetch events from database",

        error: e instanceof Error ? e.message : "unknown",

      },

      { status: 500 },

    );

  }

}