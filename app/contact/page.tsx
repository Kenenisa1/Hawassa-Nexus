import ContactForm from "@/components/ContactForm";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTwitter, FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#030014] text-zinc-100 pt-32 pb-20 px-6 overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* LEFT COLUMN: Hawassa Nexus Brand Info (2/5) */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <HiOutlineChatAlt2 size={14} />
              Get in Touch
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic leading-tight">
              Sync with the <br />
              <span className="text-sky-500">Nexus.</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
              Whether you want to partner with us, list your business, or simply ask a question, our team is ready to connect.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-8">
            <div className="group flex items-start gap-6">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-500 group-hover:border-sky-500/50 transition-all">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">HQ Location</h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  Hawassa City Center,<br />
                  Southern Ethiopia
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-6">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-500 group-hover:border-sky-500/50 transition-all">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Digital Inbox</h4>
                <p className="text-zinc-500 text-sm font-medium">hello@hawassapulse.com</p>
              </div>
            </div>
          </div>

          {/* Social Connectivity */}
          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Follow the movement</p>
            <div className="flex gap-4">
              {[
                { icon: <FaTelegramPlane />, link: "#" },
                { icon: <FaTwitter />, link: "#" },
                { icon: <FaLinkedinIn />, link: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-sky-500 hover:border-sky-500/30 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Form Container (3/5) */}
        <div className="lg:col-span-3">
          <div className="relative group">
            {/* Animated Glow Border */}
            <div className="absolute -inset-1 bg-gradient-to-b from-sky-500/20 to-transparent rounded-[3rem] blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative bg-[#07070f] p-8 md:p-12 rounded-[2.8rem] border border-white/10 shadow-2xl">
              <div className="mb-10">
                <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Send a Transmission</h2>
                <p className="text-zinc-500 text-xs sm:text-sm font-medium">Response time: Usually within 24 hours.</p>
              </div>
              
              {/* Form Component */}
              <ContactForm />

              <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4 text-zinc-600">
                 <p className="text-[9px] font-black uppercase tracking-widest italic">
                   End-to-End Encrypted Connectivity
                 </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}