export interface IHubData {
  id: number;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  am: string;
  si: string;
  tagline: string;
  description: {
    en: string;
    am: string;
    si: string;
  };
  image: string;
  accentColor: string;
}

export const HAWASSA_HUBS: IHubData[] = [
  {
    id: 1,
    slug: "lake-front",
    name: "Lake Front",
    lat: 7.0500,
    lng: 38.4667,
    am: "ሐይቅ ዳርቻ",
    si: "Laku Qeechenni",
    tagline: "Culture & Recreation",
    description: {
      en: "The cultural and recreational center of Hawassa, featuring stunning lake views, vibrant community gatherings and unforgettable sunset evenings.",
      am: "የሀዋሳ ባህላዊ እና መዝናኛ ማዕከል፣ ማራኪ የሐይቅ እይታ እና ደማቅ የማህበረሰብ ስብስቦችን የያዘ።",
      si: "Hawassaho baado qeechenni bati'rannowa, hawassahu laku leellannowa."
    },
    image: "/Hawassa.jpg",
    accentColor: "#0ea5e9"
  },
  {
    id: 2,
    slug: "industrial-park",
    name: "Industrial Park",
    lat: 7.0850,
    lng: 38.5010,
    am: "ኢንዱስትሪ ፓርክ",
    si: "Industirete Paarke",
    tagline: "Business & Innovation",
    description: {
      en: "A major economic driver of the city, hosting numerous businesses, tech events, and large-scale summits in one of East Africa's fastest-growing industrial zones.",
      am: "የከተማዋ ዋና የኢኮኖሚ ሞተር፣ በርካታ የንግድ ተቋማትን፣ የቴክኖሎጂ ዝግጅቶችን እና ትልልቅ ጉባኤዎችን የሚያስተናግድ።",
      si: "Quchumaho jiro lossitannoti, lowo daldalatenna tekinolojiyete qixxaawoonni bati'rannowa."
    },
    image: "/industrial.jpg",
    accentColor: "#8b5cf6"
  },
  {
    id: 3,
    slug: "piazza-center",
    name: "Piazza Center",
    lat: 7.0620,
    lng: 38.4750,
    am: "ፒያሳ",
    si: "Piyyaasa",
    tagline: "Commerce & Urban Life",
    description: {
      en: "The bustling commercial heart of the city, perfect for networking, local business showcases, cultural festivals and the vibrant pulse of urban Hawassa.",
      am: "ደማቅ የከተማዋ የንግድ ማዕከል፣ ለንግድ ግንኙነቶች እና ለከተማ ህይወት ተስማሚ የሆነ።",
      si: "Quchumaho bati'rannohu daldalu qeechenni, jajjabba daldalu baqado afantannowa."
    },
    image: "/piazza.jpg",
    accentColor: "#f59e0b"
  },
  {
    id: 4,
    slug: "hawassa-university",
    name: "Hawassa University",
    lat: 7.0600,
    lng: 38.4900,
    am: "ሀዋሳ ዩኒቨርሲቲ",
    si: "Hawassa Yuniversitete",
    tagline: "Tech & Innovation Shows",
    description: {
      en: "The leading academic hub of the region, where students, researchers, and tech entrepreneurs converge for innovation showcases, hackathons, and groundbreaking seminars.",
      am: "የክልሉ ዋና አካዳሚያዊ ማዕከል፣ ተማሪዎች፣ ተመራማሪዎች እና የቴክ ሥራ ፈጣሪዎች ለፈጠራ ትርኢቶች፣ ሃካቶን እና ሴሚናሮች የሚሰበሰቡበት።",
      si: "Geeshsha danna gobba, tekinolojete afantanno xexxeannowanna haaro leellishsha bati'rannowa."
    },
    image: "/university.jpg",
    accentColor: "#10b981"
  },
  {
    id: 5,
    slug: "hawassa-stadium",
    name: "Hawassa Stadium",
    lat: 7.0680,
    lng: 38.4800,
    am: "ሀዋሳ ስታዲየም",
    si: "Hawassa Istadiyome",
    tagline: "Sports & Tournaments",
    description: {
      en: "The beating heart of Hawassa's sports scene — home to thrilling football tournaments, athletics competitions, and massive city-wide sports events that ignite community pride.",
      am: "የሀዋሳ ስፖርት ትዕይንት ዋና ደረጃ — ለሚያስደንቅ የእግር ኳስ ውድድሮች፣ የአትሌቲክስ ፉክክሮች እና ትልቅ ከተማ-ስፋ ስፖርታዊ ዝግጅቶች ቤት።",
      si: "Hawassaho ispoortete damba — galamote dambanna atlaatikisete qixxaawoonni bati'rannowa."
    },
    image: "/stadium.jpg",
    accentColor: "#ef4444"
  },
  {
    id: 6,
    slug: "tech-hub",
    name: "Tech Hub",
    lat: 7.0550,
    lng: 38.4820,
    am: "የቴክ ማዕከል",
    si: "Tekinolojete Qeechenni",
    tagline: "Startups & Digital Innovation",
    description: {
      en: "Hawassa's growing digital frontier — a co-working and event space for startups, software developers, designers, and digital creators shaping the city's future.",
      am: "የሀዋሳ እያደገ የሚሄደው ዲጂታል ድንበር — ስታርትአፕዎች፣ ሶፍትዌር ገንቢዎች፣ ዲዛይነሮች እና ዲጂታል ፈጣሪዎች የሚሰሩበት ቦታ።",
      si: "Haaro Hawassate dijiitale heeshsho — istartappenna software loonsitinote qeechenni."
    },
    image: "/techHub.jpg",
    accentColor: "#06b6d4"
  },
  {
    id: 7,
    slug: "amora-gedel",
    name: "Amora Gedel",
    lat: 7.0430,
    lng: 38.4600,
    am: "አሞራ ጌደል",
    si: "Amora Gedele",
    tagline: "Culture & Music Festivals",
    description: {
      en: "A scenic park and cultural landmark of Hawassa — home to music festivals, art exhibitions, open-air theater, and the city's most beloved outdoor cultural events.",
      am: "ሥዕላዊ ፓርክ እና የሀዋሳ ባህላዊ ቅርስ — ለሙዚቃ ፌስቲቫሎች፣ የሥነ ጥበብ ትርኢቶች፣ ክፍት ቴያትር እና ለከተማዋ ተወዳጅ ውጪ ባህላዊ ዝግጅቶች።",
      si: "Hawassate kultuurete laame — muuziqete fesitivaallenna sanate qixxaawoonni bati'rannowa."
    },
    image: "/amora.webp",
    accentColor: "#f97316"
  },
];
