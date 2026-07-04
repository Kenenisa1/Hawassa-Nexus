"use client";

import { toggleSaveEvent } from "@/lib/actions/user.actions";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { toast } from "sonner"; // Recommended for OLED-style notifications

interface Props {
  userId: string;
  eventId: string;
  hasSaved: boolean;
}

const SaveButton = ({ userId, eventId, hasSaved }: Props) => {
  const pathname = usePathname();
  const [isSaved, setIsSaved] = useState(hasSaved);

  const handleSave = async () => {
    // 1. Optimistic UI update
    setIsSaved((prev) => !prev);

    try {
      const result = await toggleSaveEvent({
        userId,
        eventId,
        path: pathname,
      });

      toast.success(
        result.status === "added" ? "Operation Saved to Pulse" : "Removed from Pulse",
        {
          style: { background: "#000", border: "1px solid #0ea5e9", color: "#fff" }
        }
      );
    } catch (error) {
      // 2. Rollback if server fails
      setIsSaved((prev) => !prev);
      toast.error("Link failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleSave}
      className={`p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        isSaved 
          ? "bg-sky-500/20 border-sky-500 text-sky-400" 
          : "bg-black/40 border-white/10 text-white hover:border-sky-500/50"
      }`}
    >
      {isSaved ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default SaveButton;