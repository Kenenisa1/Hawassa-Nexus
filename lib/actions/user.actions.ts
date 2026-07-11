"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";

/**
 * CREATE USER
 * Native MERN implementation for custom registration.
 */
export async function createUser(userData: {
  name: string;
  username: string;
  email: string;
  picture: string;
  password?: string; // For your custom auth
}) {
  try {
    await connectToDatabase();
    
    const newUser = await User.create(userData);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to initiate user profile.");
  }
}

/**
 * UPDATE USER
 * Uses MongoDB _id for maximum query efficiency.
 */
export async function updateUser(params: {
  userId: string;
  updateData: Partial<{
    name: string;
    username: string;
    email: string;
    picture: string;
    bio: string;
    location: string;
  }>;
  path: string;
}) {
  try {
    await connectToDatabase();
    const { userId, updateData, path } = params;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { 
      new: true 
    });

    if (!updatedUser) throw new Error("User sequence not found.");

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * DELETE USER
 * Clean removal using the primary ID.
 */
export async function deleteUser(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error("User not found in the grid.");

    // Note: You can add logic here to remove the user's bookings too
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * TOGGLE SAVE EVENT
 * Optimized to perform the existence check and update in a lean sequence.
 */
export async function toggleSaveEvent(params: {
  userId: string;
  eventId: string;
  path: string;
}) {
  try {
    await connectToDatabase();
    const { userId, eventId, path } = params;

    // Fetch only the 'saved' array to minimize data transfer
    const user = await User.findById(userId).select("saved");
    if (!user) throw new Error("User not found.");

    const isSaved = user.saved.includes(eventId as any);

    // Atomic operation: $pull (remove) or $addToSet (add if unique)
    const update = isSaved 
      ? { $pull: { saved: eventId } } 
      : { $addToSet: { saved: eventId } };

    await User.findByIdAndUpdate(userId, update);

    revalidatePath(path);
    return { status: isSaved ? "removed" : "added" };
  } catch (error) {
    console.error("Toggle save error:", error);
    throw new Error("Failed to sync operation.");
  }
}

/**
 * UPDATE REPUTATION
 * Atomic increment: the most efficient way to update counters.
 */
export async function updateReputation(userId: string, points: number) {
  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { $inc: { reputation: points } });
  } catch (error) {
    console.error("Reputation sync error:", error);
  }
}

export async function getAllUsers() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ joinedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: "user" | "organizer" | "admin") {
  try {
    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!updatedUser) return { success: false, message: "User not found" };
    return { success: true, message: `User role updated to ${role} successfully!` };
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return { success: false, message: error.message || "Failed to update role" };
  }
}