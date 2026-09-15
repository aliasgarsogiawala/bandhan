"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Expand,
  Plane,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import { Container } from "@/components/ui/Container";
import type { Destination, DestinationExperience, DestinationRouteStop, DestinationSeason } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Lightbox } from "@/components/ui/Lightbox";

type GuideProfile = {
  duration: string;
  bestTime: string;
  startingPoint: string;
  overview: string[];
  characterTitle?: string;
  planningTitle?: string;
  planningDescription?: string;
  planningPoints?: string[];
  experiences: DestinationExperience[];
  route: DestinationRouteStop[];
  seasons: DestinationSeason[];
  notes: string[];
};

const guides: Record<string, GuideProfile> = {
  kerala: {
    duration: "6 - 8 days",
    bestTime: "September - March",
    startingPoint: "Kochi International Airport",
    overview: [
      "Kerala is at its best when you travel slowly. The route moves from Fort Kochi's old-world lanes into the cool tea country of Munnar, through spice-scented hills and finally to the quiet backwaters of Alleppey.",
      "It works beautifully for couples, families and first-time visitors because every stop feels distinct: heritage, mountains, wildlife, food and a night on the water — all within one unhurried journey.",
    ],
    experiences: [
      { title: "Munnar's tea country", description: "Wake up among rolling plantations, misty viewpoints and small mountain roads made for an unhurried day out." },
      { title: "A night on the backwaters", description: "Cruise through palm-lined canals and paddy fields, then watch the sunset from your private houseboat deck." },
      { title: "Thekkady's spice trails", description: "Explore cardamom gardens, forest edges and local flavours with time set aside for a calm, nature-led stay." },
      { title: "Fort Kochi after dark", description: "Colonial streets, art spaces, seafood cafés and Chinese fishing nets offer a graceful beginning or finish to the trip." },
    ],
    route: [
      { label: "Days 1 - 2", title: "Kochi to Munnar", description: "Arrive in Kochi, then climb through Cheeyappara waterfalls and sprawling tea gardens to a scenic hill-station stay." },
      { label: "Days 3 - 4", title: "Munnar and Thekkady", description: "Explore Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam, spice plantations and an evening Kathakali & Kalaripayattu cultural show." },
      { label: "Days 5 - 6", title: "Backwaters of Alleppey", description: "Board a traditional thatched houseboat for a serene canal cruise with authentic Kerala Sadhya lunch and backwater sunset." },
      { label: "Days 7 - 8", title: "Varkala Cliff / Kochi Departure", description: "Add Varkala's red-cliff beach or return via Fort Kochi's Dutch Palace and spice markets for your onward flight." },
    ],
    seasons: [
      { title: "October to February", detail: "Cooler, crystal-clear days for tea hills, backwaters, wildlife safaris and festive temple celebrations." },
      { title: "March to May", detail: "Warmer weather; ideal if you prefer quieter plantation stays, fewer crowds and a slower coastal pace." },
      { title: "June to September", detail: "Lush monsoon landscapes, traditional Ayurvedic wellness treatments and cascading mountain waterfalls." },
    ],
    notes: ["A private chauffeur makes the hill-to-backwater route smooth and flexible.", "A houseboat night is best paired with a land stay so the trip keeps its rhythm.", "Choose Munnar hotels by view and estate location rather than just star rating."],
  },
  kashmir: {
    duration: "5 - 7 days",
    bestTime: "March - October (Tulips in April, Snow in Winter)",
    startingPoint: "Srinagar Airport",
    overview: [
      "Kashmir is a journey of contrasts: quiet mornings on Dal Lake, flower-filled Mughal gardens, wide alpine meadows and high mountain roads.",
      "A thoughtful route gives each valley its own time, rather than treating Srinagar, Gulmarg and Pahalgam as quick checkboxes.",
    ],
    experiences: [
      { title: "Dal Lake mornings", description: "Stay on a hand-carved cedar houseboat and begin the day with a gentle shikara ride to the floating vegetable market." },
      { title: "Gulmarg Gondola heights", description: "Ride the world's second-highest cable car up to Kongdoori and Apharwat Peak for panoramic Himalayan snow vistas." },
      { title: "Pahalgam & Betaab Valley", description: "Slow down beside the crystal-clear Lidder River, pine forests and the alpine meadows of Aru and Chandanwari." },
      { title: "Srinagar Mughal gardens", description: "Stroll through Shalimar Bagh, Nishat Bagh, and Chashme Shahi, ending with a fragrant Kashmiri wazwan dinner." },
    ],
    route: [
      { label: "Days 1 - 2", title: "Srinagar & Houseboat Stay", description: "Arrive in Srinagar, explore Mughal Gardens, enjoy a sunset shikara ride, and stay overnight on a luxury Dal Lake houseboat." },
      { label: "Days 3 - 4", title: "Gulmarg Mountain Escape", description: "Drive through pine-clad hills to Gulmarg for the Phase 1 & 2 Gondola ride, snow activities and alpine meadow walks." },
      { label: "Days 5 - 6", title: "Pahalgam Valley & Saffron Fields", description: "Travel past Pampore saffron fields and Avantipur ruins to Pahalgam for pony trails, Lidder River views and Betaab Valley." },
      { label: "Day 7", title: "Old City Craft & Departure", description: "Shop for authentic Pashmina shawls, walnut wood carving and saffron in Srinagar before transferring to the airport." },
    ],
    seasons: [
      { title: "March to May", detail: "Spring blossoms, lush green valleys and the world-famous Indira Gandhi Memorial Tulip Garden in April." },
      { title: "June to September", detail: "Pleasant summer weather, perfect for family holidays, outdoor meadow picnics and clear mountain drives." },
      { title: "December to February", detail: "Magical winter snow, frozen waterfalls, skiing and gondola snow-play in Gulmarg." },
    ],
    notes: ["Pre-book Phase 2 Gondola tickets in Gulmarg well in advance during peak season.", "Combine both a houseboat night on Dal Lake and boutique hillside hotels in Pahalgam.", "Carry layered woollens even in summer as mountain temperatures drop after sunset."],
  },
  goa: {
    duration: "4 - 6 days",
    bestTime: "November - March",
    startingPoint: "Goa Airport (Dabolim / Mopa GOX)",
    overview: [
      "Goa reveals two distinct souls: the vibrant beach culture, water sports and night bazaars of the North, and the serene coconut groves, Portuguese mansions and quiet coves of the South.",
      "Our curated route balances heritage, island boat cruises, spice plantation lunches and peaceful sunset beach dining.",
    ],
    experiences: [
      { title: "Fontainhas Latin Quarter", description: "Walk through Panaji's heritage precinct of 18th-century Portuguese villas, pastel lanes, and boutique art galleries." },
      { title: "Mandovi River Sunset Cruise", description: "Sail past historic riverfronts with live Goan folk music, Dekhni dance performances and twilight ocean views." },
      { title: "Sahakari Spice Plantation", description: "Explore organic cardamom, vanilla and betel farms followed by a traditional buffet lunch served on banana leaves." },
      { title: "South Goa Coastal Haven", description: "Unwind on the pristine white sands of Palolem, Cavelossim or Benaulim away from commercial crowds." },
    ],
    route: [
      { label: "Days 1 - 2", title: "North Goa Beaches & Forts", description: "Arrive in Goa, check in to your beach resort, visit Fort Aguada, Candolim Beach, and explore the Anjuna / Baga sunset scene." },
      { label: "Days 3 - 4", title: "Old Goa Churches & Spice Farm", description: "Visit Basilica of Bom Jesus, Se Cathedral, Sahakari Spice Farm lunch, and take a heritage walk through Fontainhas." },
      { label: "Days 5 - 6", title: "South Goa & Departure", description: "Relax at Miramar or Colva Beach, indulge in fresh coastal seafood, and transfer to the airport for your return flight." },
    ],
    seasons: [
      { title: "November to February", detail: "Sun-drenched, breezy weather with pleasant evenings — ideal for beach shacks, cruises and water sports." },
      { title: "March to May", detail: "Warm tropical summer; perfect for quiet resort pools, relaxed dining and uncrowded beaches." },
      { title: "June to September", detail: "Monsoon charm with emerald greenery, roaring Dudhsagar waterfalls and romantic rain-soaked landscapes." },
    ],
    notes: ["Rent a dedicated private car for smooth cross-district travel between North and South Goa.", "Try authentic Goan fish curry, Poi bread and Bebinca dessert at traditional heritage eateries.", "Book water sports with certified operators at Calangute or Baga beach."],
  },
  bali: {
    duration: "6 - 8 days",
    bestTime: "April - October",
    startingPoint: "Ngurah Rai International Airport, Denpasar (DPS)",
    overview: [
      "Bali blends spiritual majesty with tropical adventure — from cliffside sea temples and emerald jungle ravines to turquoise speedboat escapes to Nusa Penida island.",
      "A dual-centre itinerary dividing your stay between beachfront Kuta/Seminyak and the cultural highlands of Ubud offers the perfect balance of relaxation and discovery.",
    ],
    experiences: [
      { title: "Nusa Penida Island Speedboat Tour", description: "Cruise to West Nusa Penida to marvel at the iconic T-Rex cliff at Kelingking Beach, Broken Beach, and Angel's Billabong." },
      { title: "Uluwatu Sunset & Kecak Dance", description: "Perch high on sea cliffs above crashing Indian Ocean waves as 50+ performers chant the dramatic Ramayana fire dance." },
      { title: "Ubud Jungle Swing & Rice Terraces", description: "Soar over palm canopies on the famous Bali Swing and walk along the stepped green paddies of Tegallalang." },
      { title: "Kintamani Volcano Viewpoint", description: "Dine overlooking active Mount Batur and its crater lake, with a stop at traditional Celuk silver and Luwak coffee estates." },
    ],
    route: [
      { label: "Days 1 - 2", title: "Coastal Arrival & Uluwatu", description: "Flower garland airport welcome, private transfer to Kuta, water sports at Tanjung Benoa, and clifftop sunset at Uluwatu Temple." },
      { label: "Days 3 - 4", title: "Nusa Penida & North Bali", description: "Full-day Nusa Penida speedboat tour (Kelingking & Crystal Bay), followed by Ulun Danu Beratan floating temple and Handara Gate." },
      { label: "Days 5 - 6", title: "Highland Ubud & Jungle Swing", description: "Transfer to Ubud via Kintamani volcano panorama, coffee tasting, Ubud Art Market, and the Bali Jungle Swing." },
      { label: "Days 7 - 8", title: "Tirta Gangga & Departure", description: "Visit the royal stepping-stone pools of Tirta Gangga water palace and shop for Balinese handicrafts before airport transfer." },
    ],
    seasons: [
      { title: "April to October", detail: "Dry, sun-filled days with cool sea breezes — the absolute best window for island hopping, surfing and outdoor dining." },
      { title: "November to March", detail: "Lush tropical rains, vibrant green landscapes, festive Balinese temple ceremonies and uncrowded luxury resorts." },
    ],
    notes: ["Split your accommodation: 3-4 nights on the coast and 2-3 nights in an Ubud jungle pool villa.", "Wear sarongs (provided at temple entrances) when visiting sacred Balinese shrines.", "Indian vegetarian and Jain meals are easily arranged at top Indian restaurants across Kuta, Seminyak and Ubud."],
  },
  dubai: {
    duration: "5 - 7 days",
    bestTime: "October - April",
    startingPoint: "Dubai International Airport (DXB)",
    overview: [
      "Dubai represents the zenith of modern engineering and Arabian luxury — from the world's tallest tower and man-made palm islands to red dune desert safaris and historic gold souks.",
      "Every itinerary is paced comfortably with private transfers, luxury dinner cruises and curated day excursions to Abu Dhabi.",
    ],
    experiences: [
      { title: "Burj Khalifa at the Top", description: "Ascend to the 124th & 125th floor observation decks in high-speed elevators for 360-degree vistas across the Arabian Gulf." },
      { title: "4x4 Desert Safari & Dune Bashing", description: "Ride over golden desert dunes in an air-conditioned 4x4, followed by camel rides, henna painting, belly dance and BBQ dinner under the stars." },
      { title: "Dubai Marina Luxury Dhow Cruise", description: "Sail past illuminated skyscrapers on a glass-enclosed dhow cruise with a 5-star international buffet and live Tanoura dance." },
      { title: "Abu Dhabi & Grand Mosque Day Trip", description: "Visit the architectural marvel of Sheikh Zayed Grand Mosque, Ferrari World, and the Emirates Palace Corniche." },
    ],
    route: [
      { label: "Days 1 - 2", title: "Arrival, Dhow Cruise & Downtown", description: "Meet & greet arrival, evening Marina Dhow Cruise, Dubai Frame visit, Dubai Mall shopping, Fountain show and Burj Khalifa 124th floor." },
      { label: "Days 3 - 4", title: "Desert Safari & Old Dubai Heritage", description: "Half-day city tour (Palm Jumeirah, Gold & Spice Souks, Abra boat ride), followed by the thrilling 4x4 Desert Safari & starlit camp dinner." },
      { label: "Days 5 - 6", title: "Abu Dhabi & Miracle Garden", description: "Day excursion to Sheikh Zayed Grand Mosque in Abu Dhabi, followed by Dubai Miracle Garden's 150 million blooming flowers and Global Village." },
      { label: "Day 7", title: "Leisure Shopping & Departure", description: "Last-minute luxury shopping at Mall of the Emirates or Gold Souk before your private transfer to Dubai International Airport." },
    ],
    seasons: [
      { title: "November to March", detail: "Pleasant, sunny days (20°C - 28°C) — prime weather for beach clubs, desert camping and outdoor walking." },
      { title: "April to May / October", detail: "Warm shoulder months with excellent luxury hotel rates and comfortable evenings." },
      { title: "June to September", detail: "Summer season dominated by indoor attractions: Dubai Mall, indoor theme parks, Ski Dubai and world-class shopping festivals." },
    ],
    notes: ["Pre-book sunset slots for Burj Khalifa to enjoy both golden hour and the night fountain displays.", "Dress respectfully with shoulders and knees covered when visiting Sheikh Zayed Grand Mosque in Abu Dhabi.", "Taxis and the Dubai Metro are fast, clean and accept contactless cards everywhere."],
  },
  thailand: {
    duration: "5 - 8 days",
    bestTime: "November - April",
    startingPoint: "Bangkok Suvarnabhumi Airport (BKK)",
    overview: [
      "Thailand captivates with its dynamic pairing of Bangkok's gilded Buddhist temples and street food with Pattaya's lively beaches, coral islands and world-class cabaret entertainment.",
      "Paced with daily Indian meals, private AC coach transfers and certified guides, this itinerary delivers standard-setting ease for families and first-time travellers.",
    ],
    experiences: [
      { title: "Coral Island Speedboat Adventure", description: "Cruise by speedboat to Koh Larn's turquoise waters for parasailing, banana boat rides, jet skiing and beach relaxation." },
      { title: "Alcazar Cabaret World-Class Show", description: "Experience Pattaya's famous theatre performance featuring state-of-the-art lighting, grand costumes and musical glamour." },
      { title: "Safari World & Marine Park", description: "Drive through open safari plains with roaming lions and giraffes, followed by dolphin and spy war stunt shows at Marine Park." },
      { title: "Bangkok Gilded Temples & Gems Gallery", description: "Admire the 5.5-ton solid gold Buddha at Wat Traimit and the exquisite Italian marble architecture of Wat Benchamabophit." },
    ],
    route: [
      { label: "Days 1 - 2", title: "Bangkok Arrival to Pattaya", description: "Arrive at BKK airport, transfer to Pattaya, settle in, and attend the world-renowned Alcazar Cabaret evening show." },
      { label: "Days 3 - 4", title: "Coral Island & Bangkok Transfer", description: "Speedboat day trip to Coral Island (Koh Larn) with water sports, then drive to Bangkok with city orientation and temple visits." },
      { label: "Days 5 - 6", title: "Safari World & Chao Phraya Cruise", description: "Full day at Safari World & Marine Park with buffet lunch, followed by an evening Chao Phraya dinner cruise or night market exploration." },
      { label: "Day 7", title: "Indira Market Shopping & Departure", description: "Shop for souvenirs, clothing and electronics at MBK Center or Pratunam before your airport transfer." },
    ],
    seasons: [
      { title: "November to February", detail: "Cool and dry season with calm blue seas — the most popular time for beach activities and outdoor temple tours." },
      { title: "March to May", detail: "Warm tropical summer; experience the vibrant nationwide Songkran water festival in mid-April." },
      { title: "June to October", detail: "Green season with refreshing afternoon showers, lush tropical fruit harvests and incredible value across top hotels." },
    ],
    notes: ["Thailand Visa on Arrival is smooth and requires a valid passport with 6 months validity, return tickets, and photos.", "Indian restaurants serving vegetarian, Jain and non-vegetarian fare are standard inclusions across all Bandhan itineraries.", "Modest attire (covered shoulders and knees) is mandatory when visiting Royal Bangkok temples."],
  },
  europe: {
    duration: "10 - 15 days",
    bestTime: "May - October",
    startingPoint: "Paris (CDG) / Zurich (ZRH) / Frankfurt (FRA)",
    overview: [
      "The Grand European journey weaves through the continent's most iconic landscapes: Parisian boulevards and the Eiffel Tower, the snow-capped Swiss Alps, Austrian imperial palaces, and Italy's historic canals and Renaissance treasures.",
      "Expertly crafted with Indian tour managers, delicious Indian dinners, luxury coach transfers and confirmed entries to Mount Titlis and top monuments.",
    ],
    experiences: [
      { title: "Mount Titlis Rotair & Glacier Cave", description: "Ride the world's first revolving cable car to 10,000 feet for snow fun, the Cliff Walk suspension bridge, and ice caves." },
      { title: "Eiffel Tower Top & Seine River Cruise", description: "Ascend the iconic Iron Lady for panoramic views of Paris, then glide down the Seine past Notre-Dame and the Louvre." },
      { title: "Venice Gondola Ride & St. Mark's Square", description: "Board a private gondola through historic Venetian canals, past ancient palazzos, the Bridge of Sighs and Doge's Palace." },
      { title: "Rome's Colosseum & Vatican City", description: "Explore the ancient Roman Forum, Trevi Fountain, and St. Peter's Basilica in the heart of Vatican City." },
    ],
    route: [
      { label: "Days 1 - 3", title: "Paris, City of Lights", description: "Arrive in Paris, visit the Eiffel Tower, cruise the River Seine, explore Champs-Élysées, Arc de Triomphe and optional Disneyland." },
      { label: "Days 4 - 6", title: "Central Switzerland & Alps", description: "Scenic coach through Rhine Falls to Lucerne, Lion Monument, Chapel Bridge, and a full day at Mount Titlis with revolving cable car." },
      { label: "Days 7 - 9", title: "Austria, Innsbruck & Salzburg", description: "Drive past Lake Constance to Innsbruck, visit Swarovski Crystal World, Golden Roof, and the Sound of Music city of Salzburg." },
      { label: "Days 10 - 12", title: "Italy: Venice & Florence", description: "Private boat to Venice island for Gondola ride and Murano glass demo, followed by Florence Duomo and the Leaning Tower of Pisa." },
      { label: "Days 13 - 15", title: "Rome, Vatican & Departure", description: "Comprehensive tour of ancient Rome: Colosseum, Roman Forum, Trevi Fountain, Vatican St. Peter's Basilica, and departure flight." },
    ],
    seasons: [
      { title: "May to June", detail: "Long daylight hours, blooming alpine flowers, comfortable temperatures (18°C - 24°C) and fewer tourist crowds." },
      { title: "July to August", detail: "Vibrant European summer sunshine, open-air concerts, lively street cafés and snow activities at high mountain peaks." },
      { title: "September to October", detail: "Golden autumn foliage across the Alps and vineyards, ideal weather for museum visits and walking tours." },
      { title: "December", detail: "Magical European Christmas markets, festive light displays and snow-covered fairytale villages." },
    ],
    notes: ["Apply for Schengen Visa at least 60-90 days prior to departure; our dedicated visa desk assists with all documentation.", "Carry comfortable, broken-in walking shoes for European cobblestone city walking tours.", "Indian meals (including Pure Veg & Jain) with daily hot teas are thoughtfully catered throughout the group tour."],
  },
  singapore: {
    duration: "4 - 6 days",
    bestTime: "Year-round (Best November - August)",
    startingPoint: "Singapore Changi Airport (SIN)",
    overview: [
      "Singapore is the world's premier garden metropolis — seamlessly fusing futuristic architecture and lush botanical biomes with world-class theme parks and multi-cultural culinary quarters.",
      "Ideal for families and multi-generational travellers with seamless logistics, clean walkable promenades and top-rated family entertainment.",
    ],
    experiences: [
      { title: "Gardens by the Bay Supertrees & Cloud Forest", description: "Walk among 50-metre vertical gardens and explore the world's largest glass greenhouse with an indoor 35-metre waterfall." },
      { title: "Universal Studios Singapore at Sentosa", description: "Experience blockbuster thrill rides including Battlestar Galactica, Transformers The Ride 3D, and Jurassic Park Rapids." },
      { title: "World's First Night Safari", description: "Embark on an open-air tram through 6 geographical zones to observe 900+ nocturnal animals in natural rainforest habitats." },
      { title: "Marina Bay Sands SkyPark & Light Show", description: "Take in 360-degree skyline vistas from the 57th-floor cantilevered SkyPark and watch the Spectra water-and-light fountain show." },
    ],
    route: [
      { label: "Days 1 - 2", title: "City Orientation & Night Safari", description: "Arrive at Changi Airport, explore Jewel's Rain Vortex, visit Merlion Park and Little India, then head to the open-air Night Safari." },
      { label: "Days 3 - 4", title: "Sentosa Island & Universal Studios", description: "Cable car to Sentosa for a full day at Universal Studios, S.E.A. Aquarium, and the evening Wings of Time laser & fireworks show." },
      { label: "Days 5 - 6", title: "Gardens by the Bay & Departure", description: "Tour Flower Dome, Cloud Forest and Marina Bay Sands SkyPark deck, with afternoon shopping on Orchard Road before departure." },
    ],
    seasons: [
      { title: "November to January", detail: "Festive season with dazzling Christmas lights along Orchard Road and grand New Year celebrations at Marina Bay." },
      { title: "February to April", detail: "Warm and relatively dry; great for walking through Chinatown, Sentosa beaches and outdoor theme parks." },
      { title: "May to August", detail: "The Great Singapore Sale, culinary festivals and pleasant tropical weather for family vacations." },
    ],
    notes: ["Singapore Changi Airport is an attraction itself — arrive 3-4 hours early to explore Jewel Changi's indoor canyon waterfall.", "Tap contactless credit/debit cards directly at MRT subway turnstiles and buses without buying paper tickets.", "Tap water across Singapore is 100% potable and safe to drink."],
  },
};

