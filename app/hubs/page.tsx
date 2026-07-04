import HubsClient from "@/app/hubs/HubsClient";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";
import { connection } from "next/server"; // Import this

async function getHubsData() {
  try {
    await connectToDatabase();
    
    const distinctHubs = await Event.distinct("hub");
    
    const hubs = await Promise.all(distinctHubs.map(async (hubName) => {
      const activeCount = await Event.countDocuments({ hub: hubName });
      
      return {
        name: hubName, 
        tagline: { 
          en: "Active Pulse Core", 
          am: "ንቁ የማዕከል እምብርት",
          si: "Baqado Pulse" 
        },
        description: { 
          en: `Explore the latest activities and opportunities within the ${hubName} district.`,
          am: `በ${hubName} ውስጥ ያሉ የቅርብ ጊዜ እንቅስቃሴዎችን እና እድሎችን ያስሱ።`,
          si: `${hubName} giddonni haaro qixxaawoonni la'i.`
        },
        slug: typeof hubName === 'string' ? hubName.toLowerCase().replace(/ /g, '-') : 'hub',
        colorHex: hubName.includes('Lake') || hubName.includes('Hawassa') ? '#0ea5e9' : '#8b5cf6',
        activeEvents: activeCount,
        members: Math.floor(Math.random() * 500) + 100 
      };
    }));

    return JSON.parse(JSON.stringify(hubs));
  } catch (error) {
    console.error("Hubs Data Fetch Error:", error);
    return [];
  }
}

export default async function Page() {
  // Calling connection() tells Next.js this page is dynamic
  // without conflicting with cacheComponents settings.
  await connection(); 
  
  const hubs = await getHubsData();
  return <HubsClient hubs={hubs} />;
}