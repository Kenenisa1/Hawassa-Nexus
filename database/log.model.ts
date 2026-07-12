import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISystemLogDoc extends Document {
  action: string;
  description: string;
  type: "info" | "warning" | "error" | "success";
  adminEmail: string;
  createdAt: Date;
}

const systemLogSchema = new Schema<ISystemLogDoc>(
  {
    action: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info",
    },
    adminEmail: { type: String, required: true, lowercase: true, trim: true },
  },
  {
    timestamps: true,
    capped: { size: 5 * 1024 * 1024, max: 500 }, // Keep last 500 logs, max 5MB
  }
);

systemLogSchema.index({ createdAt: -1 });

const SystemLog: Model<ISystemLogDoc> =
  mongoose.models.SystemLog ||
  mongoose.model<ISystemLogDoc>("SystemLog", systemLogSchema);

export default SystemLog;
