"use client";
import { createBooking } from "@/lib/actions/booking.action";
import posthog from "posthog-js";
import { useState } from "react";
import { 
  FaCheck, FaTicketAlt, FaMobileAlt, FaUniversity, FaShieldAlt,
  FaMinus, FaPlus
} from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";

interface BookEventProps {
  eventId: string;
  slug: string;
  price: number;
}

const LOCAL_PAYMENT_METHODS = [
  {
    id: "telebirr",
    name: "TeleBirr",
    icon: "📱",
    shortCode: "*127#",
    recipientNumber: process.env.NEXT_PUBLIC_TELEBIRR_NUMBER || "0912345678",
    instructions: [
      "Dial *127# on your phone",
      "Select 'Pay Bill' → 'Merchants'",
      "Enter merchant code or use the number below",
      "Enter the exact amount",
      "Confirm and save the Transaction Reference",
    ],
  },
  {
    id: "cbe_birr",
    name: "CBE Birr",
    icon: "🏦",
    shortCode: "*847#",
    recipientNumber: process.env.NEXT_PUBLIC_CBE_NUMBER || "1000123456789",
    instructions: [
      "Dial *847# or open the CBE Birr app",
      "Select 'Transfer' → 'To Account'",
      "Enter the account number below",
      "Enter the exact amount",
      "Save the Transaction Reference number",
    ],
  },
  {
    id: "awash_bank",
    name: "Awash Bank",
    icon: "🌊",
    shortCode: "Awash App",
    recipientNumber: process.env.NEXT_PUBLIC_AWASH_NUMBER || "01320123456789",
    instructions: [
      "Open the Awash Bank mobile app",
      "Select 'Transfer' → 'To Awash Account'",
      "Enter the account number below",
      "Enter the exact amount and transfer",
      "Note down the Transaction Reference ID",
    ],
  },
];