function genericGuide(destination: Destination): GuideProfile {
  const duration = destination.duration || "4 - 6 days";
  const bestTime = destination.bestTime || "Choose dates with your travel designer";
  const highlights = destination.highlights?.length ? destination.highlights : ["Signature local sights", "Regional food and culture", "Scenic experiences", "Time to unwind"];
  return {
    duration,
    bestTime,
    startingPoint: destination.startingPoint || "Nearest major airport",
    characterTitle: destination.characterTitle || `Travel ${destination.name} with room to feel it.`,
    planningTitle: destination.planningTitle || "Make the guide yours.",
    planningDescription: destination.planningDescription || "We shape a day-by-day plan around your dates, budget, hotel style and who is travelling.",
    planningPoints: destination.planningPoints?.length ? destination.planningPoints : ["Private transfers and handpicked stays", "Flexible pacing and optional experiences", "Support from first enquiry to departure"],
    overview: [destination.overview || destination.description, "We tailor the pace, stays and route around the experiences that matter to your group."],
    experiences: highlights.slice(0, 4).map((title) => ({ title, description: `A memorable ${destination.name} experience, fitted naturally into your route.` })),
    route: [{ label: "Days 1 - 2", title: "Arrive and settle in", description: "Start gently with the destination's essential sights and local character." }, { label: "Days 3 - 4", title: "Explore more deeply", description: "Add the experiences, stays and pace that suit the way you travel." }, { label: "Final day", title: "Return at your own pace", description: "Keep the last day relaxed and timed comfortably for your departure." }],
    seasons: [{ title: "Best travel window", detail: bestTime }, { title: "A quieter escape", detail: "Ask us for shoulder-season dates with more space and value." }, { title: "Built around you", detail: "We will match weather, route and hotel style to your travel plan." }],
    notes: ["Private transfers keep the route comfortable and flexible.", "Choose hotels by location and experience, not only category.", "We can adjust the plan for families, celebrations and special interests."],
  };
}

