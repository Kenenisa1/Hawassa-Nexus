"use client";

import { motion } from "framer-motion";
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLightBulb,
  HiArrowRight,
  HiChevronDown,
} from "react-icons/hi";
import { FaHeartbeat, FaBook, FaComments, FaPlayCircle } from "react-icons/fa";
import LText from "@/components/LanguageFriendlyText";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Link from "next/link";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Content dictionary
const content = {
  heroTag: {
    en: "Help & Support Center",
    am: "ሰላይ እና ድጋፍ ማዕከል",
    si: "Irko fi Gargaarsa",
  },
  heroTitle: {
    en: "Get Support",
    am: "ድጋፍ ይሙሙ",
    si: "Irko Qabaadi",
  },
  heroSubtitle: {
    en: "We're here to help you navigate Hawassa Nexus and maximize your community engagement.",
    am: "ሀዋሳ ነክሰስን ለመሳፈር እና ማህበረሰብ ተሳትፎዎን ለማሳደግ እርስዎን ለመርዳት እዚህ ነን።",
    si: "Ani wajjin jirtannu dhaaf Hawassa Nexus keessatti tarkaanfii godhuuf fi walhaasaa waldaa keessaa fayyadhachuu guddisuu.",
  },
  faqTitle: {
    en: "Frequently Asked Questions",
    am: "በተደጋጋሚ የሚነሱ ጥያቄዎች",
    si: "Gaffii yeroo hunda Yaadame",
  },
  categoriesTitle: {
    en: "Support Categories",
    am: "ድጋፍ ምድቦች",
    si: "Miseensa Gargaarsa",
  },
  contactTitle: {
    en: "Still need help?",
    am: "አሁንም ድጋፍ ያስፈልግዎታል?",
    si: "Haala amma irko barbaaddaa?",
  },
  contactDesc: {
    en: "Connect with our support team for personalized assistance.",
    am: "ለ ግላዊ ረዳታ ከእኛ ድጋፍ ቡድን ጋር ይገናኙ።",
    si: "Gargaarsa ofumaa keessaf walhaasichii gargaarsa nu waliin wal qabii.",
  },
};

