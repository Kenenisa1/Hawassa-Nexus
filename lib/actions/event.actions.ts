'use server';

/**
 * HAWASSA NEXUS - SERVER ACTIONS ENGINE
 * ------------------------------------------------
 * Core logic for database operations including Event 
 * Orchestration, Synchronization, and State Management.
 */

import { revalidatePath } from 'next/cache';
import connectToDatabase from "../mongodb";
import Event, { IEvent } from '@/database/event.model';

interface ActionResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T; 
}

/**
 * CREATE: Publish a new pulse to the system.
 * Uses named function for Next.js Server Action ID stability.
 */
export async function createEvent(formData: FormData): Promise<ActionResponse<IEvent>> {
  try {
    await connectToDatabase();

    const s = (key: string) => (formData.get(key) as string)?.trim() || "";

    const eventData = {
      // 1. FIXED: Title must be an object { en, am, si } to match your schema
      title: {
        en: s('title_en'), // Changed from s('title')
        am: s('title_am'),
        si: s('title_si'),
      },
      description: {
        en: s('desc_en'),
        am: s('desc_am'),
        si: s('desc_si'),
      },
      overview: {
        en: s('overview_en'),
        am: s('overview_am'),
        si: s('overview_si'),
      },
      // 2. FIXED: Agenda must be an array of objects [{ en, am, si }]
      // Map each line to the current active language (e.g., 'en')
      agenda: s('agenda').split('\n')
        .filter(Boolean)
        .map(line => ({ en: line.trim() })), 

      hub: s('hub'),
      image: s('image'),
      venue: s('venue'),
      location: s('location'),
      date: s('date'),
      time: s('time'),
      
      // 3. ENUM HANDLING: Fallback to schema defaults if empty to avoid validation errors
      mode: (s('mode') || "offline") as 'online' | 'offline' | 'hybrid',
      category: (s('category') || "Technology") as 'Technology' | 'Culture' | 'Business' | 'Sports',
      status: (s('status') || "draft") as 'draft' | 'published' | 'sold-out' | 'archived',
      
      audience: s('audience'),
      organizer: s('organizer') || "Kenenisa Mieso", // Default if missing
      price: Number(formData.get('price')) || 0,
      totalCapacity: Number(formData.get('totalCapacity')) || 0,
      tags: s('tags').split(',').map(tag => tag.trim()).filter(Boolean),
      isFeatured: formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on',
    };

    // Final Validation Check before DB hit
    if (!eventData.title.en || !eventData.description.en) {
      throw new Error("Primary Language (English) Title and Description are required.");
    }

    const newEvent = await Event.create(eventData);
    
    revalidatePath('/admin');
    
    return { 
      success: true, 
      message: "Pulse broadcast initialized", 
      data: JSON.parse(JSON.stringify(newEvent)) 
    };
  } catch (error: any) {
    console.error("[DATABASE ERROR] Creation failed:", error);
    return { 
      success: false, 
      message: error.message || "Failed to create pulse" 
    };
  }
}

/**
 * READ: Get all pulses sorted by latest creation.
 */
export async function getAllEvents(): Promise<IEvent[]> {
    try {
        await connectToDatabase();
        const events = await Event.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(events)) as IEvent[];
    } catch (error) {
        console.error("[DATABASE ERROR] Fetch all failed:", error);
        return [];
    }
}

/**
 * READ: Get a single event by its unique slug.
 */
export async function getEventBySlug(slug: string): Promise<IEvent | null> {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug }).lean();
        return event ? (JSON.parse(JSON.stringify(event)) as IEvent) : null;
    } catch (error) {
        console.error("[DATABASE ERROR] Slug fetch failed:", error);
        return null;
    }
}

/**
 * RECOMMENDATION: Find pulses with overlapping tags.
 */
export async function getSimilarEventsBySlug(slug: string): Promise<IEvent[]> {
    try {
        await connectToDatabase();

        const currentEvent = await Event.findOne({ slug }).select('tags _id');
        if (!currentEvent) return [];

        const similarEvents = await Event.find({
            _id: { $ne: currentEvent._id },
            tags: { $in: currentEvent.tags }
        })
        .limit(3)
        .lean();

        return JSON.parse(JSON.stringify(similarEvents)) as IEvent[];
    } catch (error) {
        console.error("[DATABASE ERROR] Recommendation engine failed:", error);
        return [];
    }
}

/**
 * DELETE: Remove a pulse from history.
 */
export async function deleteEvent(id: string): Promise<ActionResponse<string>> {
    try {
        await connectToDatabase();
        await Event.findByIdAndDelete(id);
        
        revalidatePath('/admin');
        return { success: true, message: "Pulse erased successfully.", data: id };
    } catch (error: unknown) {
        console.error("[DATABASE ERROR] Erasure failed:", error);
        return { success: false, message: "Failed to erase pulse from record." };
    }
}

/**
 * UPDATE: Modify an existing pulse record.
 */
export async function updateEvent(id: string, formData: FormData): Promise<ActionResponse<IEvent>> {
    try {
        await connectToDatabase();

        const category = formData.get('category') as IEvent['category'];
        const mode = formData.get('mode') as IEvent['mode'];
        const s = (k: string) => (formData.get(k) as string)?.trim() || "";

        const updateData: Partial<IEvent> = {
            title: {
                en: s('title_en'),
                am: s('title_am'),
                si: s('title_si'),
            },
            description: {
                en: s('desc_en'),
                am: s('desc_am'),
                si: s('desc_si'),
            },
            overview: {
                en: s('overview_en'),
                am: s('overview_am'),
                si: s('overview_si'),
            },
            hub: formData.get('hub') as string,
            image: formData.get('image') as string,
            venue: formData.get('venue') as string,
            location: formData.get('location') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            mode: mode,
            category: category,
            audience: formData.get('audience') as string,
            organizer: formData.get('organizer') as string,
            price: Number(formData.get('price')) || 0,
            tags: (formData.get('tags') as string || "").split(',').map(t => t.trim()).filter(Boolean),
            agenda: (formData.get('agenda') as string || "")
                .split('\n')
                .map(l => l.trim())
                .filter(Boolean)
                .map(line => ({ en: line })),
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEvent) throw new Error("Target pulse not found in database.");

        // Clear all relevant caches
        revalidatePath('/admin');
        revalidatePath('/Event');
        revalidatePath(`/Event/${updatedEvent.slug}`);
        
        return { 
            success: true, 
            message: "Pulse record updated successfully!", 
            data: JSON.parse(JSON.stringify(updatedEvent)) as IEvent 
        };

    } catch (error: unknown) {
        console.error("[DATABASE ERROR] Update failed:", error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : "System Update Error" 
        };
    }
}

/**
 * READ: Get a single event by ID (Internal Management use).
 */
export async function getEventById(id: string): Promise<IEvent | null> {
    try {
        await connectToDatabase();
        const event = await Event.findById(id).lean();

        if (!event) return null;

        return JSON.parse(JSON.stringify(event)) as IEvent;
    } catch (error) {
        console.error("[DATABASE ERROR] ID fetch failed:", error);
        return null;
    }
}