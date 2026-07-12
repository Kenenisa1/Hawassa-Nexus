export {}; // This makes the file a module

export interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
  };
}

export interface CloudinaryWidgetInstance {
  open: () => void;
  close: () => void;
  destroy: () => Promise<void>;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: object,
        callback: (error: Error | null, result: CloudinaryResult) => void
      ) => CloudinaryWidgetInstance;
    };
  }
}

// ----- Frontend Friendly Models -----

export interface IEvent {
  _id: string;
  title: { en: string; am?: string; si?: string };
  description: { en: string; am?: string; si?: string };
  overview: { en: string; am?: string; si?: string };
  agenda: Array<{ en: string; am?: string; si?: string }>;
  slug: string;
  hub: string;
  image: string;
  gallery: string[];
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  category: "Technology" | "Culture" | "Business" | "Sports";
  status: "draft" | "published" | "sold-out" | "archived";
  totalCapacity: number;
  soldCount: number;
  audience: string;
  organizer: string;
  tags: string[];
  isFeatured: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBooking {
  _id: string;
  eventId: string | IEvent;
  email: string;
  ticketsCount: number;
  totalAmount: number;
  paymentStatus: "free" | "pending" | "verified" | "failed";
  txReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContact {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  category: "general" | "partnership" | "membership" | "support";
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  ipAddress?: string;
  createdAt: string;
}

export interface ISubscriber {
  _id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation: number;
  role: "user" | "organizer" | "admin";
  saved: string[];
  joinedAt: string;
}

export interface ISystemLog {
  _id: string;
  action: string;
  description: string;
  type: "info" | "warning" | "error" | "success";
  adminEmail: string;
  createdAt: string;
}