// FAQ Data Structure
const faqData = [
  {
    question: {
      en: "How do I create an account on Hawassa Nexus?",
      am: "በሀዋሳ ነክሰስ ላይ 계정ን እንዴት ይፈጥራለሁ?",
      si: "Hawassa Nexus irraa akkaataa kamiin koontoo uumaa?",
    },
    answer: {
      en: "Navigate to the registration page, fill in your email and details, and you're ready to explore!",
      am: "ወደ ምዝገባ ገጽ ይሂዱ፣ ኢሜይልዎን እና ዝርዝሮችን ሙሉ ያድርጉ፣ እና ያስስ ዘጋቢ ነዋሪ ይሆናሉ!",
      si: "Gara fuula galmee kaasaa deemi, imeelii fi seenaa kee guute, fi ati barbaachisuu keessaa lak!",
    },
  },
  {
    question: {
      en: "How can I find events happening near me?",
      am: "በቅርብ ግዜ ምን ኩነቶች እንዳሉ እንዴት ላውቅ?",
      si: "Woyitoota mana jiru akkamitti barbaada?",
    },
    answer: {
      en: "Visit the 'Explore' section to view live events with filters for location and date.",
      am: "ለ ስቴ እና ታሪክ ፊልተሮች ያሉ ቀጥታ ኩነቶችን ለመመልከት 'ኩነቶች' ይይዙ።",
      si: "Kutaa 'Woyitoota' bukaa deemi woyitoota jireenyaa fillagee jajjaa fi guyyaa ilaaluuf.",
    },
  },
  {
    question: {
      en: "What are City Hubs and how do I use them?",
      am: "City Hubs ምንድን ናቸው እና እንዴት እጠቀምበት?",
      si: "Gidduubba Magaalaa maal jedhu fi akkamitti fayyadamaa?",
    },
    answer: {
      en: "City Hubs are community spaces where local businesses, events, and partnerships thrive. Browse our 'Hubs' section to discover them!",
      am: "City Hubs የሕዝብ ቦታዎች ሲሆኑ የህዝበ ንግዶች፣ ኩነቶች እና ክፍለ ተቋማት ውስጡ ይወጣሉ። 'ማዕከላት' ሴክሽን ያስስ ለመግኘት!",
      si: "Gidduubba Magaalaa iddoo waldaa dha iddoo negosii naanichaa, woyitoota, fi hullahuuwan dhaabachuu. Kutaa 'Gidduubba' keessa deemi argachuu!",
    },
  },
  {
    question: {
      en: "How do I change my language preference?",
      am: "የቋንቋ ምርጫ እንዴት አቀይራለሁ?",
      si: "Filannoo afaaf akkamitti jijjiiraa?",
    },
    answer: {
      en: "Use the language selector in the top navigation bar to switch between English, Amharic, and Sidaamu.",
      am: "በላይ ላይ ንቅናቄ ባር ውስጥ ያለውን ቋንቋ ምርጫ ተጠቀም ኢንግሊዝኛ፣ አማርኛ እና ሳሙ መካከል ለመቀየር።",
      si: "Filannoo afaaf gidi navigeeshinii gubbaa keessa fayyadami English, Amharic, fi Sidaamu galiinsa jijjiiruu.",
    },
  },
  {
    question: {
      en: "Can I partner with Hawassa Nexus?",
      am: "ከሀዋሳ ነክሰስ ጋር ክፍለ ተቋም ሊሆን ይችላ?",
      si: "Hawassa Nexus wajjin walqabatan aata?",
    },
    answer: {
      en: "Absolutely! We welcome partnerships. Contact us via the support team or email hello@hawassapulse.com",
      am: "በእርግጥ! ክፍለ ተቋማትን ይከበባሉ። ከድጋፍ ቡድን ወይም ኢሜይል hello@hawassapulse.com ጋር ተገናኙ",
      si: "Bara! Walqabatani walbira. Wajjin gargaarsa teemii keessa yookiin imeelii hello@hawassapulse.com walqabii",
    },
  },
  {
    question: {
      en: "How is my data protected?",
      am: "ሳሙ ውሂብ እንዴት ተከላካይ ነው?",
      si: "Seenaa koo akkamitti eegamaa?",
    },
    answer: {
      en: "We use industry-standard encryption and never share your personal data without permission.",
      am: "የሰሪ-መሰናዶ ኤንክሪፕሽን ተጠቀም እና ሙከራውን ሳይፈቀዱ ግላዊ ሳሙን ምንም ጊዜ አጋራ ማድረግ አይችሉ።",
      si: "Itti ammayyuu encryption fayyadamna hin walhajji seenaa keessaa hanqina allo.",
    },
  },
];

// Support Categories
const supportCategories = [
  {
    icon: <HiOutlineLightBulb />,
    title: { en: "Getting Started", am: "ውስንት ይህ", si: "Jalqaba" },
    description: {
      en: "Learn the basics of navigating Hawassa Nexus and creating your profile.",
      am: "ሀዋሳ ነክሰስን አስተዳደግ እና የግል ፕሮፋይል መፍጠር ተማር።",
      si: "Hawassa Nexus faasalamu fi profile kee uumaaman naala.",
    },
  },
  {
    icon: <FaPlayCircle />,
    title: { en: "Events & Discovery", am: "ኩነቶች እና ተፈላ", si: "Woyitoota & Argachuu" },
    description: {
      en: "Find tips on searching, filtering, and discovering events that match your interests.",
      am: "ኩነቶችን ለመፈለግ፣ ለመፍተሽ እና ከርስዎ ፍላጎት ጋር ሚመሳሰሉ ጠቃሚ ምክሮች ያግኙ።",
      si: "Woyitoota barbaaduu, gadilchuu fi dandeettii kee waangoo woyitoota argachuu tilmaamota argaa.",
    },
  },
  {
    icon: <FaComments />,
    title: { en: "Account & Settings", am: "ኣካውንት እና 세팅", si: "Akkaawuni & Gosa" },
    description: {
      en: "Manage your profile, security, and notification preferences in one place.",
      am: "በአንድ ቦታ ውስጥ ግል ፕሮፋይሎዎን፣ ዋስትና እና ማሳወቂያ ምርጫ ይቁጠሩ።",
      si: "Profile, jiddha fi filannoo ilmamtaa keessa guddisaa.",
    },
  },
  {
    icon: <HiOutlineEnvelope />,
    title: { en: "Partnerships", am: "ክፍለ ተቋማት", si: "Walqabata" },
    description: {
      en: "Information about becoming a business partner or listing your events.",
      am: "ሥራ ክፍለ ተቋም ወይም ኩነቶችህን ማዘርዘር አዋጅ።",
      si: "Waliigala negosii aatan aano woyitoota seenu kan guddina.",
    },
  },
];

