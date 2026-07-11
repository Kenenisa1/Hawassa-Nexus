'use server'

import Booking from '@/database/booking.model';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/database/event.model'; // Ensure Event model is registered

export const createBooking = async ({eventId, slug, email} : { eventId: string, slug: string, email: string}) => {
    try {
        await connectToDatabase();
        await Booking.create({  eventId, slug, email });
        return { success: true };
    }
    catch (e) 
    {
        console.log('creating booking failed', e);
        return { success: false}; 
    }
}

export const getAllBookings = async () => {
    try {
        await connectToDatabase();
        const bookings = await Booking.find({})
            .populate('eventId')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        return [];
    }
}

export const deleteBooking = async (id: string) => {
    try {
        await connectToDatabase();
        const result = await Booking.findByIdAndDelete(id);
        if (!result) return { success: false, message: "Booking not found" };
        return { success: true, message: "Booking successfully removed" };
    } catch (error: any) {
        console.error("Failed to delete booking:", error);
        return { success: false, message: error.message || "Failed to delete booking" };
    }
}