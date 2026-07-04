"use server";

import  connectToDatabase  from "@/lib/mongodb";
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
    console.log("New contact message saved:", newMessage);

  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save message" };
  }
};