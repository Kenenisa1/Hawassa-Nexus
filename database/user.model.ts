import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password?: string; // Now essential for custom auth
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation: number;
  role: "user" | "organizer" | "admin";
  saved: Types.ObjectId[]; // References to Event model
  joinedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Efficiency: avoids casing issues during login
    trim: true,
    index: true // Faster lookup for profile pages
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true 
  },
  password: { 
    type: String,
    // Note: This will be required once you implement your custom sign-up logic
  },
  bio: { 
    type: String 
  },
  picture: { 
    type: String, 
    default: "/assets/default-avatar.png" // Fallback if no image provided
  },
  location: { 
    type: String 
  },
  portfolioWebsite: { 
    type: String 
  },
  reputation: { 
    type: Number, 
    default: 0 
  },
  role: { 
    type: String, 
    enum: ["user", "organizer", "admin"], 
    default: "user" 
  },
  saved: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Event" 
  }],
  joinedAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

const User = models.User || model<IUser>("User", userSchema);

export default User;