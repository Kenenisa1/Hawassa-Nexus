"use server";

import connectToDatabase from "@/lib/mongodb";
import Contact from "@/database/contact.model";

export const sendEmail = async (formData: FormData) => {
  try {
    await connectToDatabase();
    
    const newMessage = await Contact.create({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      category: formData.get("category") as string || "general",
      message: formData.get("message") as string,
    });

    return { success: true, id: newMessage._id.toString() };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save message" };
  }
};

export const getAllContacts = async () => {
  try {
    await connectToDatabase();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(contacts));
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return [];
  }
};

export const updateContactStatus = async (id: string, status: string) => {
  try {
    await connectToDatabase();
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return { success: false, message: "Contact inquiry not found" };
    return { success: true, message: "Inquiry status updated successfully" };
  } catch (error: any) {
    console.error("Failed to update contact status:", error);
    return { success: false, message: error.message || "Failed to update status" };
  }
};

export const deleteContact = async (id: string) => {
  try {
    await connectToDatabase();
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) return { success: false, message: "Contact inquiry not found" };
    return { success: true, message: "Inquiry deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete contact:", error);
    return { success: false, message: error.message || "Failed to delete inquiry" };
  }
};