"use server";

import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";


export async function loginUser(params: any) {
  try {
    await connectToDatabase();
    const { email, password } = params;

    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return { error: "No identity found with this email." };

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Invalid access credentials." };

    // 3. Return user data (excluding password)
    return { 
      success: true, 
      user: { id: user._id.toString(), name: user.name, role: user.role } 
    };
  } catch (error) {
    return { error: "System sync error. Try again." };
  }
}


export async function registerUser(userData: any) {
  try {
    await connectToDatabase();
    const { name, username, email, password } = userData;

    // 1. Check if user already exists (Efficiency: One query for both)
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      return { error: "Identity already exists in the Pulse grid." };
    }

    // 2. Hash Password (12 salt rounds for strong security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create User
    await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      picture: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`, // Cool dynamic avatar
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to initialize pulse sequence." };
  }
}