function prepareGuide(destination: Destination) {
  const profile = guides[destination.id] || genericGuide(destination);
  const customHighlights = destination.highlights?.length
    ? destination.highlights.slice(0, 4).map((title) => ({ title, description: `A signature ${destination.name} experience, planned at the right pace for your trip.` }))
    : profile.experiences;
  return {
    ...profile,
    characterTitle: destination.characterTitle || profile.characterTitle,
    planningTitle: destination.planningTitle || profile.planningTitle,
    planningDescription: destination.planningDescription || profile.planningDescription,
    planningPoints: destination.planningPoints?.length ? destination.planningPoints : profile.planningPoints,
    duration: destination.duration || profile.duration,
    bestTime: destination.bestTime || profile.bestTime,
    startingPoint: destination.startingPoint || profile.startingPoint,
    overview: destination.overview ? destination.overview.split(/\n\s*\n/).filter(Boolean) : profile.overview,
    experiences: destination.experiences?.filter((item) => item.title || item.description).length ? destination.experiences.filter((item) => item.title || item.description) : customHighlights,
    route: destination.route?.filter((item) => item.title || item.description).length ? destination.route.filter((item) => item.title || item.description) : profile.route,
    seasons: destination.seasons?.filter((item) => item.title || item.detail).length ? destination.seasons.filter((item) => item.title || item.detail) : profile.seasons,
    notes: destination.designerNotes?.length ? destination.designerNotes : profile.notes,
    themes: [...new Set([...(destination.themes || []), ...(destination.tag ? [destination.tag] : [])])].slice(0, 5),
    gallery: [...new Set([destination.image, ...(destination.gallery || [])].filter(Boolean))],
  };
}

