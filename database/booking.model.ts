import mongoose, { Document, Schema, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  ticketsCount: number;
  totalAmount: number;
  paymentStatus: "free" | "pending" | "verified" | "failed";
  txReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: { 
      type: String, 
      required: true, 
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
      lowercase: true 
    },
    ticketsCount: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["free", "pending", "verified", "failed"],
      default: "free"
    },
    txReference: { type: String }
  },
  { timestamps: true }
);

// Pre-save for existence validation
bookingSchema.pre('save', async function (this: IBooking) {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error('Referenced event does not exist');
  }
});

bookingSchema.index({ eventId: 1 });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;