'use server'

import Booking from '@/database/booking.model';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/database/event.model'; // Ensure Event model is registered

export const createBooking = async ({
    eventId, 
    email, 
    ticketsCount = 1, 
    totalAmount = 0, 
    paymentStatus = "free", 
    txReference
}: { 
    eventId: string, 
    email: string,
    ticketsCount?: number,
    totalAmount?: number,
    paymentStatus?: string,
    txReference?: string
}) => {
    try {
        await connectToDatabase();
        await Booking.create({  
            eventId, 
            email, 
            ticketsCount, 
            totalAmount, 
            paymentStatus, 
            txReference 
        });
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
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to delete booking";
        console.error("Failed to delete booking:", error);
        return { success: false, message: msg };
    }
}

export const verifyBookingPayment = async (id: string) => {
    try {
        await connectToDatabase();
        const booking = await Booking.findByIdAndUpdate(
            id,
            { paymentStatus: "verified" },
            { new: true }
        );
        if (!booking) return { success: false, message: "Booking not found" };
        return { success: true, message: "Payment verified successfully" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Verification failed";
        console.error("Failed to verify payment:", error);
        return { success: false, message: msg };
    }
}

export const rejectBookingPayment = async (id: string) => {
    try {
        await connectToDatabase();
        const booking = await Booking.findByIdAndUpdate(
            id,
            { paymentStatus: "failed" },
            { new: true }
        );
        if (!booking) return { success: false, message: "Booking not found" };
        return { success: true, message: "Payment marked as failed" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Rejection failed";
        console.error("Failed to reject payment:", error);
        return { success: false, message: msg };
    }
}
