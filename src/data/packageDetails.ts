import { featuredPackages, TourPackage } from "./mockData";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  stay?: string;
}

export interface PackageFaq {
  question: string;
  answer: string;
}

export interface GalleryImage {
  image: string;
  caption: string;
}

export interface PackageDetail {
  id: string;
  tagline: string;
  overview: string;
  heroImage: string;
  gallery: GalleryImage[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  bestTime: string;
  startingPoint: string;
  groupSize: string;
  themes: string[];
  faqs: PackageFaq[];
}

export type FullPackage = TourPackage & PackageDetail;

const details: Record<string, PackageDetail> = {
  "sikkim-special": {
    id: "sikkim-special",
    tagline: "Prayer flags, alpine lakes, and the world's third-highest peak on your horizon.",
    overview:
      "This 10-day journey threads together the finest of the Eastern Himalayas — the monasteries and mountain passes of Gangtok, the sacred glacial waters of Tsomgo Lake, and the colonial charm of Darjeeling's tea country. Travel in small groups with local guides who grew up in these hills, stay in handpicked heritage properties, and time your mornings for the famous Kanchenjunga sunrise from Tiger Hill.",
    heroImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
    gallery: [
      {
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        caption: "Himalayan valleys en route to North Sikkim",
      },
      {
        image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1200",
        caption: "Alpine lakes and snow peaks",
      },
      {
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=1200",
        caption: "Misty mornings in the foothills",
      },
      {
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200",
        caption: "Heritage stops along the journey",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive at Bagdogra — Drive to Gangtok",
        description:
          "Our team welcomes you at Bagdogra Airport for a scenic 4-hour drive along the Teesta River into Sikkim's capital. Evening free to stroll MG Marg's pedestrian boulevard.",
        meals: "Dinner",
        stay: "Gangtok",
      },
      {
        day: 2,
        title: "Gangtok Monasteries & City Sights",
        description:
          "A full day covering Rumtek and Enchey monasteries, the Institute of Tibetology, Do Drul Chorten stupa, and the flower exhibition centre, ending with sunset views from Tashi viewpoint.",
        meals: "Breakfast, Dinner",
        stay: "Gangtok",
      },
      {
        day: 3,
        title: "Tsomgo Lake & Baba Mandir Excursion",
        description:
          "Climb to 12,400 ft for the sacred glacial Tsomgo Lake — yak rides optional — then continue to the revered Baba Harbhajan Singh Mandir near Nathula Pass.",
        meals: "Breakfast, Dinner",
        stay: "Gangtok",
      },
      {
        day: 4,
        title: "Gangtok to Lachung via Waterfall Trail",
        description:
          "Journey into North Sikkim past Seven Sisters and Naga waterfalls, with the Himalayas growing closer at every bend. Evening tea in the riverside village of Lachung.",
        meals: "Breakfast, Dinner",
        stay: "Lachung",
      },
      {
        day: 5,
        title: "Yumthang Valley — Valley of Flowers",
        description:
          "An early start for Yumthang's rhododendron meadows and hot springs at 11,800 ft, framed by snow ridges. Return to Gangtok by evening.",
        meals: "Breakfast, Dinner",
        stay: "Gangtok",
      },
      {
        day: 6,
        title: "Gangtok to Pelling",
        description:
          "Drive west past cardamom farms to Pelling. En route, visit the ancient Rabdentse ruins and Pemayangtse Monastery, one of Sikkim's oldest.",
        meals: "Breakfast, Dinner",
        stay: "Pelling",
      },
      {
        day: 7,
        title: "Pelling Skywalk & Khecheopalri Lake",
        description:
          "Walk the glass skywalk to Chenrezig statue, then find quiet at wish-fulfilling Khecheopalri Lake, where not a single leaf is allowed to float on the surface.",
        meals: "Breakfast, Dinner",
        stay: "Pelling",
      },
      {
        day: 8,
        title: "Pelling to Darjeeling",
        description:
          "Cross into West Bengal's tea country. Afternoon ride on the UNESCO-listed Darjeeling Himalayan Railway 'Toy Train' (subject to operation) and a lazy evening on Mall Road.",
        meals: "Breakfast, Dinner",
        stay: "Darjeeling",
      },
      {
        day: 9,
        title: "Tiger Hill Sunrise & Tea Estates",
        description:
          "A 4 AM drive to Tiger Hill for sunrise over Kanchenjunga, followed by Ghoom Monastery, Batasia Loop, and a guided tasting walk through a working tea estate.",
        meals: "Breakfast, Dinner",
        stay: "Darjeeling",
      },
      {
        day: 10,
        title: "Departure from Bagdogra",
        description:
          "After breakfast, descend through tea gardens to Bagdogra Airport with a bag full of Darjeeling first-flush and a camera roll to match.",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "9 nights in handpicked 3★/4★ hotels & heritage stays",
      "Daily breakfast and dinner (MAP plan)",
      "Private SUV transfers & all sightseeing by dedicated vehicle",
      "Tsomgo Lake & Nathula-area permits arranged for you",
      "English/Hindi-speaking local guide throughout",
      "Toy Train joyride tickets (Darjeeling)",
      "All parking, tolls, driver allowances & taxes",
    ],
    exclusions: [
      "Airfare / train fare to and from Bagdogra",
      "Lunches and personal food & beverage orders",
      "Yak rides, ropeways & other optional activities",
      "Travel insurance",
      "Anything not listed under inclusions",
    ],
    bestTime: "March – June & October – December",
    startingPoint: "Bagdogra Airport (IXB)",
    groupSize: "2 – 16 guests",
    themes: ["Himalayas", "Monasteries", "Tea Estates", "Group Friendly"],
    faqs: [
      {
        question: "Do I need a permit to visit Tsomgo Lake and North Sikkim?",
        answer:
          "Yes — both areas need Protected Area Permits. We arrange every permit for you in advance; just share passport-size photos and a valid government ID after booking.",
      },
      {
        question: "Will altitude be a problem on this tour?",
        answer:
          "The itinerary climbs gradually and the highest overnight stay is at Lachung (~8,600 ft), which most travellers handle comfortably. We keep day one and two easy so your body acclimatises naturally.",
      },
      {
        question: "Is this tour suitable for senior citizens and kids?",
        answer:
          "Absolutely. The pace is relaxed, drives are broken with stops, and hotels are chosen for comfort. We only suggest skipping the Yumthang excursion for guests with serious respiratory conditions.",
      },
    ],
  },

  "kashmir-paradise": {
    id: "kashmir-paradise",
    tagline: "Shikaras at dawn, saffron fields at noon, and a houseboat to call home.",
    overview:
      "Seven days in the valley poets refused to describe in ordinary words. Glide across Dal Lake in a hand-carved shikara, ride the world's highest gondola in Gulmarg, picnic beside the Lidder River at Pahalgam, and wander Mughal gardens laid out four centuries ago. One night is reserved for Kashmir's most iconic stay — a cedar houseboat with carved walnut interiors.",
    heroImage:
      "https://images.unsplash.com/photo-1566837430541-11d2798e27c1?auto=format&fit=crop&q=80&w=2000",
    gallery: [
      {
        image: "https://images.unsplash.com/photo-1566837430541-11d2798e27c1?auto=format&fit=crop&q=80&w=1200",
        caption: "Dal Lake and the Zabarwan range",
      },
      {
        image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1200",
        caption: "Snow-capped peaks over pristine waters",
      },
      {
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        caption: "Meadows on the road to Gulmarg",
      },
      {
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=1200",
        caption: "Still waters, golden hours",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Srinagar — Shikara Sunset",
        description:
          "Touch down at Srinagar and settle into your hotel by Dal Lake. As the light softens, take a slow shikara ride past floating gardens and the lake's famous wooden mosques.",
        meals: "Dinner",
        stay: "Srinagar",
      },
      {
        day: 2,
        title: "Mughal Gardens & Old City",
        description:
          "Walk the terraces of Nishat, Shalimar, and Chashme Shahi gardens, then explore the old city's papier-mâché and pashmina workshops with our local host.",
        meals: "Breakfast, Dinner",
        stay: "Srinagar",
      },
      {
        day: 3,
        title: "Gulmarg — Gondola to Apharwat",
        description:
          "Day trip to the 'Meadow of Flowers'. Ride the Gulmarg Gondola towards Apharwat Peak (Phase I included) for views that stretch to the Line of Control on clear days.",
        meals: "Breakfast, Dinner",
        stay: "Srinagar",
      },
      {
        day: 4,
        title: "Srinagar to Pahalgam via Saffron Fields",
        description:
          "Drive through Pampore's saffron fields and Avantipora ruins to the shepherd town of Pahalgam, set on the banks of the Lidder River.",
        meals: "Breakfast, Dinner",
        stay: "Pahalgam",
      },
      {
        day: 5,
        title: "Betaab Valley, Aru & Chandanwari",
        description:
          "Explore the cinematic trio of Betaab Valley, Aru meadows, and Chandanwari by local union taxi, with time for pony rides and riverside photographs.",
        meals: "Breakfast, Dinner",
        stay: "Pahalgam",
      },
      {
        day: 6,
        title: "Return to Srinagar — Houseboat Night",
        description:
          "Back in Srinagar, board your heritage houseboat. Evening kahwa on the deck as shikara vendors drift past selling flowers and saffron.",
        meals: "Breakfast, Dinner",
        stay: "Houseboat, Dal Lake",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "One last lake-view breakfast before your airport transfer, with dry fruits and saffron from our trusted sellers if you wish to shop en route.",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "5 nights premium hotels + 1 night deluxe houseboat",
      "Daily breakfast and dinner",
      "1-hour private shikara ride on Dal Lake",
      "Gulmarg Gondola Phase I tickets",
      "All transfers & sightseeing in a private vehicle",
      "Union taxi charges at Pahalgam (Betaab/Aru/Chandanwari)",
      "All applicable taxes & driver allowances",
    ],
    exclusions: [
      "Flights to/from Srinagar",
      "Gondola Phase II tickets & pony rides",
      "Lunches and beverages",
      "Travel insurance",
      "Personal expenses, tips & shopping",
    ],
    bestTime: "April – October (December – February for snow)",
    startingPoint: "Srinagar Airport (SXR)",
    groupSize: "2 – 20 guests",
    themes: ["Honeymoon", "Lakes & Gardens", "Houseboat Stay", "Family"],
    faqs: [
      {
        question: "Is Kashmir safe for tourists?",
        answer:
          "Tourist circuits — Srinagar, Gulmarg, Pahalgam, Sonmarg — are well-policed and heavily visited year-round. Our on-ground team monitors conditions daily and adjusts routes in the rare event of local disruptions.",
      },
      {
        question: "What is the houseboat experience like?",
        answer:
          "You stay in a full-service deluxe houseboat with attached bathrooms, hot water, a dining lounge, and an open deck. Dinner and breakfast are served on board by the houseboat family.",
      },
      {
        question: "Can this itinerary be customised for a honeymoon?",
        answer:
          "Yes — we regularly upgrade this route with candlelight dinners, room décor, and premium houseboats. Mention 'honeymoon' in your enquiry and our designer will share options.",
      },
    ],
  },

  "royal-rajasthan": {
    id: "royal-rajasthan",
    tagline: "Forts that touch the clouds, lakes that mirror palaces, and dunes that glow at dusk.",
    overview:
      "Thirteen days across the land of kings — from Jaipur's pink façades to Udaipur's shimmering lakes, Jodhpur's blue lanes beneath Mehrangarh, and a night under the stars in the Thar desert outside Jaisalmer. This is our most complete Rajasthan circuit, balancing grand forts and palace museums with slow evenings in havelis, bazaar walks, and folk performances around the campfire.",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&q=80&w=2000",
    gallery: [
      {
        image: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&q=80&w=1200",
        caption: "Palaces of the Pink City",
      },
      {
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200",
        caption: "The Taj Mahal — optional Agra extension",
      },
      {
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
        caption: "Desert skylines and golden light",
      },
      {
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200",
        caption: "Heritage architecture at every turn",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Jaipur",
        description:
          "Welcome to the Pink City. Evening aarti at Birla Mandir and a first taste of Rajasthani thali at a rooftop restaurant overlooking the old city.",
        meals: "Dinner",
        stay: "Jaipur",
      },
      {
        day: 2,
        title: "Amber Fort & City Palace",
        description:
          "Morning at Amber Fort with its mirror-work Sheesh Mahal, then City Palace, Jantar Mantar observatory, and the iconic Hawa Mahal photo stop.",
        meals: "Breakfast, Dinner",
        stay: "Jaipur",
      },
      {
        day: 3,
        title: "Jaipur Bazaars & Block Printing",
        description:
          "A slower day: hand-block printing workshop in Sanganer, gem and jootis shopping in Johari Bazaar, and sunset from Nahargarh Fort's ramparts.",
        meals: "Breakfast, Dinner",
        stay: "Jaipur",
      },
      {
        day: 4,
        title: "Jaipur to Pushkar",
        description:
          "Drive to the holy town of Pushkar. Circle the sacred lake's 52 ghats and visit one of the world's very few Brahma temples.",
        meals: "Breakfast, Dinner",
        stay: "Pushkar",
      },
      {
        day: 5,
        title: "Pushkar to Udaipur via Chittorgarh",
        description:
          "Cross the Aravallis with a stop at Chittorgarh Fort — Asia's largest fort complex and stage of Rajasthan's most stirring legends — before reaching the City of Lakes.",
        meals: "Breakfast, Dinner",
        stay: "Udaipur",
      },
      {
        day: 6,
        title: "Udaipur City Palace & Lake Pichola Cruise",
        description:
          "Tour the sprawling City Palace, then board an evening cruise on Lake Pichola past the Lake Palace, docking at Jag Mandir for sunset.",
        meals: "Breakfast, Dinner",
        stay: "Udaipur",
      },
      {
        day: 7,
        title: "Udaipur at Leisure — Sahelion Ki Bari",
        description:
          "Morning at the Garden of Maidens and the vintage car museum; the afternoon is yours for café-hopping in the old city's art-filled lanes.",
        meals: "Breakfast, Dinner",
        stay: "Udaipur",
      },
      {
        day: 8,
        title: "Udaipur to Jodhpur via Ranakpur",
        description:
          "Pause at the 1,444 uniquely carved marble pillars of Ranakpur Jain Temple before arriving in the Blue City by evening.",
        meals: "Breakfast, Dinner",
        stay: "Jodhpur",
      },
      {
        day: 9,
        title: "Mehrangarh Fort & the Blue Lanes",
        description:
          "Explore mighty Mehrangarh and Jaswant Thada, then walk the indigo lanes below the fort and haggle for spices at the Clock Tower market.",
        meals: "Breakfast, Dinner",
        stay: "Jodhpur",
      },
      {
        day: 10,
        title: "Jodhpur to Jaisalmer",
        description:
          "Head deep into the Thar. Evening arrival in the Golden City with a first view of Sonar Qila glowing above the town.",
        meals: "Breakfast, Dinner",
        stay: "Jaisalmer",
      },
      {
        day: 11,
        title: "Jaisalmer Fort & Havelis",
        description:
          "Wander the living fort's alleys, Patwon Ki Haveli's filigreed façades, and Gadisar Lake, before an evening of shopping in the fort bazaar.",
        meals: "Breakfast, Dinner",
        stay: "Jaisalmer",
      },
      {
        day: 12,
        title: "Sam Dunes — Desert Camp Night",
        description:
          "Camel safari over the Sam sand dunes at sunset, followed by Kalbeliya folk dance, live music, and dinner under the stars at our desert camp.",
        meals: "Breakfast, Dinner",
        stay: "Desert Camp, Sam",
      },
      {
        day: 13,
        title: "Departure via Jodhpur",
        description:
          "After a desert sunrise, transfer to Jodhpur airport (or extend to Agra & the Taj Mahal — ask our planners).",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "12 nights in heritage havelis, 4★ hotels & a premium desert camp",
      "Daily breakfast and dinner",
      "Air-conditioned SUV with chauffeur for the full circuit",
      "Lake Pichola shared boat cruise",
      "Camel safari at Sam dunes with folk evening",
      "Local guides at Jaipur, Udaipur, Jodhpur & Jaisalmer",
      "All monument parking, tolls & taxes",
    ],
    exclusions: [
      "Flights / trains to Jaipur and from Jodhpur",
      "Monument entry tickets (payable directly, ~₹2,500 pp)",
      "Lunches and drinks",
      "Camera fees at monuments",
      "Tips, laundry & personal expenses",
    ],
    bestTime: "October – March",
    startingPoint: "Jaipur Airport (JAI)",
    groupSize: "2 – 12 guests",
    themes: ["Heritage", "Forts & Palaces", "Desert Safari", "Photography"],
    faqs: [
      {
        question: "How much driving is involved between cities?",
        answer:
          "Legs range from 3 to 6 hours on good highways, always broken with meal and monument stops. The longest day (Jodhpur–Jaisalmer) is about 5.5 hours.",
      },
      {
        question: "What is the desert camp like — is it comfortable?",
        answer:
          "We use premium Swiss-tent camps with attached western bathrooms, proper beds, and electricity. It's a full glamping experience, not a rough campsite.",
      },
      {
        question: "Can we add Agra and the Taj Mahal?",
        answer:
          "Yes — a popular 2-night extension adds Agra and Fatehpur Sikri at the start of the trip. Ask for the 15-day 'Royal Rajasthan + Taj' variant when you enquire.",
      },
    ],
  },

  "singapore-malaysia": {
    id: "singapore-malaysia",
    tagline: "A garden city of supertrees, night safaris, and island thrills — visa-easy and family-perfect.",
    overview:
      "Ten effortless days in Asia's most polished city-state. Watch the Supertrees light up at Gardens by the Bay, scream through Universal Studios' rides, cable-car into Sentosa for beaches and the S.E.A. Aquarium, and meet nocturnal wildlife on the world's first Night Safari. With English spoken everywhere, spotless transit, and hawker food courts on every corner, this is the easiest international holiday you'll ever take.",
    heroImage:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=2000",
    gallery: [
      {
        image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=1200",
        caption: "Marina Bay Sands and the city skyline",
      },
      {
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200",
        caption: "Gardens by the Bay after dark",
      },
      {
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
        caption: "Futuristic skylines all around",
      },
      {
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200",
        caption: "Temples and old quarters between the towers",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Singapore — Jewel Changi",
        description:
          "Land at Changi and walk straight into Jewel's 40-metre indoor Rain Vortex waterfall. Evening check-in and a riverside dinner at Clarke Quay.",
        meals: "Dinner",
        stay: "Singapore",
      },
      {
        day: 2,
        title: "City Tour & Gardens by the Bay",
        description:
          "Half-day city orientation — Merlion Park, Chinatown, Little India — then an evening among the Supertrees with the Garden Rhapsody light show.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 3,
        title: "Universal Studios Singapore",
        description:
          "A full day of movie-themed rides across seven zones, from Transformers: The Ride to Revenge of the Mummy. Park-hopper tips from our concierge included.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 4,
        title: "Sentosa by Cable Car",
        description:
          "Glide into Sentosa on the Mount Faber cable car. S.E.A. Aquarium, Skyline Luge, and golden hour at Siloso Beach, ending with the Wings of Time show.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 5,
        title: "Night Safari & Free Morning",
        description:
          "A slow morning for Orchard Road shopping, then the world-famous Night Safari — tram ride plus walking trails through nocturnal habitats.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 6,
        title: "Gardens, Museums or Shopping — Your Pick",
        description:
          "A flexible day: ArtScience Museum and the National Gallery, a Singapore Flyer spin, or Bugis Street bargains. Our concierge books whatever you fancy.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 7,
        title: "Day Cruise to Lazarus & St John's Islands",
        description:
          "Escape the city on a southern-islands hop — swim at Lazarus's crescent beach, one of Singapore's best-kept secrets.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 8,
        title: "Singapore Zoo & River Wonders",
        description:
          "Breakfast-with-orangutans option at the world's best rainforest zoo, then boat rides past giant pandas and Amazon manatees at River Wonders.",
        meals: "Breakfast",
        stay: "Singapore",
      },
      {
        day: 9,
        title: "Hawker Trail & Marina Bay Sunset",
        description:
          "A guided food crawl through Michelin-starred hawker stalls — chicken rice, laksa, chilli crab — capped with skyline views from Marina Barrage.",
        meals: "Breakfast, Dinner",
        stay: "Singapore",
      },
      {
        day: 10,
        title: "Departure",
        description:
          "Last-minute Jewel shopping before your flight home, with early check-in assistance at Changi if your airline allows.",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "9 nights in a centrally located 4★ hotel",
      "Daily breakfast + welcome & farewell dinners",
      "Universal Studios one-day pass",
      "Gardens by the Bay (both conservatories) tickets",
      "Sentosa cable car, S.E.A. Aquarium & Wings of Time",
      "Night Safari with tram ride",
      "Airport transfers & all tours in air-conditioned coach",
    ],
    exclusions: [
      "International airfare",
      "Singapore visa fee (we assist with documentation)",
      "Lunches and most dinners — hawker budget recommended",
      "Southern islands cruise (optional add-on)",
      "Travel insurance & personal expenses",
    ],
    bestTime: "Year-round (February – April is driest)",
    startingPoint: "Changi Airport (SIN)",
    groupSize: "2 – 24 guests",
    themes: ["Family", "Theme Parks", "City Break", "Food Trail"],
    faqs: [
      {
        question: "Do Indian passport holders need a visa for Singapore?",
        answer:
          "Yes. We assist with the complete e-visa documentation; processing typically takes 3–5 working days. Apply at least 3 weeks before travel to be safe.",
      },
      {
        question: "Is this a good trip for young children?",
        answer:
          "It's our most family-friendly international package — short transfers, stroller-friendly attractions, and hotels chosen near MRT stations. Kids under 4 travel at a reduced rate.",
      },
      {
        question: "How much spending money should we budget?",
        answer:
          "Plan roughly SGD 40–60 per person per day for lunches, dinners, and small purchases. Hawker centres keep excellent meals under SGD 8.",
      },
    ],
  },

  "kerala-backwaters": {
    id: "kerala-backwaters",
    tagline: "Tea hills, spice gardens, and a night adrift on the backwaters of God's Own Country.",
    overview:
      "Seven unhurried days through Kerala's green heart. Wake to mist rolling over Munnar's tea terraces, spot elephants across Periyar's lake in Thekkady, then board a traditional kettuvallam houseboat for a night drifting Alleppey's palm-fringed canals — freshly cooked Karimeen fish on deck as paddy fields slip past. The trip closes in Fort Kochi among colonial lanes, Chinese fishing nets, and a Kathakali performance.",
    heroImage:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=2000",
    gallery: [
      {
        image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200",
        caption: "Tea gardens draped over Munnar's hills",
      },
      {
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=1200",
        caption: "A kettuvallam gliding the Alleppey canals",
      },
      {
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1200",
        caption: "Backwater life at its own pace",
      },
      {
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        caption: "Golden evenings on the Malabar coast",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive at Kochi — Drive to Munnar",
        description:
          "Meet your chauffeur at Kochi airport and climb into the Western Ghats past waterfalls and rubber estates. Evening tea overlooking the plantations.",
        meals: "Dinner",
        stay: "Munnar",
      },
      {
        day: 2,
        title: "Munnar Tea Trails & Eravikulam",
        description:
          "Morning at Eravikulam National Park looking for the endangered Nilgiri tahr, then a tea-factory tour, Mattupetty Dam, and Echo Point.",
        meals: "Breakfast, Dinner",
        stay: "Munnar",
      },
      {
        day: 3,
        title: "Munnar to Thekkady — Spice Country",
        description:
          "Wind through cardamom hills to Thekkady. Afternoon guided spice-plantation walk — pepper vines, vanilla, nutmeg — and an optional Kalaripayattu martial-arts show.",
        meals: "Breakfast, Dinner",
        stay: "Thekkady",
      },
      {
        day: 4,
        title: "Periyar Lake & Bamboo Rafting",
        description:
          "Early boat ride on Periyar Lake scanning the banks for elephants and bison, with an optional bamboo-rafting or nature-walk upgrade inside the reserve.",
        meals: "Breakfast, Dinner",
        stay: "Thekkady",
      },
      {
        day: 5,
        title: "Alleppey Houseboat — Backwater Cruise",
        description:
          "Descend to sea level and board your private houseboat by noon. Cruise past paddy fields, village jetties, and coir workshops; dinner and overnight anchored mid-lake.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Houseboat, Alleppey",
      },
      {
        day: 6,
        title: "Alleppey to Fort Kochi",
        description:
          "Disembark after breakfast for Fort Kochi — Chinese fishing nets, St. Francis Church, Jew Town's antique shops — and an evening Kathakali performance.",
        meals: "Breakfast, Dinner",
        stay: "Kochi",
      },
      {
        day: 7,
        title: "Departure from Kochi",
        description:
          "Morning free for a Marine Drive stroll or last-minute spice shopping before your airport transfer.",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "5 nights in 3★/4★ resorts + 1 night private deluxe houseboat",
      "Daily breakfast & dinner; all meals aboard the houseboat",
      "Private air-conditioned car with chauffeur throughout",
      "Periyar Lake boat safari tickets",
      "Guided spice plantation walk at Thekkady",
      "Kathakali show tickets at Kochi",
      "All tolls, parking, fuel & taxes",
    ],
    exclusions: [
      "Flights to/from Kochi",
      "Lunches (except on the houseboat)",
      "Eravikulam National Park entry (seasonal, payable directly)",
      "Ayurvedic spa treatments & optional activities",
      "Personal expenses & tips",
    ],
    bestTime: "September – March",
    startingPoint: "Kochi Airport (COK)",
    groupSize: "2 – 16 guests",
    themes: ["Backwaters", "Hill Stations", "Wildlife", "Honeymoon"],
    faqs: [
      {
        question: "Is the houseboat private or shared?",
        answer:
          "Private — each booking gets its own kettuvallam with a dedicated crew of captain, chef, and deckhand. One-bedroom to five-bedroom boats are available for groups.",
      },
      {
        question: "What food is served on the houseboat?",
        answer:
          "A traditional Kerala menu cooked fresh on board: rice, thoran, sambar, and the day's catch — usually pearl-spot fish. Continental and Jain options are available on request.",
      },
      {
        question: "Does this itinerary work during the monsoon?",
        answer:
          "Yes, with caveats — the hills are at their greenest June–August and rates drop, but Periyar boat rides can be suspended in heavy rain. Many guests deliberately choose monsoon for Ayurveda.",
      },
    ],
  },

  "thailand-getaway": {
    id: "thailand-getaway",
    tagline: "Gilded temples, floating markets, and the turquoise coves of the Andaman Sea.",
    overview:
      "Eight days that pack in three Thailands: the gold-spired temples and street food of Bangkok, the coral islands and cabaret nights of Pattaya, and Phuket's beach-resort finale with a longtail-boat day trip to the limestone cliffs of Phi Phi. Flights between coasts keep road time short so beach time stays long.",
    heroImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000",
    gallery: [
      {
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200",
        caption: "Longtail boats in a turquoise cove",
      },
      {
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200",
        caption: "Bangkok's gilded temple spires",
      },
      {
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        caption: "Beach days on the Andaman coast",
      },
      {
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
        caption: "Island-hopping horizons",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Bangkok",
        description:
          "Touch down at Suvarnabhumi and transfer to your riverside hotel. Evening free — we recommend a Chao Phraya dinner cruise past the illuminated Grand Palace.",
        meals: "—",
        stay: "Bangkok",
      },
      {
        day: 2,
        title: "Grand Palace & Temple Circuit",
        description:
          "Guided morning through the Grand Palace, Wat Phra Kaew's Emerald Buddha, and reclining-Buddha Wat Pho, then a longtail ride through Thonburi's canals.",
        meals: "Breakfast",
        stay: "Bangkok",
      },
      {
        day: 3,
        title: "Floating Market — Transfer to Pattaya",
        description:
          "Early visit to Damnoen Saduak floating market, paddling between boats piled with mangoes and pad thai, then a 2-hour drive to Pattaya for sunset at the beachfront.",
        meals: "Breakfast",
        stay: "Pattaya",
      },
      {
        day: 4,
        title: "Coral Island Cruise",
        description:
          "Speedboat to Koh Larn (Coral Island) for a day of clear-water swimming, parasailing, and banana-boat rides, with a Thai seafood lunch on the beach.",
        meals: "Breakfast, Lunch",
        stay: "Pattaya",
      },
      {
        day: 5,
        title: "Fly to Phuket — Beach Evening",
        description:
          "Morning flight across to the Andaman coast. Check into your Patong-area resort and unwind with a sunset stroll and beachfront dinner.",
        meals: "Breakfast",
        stay: "Phuket",
      },
      {
        day: 6,
        title: "Phi Phi Islands Day Trip",
        description:
          "Full-day speedboat adventure to Maya Bay, Monkey Beach, and Pileh Lagoon, with snorkelling stops over coral gardens and lunch on Phi Phi Don.",
        meals: "Breakfast, Lunch",
        stay: "Phuket",
      },
      {
        day: 7,
        title: "Phuket Your Way",
        description:
          "Free day: Big Buddha and Old Town's Sino-Portuguese streets, an elephant sanctuary visit, or simply a beach chair and a good book. Farewell dinner with the group.",
        meals: "Breakfast, Dinner",
        stay: "Phuket",
      },
      {
        day: 8,
        title: "Departure from Phuket",
        description:
          "Transfer to Phuket International for your flight home — or ask us about extending to Krabi's cliffs.",
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "7 nights in 4★ hotels & beach resorts",
      "Daily breakfast + meals as listed",
      "Bangkok temples tour with English-speaking guide",
      "Coral Island speedboat cruise with lunch",
      "Phi Phi Islands day trip with snorkelling gear & lunch",
      "Bangkok–Phuket domestic flight",
      "All airport & hotel transfers",
    ],
    exclusions: [
      "International airfare",
      "Thailand visa-on-arrival fee (if applicable)",
      "Most lunches & dinners",
      "Water-sports beyond listed activities",
      "Travel insurance & personal expenses",
    ],
    bestTime: "November – April",
    startingPoint: "Bangkok Suvarnabhumi (BKK)",
    groupSize: "2 – 20 guests",
    themes: ["Beaches", "Islands", "Nightlife", "Adventure"],
    faqs: [
      {
        question: "Do we need a visa for Thailand?",
        answer:
          "Indian passport holders currently enjoy visa-free entry for short tourist stays (verify at booking, as policies change). We share the latest requirements and help with any paperwork.",
      },
      {
        question: "Is the Phi Phi trip suitable for non-swimmers?",
        answer:
          "Yes — life jackets are mandatory on board, snorkelling is optional and always guided, and several stops are pure beach time. The crossing can be choppy; motion-sickness tablets are advised.",
      },
      {
        question: "Can couples get a private version of this tour?",
        answer:
          "Absolutely. The same route runs as a private package with your own car and guide at a small supplement — popular with honeymooners who add a Krabi extension.",
      },
    ],
  },
};

export const getFullPackage = (id: string): FullPackage | undefined => {
  const base = featuredPackages.find((pkg) => pkg.id === id);
  const detail = details[id];
  if (!base || !detail) return undefined;
  return { ...base, ...detail };
};

export const getAllPackageIds = (): string[] =>
  featuredPackages.filter((pkg) => details[pkg.id]).map((pkg) => pkg.id);

export const getRelatedPackages = (id: string, count = 3): TourPackage[] =>
  featuredPackages.filter((pkg) => pkg.id !== id).slice(0, count);