// FAQ Accordion Component
const FAQAccordion = () => {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqData.map((item, idx) => (
        <motion.div
          key={idx}
          variants={fadeInUp}
          className="border border-white/10 rounded-2xl overflow-hidden hover:border-sky-500/30 transition-colors"
        >
          <button
            onClick={() => setOpenId(openId === idx ? null : idx)}
            className="w-full p-6 md:p-8 flex items-start justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <span className="font-black text-white text-sm md:text-base leading-relaxed">
              <LText content={item.question} />
            </span>
            <HiChevronDown
              className={`w-5 h-5 text-sky-400 shrink-0 transition-transform duration-300 ${
                openId === idx ? "rotate-180" : ""
              }`}
            />
          </button>

          {openId === idx && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/5 text-sm md:text-base text-zinc-400 leading-relaxed"
            >
              <LText content={item.answer} />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default function SupportClient() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-[#030014] text-zinc-100 pt-32 pb-20 px-6 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <FaHeartbeat size={14} />
            <LText content={content.heroTag} />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic leading-tight">
            <LText content={content.heroTitle} />
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            <LText content={content.heroSubtitle} />
          </p>
        </motion.section>

        {/* Support Categories Grid */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-12 uppercase italic tracking-tighter">
            <LText content={content.categoriesTitle} />
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {supportCategories.map((category, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-sky-500/20 transition-all group cursor-pointer"
              >
                <div className="text-4xl text-sky-500 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-3 uppercase">
                  <LText content={category.title} />
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  <LText content={category.description} />
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="flex items-center gap-3 mb-12">
            <HiOutlineQuestionMarkCircle className="w-8 h-8 text-sky-500" />
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
              <LText content={content.faqTitle} />
            </h2>
          </div>

          <FAQAccordion />
        </motion.section>

        {/* Resources Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-12 uppercase italic tracking-tighter">
            {language === "en" && "Learning Resources"}
            {language === "am" && "የመማር ሙከራዎች"}
            {language === "si" && "Qabeenya Barumsaa"}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaBook />,
                title: {
                  en: "Documentation",
                  am: "ሰነድ",
                  si: "Galmee",
                },
                desc: {
                  en: "Complete guide to using Hawassa Nexus features",
                  am: "ሀዋሳ ነክሰስ ቅንብር አሠራር ሙሉ መመሪያ",
                  si: "Hawassa Nexus qabeenya fayyadamuu gabaa guutuu",
                },
              },
              {
                icon: <FaPlayCircle />,
                title: {
                  en: "Video Tutorials",
                  am: "ቪዲዮ ትምህርቶች",
                  si: "Barnoota Vidiyoo",
                },
                desc: {
                  en: "Step-by-step video guides for all features",
                  am: "ሁሉም ቅንብር ለ ደረጃ-በ-ደረጃ ቪዲዮ መመሪያ",
                  si: "Tarkaanfi-tarkaanfi barnoota vidiyoo qabeenya guutuu",
                },
              },
              {
                icon: <FaComments />,
                title: {
                  en: "Community Forum",
                  am: "ማህበረሰብ መድረክ",
                  si: "Foramu Waldaa",
                },
                desc: {
                  en: "Connect with other users and share tips",
                  am: "ሌሎች ተጠቃሚዎች ጋር ይገናኙ እና ምክሮች ያጋሩ",
                  si: "Fayyadamtoonni biraa wajjin wal qabii fi tilmaamota kan ragga",
                },
              },
            ].map((resource, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-sky-500/30 transition-all group"
              >
                <div className="text-4xl text-sky-500 mb-4 group-hover:text-white transition-colors">
                  {resource.icon}
                </div>
                <h3 className="font-black text-white mb-2 uppercase text-sm">
                  <LText content={resource.title} />
                </h3>
                <p className="text-xs text-zinc-500">
                  <LText content={resource.desc} />
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-sky-500/10 to-sky-500/5 border border-sky-500/20 rounded-[3rem] p-12 md:p-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase italic">
            <LText content={content.contactTitle} />
          </h2>

          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            <LText content={content.contactDesc} />
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-sky-500 text-black font-black text-sm uppercase rounded-2xl hover:bg-sky-400 transition-all group"
          >
            {language === "en" && "Contact Support Team"}
            {language === "am" && "ድጋፍ ቡድን ጋር ተገናኙ"}
            {language === "si" && "Gargaarsa Teemii Walqabii"}
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