const BookEvent = ({ eventId, slug, price }: BookEventProps) => {
  const isFree = price === 0;

  const [step, setStep] = useState<"form" | "payment" | "confirm">(isFree ? "form" : "form");
  const [email, setEmail] = useState("");
  const [ticketsCount, setTicketsCount] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(LOCAL_PAYMENT_METHODS[0].id);
  const [txReference, setTxReference] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = price * ticketsCount;
  const method = LOCAL_PAYMENT_METHODS.find((m) => m.id === selectedMethod)!;

  const handleFreeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await createBooking({
        eventId,
        email,
        ticketsCount: 1,
        totalAmount: 0,
        paymentStatus: "free",
      });
      if (response?.success) {
        setSubmitted(true);
        posthog.capture("event_booked_free", { eventId, slug, email });
      } else {
        setError("Booking failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setError("");
    setStep("payment");
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txReference.trim()) { setError("Please enter your Transaction Reference."); return; }
    setIsLoading(true);
    setError("");
    try {
      const response = await createBooking({
        eventId,
        email,
        ticketsCount,
        totalAmount,
        paymentStatus: "pending",
        txReference: txReference.trim(),
      });
      if (response?.success) {
        setSubmitted(true);
        posthog.capture("event_booked_paid", { eventId, slug, email, totalAmount, selectedMethod });
      } else {
        setError("Booking submission failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Confirmed State ── */
  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
          <FaCheck className="text-green-400 text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {isFree ? "Registration Confirmed!" : "Payment Submitted!"}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {isFree
            ? "You have successfully registered. Your spot is reserved."
            : "Your payment is under review. You will receive confirmation at your email address once verified by our team."}
        </p>
        {!isFree && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs text-left">
            <strong>⏱ Verification Time:</strong> Payments are typically verified within 1–3 business hours.
          </div>
        )}
      </div>
    );
  }

  /* ── Step 1: Email & Ticket Count ── */
  if (step === "form") {
    return (
      <form onSubmit={isFree ? handleFreeBooking : handleProceedToPayment} className="space-y-5">
        {/* Ticket Price Banner */}
        {!isFree && (
          <div className="flex items-center justify-between p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
            <div className="flex items-center gap-2 text-sky-400">
              <FaTicketAlt />
              <span className="text-xs font-black uppercase tracking-widest">Entry Fee</span>
            </div>
            <span className="text-white font-black text-lg">{price.toLocaleString()} ETB</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="book-email" className="text-sm font-semibold text-zinc-300 block">
            Email Address
          </label>
          <input
            type="email"
            id="book-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-zinc-900/70 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all text-sm"
            placeholder="Enter your email address"
          />
        </div>

        {/* Ticket Count (only for paid) */}
        {!isFree && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 block">Number of Tickets</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTicketsCount((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="text-white font-black text-xl w-8 text-center">{ticketsCount}</span>
              <button
                type="button"
                onClick={() => setTicketsCount((p) => Math.min(10, p + 1))}
                className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
              >
                <FaPlus className="text-xs" />
              </button>
              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Total</p>
                <p className="text-white font-black">{totalAmount.toLocaleString()} ETB</p>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-xs py-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full cursor-pointer bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : isFree ? (
            <>Register for Free</>
          ) : (
            <>Proceed to Payment</>
          )}
        </button>

        {!isFree && (
          <div className="flex items-start gap-2 text-zinc-500 text-xs">
            <MdInfoOutline className="mt-0.5 shrink-0 text-zinc-400" />
            <p>Payment is processed locally via Ethiopian mobile banking. Your booking is confirmed after admin verification.</p>
          </div>
        )}
      </form>
    );
  }

  /* ── Step 2: Payment Instructions ── */
  return (
    <form onSubmit={handleConfirmPayment} className="space-y-5">
      {/* Back + Summary */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep("form")}
          className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Amount Due</p>
          <p className="text-white font-black">{totalAmount.toLocaleString()} ETB</p>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-zinc-300">Select Payment Method</p>
        <div className="grid grid-cols-3 gap-2">
          {LOCAL_PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMethod(m.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedMethod === m.id
                  ? "border-sky-500/60 bg-sky-500/10 text-white"
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-[10px] font-bold">{m.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-sky-400">
          <FaMobileAlt />
          <span className="text-xs font-black uppercase tracking-widest">{method.name} Instructions</span>
        </div>
        <div className="space-y-2">
          {method.instructions.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-zinc-300 text-xs leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        {/* Recipient Account */}
        <div className="mt-3 p-3 bg-black/40 rounded-xl border border-zinc-700">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
            {method.id === "telebirr" ? "Phone Number" : "Account Number"}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-white font-black text-sm tracking-wider">{method.recipientNumber}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(method.recipientNumber)}
              className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="p-3 bg-black/40 rounded-xl border border-zinc-700">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Exact Amount to Send</p>
          <p className="text-green-400 font-black text-base tracking-wider">{totalAmount.toLocaleString()} ETB</p>
        </div>
      </div>

      {/* Transaction Reference Input */}
      <div className="space-y-2">
        <label htmlFor="tx-reference" className="text-sm font-semibold text-zinc-300 block">
          Transaction Reference <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <FaShieldAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
          <input
            type="text"
            id="tx-reference"
            value={txReference}
            onChange={(e) => setTxReference(e.target.value)}
            required
            className="w-full pl-9 pr-4 py-3 bg-zinc-900/70 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all text-sm font-mono"
            placeholder="e.g. TXN20240712XXXXXXXX"
          />
        </div>
        <p className="text-xs text-zinc-500">Enter the reference number you received after completing the transfer.</p>
      </div>

      {error && <p className="text-red-400 text-xs py-1">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !txReference.trim()}
        className="w-full cursor-pointer bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FaUniversity />
            Confirm Payment &amp; Book
          </>
        )}
      </button>

      <div className="flex items-start gap-2 text-zinc-500 text-xs">
        <FaShieldAlt className="mt-0.5 shrink-0 text-zinc-400" />
        <p>Your booking will be confirmed once our team verifies your payment reference. This usually takes 1–3 hours.</p>
      </div>
    </form>
  );
};

export default BookEvent;