const sectionLinks = [
  { id: "overview", label: "Overview" },
  { id: "experiences", label: "Experiences" },
  { id: "route", label: "Suggested route" },
  { id: "seasons", label: "When to go" },
  { id: "gallery", label: "Gallery" },
];

export default function DestinationGuideClient({ id }: { id: string }) {
  const { items } = useCollection<Destination>("destinations");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const destination = useMemo(() => items.find((item) => item.id === id && item.status !== "draft"), [id, items]);

  if (!destination) {
    return (
      <PageShell tone="sand" offsetTop mainClassName="flex items-center justify-center px-6 py-24 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Destination unavailable</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-primary">This guide is off the map.</h1>
          <Link href="/destinations" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">Explore destinations</Link>
        </div>
      </PageShell>
    );
  }

  const guide = prepareGuide(destination);
  const bookingHref = `/book?type=destination&id=${encodeURIComponent(destination.id)}`;
  const guideSections = destination.faqs?.length ? [...sectionLinks, { id: "faqs", label: "FAQs" }] : sectionLinks;
  const heroLabels = [...new Set([destination.country || destination.region || "India", destination.tag, ...guide.themes].filter(Boolean))];
  const facts = [
    { label: "Ideal duration", value: guide.duration, icon: Clock3 },
    { label: "Best time", value: guide.bestTime, icon: CalendarDays },
    { label: "Start from", value: guide.startingPoint, icon: Plane },
    { label: "Best for", value: destination.groupSize || "Couples, families & friends", icon: Users },
  ];
  const gallerySlides = guide.gallery.map((image, index) => ({ image, title: destination.name, caption: guide.experiences[index]?.title || `${destination.name} travel moment` }));

  return (
    <PageShell tone="custom" className="destination-detail bg-sand-light">
      <header className="relative flex min-h-[86svh] items-end overflow-hidden pt-28 sm:min-h-[720px] sm:pt-0 lg:min-h-[780px]">
        <Image src={destination.image} alt={destination.name} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 bg-ink-deep/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/25 to-ink-deep/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/25" />

        <Container className="relative pb-12 sm:pb-16 lg:pb-20">
          <nav className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60" aria-label="Breadcrumb">
            <Link href="/destinations" className="transition-colors hover:text-gold">← Destinations</Link>
          </nav>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            {heroLabels.join(" · ")}
          </p>
          <h1 className="max-w-6xl break-words font-heading text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-white min-[420px]:text-5xl sm:text-6xl lg:text-[4.5rem]">
            {destination.name}
          </h1>
          <p className="mt-6 max-w-4xl text-sm leading-7 text-white/80 sm:text-lg sm:leading-8">{destination.tagline || destination.description}</p>

          <div className="mt-8 grid w-full grid-cols-2 border-y border-white/20 sm:grid-cols-4">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} className="min-w-0 border-b border-r border-white/15 px-0 py-4 pr-4 last:border-r-0 even:pl-4 sm:border-b-0 sm:px-5 sm:first:pl-0">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-gold"><Icon size={12} strokeWidth={1.7} />{fact.label}</span>
                  <span className="mt-1.5 block text-xs font-medium leading-5 text-white sm:text-sm">{fact.value}</span>
                </div>
              );
            })}
          </div>
        </Container>
      </header>

      <div className="sticky top-16 z-30 border-b border-primary/10 bg-[#fbfaf7]/95 backdrop-blur-xl sm:top-[76px]">
        <Container className="flex items-center gap-2 py-3">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Destination sections">
            {guideSections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="whitespace-nowrap border-b border-transparent px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:border-gold-dark hover:text-primary sm:px-4">{section.label}</a>
            ))}
          </nav>
          <Link href={bookingHref} className="ml-auto inline-flex shrink-0 items-center gap-2 whitespace-nowrap bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold hover:text-primary sm:px-6">
            Plan my trip <ArrowRight size={14} />
          </Link>
        </Container>
      </div>

      <section className="bg-[#fbfaf7] py-12 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div className="min-w-0 space-y-14 sm:space-y-20">
            <ScrollReveal>
              <section id="overview" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">The destination</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight tracking-[-0.03em] text-primary sm:text-5xl">{guide.characterTitle || `Travel ${destination.name} with room to feel it.`}</h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-foreground-muted sm:text-base sm:leading-8">
                  {guide.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <figure className="relative mt-8 h-[260px] w-full overflow-hidden bg-sand-dark sm:h-[420px]">
                  <Image src={guide.gallery[0]} alt={`${destination.name} landscape`} fill sizes="(max-width: 1023px) 100vw, 70vw" className="object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 to-transparent px-5 pb-5 pt-16 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">{destination.name}</figcaption>
                </figure>
                {guide.themes.length > 0 ? (
                  <div className="mt-8 border-y border-primary/15 sm:grid sm:grid-cols-2">
                    {guide.themes.map((theme, index) => (
                      <div key={theme} className="flex items-start gap-4 border-b border-primary/10 py-4 last:border-b-0 sm:px-5 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd):last-child]:col-span-2 sm:[&:nth-child(odd):last-child]:border-r-0 sm:[&:nth-child(odd):last-child]:pl-0">
                        <span className="font-heading text-xl font-extrabold text-gold-dark">{String(index + 1).padStart(2, "0")}</span>
                        <span className="pt-1 text-sm font-semibold leading-6 text-primary">{theme}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="experiences" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Signature moments</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Experiences worth travelling for</h2>
                <div className="mt-7 grid border-t border-primary/15 sm:grid-cols-2">
                  {guide.experiences.map((experience, index) => (
                    <article key={experience.title} className="border-b border-primary/15 py-6 sm:px-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pl-0 sm:[&:nth-child(odd):last-child]:col-span-2 sm:[&:nth-child(odd):last-child]:border-r-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">Experience {String(index + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 font-heading text-2xl font-extrabold text-primary">{experience.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground-muted">{experience.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="route" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Suggested flow</span>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-primary/15 pb-5">
                  <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">A route with room to breathe</h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">Fully customisable</span>
                </div>
                <ol>
                  {guide.route.map((stop, index) => (
                    <li key={`${stop.label}-${stop.title}`} className="grid gap-3 border-b border-primary/10 py-6 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-6">
                      <div><span className="font-heading text-3xl font-extrabold text-gold-dark">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-foreground-muted">{stop.label}</span></div>
                      <div><h3 className="font-heading text-2xl font-extrabold text-primary">{stop.title}</h3><p className="mt-2 text-sm leading-7 text-foreground-muted">{stop.description}</p></div>
                    </li>
                  ))}
                </ol>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="seasons" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">When to go</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Choose your season</h2>
                <div className="mt-7 divide-y divide-primary/10 border-y border-primary/15">
                  {guide.seasons.map((season) => (
                    <article key={season.title} className="grid gap-2 py-5 sm:grid-cols-[28px_190px_minmax(0,1fr)] sm:items-start sm:gap-5">
                      <Sun size={22} className="text-gold-dark" />
                      <h3 className="font-heading text-xl font-extrabold text-primary">{season.title}</h3>
                      <p className="text-sm leading-7 text-foreground-muted">{season.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="gallery" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">A sense of place</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">See {destination.name}</h2>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {guide.gallery.slice(0, 6).map((image, index) => (
                    <button key={`${image}-${index}`} type="button" onClick={() => setGalleryIndex(index)} className={`group relative overflow-hidden bg-sand-dark text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${index === 0 ? "col-span-2 min-h-[240px] sm:min-h-[400px]" : "min-h-40 sm:min-h-[200px]"}`} aria-label={`View ${destination.name} image ${index + 1}, enlarged`}>
                      <Image src={image} alt={`${destination.name} travel moment ${index + 1}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white/90 text-primary"><Expand size={15} /></span>
                    </button>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {destination.faqs?.length ? (
              <ScrollReveal>
                <section id="faqs" className="scroll-mt-28">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Before you travel</span>
                  <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Frequently asked questions</h2>
                  <div className="mt-7 divide-y divide-primary/10 border-y border-primary/15">
                    {destination.faqs.map((faq) => (
                      <details key={faq.question} className="group py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-primary">{faq.question}<span className="text-xl font-light text-gold-dark transition-transform group-open:rotate-45">+</span></summary>
                        <p className="max-w-3xl pt-4 text-sm leading-7 text-foreground-muted">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-36">
            <div className="border border-primary/15 bg-white p-7 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">Plan this destination</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted">Indicative trips from</p>
              <p className="mt-1 font-heading text-4xl font-extrabold text-primary">{destination.price}</p>
              <p className="mt-4 text-sm leading-7 text-foreground-muted">{guide.planningDescription || "We shape a day-by-day plan around your dates, budget, hotel style and travel party."}</p>
              <div className="mt-6 space-y-3 border-t border-primary/10 pt-5">
                {(guide.planningPoints?.length ? guide.planningPoints : ["Private transfers and handpicked stays", "Flexible pacing and optional experiences", "Support from enquiry to departure"]).map((item) => (
                  <p key={item} className="flex gap-2.5 text-sm leading-6 text-primary"><Check className="mt-1 h-4 w-4 shrink-0 text-gold-dark" />{item}</p>
                ))}
              </div>
              <Link href={bookingHref} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold hover:text-primary">Plan my trip <ArrowRight size={15} /></Link>
              <Link href="/contact" className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-primary/20 px-5 text-xs font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white">Talk to a designer</Link>
            </div>

            <div className="border border-primary/10 bg-sand-dark p-7">
              <Sparkles size={20} className="text-gold-dark" />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">Designer notes</p>
              <ul className="mt-4 space-y-4">
                {guide.notes.map((note) => <li key={note} className="border-b border-primary/10 pb-4 text-sm leading-6 text-foreground-muted last:border-0 last:pb-0">{note}</li>)}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-primary py-16 text-white sm:py-24">
        <Image src={destination.image} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-ink-deep/70" />
        <Container className="relative text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl">Make {destination.name} your journey.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">Share your dates and travel style. We will turn this guide into a considered, bookable itinerary.</p>
          <Link href={bookingHref} className="mt-8 inline-flex min-h-12 items-center gap-2 bg-gold px-8 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-white">Start planning <ArrowRight size={15} /></Link>
        </Container>
      </section>

      <Lightbox slides={gallerySlides} index={galleryIndex} onClose={() => setGalleryIndex(null)} onNavigate={setGalleryIndex} />
    </PageShell>
  );
}
