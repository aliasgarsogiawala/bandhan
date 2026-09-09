export interface Destination {
  id: string;
  name: string;
  image: string;
  price: string;
  description: string;
  tag?: string;
  country?: string;
  region?: string;
  duration?: string;
  bestTime?: string;
  highlights?: string[];
  gallery?: string[];
  isFeatured?: boolean;
  tagline?: string;
  overview?: string;
  startingPoint?: string;
  groupSize?: string;
  themes?: string[];
  characterTitle?: string;
  planningTitle?: string;
  planningDescription?: string;
  planningPoints?: string[];
  experiences?: DestinationExperience[];
  route?: DestinationRouteStop[];
  seasons?: DestinationSeason[];
  designerNotes?: string[];
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: PackageFaq[];
  status?: "draft" | "active";
}

export interface DestinationExperience {
  title: string;
  description: string;
}

export interface DestinationRouteStop {
  label: string;
  title: string;
  description: string;
}

export interface DestinationSeason {
  title: string;
  detail: string;
}

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

export interface PackageGalleryImage {
  image: string;
  caption: string;
  /** True on stand-in artwork padded in by `lib/placeholderImages`. */
  placeholder?: boolean;
}

export interface PackageAddon {
  id: string;
  title: string;
  description?: string;
  price: number;
  pricing: "per-person" | "per-booking";
}

export interface PackagePricing {
  adultPrice: number;
  childWithBedPrice: number;
  childWithoutBedPrice: number;
  infantPrice: number;
  singleRoomSupplement: number;
  depositPercent: number;
  quoteValidityDays: number;
  addons: PackageAddon[];
}

export const PACKAGE_SERVICE_KEYS = ["hotel", "meals", "flights", "sightseeing", "transfer", "visa"] as const;
export type PackageServiceKey = (typeof PACKAGE_SERVICE_KEYS)[number];

/** Detailed service notes shown in the package inclusion tabs. */
export interface PackageServiceDetails {
  kind: PackageServiceKey;
  items: string[];
}

export interface TourPackage {
  id: string;
  title: string;
  image: string;
  duration: string;
  price: string;
  highlights: string[];
  category: string;
  /** Primary destination label used by catalogue filtering and quotations. */
  destination?: string;
  /** Overlapping commercial collections; geographic category remains separate. */
  travelStyles?: TravelStyle[];
  isPopular?: boolean;
  tagline?: string;
  overview?: string;
  heroImage?: string;
  bestTime?: string;
  startingPoint?: string;
  groupSize?: string;
  themes?: string[];
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  serviceDetails?: PackageServiceDetails[];
  gallery?: PackageGalleryImage[];
  faqs?: PackageFaq[];
  pricing?: PackagePricing;
  status?: "draft" | "active";
}

export type TravelStyle = "group" | "customized" | "seasonal" | "special-departure";

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  stat?: string;
  iconName: "experience" | "happy" | "planning" | "support";
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  destination: string;
  review: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  location: string;
  title: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // body; blank lines separate paragraphs
  coverImage: string;
  author: string;
  category: string;
  readTime: string;
  date: string; // display string, e.g. "20 Jul 2026"
  isPublished: boolean;
}

export const destinations: Destination[] = [
  {
    id: "kashmir",
    name: "Kashmir",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1400",
    price: "₹34,500",
    description: "Heaven on Earth - experience pristine lakes, snow-capped peaks, and houseboats.",
    tag: "Romantic",
  },
  {
    id: "kerala",
    name: "Kerala",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1400",
    price: "₹28,000",
    description: "God's Own Country - drift through green backwaters and spice plantations.",
    tag: "Nature",
  },
  {
    id: "goa",
    name: "Goa",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1400",
    price: "₹18,500",
    description: "Sun-drenched beaches, historical churches, and vibrant coastal night life.",
    tag: "Beach",
  },
  {
    id: "bali",
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1400",
    price: "₹65,000",
    description: "Tropical paradise loaded with cultural heritage, temples, and reefs.",
    tag: "Exotic",
  },
  {
    id: "dubai",
    name: "Dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=1400",
    price: "₹78,000",
    description: "Sleek architecture, futuristic malls, and thrilling desert adventures.",
    tag: "Luxury",
  },
  {
    id: "thailand",
    name: "Thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1400",
    price: "₹48,500",
    description: "Fascinating Buddhist temples, exotic street food, and islands.",
    tag: "Adventure",
  },
  {
    id: "europe",
    name: "Europe",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1400",
    price: "₹1,85,000",
    description: "Timeless history, iconic architectural marvels, and diverse cultures.",
    tag: "Heritage",
  },
  {
    id: "singapore",
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1400",
    price: "₹82,000",
    description: "Ultra-modern garden city featuring advanced technology and luxury lifestyles.",
    tag: "Modern",
  },
];

const packageCatalogue: TourPackage[] = [
  {
    id: "bali-island-dreams",
    title: "Bali – The Island of Dreams (4N Kuta | 2N Ubud)",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹61,900",
    highlights: [
      "Explore the best of Kuta, Ubud & Nusa Penida",
      "Traditional Balinese Welcome with Garland",
      "Tanjung Benoa Water Sports (Jet Ski, Banana Boat & Couple Parasailing)",
      "Uluwatu Temple Sunset Tour",
      "Kecak Fire Dance Performance",
      "Full-Day West Nusa Penida Island Tour by Speedboat",
      "Visit Kelingking Beach, Broken Beach, Angel's Billabong & Crystal Bay",
      "Ulun Danu Beratan Temple",
      "Handara Gate Photo Stop",
      "Tanah Lot Sea Temple",
      "Tirta Gangga Water Palace",
      "Mount Batur View Point, Kintamani",
      "Tegenungan Waterfall",
      "Bali Jungle Swing Experience",
      "Batik Factory & Celuk Village Visit",
      "Balinese Coffee Plantation",
      "Ubud Art Market",
    ],
    category: "International",
    isPopular: true,
    tagline: "4N Kuta | 2N Ubud · 6N/7D · Fixed Departures from Sep to Apr",
    overview:
      "Explore the best of Bali across 4 nights in Kuta and 2 nights in Ubud. Highlights include water sports at Tanjung Benoa, Uluwatu sunset with Kecak Fire Dance, a full-day speedboat excursion to West Nusa Penida (Kelingking Beach, Broken Beach, Angel's Billabong & Crystal Bay), North & West Bali sightseeing (Ulun Danu Beratan, Handara Gate, Tanah Lot), Tirth Ganga Temple, Mount Batur viewpoint at Kintamani, Tegenungan Waterfall, and the Bali Jungle Swing.\n\nTour Departure Dates: Sep 17, 21 | Oct 7, 22 | Nov 6 | Feb 2, 16 | Mar 4, 24, 26 | Apr 1, 18.",
    heroImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to April",
    startingPoint: "Ngurah Rai International Airport (DPS), Denpasar (Expected arrival time: 16:40 PM)",
    groupSize: "Min 25 pax for quoted rate",
    themes: ["Beach", "Culture", "Adventure"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1800", caption: "Kuta and Ubud, Bali" },
      { image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800", caption: "Island-hopping to Nusa Penida" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali",
        description:
          "Upon arrival at Ngurah Rai International Airport (DPS),(Expected arrival time 16:40pm), Meet our representative. Welcome with Garland on arrival. A one-way private transfer will be arranged from the airport to the hotel in Kuta. Later check-in at hotel (Check in at 02:00pm). Rest day for leisure. Overnight stay at Kuta. (L-D)",
        meals: "Lunch, Dinner",
        stay: "Kuta",
      },
      {
        day: 2,
        title: "Benoa Water Sports – Uluwatu Temple – Kecak Dance",
        description:
          "Morning breakfast at the hotel. Visit Tanjung Benoa for a day of water sports (1x Jet ski, 1x Banana Boat Ride & 1x Couple Parasailing). Later proceed to Uluwatu Temple for a beautiful sunset. Explore the temple and surrounding areas, and witness a stunning sunset. In the evening, enjoy the iconic Kecak Dance, a traditional Balinese performance featuring rhythmic chanting and a captivating fire display. Overnight stay at Kuta. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuta",
      },
      {
        day: 3,
        title: "West Nusa Penida Day Tour",
        description:
          "Breakfast at the hotel. Transfer to Sanur Harbor. Speed boat transfer to Nusa Penida Island. West Nusa Penida Highlights: Kelingking Beach, Broken Beach, Angel's Billabong, Crystal Bay. Local snack lunch included. Return by speed boat to Bali. Transfer back to hotel. Overnight stay in Kuta. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuta",
      },
      {
        day: 4,
        title: "Ulun Danu – Handara Gate – Tanah Lot",
        description:
          "After breakfast, Full-day North & West Bali sightseeing: Ulun Danu Beratan Temple (Floating temple on Lake Beratan), Handara Gate (Iconic photo stop), Tanah Lot Temple (Famous sea temple, best for sunset views). Return to hotel. Overnight stay in Kuta. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuta",
      },
      {
        day: 5,
        title: "Tirth Ganga Temple Visit & Leisure Day",
        description:
          "After breakfast, visit the sacred Tirth Ganga Temple and explore its serene surroundings. Spend some time enjoying the peaceful atmosphere and scenic views. The rest of the day is at leisure for personal activities, relaxation, or independent exploration. Overnight stay at the hotel. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuta",
      },
      {
        day: 6,
        title: "Kintamani – Tegenungan Waterfall – Bali Swing – Ubud",
        description:
          "Breakfast at the hotel. Full-day tour covering: Mount Batur Viewing Point, Visit to Batik Factory, Celuk Village (Gold & Silver handicrafts), Coffee Plantation (Balinese coffee tasting), Ubud Art Market, Bali Jungle Swing. Return to hotel. Overnight stay in Ubud. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Ubud",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "After breakfast, check out from the hotel and transfer to I Gusti Ngurah Rai International Airport for your onward flight. (Expected departure time: 6:00PM). Depart with wonderful memories of your Bali holiday. See you again! (B-L)",
        meals: "Breakfast, Lunch",
        stay: "—",
      },
    ],
    inclusions: [
      "Welcome by Garland",
      "3-star hotel accommodation on double sharing basis",
      "Daily continental Breakfast at Hotel",
      "Lunch and Dinner at Indian restaurant with Veg /non-veg set menu",
      "Daily 1 bottle of mineral water per person during the tour",
      "Water sport activities (1x Jet ski, 1x Banana Boat Ride & 1x Couple Parasailing)",
      "Sightseeing as mentioned above",
      "Tirth Ganga Temple",
      "Bali Swing",
      "Bali visa",
      "Ubud Tour",
      "English speaking Guide above 20 persons",
      "Indian Tour Leader above 20 persons throughout the tour",
      "Complimentary travel insurance up to 59 years of age",
      "All Tours & Transfer on Private Basis",
    ],
    exclusions: [
      "Any Airfare",
      "Airport charges",
      "5% GST & 2% TCS",
      "Beverages and other meals are not mentioned above.",
      "Cost of pre or post tour hotel accommodation",
      "Tips and porter charges",
      "Expenses of personal nature such as other taxes, drinks, telephone, shopping, snacks, Porterage and laundry bills etc.",
      "Any additional expenses incurred due to any flight delay or cancellation, weather conditions, political closures, technical faults etc.",
    ],
    faqs: [
      {
        question: "What is the total tour cost and room sharing pricing?",
        answer:
          "The tour cost is based on a minimum of 25 pax:\n• Double sharing basis: ₹61,900/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹76,900/- + 5% GST + 2% TCS per person\n• Triple sharing basis: ₹60,900/- + 5% GST + 2% TCS per person\n• Child with bed: ₹59,900/- + 5% GST + 2% TCS\n• Child without bed: ₹38,900/- + 5% GST + 2% TCS\n• Child below 3 years: Complimentary",
      },
      {
        question: "What are the confirmed tour departure dates?",
        answer:
          "Tour Departure Dates: Sep 17, 21 | Oct 7, 22 | Nov 6 | Feb 2, 16 | Mar 4, 24, 26 | Apr 1, 18.",
      },
      {
        question: "What are the passport, visa, and flight reporting guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid tourist visa is mandatory (Bali visa is included). Report at the airport at least 3 hours before the scheduled departure of your international flight. Standard hotel check-in is 2:00 PM and check-out is 12:00 PM.",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "A 50% advance payment is required to confirm booking, with the remaining balance due at least 15 days prior to departure.\n\nCancellation charges prior to departure:\n• 121 to 900 days: 10%\n• 91 to 120 days: 15%\n• 61 to 90 days: 20%\n• 46 to 60 days: 30%\n• 31 to 45 days: 40%\n• 21 to 30 days: 50%\n• 11 to 20 days: 75%\n• 0 to 10 days: 100%\nVisa fees, airfare, travel insurance, and non-refundable services apply in addition.",
      },
    ],
  },
  {
    id: "3-sisters-tour",
    title: "3 Sisters Tour (Assam • Meghalaya • Arunachal Pradesh)",
    image: "/pdf-assets/kanchenjunga-darjeeling.jpg",
    duration: "11 Nights / 12 Days",
    price: "₹57,000",
    highlights: [
      "Maa Kamakhya Devi Temple",
      "Umiam Lake Viewpoint",
      "Don Bosco Museum & Ward's Lake",
      "Mawlynnong Village & Living Root Bridge",
      "Dawki River & Suspension Bridge",
      "Cherrapunjee: Nohkalikai Falls & Seven Sisters Falls",
      "Mawsmai Caves & Garden of Caves",
      "Elephant Safari & Jeep Safari at Kaziranga National Park",
      "Assamese Cultural Bihu Dance Program",
      "Tipi Orchidarium (7,500+ orchid species)",
      "Sela Pass (13,703 ft.) & Sela Lake",
      "Tawang Monastery & Bumla Pass (China Border)",
      "Madhuri Lake / Sangetsar Lake",
      "Tawang War Memorial Light & Sound Show",
      "Nuranang (Jang) Waterfall & Jaswant Garh War Memorial",
      "Brahmaputra River Sunset Cruise",
      "Shree Sankardeva Kalakshetra",
    ],
    category: "North East",
    isPopular: true,
    tagline: "Guwahati 1N – Shillong 3N – Kaziranga 2N – Dirang 1N – Tawang 2N – Bomdila 1N – Guwahati 1N · 11N/12D",
    overview:
      "A magnificent 11 Nights / 12 Days journey across Assam, Meghalaya, and Arunachal Pradesh. Experience sacred temples, misty hill stations, Asia's cleanest village, living root bridges, wildlife safaris in Kaziranga National Park, high-altitude mountain passes including Sela Pass and Bumla Pass, iconic monasteries, cascading waterfalls, and a sunset cruise on the Brahmaputra River.\n\nDeparture Dates: Sep 24, 28 | Oct 01, 04, 12, 21, 24 | Nov 01, 04, 14, 18, 22, 26 | Dec 02, 06, 12, 18, 22.",
    heroImage: "/pdf-assets/kanchenjunga-darjeeling.jpg",
    bestTime: "September to December",
    startingPoint: "Guwahati Airport (18km / 30 min transfer)",
    groupSize: "Group departures",
    themes: ["Mountains", "Culture", "Wildlife"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800", caption: "Himalayan foothills of Arunachal Pradesh" },
      { image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=85&w=1800", caption: "Misty mornings in Meghalaya" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Guwahati by Air – Transfer to Hotel (18km/30 Min.)",
        description:
          "Upon arrival at Guwahati Airport, meet and greet with a warm traditional welcome by our representative. After checking in at the hotel and refreshing, visit the Mata Kamakhya Devi Temple for a Mukh Darshan. Return to the hotel for an overnight stay in Guwahati.",
        meals: "Dinner",
        stay: "Guwahati",
      },
      {
        day: 2,
        title: "Guwahati – Shillong by Road (99km/3 hrs.)",
        description:
          "After breakfast, proceed to Shillong, the capital of Meghalaya, also known as 'The Scotland of the East'. En route, stop at Umiam Lake Viewpoint, the largest man-made lake in Northeast India. After a 3-hour drive, arrive in Shillong and visit the Don Bosco Museum and Ward's Lake, famous for its garden walks and boating. Check in to the hotel for an overnight stay in Shillong.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Shillong",
      },
      {
        day: 3,
        title: "Shillong – Mawlynnong - Dawki – Shillong (85km/3 hrs.)",
        description:
          "After early breakfast, drive to Mawlynnong, the cleanest village in Asia. Explore the village and enjoy the Sky Walk for a spectacular view of the Living Root Bridge. After lunch, proceed to Dawki, a gateway to Bangladesh, known for its scenic drive through deep gorges. Visit the Umngot River and the suspension bridge. Return back to Shillong for an overnight stay.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Shillong",
      },
      {
        day: 4,
        title: "Shillong- Cherrapunjee - Shillong (65km/2 hrs.)",
        description:
          "After breakfast, drive to Cherrapunjee, known as the wettest place in the world. Enjoy a 1.5-hour scenic drive through pine trees and mist. Visit Nohkalikai Falls, Seven Sisters Falls, Mawsmai Caves, Ramakrishna Mission, and Garden of Caves. Overnight stay in Shillong.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Shillong",
      },
      {
        day: 5,
        title: "Shillong – Kaziranga National Park (230km/6hrs.)",
        description:
          "After breakfast, drive to Kaziranga National Park, home to the world's largest population of one-horned rhinoceroses, along with tigers, elephants, panthers, and birds. Declared a UNESCO World Heritage Site in 1985, it boasts a unique natural environment. En route, visit the Maha Mrityunjay Temple in Nagaon. Overnight stay in Kaziranga.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kaziranga",
      },
      {
        day: 6,
        title: "Kaziranga National Park (Jungle Activity)",
        description:
          "Begin the day with an early morning Elephant Ride at the Western Range (Bagori). Return to the hotel for breakfast and relaxation. Later, visit the Orchid Park for an authentic Assamese lunch. Afternoon, enjoy a Jeep Safari at the Central Range (Kohora). Evening, enjoy a local cultural program. Overnight stay in Kaziranga.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kaziranga",
      },
      {
        day: 7,
        title: "Kaziranga National Park – Dirang (225km/6 hrs.)",
        description:
          "After breakfast, visit a nearby tea garden. Later, drive to Dirang. En route, visit the Tipi Orchidarium, home to a glasshouse with over 7,500 species of orchids. Overnight stay in Dirang.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Dirang",
      },
      {
        day: 8,
        title: "Dirang – Tawang (143km/7 hrs.)",
        description:
          "After breakfast, enjoy the scenic views of the beautiful valleys and rivers of Dirang. Later, drive to Tawang via the breathtaking Sela Pass (13,703 ft.) and spend some time at the picturesque Sela Lake. On arrival, check in to the hotel. Overnight stay in Tawang.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Tawang",
      },
      {
        day: 9,
        title: "Tawang (Bumla Pass Excursion)",
        description:
          "After breakfast, proceed for an excursion to Bumla Pass (India–China Border) and Madhuri Lake, offering breathtaking views of the surrounding valleys. In the evening, enjoy the Light and Sound Show at the Tawang War Memorial. Later, enjoy free time for shopping and leisure at your own. Overnight stay in Tawang.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Tawang",
      },
      {
        day: 10,
        title: "Tawang – Bomdila (180km/6hrs.)",
        description:
          "After breakfast, visit the famous Tawang Monastery, one of the largest monasteries in India, founded in the 17th century. Later, drive to Jang to witness the breathtaking Nuranang (Jang) Waterfall. En route, pay homage at the Jaswant Garh War Memorial. Continue your drive to Bomdila. Evening free for shopping and leisure. Overnight stay in Bomdila.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bomdila",
      },
      {
        day: 11,
        title: "Bomdila – Guwahati (280km/7.30 hrs.)",
        description:
          "Early morning, check out from the Hotel, en route breakfast and proceed to Guwahati. On Arrival, enjoy a river cruise on the mighty Brahmaputra, check in to the hotel, and overnight stay in Guwahati.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Guwahati",
      },
      {
        day: 12,
        title: "Guwahati Airport",
        description:
          "After breakfast, visit the Sri Shankardeva Kalakshetra, a cultural centre showcasing the rich heritage and traditions of Assam. Check out from the hotel and proceed to Guwahati Airport for your onward journey. Tour ends with wonderful memories.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "All Accommodation 3* Premium Hotels on double sharing basis and as per itinerary",
      "Breakfast, Lunch & Dinner",
      "Daily 1 Lt. water bottle per person",
      "Travel Insurance",
      "Dawki River Boating",
      "Thrilling Jeep Safari & Elephant Safari at Kaziranga",
      "Brahmaputra River Cruise",
      "All Entry Fees",
      "Inner Line Permit (ILP)",
      "Bumla Pass / China Border & Madhuri Lake visit by Sumo / Bolero Car",
      "Cultural Bihu Dance Program at Kaziranga National Park",
      "All applicable Transfers & Sightseeing by A/C Force Urbania (A/C does not work in hilly area) vehicle exclusively for guests with all driver allowance & parking fees",
    ],
    exclusions: [
      "Airfare / Train Fare",
      "Any expenses of personal nature like tips, laundry, camera fees, etc.",
      "Any services not specifically mentioned in inclusions",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Sharing: ₹57,000/- + 5% GST per person\n• Extra Mattress: ₹50,000/- + 5% GST\n• Child No Bed (5 - 12 yrs): ₹45,000/- + 5% GST\n• Single Occupancy: ₹70,500/- + 5% GST",
      },
      {
        question: "What are the departure dates for the 3 Sisters Tour?",
        answer:
          "Departure Dates:\n• Sep: 24, 28\n• Oct: 01, 04, 12, 21, 24\n• Nov: 01, 04, 14, 18, 22, 26\n• Dec: 02, 06, 12, 18, 22",
      },
      {
        question: "What documents and permits are required?",
        answer:
          "• Guests must carry any one original Government-issued Photo ID: Passport, Voter ID, Driving License, or Aadhaar Card.\n• Two (2) recent passport-size photographs are mandatory for permit processing.\n• Inner Line Permit (ILP) is mandatory for Arunachal Pradesh and required documents must be submitted well in advance.",
      },
      {
        question: "What are the payment terms and cancellation policy?",
        answer:
          "Payment Terms:\n• 30% booking amount required at confirmation.\n• Full balance payment must be completed 15 days prior to departure date.\n\nCancellation Policy:\n• 61 Days or more: 15% of Total tour cost\n• 46–60 Days: 25% of Total tour cost\n• 31–45 Days: 50% of Total tour cost\n• 16–30 Days: 75% of Total tour cost\n• 15 Days or less / No-show: 100% of Total tour cost",
      },
    ],
  },
  {
    id: "4-sisters-tour",
    title: "4 Sisters Tour (Nagaland • Manipur • Tripura • Mizoram)",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=85&w=1800",
    duration: "09 Nights / 10 Days",
    price: "₹59,999",
    highlights: [
      "Kohima War Cemetery & Kohima Village (Bara Basti)",
      "Khonoma Green Village & Kisama Heritage Village (Hornbill venue)",
      "Loktak Lake & Keibul Lamjao Floating National Park",
      "Indian National Army (INA) Museum & Kangla Fort",
      "Shri Govindaji Temple & Ima Keithel (All-Women's Market)",
      "Sepahijala Wildlife Sanctuary",
      "Ujjayanta Palace & Tripura Sundari Temple",
      "Neermahal Water Palace",
      "Ancient rock-cut carvings of Unakoti",
      "Mizoram State Museum & Solomon's Temple, Aizawl",
      "Durtlang Hills, KV Paradise & Sky Walk",
    ],
    category: "North East",
    tagline: "Kohima 2N – Imphal 2N – Agartala 2N – Kumarghat 1N – Aizawl 2N · 9N/10D",
    overview:
      "An adventurous 9 Nights / 10 Days journey through four captivating North Eastern sister states: Nagaland, Manipur, Tripura, and Mizoram. Explore WWII history and Khonoma green village in Kohima, the floating islands of Loktak Lake and vibrant Ima Keithel women's market in Imphal, the lakeside majesty of Neermahal and sacred temples of Agartala, ancient rock sculptures at Unakoti, and the scenic mountain vistas of Aizawl.\n\nDeparture Dates: Sep 24 | Oct 01, 08, 15, 22, 29 | Nov 05, 12, 19, 24, 26 | Dec 01, 03, 10, 17, 24.",
    heroImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to December",
    startingPoint: "Dimapur Airport (Approx. 70 KM / 2.5 hrs to Kohima)",
    groupSize: "Group departures",
    themes: ["Culture", "Heritage", "Off the beaten path"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=85&w=1800", caption: "Hills of Nagaland and Manipur" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Heritage sites of Tripura" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Dimapur – Kohima (70 Kms / 2hrs 30 Min)",
        description:
          "Arrive at Dimapur, Meet & Greet with assistance, and proceed to Kohima. On arrival, check in to hotel. Overnight stay in Kohima.",
        meals: "Dinner",
        stay: "Kohima",
      },
      {
        day: 2,
        title: "Kohima (Local Sightseeing)",
        description:
          "After breakfast, explore the key attractions of Kohima. Visit the Kohima War Cemetery, a tribute to soldiers who died in World War II, and explore Kohima Village (Bara Basti), one of largest villages in Asia. Head to Khonoma, the first green village of Nagaland, located 21 km from the city, and also stop by Kisama Heritage Village, the venue of the famed Hornbill Festival. Overnight stay in Kohima.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kohima",
      },
      {
        day: 3,
        title: "Kohima – Imphal (138 Kms / 5hrs 30 Min)",
        description:
          "Morning after breakfast depart for Imphal. Arrival and check in to hotel. Overnight stay in Imphal.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Imphal",
      },
      {
        day: 4,
        title: "Imphal (Local Sightseeing)",
        description:
          "After breakfast, proceed to sightseeing of Imphal covered with Loktak Lake, Keibul Lamjao National Park, Indian National Army Museum, Kangla Fort, Govindaji Temple and Ima Bazaar. Overnight stay in Imphal.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Imphal",
      },
      {
        day: 5,
        title: "Imphal – Agartala (by Air)",
        description:
          "After breakfast, drive to Airport for flight to Agartala. On arrival, pick up and transfer to hotel, explore the city on your own. Overnight stay in Agartala.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Agartala",
      },
      {
        day: 6,
        title: "Agartala (Local Sightseeing)",
        description:
          "After breakfast, proceed to explore Agartala covering Sepahijala Wildlife Sanctuary, Ujjayanta Palace, Tripura Sundari Temple, and Neermahal. Overnight stay in Agartala.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Agartala",
      },
      {
        day: 7,
        title: "Agartala to Kumarghat (116 kms / 3.30 hrs)",
        description:
          "After breakfast proceed to visit Unakoti, a famous heritage site known for its ancient rock-cut carvings. Later transfer to Kumarghat for an overnight stay.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kumarghat",
      },
      {
        day: 8,
        title: "Kumarghat to Aizawl (212 Kms / 6 hrs)",
        description:
          "After breakfast, depart for Aizawl. Arrival and check in to hotel. Rest for the day. Overnight stay in Aizawl.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Aizawl",
      },
      {
        day: 9,
        title: "Aizawl (Local Sightseeing)",
        description:
          "After breakfast, proceed for Aizawl sightseeing. Visit Mizoram State Museum, Solomon's Temple, Durtlang Hills, KV Paradise & Sky Walk. Overnight stay in Aizawl.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Aizawl",
      },
      {
        day: 10,
        title: "Aizawl Airport – Hometown",
        description:
          "After breakfast transfer to Aizawl Airport. Tour ends with sweet memories.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "All accommodation on double sharing as per itinerary",
      "Daily 1ltr Mineral Water per person",
      "Inner Line Permit (ILP)",
      "Breakfast, Lunch and Dinner daily",
      "All applicable Transfers & Sightseeing by exclusive private vehicle: 17-Seater Force Urbania in Nagaland & Manipur, Innova Crysta in Tripura & Mizoram (point-to-point basis)",
      "All driver allowance & parking fees",
      "Travel Insurance",
    ],
    exclusions: [
      "All airfare (including Imphal to Agartala sector)",
      "Personal expenses such as laundry, tips, telephone calls, etc.",
      "Adventure activities or optional sightseeing",
      "Any services not specifically mentioned under inclusions",
      "Expenses arising due to natural calamities, landslides, roadblocks, political disturbances, or flight delays",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Sharing: ₹59,999/- + 5% GST per person\n• Extra Mattress: ₹53,499/- + 5% GST\n• Child No Bed (5 - 12 yrs): ₹48,499/- + 5% GST\n• Single Occupancy: ₹72,999/- + 5% GST",
      },
      {
        question: "What are the departure dates for 4 Sisters Tour?",
        answer:
          "Departure Dates:\n• Sep: 24\n• Oct: 01, 08, 15, 22, 29\n• Nov: 05, 12, 19, 24, 26\n• Dec: 01, 03, 10, 17, 24",
      },
      {
        question: "What permits and documents are required for Manipur and Mizoram?",
        answer:
          "• Guests must carry any one original Government-issued Photo ID: Passport, Voter ID, Driving Licence, or Aadhaar Card.\n• Four (4) recent passport-size photographs are mandatory for permit processing.\n• Inner Line Permit (ILP) is mandatory for Manipur and Mizoram.",
      },
      {
        question: "What vehicle types are provided during the circuit?",
        answer:
          "• Nagaland & Manipur: 17-Seater Force Urbania\n• Tripura & Mizoram: Innova Crysta",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation Charges Before Departure:\n• 61 Days or more: 15% of Total tour cost\n• 46–60 Days: 25% of Total tour cost\n• 31–45 Days: 50% of Total tour cost\n• 16–30 Days: 75% of Total tour cost\n• 15 Days or less / No-show: 100% of Total tour cost",
      },
    ],
  },
  {
    id: "amazing-thailand",
    title: "Amazing Thailand — 2N Pattaya | 2N Bangkok",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
    duration: "4 Nights / 5 Days",
    price: "₹34,900",
    highlights: [
      "Explore the vibrant cities of Bangkok & Pattaya",
      "Alcazar Cabaret Show, Pattaya",
      "Coral Island Tour by Speedboat",
      "Bangkok City & Temple Tour",
      "Golden Buddha Temple (Wat Traimit)",
      "Marble Buddha Temple (Wat Benchamabophit)",
      "Gems Gallery Visit",
      "Full-Day Safari World & Marine Park",
      "Daily Breakfast, Lunch & Dinner (as per itinerary)",
      "Comfortable Hotel Accommodation",
      "Airport Transfers & Sightseeing as per Itinerary",
    ],
    category: "International",
    tagline: "2N Pattaya | 2N Bangkok · 4N/5D · Fixed Departures from Sep to Apr",
    overview:
      "A vibrant 4 Nights / 5 Days journey across Pattaya and Bangkok. Experience Pattaya's beaches, water sports at Koh Larn Coral Island, and the world-famous Alcazar Cabaret Show, paired with Bangkok's cultural landmarks including the Golden Buddha Temple (Wat Traimit), Marble Buddha Temple (Wat Benchamabophit), Gems Gallery, and a full day at Safari World & Marine Park.\n\nTour Departure Dates: Sep 1, 22 | Oct 6, 20 | Nov 2, 17 | Dec 1, 8 | Jan 1, 17 | Feb 8, 16 | Mar 8, 17 | Apr 8, 18.",
    heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to April",
    startingPoint: "Bangkok Airport (Expected Arrival Time: 10:50 AM)",
    groupSize: "Min 25 pax for quoted rate",
    themes: ["Beach", "City", "Family"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800", caption: "Pattaya coastline" },
      { image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800", caption: "Coral Island day trip" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok — Transfer to Pattaya",
        description:
          "Welcome to Thailand. From airport (Expected Arrival Time: 10:50 AM), proceed to Pattaya. Check in to the hotel and relax (check in at 2:00 PM). Pattaya is the place to go if you are looking for a night to remember. You cannot miss going to a Alcazar Show is one of the city's most famous performances. Alcazar Cabaret Show is a grand artistic delight for all music and dance lovers. See a marvelous combination of music, dance, and costume. Overnight stay at Pattaya. Note: These events draw huge crowds. To avoid missing out, we recommend guests arriving and lining up early. (L-D)",
        meals: "Lunch, Dinner",
        stay: "Pattaya",
      },
      {
        day: 2,
        title: "Coral Island Tour",
        description:
          "Today will proceed to Coral Island tour (subject to weather condition). Escape to the beautiful Koh Larn Coral Island—only a short distance off the Pattaya coast via speedboat. Have a day at your leisure, relax on the beach, or try out some fun water like banana boat ride, jet ski, swimming in the tropical water, etc. on your own expenses. (Do not forget to bring your swimwear, towel, sunglasses, and any personal essentials you may need to enjoy the water comfortably.) Time free for leisure. Overnight stay at hotel in Pattaya. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Pattaya",
      },
      {
        day: 3,
        title: "Transfer from Pattaya to Bangkok — City and Temple Tour",
        description:
          "After breakfast, check out from the hotel and proceed to Bangkok. En route, enjoy a Bangkok City & Temple Tour covering the famous Golden Buddha Temple (Wat Traimit), home to the world's largest solid gold Buddha statue, and the beautiful Marble Buddha Temple (Wat Benchamabophit), renowned for its stunning Italian marble architecture and serene atmosphere. Your tour will come to an end at Gems Gallery, the largest Jewellery store in the world. Later, transfer to the hotel for check-in. Overnight at Bangkok. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bangkok",
      },
      {
        day: 4,
        title: "Full Day Safari World and Marine Park",
        description:
          "Enjoy a visit to Bangkok Safari World, a notable Thailand zoo. Enjoy the services of a guide who introduces you to Safari World's two main attractions — the Safari Park and Marine Park. Observe lions and zebras from your vehicle during a safari tour through African-inspired landscapes; go in search of crocodiles and gorillas on a jungle cruise; and view dolphins, sea lions and orangutans on exhibit and at entertaining animal shows. Overnight at Bangkok. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bangkok",
      },
      {
        day: 5,
        title: "Departure",
        description:
          "After breakfast. check-out from the hotel. Later you will be transfer to the Airport to catch your return flight back home. See you again! (B)",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "3 Star hotel Accommodation on double/twin sharing basis",
      "Daily Breakfast at hotel",
      "Lunch, Dinner at Indian Restaurant",
      "Coral Island Tour with Lunch on SIC",
      "Thailand visa on arrival",
      "Safari World and Marine Park",
      "Sightseeing Entry tickets as mentioned in the itinerary",
      "Indian Tour Leader above 20 persons throughout the tour",
      "English speaking tour guide above 20 persons",
      "Complimentary Travel insurance up to 59 years of age",
      "All Tours & Transfer on Private Basis",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Anything not mentioned above",
      "Any Activities",
      "Cost of pre or post tour hotel accommodation",
      "Expenses of personal nature such as other taxes, drinks, telephone, shopping, snacks, Porterage and laundry bills etc.",
      "Tips and porter charges",
      "Any additional expenses incurred due to any flight delay or cancellation, weather conditions, political closures, technical faults etc.",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing pricing?",
        answer:
          "The tour cost is based on a minimum of 25 pax:\n• Double sharing basis: ₹34,900/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹47,900/- + 5% GST + 2% TCS per person\n• Triple sharing basis: ₹33,900/- + 5% GST + 2% TCS per person\n• Child with bed: ₹30,900/- + 5% GST + 2% TCS\n• Child without bed: ₹26,900/- + 5% GST + 2% TCS\n• Child below 3 years: Complimentary",
      },
      {
        question: "What are the confirmed tour departure dates?",
        answer:
          "Tour Departure Dates: Sep 1, 22 | Oct 6, 20 | Nov 2, 17 | Dec 1, 8 | Jan 1, 17 | Feb 8, 16 | Mar 8, 17 | Apr 8, 18.",
      },
      {
        question: "What are the passport, visa, and flight reporting guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid tourist visa is mandatory (Thailand visa on arrival is included). Report at the airport at least 3 hours before the scheduled departure of your international flight. Standard hotel check-in is 2:00 PM and check-out is 12:00 PM.",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "A 50% advance payment is required to confirm booking, with the remaining balance due at least 15 days prior to departure.\n\nCancellation charges prior to departure:\n• 121 to 900 days: 10%\n• 91 to 120 days: 15%\n• 61 to 90 days: 20%\n• 46 to 60 days: 30%\n• 31 to 45 days: 40%\n• 21 to 30 days: 50%\n• 11 to 20 days: 75%\n• 0 to 10 days: 100%\nVisa fees, airfare, travel insurance, and non-refundable services apply in addition.",
      },
    ],
  },
  {
    id: "andaman-tour",
    title: "Andaman Tour (5 Nights / 6 Days)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800",
    duration: "5 Nights / 6 Days",
    price: "₹33,499",
    highlights: [
      "Port Blair City Tour & Corbyn's Cove Beach",
      "Cellular Jail Visit & Light & Sound Show",
      "Inter-Island Cruise to Swaraj Dweep (Havelock Island)",
      "World-Famous Radhanagar Beach (Asia's Best Beach)",
      "Kala Pathar Beach scenic black rocks",
      "Elephanta Beach with Complimentary 5-Minute Snorkeling",
      "Ferry to Shaheed Dweep (Neil Island)",
      "Bharatpur Beach & Laxmanpur Beach sunset",
      "Natural Coral Bridge (Howrah Bridge)",
      "Ross Island (Netaji Subhash Chandra Bose Island)",
      "British Colonial Ruins, Japanese Bunkers, Deer & Peacock Park",
      "Daily Bandhan Special Treats & Farewell Gift Pack",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Port Blair 2N – Havelock Island 2N – Neil Island 1N · 5N/6D · Fixed Departures",
    overview:
      "A tropical 5 Nights / 6 Days getaway across the Andaman Islands. Relive India's freedom struggle at the historic Cellular Jail with its stirring Light & Sound show, cruise turquoise waters to Havelock Island to stroll the powdery sands of world-renowned Radhanagar Beach, enjoy complimentary snorkeling amidst vibrant reefs at Elephanta Beach, explore Neil Island's natural rock bridge, and walk through colonial ruins on Ross Island.\n\nDeparture Dates: Sep 07, 28 | Oct 02, 09, 21 | Nov 12, 27 | Dec 02, 10, 18, 25 (2026).",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=90&w=3200",
    bestTime: "October to May",
    startingPoint: "Port Blair Airport (IXZ) (Arrival before 12:00 PM)",
    groupSize: "Group departures",
    themes: ["Beach", "Island", "History"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800", caption: "Radhanagar Beach, Havelock Island" },
      { image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800", caption: "Snorkeling off Elephanta Beach" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Port Blair – City Tour",
        description:
          "Upon arrival at Port Blair Airport, meet our representative and transfer to your hotel. After check-in and some relaxation, proceed to visit the beautiful Corbyn's Cove Beach followed by the historic Cellular Jail. In the evening, witness the spectacular Light & Sound Show, which narrates the inspiring story of India's freedom struggle. (Bandhan Special Treat: Welcome Coconut Drink on Arrival). Overnight stay in Port Blair.",
        meals: "Lunch, Dinner",
        stay: "Port Blair",
      },
      {
        day: 2,
        title: "Port Blair – Swaraj Dweep (Havelock Island) – Radhanagar Beach",
        description:
          "After breakfast, board the cruise to Swaraj Dweep (Havelock Island). Upon arrival, check in to the hotel and later visit the world-famous Radhanagar Beach, renowned for its pristine white sands and crystal-clear waters. The island is also famous for its diving and snorkeling experiences. (Bandhan Special Treat: Fresh Tropical Fruit Platter at Radhanagar Beach). Overnight stay in Swaraj Dweep (Havelock Island).",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Havelock Island",
      },
      {
        day: 3,
        title: "Kala Pathar Beach & Elephanta Beach Excursion",
        description:
          "After breakfast, visit the scenic Kala Pathar Beach, known for its black rocks, turquoise waters and peaceful surroundings. Later proceed to Elephanta Beach, famous for its coral reefs and exciting water sports. Enjoy 5 minutes of complimentary snorkeling amidst vibrant marine life. (Bandhan Special Treat: Beachside Refreshments). Overnight stay in Swaraj Dweep (Havelock Island).",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Havelock Island",
      },
      {
        day: 4,
        title: "Swaraj Dweep – Shaheed Dweep (Neil Island)",
        description:
          "After breakfast, board the ferry to Shaheed Dweep (Neil Island). On arrival, check in to the hotel and explore the island's famous attractions including Bharatpur Beach, Laxmanpur Beach, and the natural rock formation known as Natural Coral Bridge (Howrah Bridge). (Bandhan Special Treat: Ice Cream at Bharatpur Beach & Group Sunset Memories Session at Laxmanpur Beach). Overnight stay in Shaheed Dweep (Neil Island).",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Neil Island",
      },
      {
        day: 5,
        title: "Shaheed Dweep – Port Blair – Ross Island",
        description:
          "After breakfast, board the cruise back to Port Blair. In the afternoon, visit Ross Island (Netaji Subhash Chandra Bose Island), once the administrative headquarters during British rule. Explore its colonial ruins, Japanese bunkers and enjoy spotting deer and peacocks amidst lush greenery. (Bandhan Special Treat: Heritage Walk with Special Tea). Overnight stay in Port Blair.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Port Blair",
      },
      {
        day: 6,
        title: "Port Blair Departure",
        description:
          "After breakfast, check out from the hotel and transfer to Port Blair Airport (departure flight after 2:00 PM) for your onward journey with unforgettable memories of the Andaman Islands. (Bandhan Special Treat: Farewell Gift Pack with Shell Keychain, Group Tour Photograph & Sweet Memories Card).",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing basis",
      "5 Breakfasts, 5 Lunches, 5 Dinners",
      "All transfers & sightseeing by A/C vehicle",
      "Professional Tour Manager",
      "Entrance Tickets",
      "One Mineral Water Bottle per person per day",
      "Travel Insurance",
      "Cruise Tickets (Makruzz / Nautika / Sea Link / ITT Majestic – Base Category)",
      "Cellular Jail Light & Sound Show Tickets",
      "Complimentary 5 Minutes Snorkeling at Elephanta Beach",
      "Visit to Netaji Subhash Chandra Bose Island (Ross Island)",
      "Visit to World Famous Radhanagar Beach",
      "Daily Bandhan Special Treats & Farewell Gift Pack",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Ship Fare",
      "Guide Charges",
      "Early Check-in / Late Check-out",
      "Additional Meals & Sightseeing",
      "Water Sports Activities (except complimentary snorkeling)",
      "Auto Rickshaw Charges",
      "Personal Expenses",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹33,499/- Per Person + 5% GST\n• Single Occupancy: ₹45,399/- Per Person + 5% GST\n• Extra Adult with Extra Bed/Mattress: ₹29,399/- Per Person + 5% GST\n• Extra Child with Extra Bed/Mattress: ₹29,399/- Per Person + 5% GST\n• Extra Adult without Extra Bed/Mattress: ₹23,899/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for Andaman Tour?",
        answer:
          "Departure Dates 2026:\n• September: 07, 28 September\n• October: 02, 09, 21 October\n• November: 12, 27 November\n• December: 02, 10, 18, 25 December",
      },
      {
        question: "What are the flight timing guidelines and ferry procedures?",
        answer:
          "• Arrival at Port Blair Airport should be before 12:00 PM.\n• Departure flight from Port Blair should be after 02:00 PM.\n• Guests must report at the ferry terminal at least 45 minutes before departure with a valid Government Photo ID.\n• Packed breakfast is collected from hotel for early morning ferry departures.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation Charges Before Departure:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 00–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "andaman-baratang-tour",
    title: "Andaman with Baratang Tour (6 Nights / 7 Days)",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹38,499",
    highlights: [
      "Port Blair City Tour, Corbyn's Cove & Cellular Jail",
      "Light & Sound Show at Cellular Jail",
      "Inter-Island Cruise to Swaraj Dweep (Havelock Island)",
      "World-Famous Radhanagar Beach",
      "Kala Pathar Beach & Elephanta Beach with Complimentary Snorkeling",
      "Ferry to Shaheed Dweep (Neil Island) — Bharatpur & Laxmanpur Beach",
      "Natural Coral Bridge (Howrah Bridge)",
      "Ross Island (Netaji Subhash Chandra Bose Island)",
      "Baratang Island Excursion via Andaman Trunk Road (ATR)",
      "Drive through Jarawa Tribal Reserve",
      "Mangrove Creek Boat Ride & Middle Strait Ferry",
      "Limestone Caves exploration",
      "India's Only Active Mud Volcano",
      "Daily Bandhan Special Treats & Farewell Gift Pack",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Port Blair 3N – Havelock Island 2N – Neil Island 1N · 6N/7D · Fixed Departures",
    overview:
      "A comprehensive 6 Nights / 7 Days expedition across the Andaman archipelago including the pristine wilderness of Baratang Island. Highlights include Cellular Jail's sound and light spectacle, luxury inter-island cruise to Havelock's Radhanagar Beach, complimentary coral snorkeling at Elephanta Beach, Neil Island's natural rock formation bridge, Ross Island's peacocks and colonial history, plus an early morning jungle safari across the Jarawa Reserve to Baratang for thrilling mangrove boat rides, limestone caves, and India's only active mud volcano.\n\nDeparture Dates: Sep 06, 26 | Oct 02, 09, 21 | Nov 12, 18, 25 | Dec 02, 18, 25 (2026).",
    heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=90&w=3200",
    bestTime: "October to May",
    startingPoint: "Port Blair Airport (IXZ) (Arrival before 12:00 PM)",
    groupSize: "Group departures",
    themes: ["Beach", "Island", "Nature", "Adventure"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800", caption: "Baratang Mangrove Creek" },
      { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800", caption: "Radhanagar Beach, Havelock" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Port Blair – City Tour",
        description:
          "Upon arrival at Port Blair Airport, meet our representative and transfer to the hotel. After check-in and some relaxation, visit the scenic Corbyn's Cove Beach followed by the historic Cellular Jail. In the evening, witness the spectacular Light & Sound Show, which beautifully narrates the story of India's freedom struggle. (Bandhan Special Treat: Welcome Coconut Drink on Arrival). Overnight stay in Port Blair.",
        meals: "Lunch, Dinner",
        stay: "Port Blair",
      },
      {
        day: 2,
        title: "Port Blair – Swaraj Dweep (Havelock Island) – Radhanagar Beach",
        description:
          "After breakfast, board the cruise to Swaraj Dweep (Havelock Island). Upon arrival, check in to your hotel and later visit the world-famous Radhanagar Beach, celebrated for its crystal-clear waters and pristine white sands. The island is also renowned for its diving and snorkeling opportunities. (Bandhan Special Treat: Fresh Tropical Fruit Platter at Radhanagar Beach). Overnight stay in Swaraj Dweep (Havelock Island).",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Havelock Island",
      },
      {
        day: 3,
        title: "Kala Pathar Beach & Elephanta Beach Excursion",
        description:
          "After breakfast, visit the peaceful Kala Pathar Beach, famous for its black rocks, turquoise waters and tranquil surroundings. Later proceed to Elephanta Beach, known for its vibrant coral reefs and exciting water sports. Enjoy 5 minutes of complimentary snorkeling in the clear blue waters. (Bandhan Special Treat: Beachside Refreshments). Overnight stay in Swaraj Dweep (Havelock Island).",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Havelock Island",
      },
      {
        day: 4,
        title: "Swaraj Dweep – Shaheed Dweep (Neil Island)",
        description:
          "After breakfast, board the ferry to Shaheed Dweep (Neil Island). On arrival, check in to the hotel and explore the island's beautiful attractions including Bharatpur Beach, Laxmanpur Beach, and the naturally formed Coral Bridge (Howrah Bridge). (Bandhan Special Treat: Ice Cream at Bharatpur Beach & Group Sunset Memories Session at Laxmanpur Beach). Overnight stay in Shaheed Dweep (Neil Island).",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Neil Island",
      },
      {
        day: 5,
        title: "Shaheed Dweep – Port Blair – Ross Island",
        description:
          "After breakfast, board the cruise back to Port Blair. In the afternoon, visit Ross Island (Netaji Subhash Chandra Bose Island), once the British administrative headquarters. Explore the colonial ruins, Japanese bunkers, lush greenery and spot friendly deer and peacocks roaming freely. (Bandhan Special Treat: Heritage Walk with Special Tea). Overnight stay in Port Blair.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Port Blair",
      },
      {
        day: 6,
        title: "Port Blair – Baratang Island Excursion",
        description:
          "Depart early morning for Baratang Island via the scenic Andaman Trunk Road (ATR) passing through the Jarawa Tribal Reserve. Cross the Middle Strait by ferry and enjoy a Mangrove Creek Boat Ride before exploring the fascinating Limestone Caves. Later visit India's only active Mud Volcano, a rare geological attraction, before returning to Port Blair. (Bandhan Special Treat: Refreshing Coconut Water at Baratang Island). Overnight stay in Port Blair.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Port Blair",
      },
      {
        day: 7,
        title: "Port Blair Departure",
        description:
          "After breakfast, check out from the hotel and transfer to Port Blair Airport (departure flight after 2:00 PM) for your onward journey with unforgettable memories of the Andaman Islands. (Bandhan Special Treat: Farewell Gift Pack with Shell Keychain, Group Tour Photograph & Sweet Memories Card).",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing basis",
      "6 Breakfasts, 6 Lunches, 6 Dinners",
      "All transfers & sightseeing by A/C Vehicle",
      "Professional Tour Manager",
      "Entrance Tickets",
      "Daily One Mineral Water Bottle per person",
      "Travel Insurance",
      "Cruise Tickets (Makruzz / Nautika / Sea Link / ITT Majestic – Base Category)",
      "Cellular Jail Light & Sound Show Tickets",
      "Complimentary 5 Minutes Snorkeling at Elephanta Beach",
      "Visit to Netaji Subhash Chandra Bose Island (Ross Island)",
      "Visit to World Famous Radhanagar Beach",
      "Baratang Island Excursion with Mangrove Creek Boat Ride, Limestone Caves & Mud Volcano",
      "Daily Bandhan Special Treats & Farewell Gift Pack",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Ship Fare",
      "Guide Charges",
      "Early Check-in / Late Check-out",
      "Additional Meals & Sightseeing",
      "Water Sports Activities (except complimentary snorkeling)",
      "Auto Rickshaw Charges",
      "Personal Expenses",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹38,499/- Per Person + 5% GST\n• Single Occupancy: ₹50,999/- Per Person + 5% GST\n• Extra Adult with Extra Bed/Mattress: ₹31,999/- Per Person + 5% GST\n• Extra Child with Extra Bed/Mattress: ₹31,999/- Per Person + 5% GST\n• Extra Child without Bed/Mattress: ₹26,999/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for Andaman with Baratang Tour?",
        answer:
          "Departure Dates 2026:\n• September: 06, 26 September\n• October: 02, 09, 21 October\n• November: 12, 18, 25 November\n• December: 02, 18, 25 December",
      },
      {
        question: "What should I know about the Baratang Island excursion?",
        answer:
          "The Baratang tour departs early morning along the Andaman Trunk Road (ATR) traversing the protected Jarawa Tribal Reserve area. Photography or interaction inside the reserve is strictly prohibited by law. The excursion includes crossing the Middle Strait, a mangrove boat safari to the limestone caves, and a visit to India's unique active mud volcano.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation Charges Before Departure:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 00–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "ayodhya-varanasi",
    title: "Ayodhya – Varanasi Spiritual Tour (6 Nights / 7 Days)",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹33,499",
    highlights: [
      "Shri Ram Janmabhoomi Temple Darshan, Ayodhya",
      "Hanuman Garhi, Kanak Bhawan & Ramkot",
      "Chitrakoot: Bharat Milap, Hanuman Dhara, Kamadgiri Parikrama & Ram Ghat",
      "Prayagraj: Holy Triveni Sangam Darshan & Alopi Devi Shakti Peeth",
      "Allahabad Fort, Swaraj Bhavan & Anand Bhavan",
      "Mahabodhi Temple & Sacred Bodhi Tree, Bodhgaya (UNESCO World Heritage Site)",
      "Great Buddha Statue & Buddhist Temples",
      "Gaya Pind Daan Rituals (Optional)",
      "Peaceful Sunrise Boat Ride on River Ganga, Varanasi",
      "VIP Darshan Pass at Kashi Vishwanath Temple",
      "Annapurna Temple, Vishalakshi Temple & Kaal Bhairav Temple",
      "Sankat Mochan Hanuman Temple & Banaras Hindu University",
      "World-Famous Ganga Aarti at Dashashwamedh Ghat",
      "Sarnath Buddhist Pilgrimage & Museum Excursion",
      "Daily Bandhan Special Treats & Farewell Gift Pack",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Ayodhya 1N – Chitrakoot 1N – Varanasi 3N – Bodhgaya 1N · 6N/7D · Fixed Departures",
    overview:
      "A sacred 6 Nights / 7 Days pilgrimage through India's holiest spiritual destinations. Bow before the divine deity at Ayodhya's grand Shri Ram Janmabhoomi Mandir, walk the sacred grounds of Lord Rama's exile in Chitrakoot, take a holy dip at Prayagraj's Triveni Sangam, meditate under the sacred Bodhi Tree where the Buddha attained enlightenment in Bodhgaya, cruise the holy Ganga at sunrise in Varanasi, receive VIP darshan at the Kashi Vishwanath Jyotirlinga, and witness the captivating evening Ganga Aarti at Dashashwamedh Ghat.\n\nDeparture Dates: Sep 07, 28 | Oct 02, 09, 21 | Nov 12, 27 | Dec 02, 10, 18, 25 (2026).",
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to March",
    startingPoint: "Lucknow Airport / Railway Station (Approx. 140 km / 3 hrs to Ayodhya)",
    groupSize: "Group departures",
    themes: ["Spiritual", "Heritage", "Culture"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=85&w=1800", caption: "Ganga Aarti, Dashashwamedh Ghat" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Varanasi Riverfront" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Lucknow Arrival – Ayodhya Sightseeing (Approx. 140 km / 3 hrs.)",
        description:
          "Upon arrival at Lucknow, drive to the holy city of Ayodhya. After hotel check-in, begin your spiritual journey by visiting Shri Ram Janmabhoomi Mandir, Hanuman Garhi, Kanak Bhawan, Ramkot, Swarg Dwar, and Nageshwarnath Temple. Explore the birthplace of Lord Rama and experience the rich religious and historical significance of this sacred city. (Bandhan Special Treat: Welcome Refreshment with Ayodhya's Famous Kesari Peda & Group Photo at Ram Path). Overnight stay in Ayodhya.",
        meals: "Lunch, Dinner",
        stay: "Ayodhya",
      },
      {
        day: 2,
        title: "Ayodhya – Chitrakoot (Approx. 275 km / 6 hrs.)",
        description:
          "After breakfast, proceed to Chitrakoot, the sacred land where Lord Rama, Sita and Lakshmana spent part of their exile. Visit Bharat Milap Temple, Hanuman Dhara, Kamadgiri Parikrama, and Ram Ghat. Experience the spiritual atmosphere before retiring for the night. (Bandhan Special Treat: Traditional Tea & Local Snacks at Ram Ghat with Spiritual Storytelling Session). Overnight stay in Chitrakoot.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Chitrakoot",
      },
      {
        day: 3,
        title: "Chitrakoot – Prayagraj – Varanasi (Approx. 250 km / 6 hrs.)",
        description:
          "After breakfast, drive to Prayagraj and visit the sacred Triveni Sangam, Hanuman Temple, Alopi Devi Shakti Peeth, Allahabad Fort, Swaraj Bhavan, and Anand Bhavan. Later continue your journey to Varanasi, the spiritual capital of India. (Bandhan Special Treat: Kulhad Chai after Sangam Darshan). Overnight stay in Varanasi.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Varanasi",
      },
      {
        day: 4,
        title: "Varanasi – Bodhgaya (Approx. 260 km / 6 hrs.)",
        description:
          "After breakfast, travel to the sacred Buddhist destination of Bodhgaya. Visit the Mahabodhi Temple, Sacred Bodhi Tree, Great Buddha Statue, and Lord Buddha Temple Complex where Lord Buddha attained enlightenment. (Bandhan Special Treat: Buddhist Blessing Ribbon & Traditional Bihari Sweet Tasting). Overnight stay in Bodhgaya.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bodhgaya",
      },
      {
        day: 5,
        title: "Bodhgaya – Gaya – Varanasi (Approx. 270 km / 6 hrs.)",
        description:
          "After breakfast, perform Pind Daan rituals at Gaya (optional). Later visit the Tibetan Monastery and other Buddhist temples before returning to Varanasi for an overnight stay. (Bandhan Special Treat: Fresh Juice & Devotional Music Session During Travel). Overnight stay in Varanasi.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Varanasi",
      },
      {
        day: 6,
        title: "Varanasi City Tour & Ganga Aarti",
        description:
          "Begin with a peaceful Sunrise Boat Ride on the River Ganga. Visit Kaal Bhairav Temple, Kashi Vishwanath Temple (VIP Darshan), Annapurna Temple, Vishalakshi Temple, Bharat Mata Temple, Sankat Mochan Hanuman Temple, Manas Mandir, and Banaras Hindu University. In the evening, witness the world-famous Ganga Aarti at Dashashwamedh Ghat. (Bandhan Special Treat: Ghat Side Masala Chai Before Aarti). Overnight stay in Varanasi.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Varanasi",
      },
      {
        day: 7,
        title: "Varanasi – Sarnath – Departure",
        description:
          "After breakfast, visit Sarnath (subject to available time), where Lord Buddha delivered his first sermon. Explore the ancient Buddhist monuments and museum before proceeding to Varanasi Airport/Railway Station for your onward journey. (Bandhan Special Treat: Farewell Gift Pack with Banarasi Prasad, Rudraksha Keychain & Group Memory Photo).",
        meals: "Breakfast, Lunch",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing basis at Premium Hotels/Resorts",
      "6 Breakfasts, 7 Lunches, 6 Dinners",
      "All transfers & sightseeing by A/C vehicle",
      "Professional Tour Manager",
      "Entrance Tickets",
      "Evening Tea/Coffee",
      "One Mineral Water Bottle per person per day",
      "Evening Ganga Aarti Experience at Dashashwamedh Ghat",
      "Morning Sunrise Boat Ride on River Ganga",
      "VIP Darshan Pass at Kashi Vishwanath Temple",
      "Visit to Banaras Hindu University",
      "Shri Ram Janmabhoomi Temple Darshan in Ayodhya",
      "Holy Triveni Sangam Visit in Prayagraj",
      "Daily Bandhan Special Treats & Farewell Gift Pack",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Train Fare",
      "Guide Charges",
      "Early Check-in / Late Check-out",
      "Additional Meals & Sightseeing",
      "Pind Daan Ritual charges in Gaya",
      "Personal Expenses",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹33,499/- Per Person + 5% GST\n• Single Occupancy: ₹43,999/- Per Person + 5% GST\n• Extra Adult with Extra Bed/Mattress: ₹28,499/- Per Person + 5% GST\n• Extra Child with Extra Bed/Mattress: ₹28,499/- Per Person + 5% GST\n• Extra Child without Bed/Mattress: ₹22,499/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for Ayodhya – Varanasi Spiritual Tour?",
        answer:
          "Departure Dates 2026:\n• September: 07, 28 September\n• October: 02, 09, 21 October\n• November: 12, 27 November\n• December: 02, 10, 18, 25 December",
      },
      {
        question: "What are the temple guidelines and ritual requirements?",
        answer:
          "• Carry a scarf/dupatta for covering the head while visiting temples.\n• Respect temple customs, rituals, queues, and local traditions.\n• Most temples remain closed between 12:00 PM and 4:00 PM.\n• Guests planning to perform Pind Daan in Gaya or rituals in Varanasi should inform the Tour Manager in advance.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation Charges Before Departure:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 00–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "singapore-malaysia-best",
    title: "Best of Singapore Malaysia",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=85&w=1800",
    duration: "5 Nights / 6 Days",
    price: "₹91,900",
    highlights: [
      "Explore Malaysia & Singapore in one exciting holiday",
      "Kuala Lumpur City Tour",
      "Putrajaya Orientation Tour",
      "Visit the iconic Batu Caves",
      "Two-Way Cable Car Ride to Genting Highlands",
      "Free Time at Genting Highlands",
      "Coach Journey from Kuala Lumpur to Singapore",
      "Night Safari, Singapore",
      "Sentosa Island Excursion",
      "Marina Bay Sands",
      "Gardens by the Bay",
      "Full-Day Universal Studios Singapore",
      "Wings of Time Show",
      "Singapore City Tour",
      "Daily Breakfast, Lunch & Dinner (as per itinerary)",
      "Hotel Accommodation",
      "Airport Transfers & Sightseeing as per Itinerary",
    ],
    category: "International",
    isPopular: true,
    tagline: "5N/6D · Fixed Departures from Sep to Apr · Kuala Lumpur, Genting & Singapore",
    overview:
      "Explore Malaysia and Singapore in one exciting 5 Nights / 6 Days holiday. Experience the Putrajaya orientation tour, Kuala Lumpur city tour, iconic Batu Caves, and two-way cable car ride to Genting Highlands. Travel by coach to Singapore for the thrilling Night Safari, Sentosa Island excursion, Marina Bay Sands, Gardens by the Bay, a full day at Universal Studios Singapore, Wings of Time night show, and Singapore city tour.\n\nTour Departure Dates: Sep 5, 26 | Oct 10, 24 | Nov 6, 21 | Dec 5, 12 | Jan 4, 21 | Feb 12, 20 | Mar 12, 21 | Apr 12, 22.",
    heroImage: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to April",
    startingPoint: "Kuala Lumpur Airport",
    groupSize: "Min 25 pax for quoted rate",
    themes: ["City", "Family", "Theme Park"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=85&w=1800", caption: "Sentosa Island, Singapore" },
      { image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1800", caption: "Singapore skyline" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Malaysia",
        description:
          "Upon arrival in Malaysia, meet our representative and proceed towards Kuala Lumpur. En route, enjoy an orientation tour of Putrajaya. Check in to the hotel. (Check in at 2:00pm). Later, continue with a Kuala Lumpur city tour covering the major landmarks and attractions of the city. In the evening, enjoy beautiful views of the city skyline before returning to the hotel for dinner and overnight stay. (L-D)",
        meals: "Lunch, Dinner",
        stay: "Kuala Lumpur",
      },
      {
        day: 2,
        title: "Genting Day Trip, En-route to Batu Caves, with a two-way cable car ride",
        description:
          "After breakfast Proceed to Genting Highlands. Genting Highlands is an integrated hill resort. It is pleasant & cool up there, carry warm clothing if required. Enroute visit Batu caves. Travel by Asia's longest and fastest Cable car to Genting Highlands. Later free time to enjoy at casino and do some shopping. Return to Kuala Lumpur for overnight stay. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuala Lumpur",
      },
      {
        day: 3,
        title: "Transfer from Kaula Lumpur- Singapore (by coach) -Night Safari",
        description:
          "Arrival at Singapore and later transfer to hotel. Check in to the hotel. Later In the evening, embark on an adventure to the Night Safari. Experience the captivating Thumbuakar Tribal Performance followed by a guided Tram Safari Adventure to observe nocturnal wildlife up close.(Breakfast - Lunch - Dinner) Note: Due to an early morning departure by coach to Singapore, breakfast at the hotel will not be possible. A packed breakfast will be provided for all guests. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Singapore",
      },
      {
        day: 4,
        title: "Sentosa Island – Marina Bay Sands & Gardens by the Bay",
        description:
          "After breakfast, proceed to Sentosa Island and enjoy the various attractions and experiences the island has to offer. Later, visit Marina Bay Sands and Gardens by the Bay, two of Singapore’s most iconic landmarks. Enjoy breathtaking views of the city skyline and spend time exploring the beautiful surroundings before returning to the hotel. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Singapore",
      },
      {
        day: 5,
        title: "Universal Studio",
        description:
          "After Breakfast Proceed to Southeast Asia's first and only Universal Studio theme park - a fun destination for all ages. Enjoy famous rides like Human vs Cyclone, Transformers - The Ultimate 3D battle, Shrek 4- D Adventure, Light Camera Action, and many more fun rides. Enjoy the 'Wings of Time' - a spectacular night show set outdoors against the backdrop of an open sea in the evening. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Singapore",
      },
      {
        day: 6,
        title: "Singapore City Tour – Departure",
        description:
          "After breakfast, proceed for a half-day Singapore city tour covering the city's major landmarks and attractions. Later, return to the hotel and check out. You will then be transferred to the airport for your return flight back home with wonderful memories of your Singapore and Malaysia holiday. (B-L)",
        meals: "Breakfast, Lunch",
        stay: "—",
      },
    ],
    inclusions: [
      "3 Star hotel Accommodation on double/twin sharing basis",
      "Daily Breakfast at hotel",
      "Lunch, Dinner at Indian Restaurant",
      "Night Safari charges",
      "Putrajaya Tour",
      "Petronas Twin Towers (Photo stop)",
      "KL Tower observatory deck",
      "Universal Studio",
      "Singapore Visa",
      "Malaysia arrival card",
      "Cable Car ride at Sentosa island",
      "Sightseeing Entry tickets as mentioned in the itinerary",
      "Transfer from Singapore to Malaysia (By Coach)",
      "Indian Tour Leader above 20 persons throughout the tour",
      "English speaking guide above 20 persons",
      "Complimentary Travel insurance up to 59 years of age",
      "All Tours & Transfer on Private Basis",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Anything not mentioned above",
      "Cost of pre or post tour hotel accommodation",
      "Expenses of personal nature such as other taxes, drinks, telephone, shopping, snacks, Porterage and laundry bills etc.",
      "Tips and porter charges",
      "Any additional expenses incurred due to any flight delay or cancellation, weather conditions, political closures, technical faults etc",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing options?",
        answer:
          "The cost is based on a minimum of 25 pax:\n• Double sharing basis: ₹91,900/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹1,06,900/- + 5% GST + 2% TCS per person\n• Triple sharing basis: ₹90,900/- + 5% GST + 2% TCS per person\n• Child with bed: ₹88,900/- + 5% GST + 2% TCS\n• Child without bed: ₹65,900/- + 5% GST + 2% TCS\n• Child below 3 years: Complimentary",
      },
      {
        question: "What are the tour departure dates?",
        answer:
          "Tour Departure Dates: Sep 5, 26 | Oct 10, 24 | Nov 6, 21 | Dec 5, 12 | Jan 4, 21 | Feb 12, 20 | Mar 12, 21 | Apr 12, 22.",
      },
      {
        question: "What are the passport, visa, and flight reporting guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid tourist visa is mandatory (Singapore visa and Malaysia arrival card are included). Report at the airport at least 3 hours before the scheduled departure of your international flight. Standard hotel check-in is 2:00 PM and check-out is 12:00 PM.",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "A 50% advance payment is required to confirm booking, with the remaining balance due at least 15 days prior to departure.\n\nCancellation charges prior to departure:\n• 121 to 900 days: 10%\n• 91 to 120 days: 15%\n• 61 to 90 days: 20%\n• 46 to 60 days: 30%\n• 31 to 45 days: 40%\n• 21 to 30 days: 50%\n• 11 to 20 days: 75%\n• 0 to 10 days: 100%\nVisa fees, airfare, travel insurance, and non-refundable services apply in addition.",
      },
    ],
  },
  {
    id: "bhutan-tour",
    title: "Bhutan Tour",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹47,000",
    highlights: [
      "Thimphu City Tour & Buddha Dordenma Statue",
      "National Library & Zorig Chusum Painting School",
      "Simply Bhutan Living Museum & Handicrafts Emporium",
      "Dochula Pass (3,088 m) Himalayan views",
      "Punakha Dzong & Punakha Suspension Bridge",
      "Chele La Pass (3,988 m) panoramic excursion",
      "Kyichu Lhakhang sacred temple",
      "Ta Dzong (National Museum)",
      "Iconic hike to Taktsang Monastery (Tiger's Nest)",
      "Local markets of Thimphu & Paro",
      "Jeep Safari at Gorumara National Park (Lataguri)",
      "Sustainable Development Fee (SDF) included",
    ],
    category: "International",
    tagline: "Phuentsholing 1N – Thimphu 3N – Paro 2N – Lataguri 1N · 7N/8D · Fixed Departures",
    overview:
      "A breathtaking 7 Nights / 8 Days journey exploring the Kingdom of Bhutan and the Dooars. Experience Phuentsholing, Thimphu's cultural landmarks, Dochula Pass, Punakha Dzong and Suspension Bridge, Chele La Pass, the legendary hike to Taktsang Monastery (Tiger's Nest), and a morning Jeep Safari at Gorumara National Park in Lataguri.\n\nDeparture Dates: Sep 04, 12, 16, 20 | Oct 02, 09, 21, 24 | Nov 04, 12, 19, 23 | Dec 02, 06, 16, 23.",
    heroImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to December",
    startingPoint: "Bagdogra Airport (IXB) / New Jalpaiguri (NJP)",
    groupSize: "Group departures",
    themes: ["Mountains", "Culture", "Spiritual"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800", caption: "Himalayan valleys of Bhutan" },
      { image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800", caption: "Prayer flags and mountain passes" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Bagdogra / New Jalpaiguri – Phuentsholing (155km/ 4 hrs.)",
        description:
          "On arrival, our representative will meet and assist you at Bagdogra and transfer you to Phuentsholing. The India-Bhutan border is shared by Jaigaon on the Indian side and Phuentsholing on the Bhutanese side. Overnight stay in Phuentsholing.",
        meals: "Dinner",
        stay: "Phuentsholing",
      },
      {
        day: 2,
        title: "Phuentsholing – Thimphu (165km/ 5 hrs.)",
        description:
          "After breakfast, complete the immigration formalities and drive to Thimphu, the capital of Bhutan, via Gedu, located at an altitude of about 9,000 ft, with a view of the Chukha Dam. En route, stop for a photo session at Wangkha Waterfall. Upon arrival in Thimphu, check in to the hotel. The evening is free to explore the local market. Overnight stay in Thimphu.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Thimphu",
      },
      {
        day: 3,
        title: "Thimphu Local Sightseeing",
        description:
          "After breakfast, visit the National Library, Institute for Zorig Chusum (Painting School), Simply Bhutan, Handicrafts Emporium, and the majestic Buddha Dordenma Statue overlooking Thimphu Valley. Explore Bhutan's rich culture, traditional arts, and local handicrafts. Overnight stay in Thimphu.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Thimphu",
      },
      {
        day: 4,
        title: "Thimphu – Punakha Excursion – Thimphu (75km/ 2 hrs 30 min)",
        description:
          "After breakfast, drive to Dochula Pass (3,088 m) to enjoy stunning Himalayan views. Continue to visit the magnificent Punakha Dzong and walk across the scenic Punakha Suspension Bridge, one of the longest suspension bridges in Bhutan. Return to Thimphu by evening. Overnight stay in Thimphu.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Thimphu",
      },
      {
        day: 5,
        title: "Thimphu – Chele La Pass Excursion – Paro (50km/ 1 hr 30 min)",
        description:
          "After breakfast, drive to Chele La Pass (3,988 m), one of Bhutan's highest motorable passes, offering spectacular Himalayan views. Later, visit Kyichu Lhakhang, one of Bhutan's oldest and most sacred temples, followed by Ta Dzong (National Museum), showcasing Bhutan's rich history, art, and culture. Proceed to Paro. Overnight stay in Paro.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paro",
      },
      {
        day: 6,
        title: "Taktsang Monastery (Tiger's Nest)",
        description:
          "After breakfast, begin the hike to the iconic Taktsang Monastery (Tiger's Nest), Bhutan's most famous and sacred monastery, perched 900 metres above the Paro Valley. According to legend, Guru Rinpoche flew to this site on the back of a tigress in the 8th century and meditated in a cave, giving the monastery its name. The monastery, built in 1692 and beautifully restored after a fire in 1998, remains one of Bhutan's most revered pilgrimage sites. Overnight stay in Paro.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paro",
      },
      {
        day: 7,
        title: "Paro – Lataguri (255km/ 6 hrs 30 min)",
        description:
          "After breakfast, drive to Lataguri. Upon arrival, check in to the hotel. The rest of the day is at leisure. Overnight stay in Lataguri.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Lataguri",
      },
      {
        day: 8,
        title: "Lataguri – Bagdogra Airport",
        description:
          "Early morning, enjoy a Jeep Safari at Gorumara National Park. After breakfast, proceed to Bagdogra Airport for your onward journey. Tour ends with sweet memories.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Sustainable Development Fee (SDF) of ₹1,200 per person per night for Indian nationals",
      "Accommodation in 3-Star hotels on a double-sharing basis",
      "Breakfast, Lunch & Dinner",
      "1-litre mineral water bottle per person per day",
      "Professional Hindi & English-speaking tour guide",
      "All Entry fees",
      "Jeep Safari at Gorumara Wildlife Sanctuary",
      "Sightseeing by private non-AC vehicle on a point-to-point basis as per the itinerary",
      "Transportation in the Indian sector by Toyota Innova or Tempo Traveller, including all toll taxes, parking charges, and driver allowances",
      "One Bhutan Tourist SIM card on arrival for the Tour Leader",
    ],
    exclusions: [
      "Train / Air Ticket",
      "Taktsang Monastery Fees",
      "Personal expenses such as trips, telephone calls, laundry, liquor etc.",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Sharing: ₹47,000/- + 5% GST per person\n• Extra Mattress: ₹42,000/- + 5% GST\n• Child No Bed (5 - 12 yrs): ₹29,500/- + 5% GST\n• Single Occupancy: ₹51,400/- + 5% GST",
      },
      {
        question: "What are the departure dates for Bhutan Tour?",
        answer:
          "Departure Dates:\n• Sep: 04, 12, 16, 20\n• Oct: 02, 09, 21, 24\n• Nov: 04, 12, 19, 23\n• Dec: 02, 06, 16, 23",
      },
      {
        question: "What are the identity document and immigration rules for Bhutan?",
        answer:
          "Indian Nationals must carry a valid Passport (minimum 6 months validity) or Original Voter ID Card for entry into Bhutan. Aadhaar Card, PAN Card, and Driving License are NOT valid for immigration. The Sustainable Development Fee (SDF) of ₹1,200 per person per night is included.",
      },
      {
        question: "What should I know about the Tiger's Nest hike?",
        answer:
          "The hike to Taktsang Monastery (Tiger's Nest) is moderate to strenuous (approx. 5–6 hours round trip). Guests with medical conditions are advised to consult their doctor beforehand. Carry comfortable walking shoes, warm clothing, rainwear, sunscreen, and water.",
      },
      {
        question: "What are the payment terms and cancellation charges?",
        answer:
          "Payment Terms:\n• 30% booking amount required at confirmation.\n• Full balance payment must be completed 15 days prior to departure date.\n\nCancellation Policy:\n• 61 Days or more: 15% of Total tour cost\n• 46–60 Days: 25% of Total tour cost\n• 31–45 Days: 50% of Total tour cost\n• 16–30 Days: 75% of Total tour cost\n• 15 Days or less / No-show: 100% of Total tour cost",
      },
    ],
  },
  {
    id: "eastern-europe-highlights",
    title: "Eastern Europe Highlights",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹1,90,400",
    highlights: [
      "Guided tours in Vienna, Budapest, Prague & Salzburg",
      "Schönbrunn Palace, Vienna",
      "Scenic Danube River Cruise in Budapest",
      "Orientation tour of Szentendre",
      "Orientation tour of Bratislava, Slovakia",
      "Prague Castle Viewing Gallery",
      "Kutná Hora historic excursion",
      "Postcard village of Hallstatt",
      "Dachstein Glacier cable car with Ice Palace & Suspension Bridge",
      "Explore Munich, the vibrant capital of Bavaria",
    ],
    category: "International",
    tagline: "Austria, Hungary, Slovakia, Czech Republic & Germany · 7N/8D · Departure: 16 Oct",
    overview:
      "A magnificent 7 Nights / 8 Days journey traversing Austria, Hungary, Slovakia, Czech Republic, and Germany. Experience guided tours of Vienna, Budapest, Prague, and Salzburg, visit Schönbrunn Palace, cruise the Danube River, discover picturesque Szentendre, explore Bratislava's Old Town, witness Prague Castle's Viewing Gallery and historic Kutná Hora, visit the postcard village of Hallstatt, ascend Dachstein Glacier by cable car, and conclude in vibrant Munich.\n\nDeparture Date: 16 Oct.",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "October",
    startingPoint: "Vienna Airport (VIE) (Landing between 08:00 AM – 02:00 PM)",
    groupSize: "Group departure: 16 Oct",
    themes: ["Heritage", "City", "Scenic"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Historic architecture of Central Europe" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Castles and old towns" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Vienna",
        description:
          "Welcome to Vienna, the capital of Austria, renowned for its rich history, cultural heritage, and vibrant arts scene. Upon arrival at Vienna Airport, you will be warmly welcomed by our friendly and professional Tour Manager. Later, proceed to your hotel and complete the check-in formalities. In the evening, enjoy a delightful dinner before returning to your hotel for a comfortable overnight stay. Overnight stay at the hotel in Vienna. (Dinner)",
        meals: "Dinner",
        stay: "Vienna",
      },
      {
        day: 2,
        title: "Vienna to Budapest",
        description:
          "After breakfast, check out from your hotel and proceed for a guided city tour of Vienna. Admire iconic landmarks such as the Ringstrasse, the Vienna Opera House, and St. Stephen's Cathedral. Later, visit the magnificent Schönbrunn Palace, once the summer residence of the Habsburgs. Enjoy lunch at an Indian restaurant, followed by some free time. Later, continue your journey to Budapest. Upon arrival, enjoy dinner at an Indian restaurant before checking in to your hotel. Overnight stay at the hotel in Budapest. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Budapest",
      },
      {
        day: 3,
        title: "Discover Budapest",
        description:
          "Begin your day with breakfast before setting out on a guided city tour of Budapest. Explore famous landmarks including Buda Castle, the Hungarian Parliament, and Heroes' Square. After lunch at an Indian restaurant, enjoy a scenic Danube River Cruise, offering spectacular views of Budapest's beautiful skyline. Later, proceed to Szentendre, a charming riverside town in Hungary, renowned for its picturesque streets, vibrant art scene, and Mediterranean charm. Enjoy dinner at an Indian restaurant before returning to your hotel. Overnight stay at the hotel in Budapest. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Budapest",
      },
      {
        day: 4,
        title: "Budapest – Bratislava – Prague",
        description:
          "After breakfast, check out and proceed to Bratislava, the charming capital of Slovakia. Enjoy an orientation tour of the city, featuring landmarks such as Bratislava Castle and the medieval streets of the Old Town. After lunch at an Indian restaurant, continue your journey to Prague, the enchanting capital of the Czech Republic. Upon arrival, enjoy a delicious Indian dinner before checking in to your hotel. Overnight stay at the hotel in Prague. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Prague",
      },
      {
        day: 5,
        title: "Discover Prague",
        description:
          "After breakfast, proceed for a guided city tour of Prague. Discover the majestic Prague Castle, Charles Bridge, and the Old Town Square, home to the famous Astronomical Clock. Visit the Castle Viewing Gallery for breathtaking panoramic views of the city. After lunch at an Indian restaurant, drive to Kutná Hora, a historic town in the Czech Republic that offers a fascinating glimpse into the medieval and Baroque eras. Later, return to Prague. Enjoy dinner at an Indian restaurant before retiring to your hotel. Overnight stay at the hotel in Prague. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Prague",
      },
      {
        day: 6,
        title: "Prague – Salzburg",
        description:
          "After breakfast, proceed to Salzburg, the birthplace of Mozart. Following lunch at an Indian restaurant, meet your professional English-speaking guide for a captivating city tour. Explore this picturesque city renowned for its rich history and magnificent Baroque architecture. Discover iconic attractions including Hohensalzburg Fortress and Mirabell Palace while strolling through Salzburg's charming streets and learning about its remarkable cultural heritage. Later, enjoy dinner at an Indian restaurant before checking in to your hotel. Overnight stay at the hotel in Flachau area. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Flachau area",
      },
      {
        day: 7,
        title: "Salzburg – Hallstatt – Schladming – Munich",
        description:
          "After breakfast, depart for the picturesque village of Hallstatt, renowned for its breathtaking scenery and alpine charm. Stroll through its quaint streets or relax beside the serene lake. Later, proceed to Schladming, a charming alpine town, and experience the spectacular Dachstein Glacier with a thrilling cable car ride. Enjoy lunch with stunning mountain views and explore attractions including the Ice Palace and the Suspension Bridge. Continue your journey to Munich, the vibrant capital of Bavaria. Upon arrival, enjoy dinner at an Indian restaurant before checking in to your hotel. Overnight stay at the hotel in Munich. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Munich",
      },
      {
        day: 8,
        title: "Fly Back Home",
        description:
          "Your memorable holiday comes to an end today. After breakfast, check out from your hotel and proceed to Munich Airport (MUC) for your return flight. (The coach will drop at MUC Airport by 11:00 AM). Bid farewell to the wonderful friends you have made during the tour and depart with unforgettable memories. (Breakfast)",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation in 4-star hotels with daily buffet breakfast",
      "Sightseeing & attraction tickets as mentioned in the itinerary",
      "Tips to coach drivers and guide tips for the duration of the tour is included",
      "Daily Continental Buffet Breakfast",
      "06 Indian Jain/Vegetarian/Non-Vegetarian Lunches",
      "07 Indian Jain/Vegetarian/Non-Vegetarian Dinners",
      "Daily Mineral Water Bottle (500ml) per person",
      "Schönbrunn Palace entrance in Vienna",
      "Danube River Cruise in Budapest",
      "Prague Castle Viewing Gallery & Kutná Hora excursion",
      "Guided tours of Vienna, Budapest, Prague & Salzburg",
      "Dachstein Glacier cable car ride, Ice Palace & Suspension Bridge",
    ],
    exclusions: [
      "5% GST & 2% TCS and any other applicable taxes",
      "Airfare (international & domestic unless specified)",
      "Visa, Passport & POE charges, Travel Insurance",
      "Airport taxes and other applicable charges",
      "Cost of excursions, sightseeing, entrance fees, and local guides not mentioned in Inclusions",
      "Personal expenses such as porterage, laundry, telephone calls, shopping, snacks, etc.",
      "Cost of pre/post tour hotel accommodation",
      "Any expenses arising due to flight delays, cancellations, weather conditions, political issues, or technical faults",
      "Porterage charges, City tax",
    ],
    faqs: [
      {
        question: "What is the total tour cost across sharing categories?",
        answer:
          "Total Tour Cost (valid till 31st July 2026):\n• Double/Triple sharing basis: ₹1,90,400/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹2,42,200/- + 5% GST + 2% TCS per person\n• Child with bed (below 12 years): ₹1,49,800/- + 5% GST + 2% TCS\n• Child no bed (below 12 years): ₹1,28,100/- + 5% GST + 2% TCS\n• Infant (below 02 years): ₹10,600/- + 5% GST + 2% TCS",
      },
      {
        question: "What are the coach transfer timings for arrival and departure?",
        answer:
          "• Vienna (VIE Airport) Arrival Transfer: Flight landing time should be between 08:00 AM – 02:00 PM.\n• Munich (MUC Airport) Departure Transfer: The coach will drop at MUC Airport by 11:00 AM.\n(There may be waiting up to 02 hours post reaching arrival hall).",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "Payment Terms:\n• At booking: 50% non-refundable booking amount.\n• 30 days prior to departure (D-30): Full balance payment (ROE calculated as XE.com + 2).\n\nCancellation Charges:\n• Up to 45 days before departure: INR 40,000 per adult/child.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
    ],
  },
  {
    id: "grand-tour-europe",
    title: "Grand Tour of Europe",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "15 Nights / 16 Days",
    price: "₹4,13,700",
    highlights: [
      "Guided tours in London, Paris, Vaduz, Florence & Vatican / Colosseum",
      "Madame Tussauds & London Eye",
      "Lord's Cricket Ground & Tower of London",
      "High-speed Eurostar train London to Paris",
      "Eiffel Tower (3rd level) & Palace of Versailles",
      "Full day at Disneyland® Paris",
      "River Seine Cruise & Paris by Night tour",
      "Brussels Grand Place, Manneken Pis & Mini Europe",
      "Keukenhof Gardens (till 10 May) / Traditional Dutch Village (from 11 May)",
      "Amsterdam Canal Cruise aboard glass-topped boat",
      "Heidelberg Altstadt & Black Forest cuckoo clock craft",
      "Rhine Falls boat ride at Schaffhausen",
      "Jungfraujoch – Top of Europe with Eiger Express & cogwheel train",
      "Mount Titlis Rotair revolving cable car & Cliff Walk",
      "Vaduz (Liechtenstein) guided mini train ride",
      "Swarovski Crystal Worlds in Wattens & Innsbruck Golden Roof",
      "Venice: Private boat to St. Mark's & romantic Gondola Ride",
      "Florence Duomo & Leaning Tower of Pisa",
      "Vatican City: Sistine Chapel & St. Peter's Basilica",
      "Rome: Colosseum, Trevi Fountain & Roman Forum",
      "Handpicked gourmet treats across France, Belgium, Holland, Germany, Swiss & Italy",
    ],
    category: "International",
    isPopular: true,
    tagline: "UK, France, Belgium, Netherlands, Germany, Swiss, Austria, Italy & Vatican · 15N/16D",
    overview:
      "The ultimate 15 Nights / 16 Days European grand voyage spanning 10 countries: UK, France, Belgium, The Netherlands, Germany, Switzerland, Liechtenstein, Austria, Italy, and Vatican City. Highlights include London landmarks, Lord's Cricket Ground, high-speed Eurostar to Paris, Eiffel Tower (3rd Level), Versailles Palace, Disneyland® Paris, Brussels Grand Place & Mini Europe, Keukenhof Gardens / traditional Dutch village, Amsterdam canal cruise, Black Forest & Rhine Falls, Jungfraujoch (Top of Europe), Mount Titlis, Vaduz mini train, Swarovski Crystal Worlds in Innsbruck, Venetian Gondola ride, Florence Duomo & Leaning Tower of Pisa, and the Sistine Chapel & Colosseum in Rome.\n\nDeparture dates: 12 Oct & 01 Nov.",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "October & November",
    startingPoint: "London Heathrow Airport (LHR) (Landing between 08:00 AM – 02:00 PM)",
    groupSize: "Group departures: 12 Oct & 01 Nov",
    themes: ["Heritage", "City", "Family"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Iconic landmarks across Europe" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Historic old towns" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in London",
        description:
          "Welcome! Today marks the beginning of your European holiday as you board your flight to London, a vibrant city renowned for its rich history, cosmopolitan culture, and iconic landmarks. Upon arrival, collect your baggage and proceed to the arrival hall, where you will be warmly welcomed by our professional Tour Manager. You will then be transferred to your hotel for check-in. Relax and unwind after your journey. Overnight stay at the hotel in London. (Dinner)",
        meals: "Dinner",
        stay: "London",
      },
      {
        day: 2,
        title: "Guided City Tour of London – Changing of the Guards – Madame Tussauds – London Eye – Thames River Cruise",
        description:
          "After breakfast, proceed on a guided city tour of London with an expert local guide. Discover some of the city's most famous landmarks including Big Ben, Houses of Parliament, Westminster Abbey, Trafalgar Square, Piccadilly Circus, Tower Bridge, River Thames, Hyde Park, and many more. Witness the famous Changing of the Guards ceremony at Buckingham Palace (subject to operation). Later, visit the renowned Madame Tussauds Wax Museum and admire the world's largest collection of lifelike wax figures. Continue to the iconic London Eye, standing 135 metres above the River Thames for spectacular panoramic views. Later, experience London with a scenic Thames River Cruise. Overnight stay at the hotel in London. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "London",
      },
      {
        day: 3,
        title: "Lord's Cricket Ground – Tower of London – Oxford Street",
        description:
          "After breakfast, proceed to visit the legendary Lord's Cricket Ground, widely known as the 'Home of Cricket.' Enjoy a behind-the-scenes experience exploring the Grade II*-listed Victorian Pavilion, the Long Room, Players' Dressing Rooms, and the MCC Museum with the Ashes Urn. (Note: If a match is scheduled at Lord's, the group will visit the Oval Cricket Ground). Later, visit the historic Tower of London, a UNESCO World Heritage Site, and marvel at the Crown Jewels including the Kohinoor diamond. In the evening, enjoy free time at Oxford Street. Overnight stay at the hotel in London. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "London",
      },
      {
        day: 4,
        title: "London to Paris – The City of Romance, Lights and Glamour",
        description:
          "After breakfast, check out from the hotel and proceed to board the high-speed Eurostar train from London to Paris through the Channel Tunnel. Enjoy scenic countryside views aboard one of Europe's fastest rail services. Upon arrival in Paris, proceed to the elegant city of haute couture and world-class monuments. Transfer to your hotel and complete check-in formalities. Overnight stay at the hotel in Paris. (Breakfast, Packed Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 5,
        title: "Guided City Tour of Paris – Eiffel Tower (3rd Level) – Palace of Versailles – Seine River Cruise – Paris by Night Tour",
        description:
          "After breakfast, proceed for a guided city tour of Paris covering Place Vendôme, Place de l'Opéra Garnier, Musée d'Orsay, Place de la Concorde, Champs-Élysées, Arc de Triomphe, Alexander Bridge, and Les Invalides. Ascend to the 3rd Level of the Eiffel Tower for breathtaking panoramic views. Continue to the magnificent Palace of Versailles, a UNESCO World Heritage Site celebrated for French architecture and royal gardens. In the evening, enjoy a romantic cruise along the River Seine. Later, experience the enchanting Paris by Night Tour as the City of Light comes alive with illuminated monuments. (Note: 3rd level access subject to operation; 2nd level provided if closed). Overnight stay at the hotel in Paris. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 6,
        title: "Disneyland® Paris – Choice of Disneyland® Park or Walt Disney Studios® Park",
        description:
          "After breakfast, proceed for a full-day excursion to Disneyland® Paris. Choose between Disneyland® Park, featuring classic attractions, spectacular shows, and colourful Disney character parades across five themed lands, or Walt Disney Studios® Park, where you can experience thrilling stunt shows, discover movie magic, and explore real film sets. Return to the hotel in the evening. Overnight stay at the hotel in Paris. (Breakfast, Packed Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 7,
        title: "Brussels – Grand Place – Manneken Pis – Mini Europe",
        description:
          "After breakfast, check out from the hotel and proceed to Brussels, the capital of Belgium and EU headquarters. Visit the magnificent Grand Place, admire the medieval Town Hall, and visit the famous Manneken Pis statue. Later, visit Mini Europe, exploring over 350 intricately recreated miniature architectural wonders of Europe. After the tour, proceed to your hotel in the Netherlands. Overnight stay at the hotel in Netherlands. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Netherlands",
      },
      {
        day: 8,
        title: "Keukenhof Gardens (till 10th May) / Traditional Dutch Village (from 11th May) – Amsterdam Canal Cruise – Germany",
        description:
          "After breakfast and check out, proceed to Lisse. (Until 10th May, visit Keukenhof Gardens; from 11th May onwards, visit a traditional Dutch village with windmills, wooden houses, and craft workshops). Later, proceed to Amsterdam and enjoy a scenic canal cruise aboard a glass-topped boat through its UNESCO-listed waterways. After the cruise, continue your journey towards Germany and check in to your hotel in the Frankfurt region. Overnight stay at the hotel in Germany. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Frankfurt region",
      },
      {
        day: 9,
        title: "Heidelberg Altstadt – Church of the Holy Spirit – Black Forest – Rhine Falls with Boat Ride",
        description:
          "After breakfast and check out, proceed to Heidelberg Altstadt along the Neckar River below Heidelberg Castle. Stroll cobblestone streets and visit the Church of the Holy Spirit. Continue to the Black Forest to witness a demonstration of traditional cuckoo-clock making. Later, journey to Switzerland and experience Rhine Falls, the largest waterfall in Europe, with an exhilarating boat ride close to the cascading waters. Proceed to your hotel in Central Switzerland. Overnight stay at the hotel in Central Switzerland. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 10,
        title: "Jungfraujoch – Top of Europe – Interlaken",
        description:
          "After breakfast, proceed to Interlaken nestled between two lakes. Embark on an alpine excursion to Jungfraujoch – the 'Top of Europe'. Travel from Grindelwald Terminal aboard the state-of-the-art 3S-Bahn Eiger Express to Eigergletscher, then continue by cogwheel train to Europe's highest railway station at 11,333 feet. Explore the Ice Palace, admire ice sculptures, and visit the Sphinx Observatory for views of the Aletsch Glacier. Overnight stay at the hotel in Central Switzerland. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 11,
        title: "Mount Titlis – Lucerne Orientation Tour – Lindt Home of Chocolate",
        description:
          "After breakfast, proceed to Mount Titlis aboard the world-famous Rotair revolving cable car, ascending to 3,020 metres. Experience the Cliff Walk, Europe's highest suspension bridge. Later, enjoy an orientation tour of Lucerne visiting the Lion Monument and historic Kapellbrücke (Chapel Bridge), with free time for Swiss watch and chocolate shopping. Conclude at the Lindt Home of Chocolate in Zurich, featuring interactive chocolate exhibits and a giant chocolate fountain. Overnight stay at the hotel in Central Switzerland. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 12,
        title: "Vaduz – Liechtenstein Mini Train Ride – Swarovski Crystal Worlds – Innsbruck",
        description:
          "After breakfast and check out, proceed towards Innsbruck. Arrive in Vaduz, capital of Liechtenstein, and enjoy a guided mini train ride through the town. Continue to Wattens, Austria, to visit the dazzling Swarovski Crystal Worlds with its artistic crystal installations. Later, proceed to Innsbruck for an orientation tour viewing the famous Golden Roof and strolling along Maria Theresien Strasse surrounded by Alpine scenery. Overnight stay at the hotel in Innsbruck / Seefeld. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Innsbruck / Seefeld",
      },
      {
        day: 13,
        title: "Welcome to Venice, Italy – The Floating City. Enjoy a Romantic Gondola Ride",
        description:
          "After breakfast and check out, proceed to Venice. Board a private boat to St. Mark's Square in the heart of Venice. Admire St. Mark's Basilica, the Bell Tower, historic Clock Tower, and the Bridge of Sighs spanning Rio di Palazzo. Later, experience the romance of Venice with a scenic gondola ride through its winding canals past baroque palaces. Return to pier and proceed to hotel for check-in. Overnight stay at the hotel in Padova / Ferrara. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Padova / Ferrara",
      },
      {
        day: 14,
        title: "Guided City Tour of Florence. View the Duomo & Remarkable Leaning Tower of Pisa",
        description:
          "After breakfast and check out, proceed to Florence, the cradle of the Renaissance. With an English-speaking local guide, explore the Duomo, Campanile, Baptistery's Gates of Paradise, Piazza della Signoria open-air museum, Palazzo Vecchio, and the Ponte Vecchio bridge across the River Arno. Later, proceed to Pisa to view the world-famous Square of Miracles and the iconic Leaning Tower of Pisa. Overnight stay at the hotel in Tuscany region. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Tuscany region",
      },
      {
        day: 15,
        title: "Trip to the Eternal City of Rome. Visit Vatican City & St. Peter's Basilica",
        description:
          "After breakfast and check out, proceed to Rome for an orientation tour. Visit Vatican City, the world's smallest independent state. Tour the Sistine Chapel with Michelangelo's Last Judgement and St. Peter's Basilica. (Note: In case Vatican tickets are unavailable, Colosseum entrance is provided). Drive past the ancient Colosseum, toss a coin at the Trevi Fountain, view the Victor Emmanuel Monument and Roman Forum. Overnight stay at the hotel in Rome. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Rome",
      },
      {
        day: 16,
        title: "Fly Back Home",
        description:
          "Your memorable European holiday comes to an end today. After breakfast, check out from the hotel and proceed to Rome FCO Airport for your return flight. (Coach drops at FCO Airport by 11:00 AM). Depart with unforgettable memories of your journey across Europe. (Breakfast)",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation in 4-star hotels with daily buffet breakfast",
      "Sightseeing & attraction tickets as mentioned in the itinerary",
      "Tips to coach drivers and guide tips for the duration of the tour is included",
      "Daily Continental Buffet Breakfast",
      "14 Indian Jain/Vegetarian/Non-Vegetarian Lunches",
      "15 Indian Jain/Vegetarian/Non-Vegetarian Dinners",
      "Daily Mineral Water Bottle (500ml) per person",
      "Packed lunch served on London to Paris day and Disneyland Paris day",
      "Eurostar high-speed train London to Paris",
      "Eiffel Tower 3rd level, Versailles Palace, Seine Cruise, Paris by Night",
      "Full day Disneyland® Paris pass",
      "Mini Europe entrance in Brussels",
      "Keukenhof Gardens / Dutch Village & Amsterdam Canal Cruise",
      "Black Forest cuckoo clock demonstration & Rhine Falls boat ride",
      "Jungfraujoch Top of Europe with Eiger Express 3S cable car & cogwheel train",
      "Mount Titlis Rotair revolving cable car & Cliff Walk",
      "Vaduz Liechtenstein mini train ride",
      "Swarovski Crystal Worlds entrance in Wattens",
      "Venice private boat transfer & romantic Gondola ride",
      "Guided tours: London, Paris, Florence, and Vatican / Rome",
      "Special handpicked treats: Champagne, Belgian Waffle, Dutch souvenir, Black Forest cake, Swiss milkshake, Italian pizza, pasta, wine & gelato",
    ],
    exclusions: [
      "5% GST & 2% TCS and any other applicable taxes",
      "Airfare (international & domestic unless specified)",
      "Visa, Passport & POE charges, Travel Insurance",
      "Airport taxes and other applicable charges",
      "Cost of excursions, sightseeing, entrance fees, and local guides not mentioned in Inclusions",
      "Personal expenses such as porterage, laundry, telephone calls, shopping, snacks, etc.",
      "Cost of pre/post tour hotel accommodation",
      "Any expenses arising due to flight delays, cancellations, weather conditions, political issues, or technical faults",
      "Porterage charges, City tax",
    ],
    faqs: [
      {
        question: "What is the total tour cost across sharing categories?",
        answer:
          "Total Tour Cost (valid till 31st July 2026):\n• Double/Triple sharing basis: ₹4,13,700/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹5,45,294/- + 5% GST + 2% TCS per person\n• Child with bed (below 12 years): ₹3,31,100/- + 5% GST + 2% TCS\n• Child no bed (below 12 years): ₹2,77,200/- + 5% GST + 2% TCS\n• Infant (below 02 years): ₹10,600/- + 5% GST + 2% TCS",
      },
      {
        question: "What are the departure dates for Grand Tour of Europe?",
        answer: "Departure dates: 12 Oct & 01 Nov.",
      },
      {
        question: "What are the coach transfer timings for arrival and departure?",
        answer:
          "• London (LHR Airport) Arrival Transfer: Flight landing time should be between 08:00 AM – 02:00 PM.\n• Rome (FCO Airport) Departure Transfer: The coach will drop at FCO Airport by 11:00 AM.\n(Waiting up to 02:30 hours in arrival hall may be required for scheduled coach transfers).",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "Payment Terms:\n• At booking: 50% non-refundable booking amount.\n• 30 days prior to departure (D-30): Full balance payment (ROE calculated as XE.com + 2).\n\nCancellation Charges:\n• Up to 45 days before departure: INR 40,000 per adult/child.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
    ],
  },
  {
    id: "kerala-kanyakumari",
    title: "Kerala with Kanyakumari – 7 Nights / 8 Days",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹39,999",
    highlights: [
      "Munnar Tea Gardens & Tea Museum",
      "Cheeyappara Waterfalls",
      "Eravikulam National Park (Nilgiri Tahr)",
      "Mattupetty Dam & Kundala Lake",
      "Spice Plantation Visit in Thekkady",
      "Kathakali Dance Performance & Kalaripayattu Martial Arts Show",
      "Jatayu Earth's Center with Ropeway Ride",
      "Varkala Cliff Beach",
      "Sree Padmanabhaswamy Temple VIP Darshan",
      "Napier Museum & Kuthiramalika Museum",
      "Full-Day Kanyakumari Excursion & Vivekananda Memorial",
      "Triveni Sangam & Sunset Viewpoint",
      "Traditional Kerala Houseboat Stay in Alleppey",
      "Scenic 1-Hour Shikara Ride",
      "Traditional Kerala Sadhya Meal Experience",
      "Ayurvedic Spa Experience",
      "Periyar Wildlife Experience (Boat Ride / Elephant Ride)",
      "Daily Bandhan Special Treats",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Munnar · Thekkady · Varkala · Kovalam · Kanyakumari · Alleppey · 7N/8D",
    overview:
      "A grand 7 Nights / 8 Days Kerala and Kanyakumari holiday spanning misty hills, coastal cliffs, sacred temples, and tranquil backwaters. Highlights include Munnar's sprawling tea gardens and Eravikulam National Park, spice plantations and cultural shows in Thekkady, the monumental Jatayu Earth's Center cable car ride, Varkala's red cliffs, Trivandrum's Sree Padmanabhaswamy Temple with VIP Darshan, a full-day excursion to India's southernmost tip at Kanyakumari and Vivekananda Rock Memorial, concluding with an authentic overnight houseboat cruise through the backwaters of Alleppey.\n\nTour Departure Dates: Sep 07, 28 | Oct 02, 12, 23 | Nov 01, 12, 20, 27 | Dec 07, 21, 25.",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to March",
    startingPoint: "Cochin International Airport (COK) / Ernakulam Railway Station",
    groupSize: "2+ guests",
    themes: ["Backwaters", "Hill Station", "Coastal", "Temple Heritage"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800", caption: "Alleppey Houseboat Backwaters" },
      { image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1800", caption: "Munnar Tea Plantations" },
      { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800", caption: "Kovalam and Varkala Beaches" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Cochin – Munnar (Approx. 130 km / 4 hrs)",
        description:
          "Upon arrival at Cochin Airport or Railway Station, meet our representative and proceed towards the picturesque hill station of Munnar. En route, visit the beautiful Cheeyappara Waterfalls. After hotel check-in, visit the famous Tea Museum to learn about Kerala's tea heritage. In the evening, guests may visit Blossom International Park (optional). (Bandhan Special Treat: Juice Sachet at Cheeyappara Waterfalls). Overnight stay in Munnar.",
        meals: "Lunch, Dinner",
        stay: "Munnar",
      },
      {
        day: 2,
        title: "Munnar Sightseeing (Approx. 45 km)",
        description:
          "After breakfast, explore the scenic beauty of Munnar by visiting Eravikulam National Park, home to the endangered Nilgiri Tahr. Later, enjoy the lush tea plantations and visit the Flower Garden, Mattupetty Dam, and Kundala Lake. Spend the day amidst breathtaking landscapes before returning to the hotel. (Bandhan Special Treat: Bhutta at Flower Garden). Overnight stay in Munnar.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Munnar",
      },
      {
        day: 3,
        title: "Munnar – Thekkady (Approx. 97 km / 3 hrs)",
        description:
          "After breakfast, proceed to Thekkady through scenic spice plantations where you'll learn about Kerala's famous spices. Upon arrival, check into the hotel. In the evening, witness Kerala's vibrant culture through a traditional Kathakali Dance Performance followed by the thrilling Kalaripayattu Martial Arts Show. (Bandhan Special Treat: Garam Masala Tea at Masala Garden). Overnight stay in Thekkady.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Thekkady",
      },
      {
        day: 4,
        title: "Thekkady – Varkala (Approx. 180 km / 5 hrs)",
        description:
          "After breakfast, drive towards the beautiful coastal town of Varkala. En route, visit the iconic Jatayu Earth's Center, featuring the world's largest bird sculpture and an exciting ropeway ride. Continue to Varkala and spend the evening relaxing near its famous cliffside beach. (Bandhan Special Treat: Jackfruit Chips at Jatayu Earth's Center). Overnight stay in Varkala.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Varkala",
      },
      {
        day: 5,
        title: "Varkala – Kovalam (Approx. 60 km / 2 hrs)",
        description:
          "After breakfast, travel to Trivandrum to visit the sacred Sree Padmanabhaswamy Temple with VIP Darshan. Continue to Kuthiramalika Museum and Napier Museum before exploring the local markets and relaxing at the beautiful Kovalam Beach in the evening. (Bandhan Special Treat: Coconut Water at Kovalam Beach). Overnight stay in Kovalam.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kovalam",
      },
      {
        day: 6,
        title: "Kanyakumari Excursion (Approx. 170 km / 5 hrs)",
        description:
          "After breakfast, proceed for a full-day excursion to Kanyakumari, India's southernmost tip. Visit Padmanabhapuram Palace, Suchindram Temple, Devi Kanyakumari Temple, Vivekananda Memorial, Gandhidham, and Triveni Sangam. Witness the spectacular sunset before returning to Kovalam. (Bandhan Special Treat: Raw Mango/Cucumber with Salt & Spice). Overnight stay in Kovalam.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kovalam",
      },
      {
        day: 7,
        title: "Kovalam – Alleppey (Approx. 172 km / 5 hrs)",
        description:
          "After breakfast, proceed to Alleppey and board a traditional Kerala Houseboat. Cruise through the tranquil backwaters while enjoying views of lush coconut groves, charming villages, and serene waterways. This unforgettable houseboat experience showcases the true essence of Kerala. (Bandhan Special Treat: Coconut Water with Banana Chips). Overnight stay in Alleppey Houseboat.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Alleppey Houseboat",
      },
      {
        day: 8,
        title: "Alleppey – Cochin Departure (Approx. 95 km / 2 hrs)",
        description:
          "After breakfast, check out from the houseboat and proceed to Cochin Airport or Railway Station for your onward journey. Depart with unforgettable memories of Kerala's enchanting backwaters, scenic hill stations, pristine beaches, vibrant culture, and warm hospitality.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Premium accommodation on Double/Triple Sharing basis (including traditional Kerala Houseboat stay)",
      "7 Breakfasts, 7 Lunches & 7 Dinners",
      "AC Vehicle for all transfers and sightseeing",
      "Professional Tour Manager throughout the tour",
      "All entrance tickets as per itinerary",
      "Evening Tea/Coffee",
      "Daily one bottle of mineral water per person",
      "Traditional Kerala Sadhya Meal",
      "Jatayu Earth's Center with Ropeway Ride",
      "Scenic 1-Hour Shikara Ride",
      "Kathakali Dance Show",
      "Kalaripayattu Martial Arts Show",
      "Ayurvedic Spa Experience",
      "Periyar Wildlife Experience (Boating or Elephant Ride, subject to availability)",
      "VIP Darshan Pass at Sree Padmanabhaswamy Temple",
      "Daily Bandhan Special Treats",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Train Fare",
      "Guide Charges",
      "Early Check-in & Late Check-out",
      "Additional Meals",
      "Optional Sightseeing & Activities",
      "Personal Expenses",
      "Expenses arising due to weather, roadblocks, illness, flight cancellation, or any unforeseen circumstances",
    ],
    faqs: [
      {
        question: "What is the tour package cost for Kerala with Kanyakumari?",
        answer:
          "Tour Pricing:\n• Double Occupancy: ₹39,999/- Per Person + 5% GST\n• Single Occupancy: ₹56,999/- Per Person + 5% GST\n• Extra Adult on Extra Bed: ₹32,000/- Per Person + 5% GST\n• Extra Child on Extra Bed: ₹32,000/- Per Person + 5% GST\n• Extra Child without Bed: ₹28,000/- Per Person + 5% GST.",
      },
      {
        question: "What are the departure dates for Kerala with Kanyakumari?",
        answer:
          "Tour Departure Dates:\n• September: 07, 28\n• October: 02, 12, 23\n• November: 01, 12, 20, 27\n• December: 07, 21, 25.",
      },
      {
        question: "What is the dress code and customs for temple visits in Kerala?",
        answer:
          "Carry a scarf/dupatta for temple visits. At Sree Padmanabhaswamy Temple in Trivandrum, traditional dress code is mandatory: men must wear a plain white or black dhoti/lungi without shirts, and women must wear a saree or traditional set-mundu. Most temples remain closed between 12:00 PM and 4:00 PM.",
      },
      {
        question: "What is the cancellation policy for this tour?",
        answer:
          "Cancellation Charges Before Departure:\n• 121 Days & Above: 5% of Total Tour Cost\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 00–05 Days / No Show / During the Tour: 100%.",
      },
    ],
  },
  {
    id: "mesmerizing-vietnam",
    title: "Mesmerizing Vietnam (Ho Chi Minh 2N | Da Nang 3N | Hanoi 1N | Halong Cruise 1N)",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹78,900",
    highlights: [
      "Ho Chi Minh City Tour",
      "Full-Day Mekong Delta Excursion",
      "Explore the Historic Cu Chi Tunnels",
      "Domestic Flights: Ho Chi Minh → Da Nang & Da Nang → Hanoi",
      "Visit Marble Mountains",
      "Explore the UNESCO-listed Hoi An Ancient Town",
      "Full-Day Ba Na Hills Excursion",
      "Ride the World-Famous Ba Na Hills Cable Car",
      "Visit the Iconic Golden Bridge",
      "Half-Day Hanoi City Tour",
      "Overnight Cruise in UNESCO-listed Ha Long Bay",
      "Scenic Cruise Through Limestone Islands & Emerald Waters",
      "Daily Breakfast",
      "Lunch, Dinner & Brunch as per Itinerary",
      "Airport Transfers & Sightseeing as per Itinerary",
      "Comfortable Hotel Accommodation",
    ],
    category: "International",
    tagline: "Ho Chi Minh 2N | Da Nang 3N | Hanoi 1N | Halong Cruise 1N · 7N/8D · Fixed Departures from Sep to Apr",
    overview:
      "A stunning 7 Nights / 8 Days journey across Vietnam featuring Ho Chi Minh City (2N), Da Nang (3N), Hanoi (1N), and an overnight cruise in Ha Long Bay (1N). Highlights include the Mekong Delta river cruise, Cu Chi Tunnels, domestic flights, Marble Mountains, UNESCO-listed Hoi An Ancient Town, Ba Na Hills with the world-famous Golden Bridge, a half-day Hanoi city tour, and cruising emerald waters among limestone karsts in Ha Long Bay.\n\nTour Departure Dates: Sep 12, 27 | Oct 3, 23 | Nov 3, 16 | Dec 10, 24 | Jan 4, 20 | Feb 12, 20 | Mar 12, 21 | Apr 12, 22.",
    heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to April",
    startingPoint: "Tan Son Nhat International Airport, Ho Chi Minh City",
    groupSize: "Min 25 pax for quoted rate",
    themes: ["Culture", "Scenic", "Cruise"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800", caption: "Golden Bridge, Ba Na Hills" },
      { image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800", caption: "Ha Long Bay limestone islands" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Ho Chi Minh Arrival – City Tour",
        description:
          "Upon arrival at Tan Son Nhat International Airport, meet your local guide and transfer to the hotel for check-in (from 02:00 PM). Later, proceed for a half-day Ho Chi Minh City tour, exploring the city's historical landmarks, cultural attractions, and vibrant local market. After the tour, return to the hotel. Overnight stay in Ho Chi Minh City. (L-D)",
        meals: "Lunch, Dinner",
        stay: "Ho Chi Minh City",
      },
      {
        day: 2,
        title: "Mekong Delta",
        description:
          "After breakfast at the hotel, proceed for a full-day excursion to the Mekong Delta. Enjoy a scenic river cruise, experience the local way of life, explore picturesque villages, and discover the region’s rich culture and traditions. Visit local workshops and enjoy regional specialties before returning to Ho Chi Minh City in the evening. Overnight stay in Ho Chi Minh City. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Ho Chi Minh City",
      },
      {
        day: 3,
        title: "Cu Chi Tunnel – Flight to Danang",
        description:
          "After breakfast at the hotel. Cu chi Tunnel- proceed for a half-day excursion to explore one of Vietnam’s most significant historical sites and learn about the country’s wartime history. Later, return to Ho Chi Minh City and transfer to the airport for your flight to Da Nang. Upon arrival, transfer to the hotel for check-in. Overnight stay in Da Nang. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Da Nang",
      },
      {
        day: 4,
        title: "Marble Mountain – Hoi An - Danang",
        description:
          "After breakfast at the hotel, proceed for a full-day excursion to explore the scenic Marble Mountains, renowned for their natural caves, pagodas, and panoramic views. Continue to the charming ancient town of Hoi An Ancient Town, where you can experience the rich cultural heritage, traditional architecture, and vibrant local atmosphere. Return to Da Nang in the evening. Overnight stay in Da Nang. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Da Nang",
      },
      {
        day: 5,
        title: "Ba Na Hills- Golden Bridge - Danang",
        description:
          "After breakfast at the hotel, proceed for a full-day excursion to Ba Na Hills. Enjoy a scenic cable car ride and explore the hill station's breathtaking landscapes, gardens, cultural attractions, and entertainment facilities. Visit the iconic Golden Bridge, famous for its unique architectural design and panoramic mountain views. Return to Da Nang in the evening. Overnight stay in Da Nang. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Da Nang",
      },
      {
        day: 6,
        title: "Flight to Hanoi – Half Day City Tour",
        description:
          "After breakfast at the hotel, enjoy free time until your transfer to the airport for your flight to Hanoi. Upon arrival, transfer to the hotel for check-in. Later, proceed for a half-day city tour exploring the capital’s historical landmarks, cultural attractions, and charming old quarters. Enjoy a guided walk through the city's vibrant streets and local surroundings before returning to the hotel. Overnight stay in Hanoi. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Hanoi",
      },
      {
        day: 7,
        title: "Hanoi – Ha Long Bay Overnight Cruise",
        description:
          "After an early breakfast, depart for Ha Long Bay, a UNESCO World Heritage Site renowned for its stunning limestone islands and emerald waters. Upon arrival, board your overnight cruise and enjoy a relaxing journey through the bay's spectacular scenery. Savor delicious onboard meals and take in the breathtaking views as you cruise through one of Vietnam’s most iconic destinations. Overnight stay on the cruise. (B-L-D)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Ha Long Bay Cruise",
      },
      {
        day: 8,
        title: "Halong Bay – Hanoi Departure",
        description:
          "After breakfast check-out from your hotel. Later you will be transfer to the Hanoi Airport to depart to home country with cherished memories created with Bandhan Tours!!! See you again! (B-BR)",
        meals: "Breakfast, Brunch",
        stay: "—",
      },
    ],
    inclusions: [
      "3 Star Hotel Accommodation on double sharing basis",
      "1N Halong Bay cruise",
      "Daily Breakfast at hotel",
      "Lunch & Dinner at restaurant",
      "Hanoi city tour",
      "Ho chi Minh city tour",
      "Marble Mountain",
      "All Tour and transfers on Private basis.",
      "English speaking tour guide above 20 persons",
      "Tour Leader above 20 persons throughout the tour",
      "water bottle per day per pax",
      "Sightseeing Entry charges as mentioned above",
      "Vietnam E-visa",
      "Complementary Travel Insurance up to 59 years",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Anything not mentioned above",
      "Any Activities",
      "Cost of pre or post tour hotel accommodation",
      "Expenses of personal nature such as other taxes, drinks, telephone, shopping, snacks, Porterage and laundry bills etc.",
      "Tips and porter charges",
      "Any additional expenses incurred due to any flight delay or cancellation, weather conditions, political closures, technical faults etc.",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing pricing?",
        answer:
          "Tour cost breakdown:\n• Double sharing basis: ₹78,900/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹93,900/- + 5% GST + 2% TCS per person\n• Triple sharing basis: ₹77,900/- + 5% GST + 2% TCS per person\n• Child with bed: ₹74,900/- + 5% GST + 2% TCS\n• Child without bed: ₹53,900/- + 5% GST + 2% TCS",
      },
      {
        question: "What are the confirmed tour departure dates?",
        answer:
          "Tour Departure Dates: Sep 12, 27 | Oct 3, 23 | Nov 3, 16 | Dec 10, 24 | Jan 4, 20 | Feb 12, 20 | Mar 12, 21 | Apr 12, 22.",
      },
      {
        question: "What are the passport, visa, and flight reporting guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid tourist visa is mandatory (Vietnam E-visa is included). Report at the airport at least 3 hours before the scheduled departure of your international flight. Standard hotel check-in is 2:00 PM and check-out is 12:00 PM.",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "A 50% advance payment is required to confirm booking, with the remaining balance due at least 15 days prior to departure.\n\nCancellation charges prior to departure:\n• 121 to 900 days: 10%\n• 91 to 120 days: 15%\n• 61 to 90 days: 20%\n• 46 to 60 days: 30%\n• 31 to 45 days: 40%\n• 21 to 30 days: 50%\n• 11 to 20 days: 75%\n• 0 to 10 days: 100%\nVisa fees, airfare, travel insurance, and non-refundable services apply in addition.",
      },
    ],
  },
  {
    id: "rajasthan-marwad",
    title: "Rajasthan Marwad – 7 Nights / 8 Days",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹34,999",
    highlights: [
      "Khatu Shyam Ji Temple Darshan & Salasar Balaji Temple",
      "Deshnok Karni Mata Rat Temple",
      "Junagarh Fort, Anup Mahal & Lalgarh Palace",
      "Camel Research Centre, Bikaner",
      "Jaisalmer Fort (UNESCO World Heritage Site)",
      "Patwon Ki Haveli & Gadisar Lake",
      "Tanot Mata Temple near Indo-Pak border",
      "Longewala War Memorial & War Museum",
      "Sam Sand Dunes Desert Safari with Camel Ride & Folk Show",
      "Mehrangarh Fort, Jaswant Thada & Blue City of Jodhpur",
      "Umaid Bhawan Palace Museum",
      "Daily Bandhan Special Treats & Farewell Sweet Box",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Jaipur – Khatu Shyam Ji 1N – Bikaner 2N – Jaisalmer 2N – Jodhpur 2N · 7N/8D",
    overview:
      "A grand 7 Nights / 8 Days journey through the vibrant heritage and desert landscapes of Marwad, Rajasthan. Seek divine blessings at Khatu Shyam Ji and Salasar Balaji, witness the royal opulence of Bikaner's Junagarh Fort and Deshnok's Karni Mata Temple, discover the Golden City of Jaisalmer, journey to the historic border posts of Tanot Mata and Longewala, sleep near the Sam Sand Dunes with cultural folk performances, and explore the majestic forts and palaces of the Blue City, Jodhpur.\n\nDeparture Dates: Sep 02, 26 | Oct 02, 21 | Nov 01, 14, 27 | Dec 07, 21.",
    heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to March",
    startingPoint: "Jaipur (Approx. 90 KM / 2 hrs to Khatu Shyam Ji)",
    groupSize: "Group departures",
    themes: ["Heritage", "Culture", "Desert"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Mehrangarh Fort, Jodhpur" },
      { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800", caption: "Sam Sand Dunes, Jaisalmer" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Jaipur – Khatu Shyam Ji (Approx. 90 KM / 2 Hrs)",
        description:
          "Upon arrival at Jaipur, meet our representative and proceed to the holy town of Khatu Shyam Ji. Check into the hotel and visit the sacred Khatu Shyam Ji Temple for evening darshan. Spend time exploring the temple surroundings and local market. (Bandhan Welcome Treat: Traditional Kesar Milk & Dry Fruit Prasad). Overnight stay in Khatu Shyam Ji.",
        meals: "Lunch, Dinner",
        stay: "Khatu Shyam Ji",
      },
      {
        day: 2,
        title: "Khatu Shyam Ji – Salasar Balaji – Bikaner (Approx. 300 KM / 6 Hrs)",
        description:
          "After breakfast proceed to Salasar Balaji Temple for darshan. Continue towards Bikaner through the scenic countryside. Check into the hotel and in the evening explore the famous local markets. (Bandhan Special Treat: Bikaneri Bhujia & Masala Chaas). Overnight stay in Bikaner.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bikaner",
      },
      {
        day: 3,
        title: "Bikaner Sightseeing",
        description:
          "After breakfast enjoy a full-day city tour covering Deshnok Karni Mata Temple, Junagarh Fort, Anup Mahal, Gaj Mandir, Sheesh Mahal, Prachina Museum, Sadul Museum, Camel Research Centre and Lalgarh Palace. (Bandhan Special Treat: Bikaneri Rasgulla & Kesar Lassi). Overnight stay in Bikaner.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bikaner",
      },
      {
        day: 4,
        title: "Bikaner – Jaisalmer (Approx. 330 KM / 6 Hrs)",
        description:
          "After breakfast proceed towards Jaisalmer through the beautiful Thar Desert. Enjoy the changing desert landscapes en route. Upon arrival check into the hotel and spend the evening exploring the local markets. (Bandhan Special Treat: Bajra Cookies & Traditional Herbal Tea). Overnight stay in Jaisalmer.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Jaisalmer",
      },
      {
        day: 5,
        title: "Tanot Mata Temple – Longewala – Sam Sand Dunes (Approx. 250 KM Round Trip)",
        description:
          "Visit the famous Tanot Mata Temple followed by Longewala War Memorial. Later proceed to Sam Sand Dunes and enjoy camel rides, jeep safari, folk dance, cultural performances and a mesmerizing desert sunset. (Bandhan Special Treat: Hot Pakoras & Masala Chai). Overnight stay in Jaisalmer.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Jaisalmer",
      },
      {
        day: 6,
        title: "Jaisalmer Sightseeing – Jodhpur (Approx. 285 KM / 5 Hrs)",
        description:
          "Visit Jaisalmer Fort, Patwon Ki Haveli, Jain Mandir and Gadisar Lake (Boating at own cost). Later proceed to Jodhpur via the War Museum. Upon arrival check into the hotel. (Bandhan Special Treat: Makhaniya Lassi). Overnight stay in Jodhpur.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Jodhpur",
      },
      {
        day: 7,
        title: "Jodhpur Sightseeing",
        description:
          "After breakfast visit Umaid Bhawan Palace Museum, Mehrangarh Fort, Moti Mahal, Phool Mahal, Sheesh Mahal, Daulat Khana, Rang Mahal and Jaswant Thada. Spend the evening enjoying time with your fellow travellers. (Bandhan Special Treat: Mirchi Vada & Rabdi). Overnight stay in Jodhpur.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Jodhpur",
      },
      {
        day: 8,
        title: "Departure from Jodhpur",
        description:
          "After breakfast check out from the hotel and transfer to Jodhpur Airport/Railway Station for your onward journey. Take home unforgettable memories of Rajasthan along with a Bandhan Farewell Sweet Box and Souvenir Gift Pack.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing Basis",
      "7 Breakfasts, 8 Lunches, 7 Dinners",
      "AC Vehicle for all Transfers & Sightseeing",
      "Professional Tour Manager",
      "Entrance Tickets",
      "Evening Tea/Coffee",
      "Daily 1 Bottle Mineral Water per person",
      "Travel Insurance",
      "Khatu Shyam Ji & Salasar Balaji Temple Visits",
      "Deshnok Karni Mata Temple",
      "Junagarh Fort & Museums",
      "Camel Research Centre",
      "Jaisalmer Fort",
      "Patwon Ki Haveli & Gadisar Lake",
      "Tanot Mata Temple & Longewala War Memorial",
      "Sam Sand Dunes Experience (Camel ride, jeep safari & folk dance)",
      "Mehrangarh Fort, Umaid Bhawan Palace & Jaswant Thada",
      "Blue City of Jodhpur",
      "Daily Bandhan Special Treats & Farewell Sweet Box",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Train Fare",
      "Guide Charges",
      "Early Check-in & Late Check-out",
      "Additional Meals & Sightseeing",
      "Rickshaw Charges & Boating at Gadisar Lake",
      "Activity Charges not mentioned",
      "Expenses due to weather, illness, roadblocks or flight cancellation",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹34,999/- Per Person + 5% GST\n• Single Occupancy: ₹46,998/- Per Person + 5% GST\n• Adult with Extra Bed: ₹28,999/- Per Person + 5% GST\n• Child with Extra Bed: ₹28,999/- Per Person + 5% GST\n• Child Without Bed: ₹25,999/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for Rajasthan Marwad?",
        answer:
          "Departure Dates:\n• September: 02, 26\n• October: 02, 21\n• November: 01, 14, 27\n• December: 07, 21",
      },
      {
        question: "What are the booking payment terms and cancellation charges?",
        answer:
          "Payment Terms:\n• 50% payment required at booking confirmation.\n• Full payment must be completed 15 days prior to departure.\n\nCancellation Policy:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 0–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "singapore-malaysia-thailand",
    title: "Singapore Malaysia Thailand (2N Pattaya | 2N Bangkok | 2N Kuala Lumpur | 3N Singapore)",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1800",
    duration: "9 Nights / 10 Days",
    price: "₹1,05,000",
    highlights: [
      "Bangkok • Pattaya • Kuala Lumpur • Genting Highlands • Singapore",
      "Alcazar Cabaret Show, Pattaya",
      "Coral Island Tour by Speedboat",
      "Bangkok City & Temple Tour (Wat Traimit Golden Buddha & Wat Benchamabophit Marble Buddha)",
      "Full-Day Safari World & Marine Park with Lunch",
      "Putrajaya Orientation Tour & Kuala Lumpur City Tour",
      "Batu Caves Visit & Two-Way Cable Car Ride to Genting Highlands",
      "Petronas Twin Towers (Photo Stop) & KL Tower Observatory Deck",
      "Scenic Coach Journey from Kuala Lumpur to Singapore",
      "Night Safari Tram Tour, Singapore",
      "Sentosa Island Excursion with Cable Car Ride",
      "Gardens by the Bay & Marina Bay Sands",
      "Universal Studios Singapore & Wings of Time Night Show",
      "Singapore Half-Day City Tour",
      "Daily Breakfast, Lunch & Dinner at Indian Restaurants (as per itinerary)",
      "All Tours & Transfers on Private Basis",
    ],
    category: "International",
    tagline: "2N Pattaya | 2N Bangkok | 2N Kuala Lumpur | 3N Singapore · 9N/10D Grand Tri-Nation Tour",
    overview:
      "A grand 9 Nights / 10 Days tri-nation Southeast Asian holiday spanning Thailand, Malaysia, and Singapore. Experience Pattaya's vibrant Alcazar show and Coral Island speedboat trip, Bangkok's revered Golden & Marble Buddha temples and full-day Safari World, Kuala Lumpur's iconic skyline, Batu Caves and Genting Highlands cable car, followed by a scenic coach transfer to Singapore for the Night Safari, Sentosa Island, Gardens by the Bay, Marina Bay Sands, and a thrilling day at Universal Studios Singapore.",
    heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=90&w=3200",
    bestTime: "Year-round",
    startingPoint: "Bangkok Suvarnabhumi Airport (BKK) / Don Mueang (DMK)",
    groupSize: "Min 25 pax for group departures",
    themes: ["Theme Parks", "City & Culture", "Family Holiday", "Tropical Beaches"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1800", caption: "Singapore Marina Bay skyline and Gardens by the Bay" },
      { image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800", caption: "Wat Arun and Grand Palace, Bangkok" },
      { image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=85&w=1800", caption: "Petronas Twin Towers, Kuala Lumpur" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok – Transfer to Pattaya",
        description:
          "Welcome to Thailand! Upon arrival at Bangkok Airport (Expected Arrival Time: 10:50 AM), proceed to Pattaya. Check in to the hotel and relax (check-in at 2:00 PM). In the evening, attend the world-famous Alcazar Cabaret Show, a grand artistic delight for music and dance lovers showcasing a marvelous combination of music, dance, and vibrant costumes. (Note: These events draw huge crowds; guests are recommended to arrive early). Overnight stay in Pattaya.",
        meals: "Lunch, Dinner",
        stay: "Pattaya",
      },
      {
        day: 2,
        title: "Coral Island Tour",
        description:
          "After breakfast, proceed to the Coral Island tour by speedboat (subject to weather conditions). Escape to the beautiful Koh Larn Coral Island off the Pattaya coast. Spend time at leisure relaxing on the beach or enjoying optional water sports such as banana boat rides, jet skiing, parasailing, and swimming in tropical waters (at own expense; carry swimwear, towel, sunglasses). Free time for leisure. Overnight stay at hotel in Pattaya.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Pattaya",
      },
      {
        day: 3,
        title: "Transfer from Pattaya to Bangkok – City and Temple Tour",
        description:
          "After breakfast, check out from the hotel and proceed to Bangkok. En route, enjoy a Bangkok City & Temple Tour covering the famous Golden Buddha Temple (Wat Traimit), home to the world's largest solid gold Buddha statue, and the beautiful Marble Buddha Temple (Wat Benchamabophit), renowned for its stunning Italian marble architecture and serene atmosphere. Conclude the tour at Gems Gallery, the largest jewellery store in the world. Later, transfer to the hotel for check-in. Overnight stay in Bangkok.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bangkok",
      },
      {
        day: 4,
        title: "Full Day Safari World and Marine Park",
        description:
          "Enjoy a full-day visit to Bangkok's premier open zoo and leisure park. Explore the Safari Park from your vehicle observing lions, zebras, giraffes, and rhinos through African-inspired landscapes, and visit the Marine Park featuring exciting dolphin shows, sea lion performances, orangutan boxing shows, and a scenic jungle cruise. Overnight stay in Bangkok.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Bangkok",
      },
      {
        day: 5,
        title: "Bangkok to Kuala Lumpur – Putrajaya & Kuala Lumpur City Tour",
        description:
          "After breakfast, check out from the hotel and transfer to the airport for your flight to Kuala Lumpur. Upon arrival, enjoy an orientation tour of Putrajaya, Malaysia's administrative capital, followed by a Kuala Lumpur city tour including photo stops at the Petronas Twin Towers, King's Palace, National Monument, and the KL Tower observatory deck. Admire the city's illuminated skyline in the evening before returning to the hotel. Overnight stay in Kuala Lumpur.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuala Lumpur",
      },
      {
        day: 6,
        title: "Genting Day Trip, En-route to Batu Caves, with a Two-Way Cable Car Ride",
        description:
          "After breakfast, proceed to Genting Highlands, an integrated mountain resort destination. En route, visit the sacred Batu Caves with its massive golden Lord Murugan statue and 272 colorful steps. Travel aboard Asia's longest and fastest cable car (Awana SkyWay) to Genting Highlands, enjoying the cool mountain air, indoor theme park, and casino entertainment. Return to Kuala Lumpur for an overnight stay.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kuala Lumpur",
      },
      {
        day: 7,
        title: "Kuala Lumpur to Singapore (By Coach) – Night Safari",
        description:
          "After an early morning breakfast, depart Kuala Lumpur and journey to Singapore by luxury coach. Upon arrival and border formalities, transfer to your hotel and check in. In the evening, experience the world-famous Night Safari, embarking on a tram ride through nocturnal habitats to observe wildlife in their natural night setting. Overnight stay in Singapore.",
        meals: "Packed Breakfast, Dinner",
        stay: "Singapore",
      },
      {
        day: 8,
        title: "Sentosa Island – Marina Bay Sands & Gardens by the Bay",
        description:
          "After breakfast, proceed to Sentosa Island via scenic cable car and explore its popular attractions and beaches. Later, visit Marina Bay Sands and Gardens by the Bay, two of Singapore's most iconic architectural landmarks. Marvel at the futuristic Supertree Grove, Flower Dome, and Cloud Forest while taking in breathtaking views of the Marina Bay skyline. Overnight stay in Singapore.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Singapore",
      },
      {
        day: 9,
        title: "Universal Studios Singapore & Wings of Time",
        description:
          "After breakfast, proceed to Southeast Asia's first and only Universal Studios theme park on Sentosa Island. Enjoy cutting-edge rides and attractions across themed zones, including Battlestar Galactica: Human vs. Cylon, Transformers The Ride: The Ultimate 3D Battle, Jurassic Park Rapids Adventure, and Shrek 4-D Adventure. In the evening, witness 'Wings of Time', a spectacular multi-sensory outdoor night show set against the open sea with water, laser, and fire effects. Overnight stay in Singapore.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Singapore",
      },
      {
        day: 10,
        title: "Singapore City Tour – Departure",
        description:
          "After breakfast, proceed for a half-day Singapore city tour covering the Merlion Park, Chinatown, Little India, and Civic District. Return to the hotel, check out, and transfer to Singapore Changi Airport for your return flight home (expected departure time: 07:30 PM), carrying unforgettable memories of Thailand, Malaysia, and Singapore.",
        meals: "Breakfast, Lunch",
        stay: "—",
      },
    ],
    inclusions: [
      "3-Star hotel accommodation on double/twin sharing basis (2N Pattaya, 2N Bangkok, 2N Kuala Lumpur, 3N Singapore)",
      "Daily Breakfast at hotel",
      "Lunches & Dinners at Indian Restaurants (as per itinerary)",
      "Coral Island Tour by Speedboat with Lunch on SIC",
      "Alcazar Cabaret Show in Pattaya",
      "Bangkok City & Temple Tour (Golden Buddha Wat Traimit & Marble Buddha Wat Benchamabophit)",
      "Full-Day Safari World & Marine Park with Lunch",
      "Putrajaya Orientation Tour & Kuala Lumpur City Tour",
      "Batu Caves Visit & Two-Way Cable Car Ride to Genting Highlands",
      "Petronas Twin Towers (Photo Stop) & KL Tower Observatory Deck Entrance",
      "Scenic Coach Transfer from Kuala Lumpur to Singapore",
      "Night Safari Singapore Tram Tour & Show",
      "Sentosa Island Excursion with Cable Car Ride",
      "Marina Bay Sands & Gardens by the Bay Visit",
      "Full-Day Universal Studios Singapore Pass",
      "Wings of Time Outdoor Night Show",
      "Singapore Half-Day City Tour",
      "Thailand Visa on Arrival, Singapore Visa & Malaysia Arrival Card assistance",
      "Indian Tour Leader (for groups above 20 persons) & English-speaking guides",
      "Complimentary Travel Insurance up to 59 years of age",
      "All Tours & Transfers on Private Basis",
    ],
    exclusions: [
      "Any Airfare (International flights & Bangkok to Kuala Lumpur flight)",
      "Airport Taxes",
      "5% GST & 2% TCS (payable as per Indian government regulations)",
      "Cost of pre or post tour hotel accommodation",
      "Expenses of personal nature such as drinks, telephone, shopping, snacks, laundry, and porterage",
      "Tips and porter charges",
      "Any additional expenses incurred due to flight delays, cancellations, weather conditions, or political closures",
    ],
    faqs: [
      {
        question: "What is the total package cost across sharing categories?",
        answer:
          "Tour Pricing (based on min 25 pax):\n• Double sharing basis: ₹1,05,000/- + 5% GST + 2% TCS per person\n• Triple sharing basis: ₹1,02,000/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹1,20,000/- + 5% GST + 2% TCS per person\n• Child with bed: ₹97,000/- + 5% GST + 2% TCS\n• Child without bed: ₹81,000/- + 5% GST + 2% TCS\n• Child below 3 years: Complimentary.",
      },
      {
        question: "What are the departure dates for Singapore Malaysia Thailand?",
        answer:
          "Tour Departure Dates:\n• Sep 5, 26\n• Oct 10, 24\n• Nov 6, 21\n• Dec 5, 12\n• Jan 4, 21\n• Feb 12, 20\n• Mar 12, 21\n• Apr 12, 22.",
      },
      {
        question: "What is the booking and payment schedule?",
        answer:
          "A 50% advance payment is required to confirm the booking. The remaining balance must be paid at least 15 days prior to departure.",
      },
      {
        question: "What is the cancellation policy for this international tour?",
        answer:
          "Cancellation charges prior to departure:\n• 121+ days: 10%\n• 91 to 120 days: 15%\n• 61 to 90 days: 20%\n• 46 to 60 days: 30%\n• 31 to 45 days: 40%\n• 21 to 30 days: 50%\n• 11 to 20 days: 75%\n• 0 to 10 days: 100%.",
      },
    ],
  },
  {
    id: "sampurna-karnataka",
    title: "Sampurna Karnataka – 7 Nights / 8 Days",
    image: "https://images.unsplash.com/photo-1600100397608-f010f443b773?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹40,499",
    highlights: [
      "Hubli City Orientation Tour & Unkal Lake Sunset",
      "Badami Rock-Cut Cave Temples & Agastya Lake",
      "Aihole Temple Complex (Cradle of Hindu Architecture)",
      "Pattadakal UNESCO World Heritage Site",
      "Hampi UNESCO World Heritage Site (Virupaksha Temple & Stone Chariot)",
      "Vittala Temple, Lotus Mahal, Elephant Stables & Royal Enclosure",
      "Anegundi (Kishkindha) Village & Coracle Ride on Tungabhadra River",
      "Sahastra Linga in the Shalmala River",
      "Magnificent Jog Falls (India's Highest Plunge Waterfall)",
      "Gokarna Mahabaleshwar Temple (Sacred Atmalinga)",
      "Murudeshwar Shiva Temple & World's Second Tallest Shiva Statue",
      "Sringeri Sharada Peetham & Sri Vidyashankara Temple",
      "Scenic Western Ghats drive to Udupi Sri Krishna Temple",
      "St. Mary's Island Ferry Ride & Hexagonal Basalt Rock Formations",
      "Daily Bandhan Special Treats & Authentic Regional Delicacies",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Hubli 2N – Hampi 2N – Gokarna 1N – Murudeshwar 1N – Udupi 1N · 7N/8D",
    overview:
      "An exhilarating 7 Nights / 8 Days journey exploring the golden heritage, spiritual bastions, and dramatic coastlines of Karnataka. Explore ancient rock-cut caves in Badami, walk through the awe-inspiring Vijayanagara empire ruins at UNESCO World Heritage Hampi, float along the Tungabhadra in a traditional coracle, marvel at the roaring cascades of Jog Falls, pray before the Atmalinga in Gokarna and the gigantic cliffside Shiva statue at Murudeshwar, receive blessings at Sringeri and Udupi Sri Krishna Temple, and take a ferry to the volcanic basalt pillars of St. Mary's Island.\n\nDeparture Dates: Sep 07, 28 | Oct 02, 21 | Nov 10, 25 | Dec 01, 25.",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f443b773?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to March",
    startingPoint: "Hubli Airport / Railway Station (Arrival before 1:00 PM)",
    groupSize: "Group departures",
    themes: ["Heritage", "Spiritual", "Nature", "Coastal"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1600100397608-f010f443b773?auto=format&fit=crop&q=85&w=1800", caption: "Hampi Stone Chariot" },
      { image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800", caption: "Murudeshwar Shiva Statue" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Hubli",
        description:
          "Arrive at Hubli Airport/Railway Station and transfer to the hotel. After freshening up, enjoy a Hubli city orientation tour and visit Unkal Lake for a beautiful sunset view (subject to arrival time). (Bandhan Special Treat: Famous Dharwad Peda Tasting). Overnight stay in Hubli.",
        meals: "Dinner",
        stay: "Hubli",
      },
      {
        day: 2,
        title: "Hubli – Badami – Aihole – Pattadakal – Hampi (Approx. 280 KM / 6–7 Hrs)",
        description:
          "Proceed to Badami to explore the famous rock-cut cave temples and Agastya Lake. Continue to Aihole, known as the cradle of Hindu temple architecture, followed by Pattadakal, a UNESCO World Heritage Site. Later proceed to Hampi. (Bandhan Special Treat: Karnataka Filter Coffee & Maddur Vada). Overnight stay in Hampi.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Hampi",
      },
      {
        day: 3,
        title: "Hampi Sightseeing",
        description:
          "Explore the UNESCO World Heritage Site of Hampi, including Virupaksha Temple, Lakshmi Narasimha Statue, Krishna Temple, Vittala Temple with the Stone Chariot, Lotus Mahal, Elephant Stables, Royal Enclosure and Pushkarni. (Bandhan Special Treat: Fresh Tender Coconut). Overnight stay in Hampi.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Hampi",
      },
      {
        day: 4,
        title: "Hampi – Anegundi Village – Hubli (Approx. 185 KM / 4 Hrs)",
        description:
          "Proceed towards Hubli via Anegundi Village (Kishkindha). Enjoy a Coracle Ride on the Tungabhadra River (subject to operation) before continuing to Hubli. (Bandhan Special Treat: Banana Bajji & South Indian Tea). Overnight stay in Hubli.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Hubli",
      },
      {
        day: 5,
        title: "Hubli – Sahastra Linga – Jog Falls – Gokarna (Approx. 305 KM / 7 Hrs)",
        description:
          "Proceed towards Gokarna via Sahastra Linga and the magnificent Jog Falls. Later visit Mahabaleshwar Temple, famous for the sacred Atmalinga, before checking into the hotel. (Bandhan Special Treat: Hot Corn & Local Malnad Snacks). Overnight stay in Gokarna.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Gokarna",
      },
      {
        day: 6,
        title: "Gokarna – Murudeshwar (Approx. 80 KM / 1.5 Hrs)",
        description:
          "Proceed to Murudeshwar and visit the famous Shiva Temple housing the world's second tallest Shiva statue. Explore the Cave Sculptures and enjoy leisure time at Murudeshwar Beach. (Bandhan Special Treat: Coastal Ice Cream & Beachside Refreshments). Overnight stay in Murudeshwar.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Murudeshwar",
      },
      {
        day: 7,
        title: "Murudeshwar – Sringeri – Udupi (Approx. 235 KM / 5 Hrs)",
        description:
          "Visit the famous Sri Vidyashankara Temple and Sharada Peetham at Sringeri. Drive through the scenic Western Ghats before reaching Udupi. (Bandhan Special Treat: Authentic Udupi Filter Coffee & Mangalore Buns). Overnight stay in Udupi.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Udupi",
      },
      {
        day: 8,
        title: "Udupi – St. Mary's Island – Departure",
        description:
          "After breakfast, take a ferry to the scenic St. Mary's Island, famous for its basalt rock formations. Visit Sri Krishna Temple and local markets (subject to time) before proceeding to Mangalore Airport or Udupi Railway Station (departure after 6:00 PM).",
        meals: "Breakfast, Lunch",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing Basis",
      "All Meals (7 Breakfasts, 7 Lunches, 7 Dinners, Day 8 Lunch)",
      "AC Vehicle for all Transfers & Sightseeing",
      "Professional Tour Manager",
      "Entrance Tickets",
      "Evening Tea/Coffee",
      "Daily 1 Bottle Mineral Water per person",
      "Travel Insurance",
      "Traditional Karnataka Meal",
      "Coracle Ride on Tungabhadra River",
      "Ferry Tickets to St. Mary's Island",
      "Murudeshwar Temple Visit",
      "Hampi UNESCO Heritage Tour",
      "Badami Cave Temples & Jog Falls Visit",
      "Daily Bandhan Special Treats",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Train Fare",
      "Guide Charges",
      "Early Check-in & Late Check-out",
      "Additional Meals & Sightseeing",
      "Auto Rickshaw Charges (if applicable)",
      "Personal Expenses",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹40,499/- Per Person + 5% GST\n• Single Occupancy: ₹54,673/- Per Person + 5% GST\n• Adult with Extra Bed: ₹32,999/- Per Person + 5% GST\n• Child with Extra Bed: ₹32,999/- Per Person + 5% GST\n• Child without Bed: ₹29,999/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for Sampurna Karnataka?",
        answer:
          "Departure Dates:\n• September: 07, 28\n• October: 02, 21\n• November: 10, 25\n• December: 01, 25",
      },
      {
        question: "What are the arrival and departure transit guidelines?",
        answer:
          "• Arrival at Hubli Airport/Railway Station should be before 01:00 PM on Day 1.\n• Departure flight/train from Mangalore/Udupi should be scheduled after 06:00 PM on Day 8.\n• Carry a scarf/dupatta while visiting temples and respect temple customs.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation Charges Before Departure:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 0–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "sikkim-darjeeling-6n",
    title: "Sikkim Darjeeling (Gangtok 2N – Pelling 2N – Darjeeling 2N)",
    image: "/pdf-assets/kanchenjunga-darjeeling.jpg",
    duration: "06 Nights / 07 Days",
    price: "₹38,900",
    highlights: [
      "Tsomgo Lake (Changu Lake at 12,400 ft) & New Baba Mandir (13,200 ft)",
      "Nathula Pass excursion (14,500 ft, Indo-China border)",
      "Gangtok city tour: Flower Show, Chorten Stupa & Banjhakri Waterfalls",
      "Pelling: Khangchendzonga Waterfalls, Rimbi Waterfalls & Orange Garden",
      "Khecheopalri Sacred Wish-Fulfilling Lake",
      "Pemayangtse Monastery & Rabdentse Palace Ruins",
      "Pelling Sky Walk glass bridge",
      "Samdruptse Stupa & Char Dham replica in Namchi",
      "Tiger Hill early morning sunrise over Mt. Kanchenjunga",
      "Ghoom Monastery & Batasia Loop",
      "Japanese Temple, Peace Pagoda & Himalayan Mountaineering Institute",
      "Padmaja Naidu Himalayan Zoological Park & Tea Garden view",
    ],
    category: "North East",
    isPopular: true,
    tagline: "Gangtok 2N – Pelling 2N – Darjeeling 2N · 6N/7D · Fixed Departures",
    overview:
      "A breathtaking 6 Nights / 7 Days journey through the Eastern Himalayas covering Sikkim and Darjeeling. Ascend to high-altitude glacial lakes at Tsomgo (12,400 ft) and the Indo-China frontier at Nathula Pass (14,500 ft), explore sacred monasteries and waterfalls in Gangtok and Pelling, walk the exhilarating Pelling Sky Walk, witness the holy Char Dham complex at Namchi, and greet the golden sunrise over Mt. Kanchenjunga from Tiger Hill in Darjeeling.\n\nDeparture Dates: Sep 28 | Oct 02, 09, 21 | Nov 04, 12, 16, 19, 23 | Dec 02, 16, 23.",
    heroImage: "/pdf-assets/kanchenjunga-darjeeling.jpg",
    bestTime: "September to December, March to May",
    startingPoint: "NJP Railway Station / Bagdogra Airport (IXB) / Siliguri (120 km / 4 hrs)",
    groupSize: "Group departures",
    themes: ["Mountains", "Culture", "Scenic"],
    gallery: [
      { image: "/pdf-assets/kanchenjunga-darjeeling.jpg", caption: "Kanchenjunga range from Darjeeling" },
      { image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800", caption: "Tsomgo Lake, Sikkim" },
    ],
    itinerary: [
      {
        day: 1,
        title: "NJP / IXB / Siliguri – Gangtok (120 km / 4 hrs)",
        description:
          "Upon arrival at NJP Railway Station, Bagdogra Airport (IXB), or Siliguri, meet our representative and proceed to Gangtok (5,410 ft). On arrival, check in to the hotel. Overnight stay in Gangtok.",
        meals: "Dinner",
        stay: "Gangtok",
      },
      {
        day: 2,
        title: "Tsomgo Lake & New Baba Mandir (110 km / 4 hrs)",
        description:
          "After an early breakfast, proceed for a full-day excursion to Tsomgo Lake (12,400 ft) and New Baba Mandir (13,200 ft). Tsomgo Lake is one of the most beautiful high-altitude lakes surrounded by majestic mountains. Later, visit Nathula Pass (14,500 ft) (for Indian Nationals only). A special permit is required and is subject to approval by the Sikkim Tourism Department. Overnight stay in Gangtok.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Gangtok",
      },
      {
        day: 3,
        title: "Gangtok Half-Day City Tour & Transfer to Pelling (125 km / 5 hrs.)",
        description:
          "After breakfast, enjoy a half-day city tour of Gangtok, covering the Handicraft Centre, Flower Show, Chorten Stupa, Institute of Tibetology, and Bakthang / Banjhakri Waterfalls. Later, drive to Pelling (7,000 ft.). On arrival, check in to the hotel. Overnight stay in Pelling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Pelling",
      },
      {
        day: 4,
        title: "Pelling (Local Sightseeing)",
        description:
          "After breakfast, proceed for a full-day sightseeing, covering Orange Garden, Rimbi Waterfalls, Khangchendzonga Waterfalls, Khecheopalri Lake, Pemayangtse Monastery, Rabdentse Ruins, and the Sky Walk. Overnight stay in Pelling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Pelling",
      },
      {
        day: 5,
        title: "Pelling – Darjeeling via Namchi (110 km / 6 hrs)",
        description:
          "After breakfast, drive to Darjeeling (6,730 ft) via Namchi. En route, visit Samdruptse Stupa and beautiful replica of Char Dham. Upon arrival, check in to the hotel. Overnight stay in Darjeeling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Darjeeling",
      },
      {
        day: 6,
        title: "Darjeeling (Local Sightseeing)",
        description:
          "Early morning at 03:30 am, visit Tiger Hill to witness the sunrise over Mt. Kanchenjunga. On the way back, visit Ghoom Monastery and Batasia Loop. Have breakfast at hotel. Later, enjoy a half-day city tour covering the Japanese Temple & Peace Pagoda, Padmaja Naidu Himalayan Zoological Park, Himalayan Mountaineering Institute, Tenzing Rock, Tibetan Refugee Self-Help Centre, and an outer view of a Tea Garden. Overnight stay in Darjeeling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Darjeeling",
      },
      {
        day: 7,
        title: "Darjeeling – NJP / IXB / Siliguri (70 km / 3 hrs)",
        description:
          "After breakfast, check out from the hotel and proceed to Bagdogra Airport (IXB), NJP Railway Station, or Siliguri for your onward journey. Tour ends with sweet memories.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "3* Accommodation on double sharing as per itinerary",
      "Breakfast, Lunch & Dinner",
      "All Sightseeing Entry Fees",
      "1ltr water bottles per day per person",
      "Nathula Pass & Namchi Char Dham excursions included",
      "All applicable Transfers & Sightseeing by Innova / Xylo / Similar (AC does not work in hilly areas) on point-to-point basis",
      "All Driver Allowance & Parking Fees",
    ],
    exclusions: [
      "Train / Airfare",
      "Heater Charges at hotels",
      "Any travel or medical insurance",
      "Any changes in Government Taxes",
      "Expenses of personal nature like tips, laundry, camera fees, etc.",
      "Any cost arising due to natural calamities, landslides, or roadblocks",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Sharing: ₹38,900/- + 5% GST per person\n• Extra Mattress: ₹38,900/- + 5% GST\n• Child No Bed (5 - 12 yrs): ₹31,500/- + 5% GST\n• Single Occupancy: ₹48,700/- + 5% GST",
      },
      {
        question: "What are the departure dates for Sikkim Darjeeling?",
        answer:
          "Departure Dates:\n• Sep: 28\n• Oct: 02, 09, 21\n• Nov: 04, 12, 16, 19, 23\n• Dec: 02, 16, 23",
      },
      {
        question: "What are the permit requirements for Nathula Pass and Tsomgo Lake?",
        answer:
          "Nathula Pass is open only to Indian Nationals and is subject to permit approval, weather conditions, and government regulations. Guests must carry a valid Original Voter ID Card or Driving Licence, along with 02 passport-size photographs. (Aadhaar Card is NOT accepted for permit issuance).",
      },
      {
        question: "What are the payment terms and cancellation charges?",
        answer:
          "Payment Terms:\n• 30% booking amount at confirmation.\n• Full balance payment must be completed 15 days before departure.\n\nCancellation Policy:\n• 61 Days or more: 15% of Total tour cost\n• 46–60 Days: 25% of Total tour cost\n• 31–45 Days: 50% of Total tour cost\n• 16–30 Days: 75% of Total tour cost\n• 15 Days or less / No-show: 100% of Total tour cost",
      },
    ],
  },
  {
    id: "sikkim-darjeeling-9n",
    title: "Sikkim Darjeeling (Gangtok, Lachung, Pelling & Darjeeling 9N/10D)",
    image: "/pdf-assets/yumthang-valley-sikkim.jpg",
    duration: "9 Nights / 10 Days",
    price: "₹52,500",
    highlights: [
      "Tsomgo Lake (12,400 ft) & New Baba Mandir (13,200 ft)",
      "Nathula Pass Indo-China border (14,500 ft - subject to permit)",
      "North Sikkim drive: Seven Sisters & Naga Waterfalls to Lachung (8,610 ft)",
      "Yumthang Valley (11,800 ft) - the world-renowned Valley of Flowers",
      "Gangtok city tour: Chorten Stupa, Tibetology, Flower Show & Banjhakri Falls",
      "Scenic West Sikkim to Pelling (7,000 ft) & glass Sky Walk overlooking Kanchenjunga",
      "Khecheopalri Sacred Lake, Pemayangtse Monastery & Rabdentse Ruins",
      "Namchi Char Dham (Siddhesvara Dhaam) & 118-ft Guru Padmasambhava at Samdruptse",
      "Early morning Tiger Hill (8,400 ft) sunrise over Kanchenjunga & Mount Everest",
      "Ghoom Monastery, Batasia Loop, Himalayan Mountaineering Institute & Zoo",
      "All meals included: Daily Breakfast, Lunch & Dinner",
      "All transfers by dedicated Innova/Xylo/Similar vehicle",
    ],
    category: "North East",
    tagline: "Gangtok · Lachung · Yumthang Valley · Pelling · Namchi · Darjeeling · 9N/10D",
    overview:
      "A comprehensive 9 Nights / 10 Days grand Himalayan circuit through Sikkim and Darjeeling. Ascend to Gangtok, glacial Tsomgo Lake, and the Indo-China frontier at Nathula Pass. Journey into North Sikkim's pristine alpine beauty at Lachung and the rhododendron pastures of Yumthang Valley. Cross into West Sikkim for Pelling's glass skywalk, Pemayangtse Monastery, and Rabdentse ruins, visit South Sikkim's Namchi Char Dham and Samdruptse, and conclude in the tea-carpeted hills of Darjeeling with the legendary Tiger Hill sunrise over Mount Kanchenjunga.",
    heroImage: "/pdf-assets/yumthang-valley-sikkim.jpg",
    bestTime: "March to May & September to December",
    startingPoint: "NJP Railway Station / Bagdogra Airport (IXB) / Siliguri",
    groupSize: "2+ guests",
    themes: ["Himalayan Valleys", "High-Altitude Lakes", "Alpine Flowers", "Heritage Monasteries"],
    gallery: [
      { image: "/pdf-assets/yumthang-valley-sikkim.jpg", caption: "Yumthang Valley - Valley of Flowers, North Sikkim" },
      { image: "/pdf-assets/kanchenjunga-darjeeling.jpg", caption: "Sunrise over Mount Kanchenjunga from Tiger Hill" },
    ],
    itinerary: [
      {
        day: 1,
        title: "NJP / IXB / Siliguri – Gangtok (120 km / 4 hrs)",
        description:
          "Upon arrival at NJP Railway Station, Bagdogra Airport (IXB), or Siliguri, meet our representative and proceed to Gangtok (5,410 ft). On arrival, check in to the hotel. Spend the evening relaxing or strolling along MG Marg. Overnight stay in Gangtok.",
        meals: "Lunch, Dinner",
        stay: "Gangtok",
      },
      {
        day: 2,
        title: "Tsomgo Lake & New Baba Mandir (110 km / 4 hrs)",
        description:
          "After an early breakfast, proceed for a full-day excursion to Tsomgo Lake (12,400 ft) and New Baba Mandir (13,200 ft). Tsomgo Lake is one of the most beautiful high-altitude glacial lakes surrounded by majestic snow-clad mountains. Later, visit Nathula Pass (14,500 ft) on the Indo-China border (for Indian Nationals only; special permit subject to approval by the Sikkim Tourism Department). Overnight stay in Gangtok.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Gangtok",
      },
      {
        day: 3,
        title: "Gangtok – Lachung (135 km / 6 hrs)",
        description:
          "After breakfast, drive to Lachung (8,610 ft) in North Sikkim. En route, visit Singhik View Point, Seven Sisters Waterfall, and Naga Waterfall. Reach Lachung by evening and, if time permits, visit the historic Lachung Monastery. Overnight stay in Lachung.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Lachung",
      },
      {
        day: 4,
        title: "Lachung – Yumthang Valley – Lachung (48 km / 3 hrs)",
        description:
          "After breakfast, drive to the world-renowned Yumthang Valley (11,800 ft), popularly celebrated as the Valley of Flowers with alpine pastures, hot springs, and sweeping Himalayan views. (Optional excursion to Zero Point / Yumesamdong at direct payment, subject to weather). After sightseeing, return to Lachung. Overnight stay in Lachung.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Lachung",
      },
      {
        day: 5,
        title: "Lachung – Gangtok (135 km / 6 hrs)",
        description:
          "After breakfast, check out and drive back to Gangtok. En route, visit Bheema Falls and Twin Falls cascading down emerald mountain slopes. Upon arrival, check in to the hotel. Spend the evening at leisure. Overnight stay in Gangtok.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Gangtok",
      },
      {
        day: 6,
        title: "Gangtok City Tour – Pelling (115 km / 5 hrs)",
        description:
          "After breakfast, enjoy a half-day sightseeing tour of Gangtok covering the Directorate of Handicraft & Handloom, Flower Show, Do Drul Chorten Stupa, Namgyal Institute of Tibetology, and Bakthang Waterfall / Banjhakri Waterfalls. Later, drive across scenic West Sikkim to Pelling (7,000 ft) and check in to your hotel. Overnight stay in Pelling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Pelling",
      },
      {
        day: 7,
        title: "Pelling Local Sightseeing",
        description:
          "After breakfast, embark on full-day sightseeing in and around Pelling. Visit the Orange Garden, Rimbi Waterfalls, Khangchendzonga Waterfalls, the wishing lake at Khecheopalri, Pemayangtse Monastery, the historic Rabdentse Ruins, and walk on the thrilling glass Sky Walk overlooking Mt. Kanchenjunga. Overnight stay in Pelling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Pelling",
      },
      {
        day: 8,
        title: "Pelling – Darjeeling via Namchi (110 km / 6 hrs)",
        description:
          "After breakfast, head towards Darjeeling (6,730 ft) via Namchi in South Sikkim. Visit the towering Samdruptse Stupa (featuring the 118-ft statue of Guru Padmasambhava) and the magnificent replica complex of the Char Dham of India (Siddhesvara Dhaam). Continue through lush tea plantations to Darjeeling. Check in to the hotel and spend the rest of the day at leisure. Overnight stay in Darjeeling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Darjeeling",
      },
      {
        day: 9,
        title: "Darjeeling Local Sightseeing",
        description:
          "Early morning at 03:30 AM, drive to Tiger Hill (8,400 ft) to witness the sunrise over Mount Kanchenjunga and Mount Everest. On the return drive, visit the historic Ghoom Monastery and the Batasia Loop war memorial. Return to hotel for breakfast. Later, enjoy a half-day city tour covering the Japanese Temple & Peace Pagoda, Padmaja Naidu Himalayan Zoological Park, Himalayan Mountaineering Institute (HMI), Tenzing Rock, Tibetan Refugee Self-Help Centre, and an outer view of a scenic tea garden. Overnight stay in Darjeeling.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Darjeeling",
      },
      {
        day: 10,
        title: "Darjeeling – NJP / IXB / Siliguri (70 km / 3 hrs)",
        description:
          "After breakfast, check out from the hotel and proceed to Bagdogra Airport (IXB), NJP Railway Station, or Siliguri for your return journey. Tour ends with sweet memories of Sikkim and Darjeeling.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on a double-sharing basis as per the itinerary",
      "All meals: Daily Breakfast, Lunch & Dinner",
      "Nathula Pass excursion (subject to permit approval) and Namchi Char Dham visit",
      "Daily 1 litre packaged drinking water bottles per person",
      "All entry fees and inner-line permits",
      "All transfers and sightseeing by A/C Innova / Xylo / Similar (A/C will not operate in hilly areas) on a point-to-point basis sector-wise",
      "All toll taxes, parking charges, driver allowances, and applicable permits",
    ],
    exclusions: [
      "Train fare / Airfare",
      "5% GST",
      "Room heater charges at hotels",
      "Zero-Point (Yumesamdong) excursion charges (optional direct payment)",
      "Travel Insurance and Medical Insurance",
      "Personal expenses such as laundry, telephone calls, tips, porterage, shopping, etc.",
      "Any services or items not specifically mentioned under Inclusions",
      "Additional expenses arising due to natural calamities, landslides, road blockages, adverse weather conditions, or political disturbances",
    ],
    faqs: [
      {
        question: "What is the tour package cost for Sikkim Darjeeling 9N/10D?",
        answer:
          "Tour Pricing:\n• Double Sharing: ₹52,500/- + 5% GST per person\n• Extra Mattress: ₹47,500/- + 5% GST\n• Child No Bed (5 yrs - 12 yrs): ₹42,000/- + 5% GST\n• Single Occupancy: ₹63,500/- + 5% GST.",
      },
      {
        question: "What are the mandatory permit documents for Nathula Pass and North Sikkim?",
        answer:
          "For Tsomgo Lake, Baba Mandir, and Nathula Pass permits, guests must carry their original Voter ID card, Driving Licence, or Passport, plus 2 passport-size photographs. (Aadhaar cards are NOT accepted by local authorities for Nathula permits). Nathula Pass is open only to Indian nationals and is subject to government approval and weather.",
      },
      {
        question: "What are the booking payment milestones and vehicle guidelines?",
        answer:
          "30% advance payment is required at booking confirmation, with the remaining balance due 15 days prior to departure. Sightseeing is provided by comfortable Innova/Xylo/similar on a sector-wise point-to-point basis. Per mountain transport norms, air conditioning does not operate in hilly terrain.",
      },
      {
        question: "What is the cancellation policy for this tour?",
        answer:
          "Cancellation fees based on notice prior to departure:\n• 61+ days: 15% of total tour cost\n• 46–60 days: 25% of total tour cost\n• 31–45 days: 50% of total tour cost\n• 16–30 days: 75% of total tour cost\n• 15 days or less / No-show: 100% of total tour cost.",
      },
    ],
  },
  {
    id: "south-india-temple-tour",
    title: "South India Temple Tour – 5 Nights / 6 Days",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
    duration: "5 Nights / 6 Days",
    price: "₹28,599",
    highlights: [
      "Meenakshi Amman Temple, Madurai",
      "Tirupparankundram & Azhagar Temple",
      "Thirumalai Nayakkar Mahal",
      "Scenic drive across the iconic Pamban Bridge",
      "Ramanathaswamy Temple & Agnitheertham",
      "Excursion to Dhanushkodi (Ghost Town of India)",
      "Sacred Sphatik Lingam Darshan & 22 Teerthams",
      "Tiruchendur Subramanya Swamy Temple",
      "Sunset at Triveni Sangam, Kanyakumari",
      "Vivekananda Rock Memorial & Thiruvalluvar Statue",
      "Newly developed Glass Bridge, Kanyakumari",
      "Suchindram Temple",
      "VIP Darshan Pass at Sree Padmanabhaswamy Temple",
      "Raja Ravi Varma Art Gallery & Napier Museum",
      "Traditional Tamil Nadu Banana Leaf Meal",
      "Traditional South Indian Wellness Therapy",
      "Daily Local Special Treats & Evening Tea/Coffee",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Madurai 1N – Rameshwaram 2N – Kanyakumari 1N – Trivandrum 1N · 5N/6D",
    overview:
      "An inspiring 5 Nights / 6 Days spiritual and cultural journey across Tamil Nadu and Kerala. Experience the towering gopurams of Madurai's Meenakshi Amman Temple, drive across the engineering marvel of Pamban Bridge to Rameshwaram, take holy dips in the 22 Teerthams, visit the land's end at Dhanushkodi, witness the confluence of three oceans at Kanyakumari, and receive VIP darshan at the legendary Sree Padmanabhaswamy Temple in Trivandrum.\n\nDeparture Dates: Sep 06 | Oct 02, 14, 22 | Nov 12, 18, 25 | Dec 02, 16, 24 (2026).",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to March",
    startingPoint: "Madurai Airport / Railway Station (Arrival before 10:00 AM)",
    groupSize: "Group departures",
    themes: ["Spiritual", "Heritage", "Culture"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800", caption: "Meenakshi Amman Temple gopurams" },
      { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800", caption: "Vivekananda Rock Memorial, Kanyakumari" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Madurai",
        description:
          "Welcome to Madurai, one of India's oldest temple cities. Upon arrival, visit the famous Meenakshi Amman Temple, followed by Tirupparankundram Temple, Azhagar Temple, and the magnificent Thirumalai Nayakkar Mahal. Experience the rich culture and heritage of Tamil Nadu before checking into the hotel. (Special Treat: Famous Madurai Jigarthanda). Overnight stay in Madurai.",
        meals: "Lunch, Dinner",
        stay: "Madurai",
      },
      {
        day: 2,
        title: "Madurai – Rameshwaram",
        description:
          "After breakfast, proceed towards the holy island of Rameshwaram. En route, enjoy breathtaking views from the iconic Pamban Bridge. Upon arrival, visit Ramanathaswamy Temple, Agnitheertham, and Ramjharoka Temple for a spiritual experience. (Special Treat: South Indian Filter Coffee & Banana Chips). Overnight stay in Rameshwaram.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Rameshwaram",
      },
      {
        day: 3,
        title: "Dhanushkodi Excursion",
        description:
          "After breakfast, visit the famous Dhanushkodi, popularly known as the Ghost Town of India. Witness the spectacular meeting point of the Bay of Bengal and the Indian Ocean. Later enjoy shopping for seashell handicrafts, pearls, and local souvenirs. (Special Treat: Dhanushkodi Coastline & Seashell Shopping). Overnight stay in Rameshwaram.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Rameshwaram",
      },
      {
        day: 4,
        title: "Rameshwaram – Kanyakumari",
        description:
          "Begin the day with the sacred Sphatik Lingam Darshan and holy bath at the 22 Teerthams. Later drive towards Kanyakumari via Tiruchendur, home to the famous Subramanya Swamy Temple. In the evening witness the spectacular sunset at Triveni Sangam, where three seas meet. (Special Treat: Traditional Tamil Nadu Banana Leaf Lunch). Overnight stay in Kanyakumari.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kanyakumari",
      },
      {
        day: 5,
        title: "Kanyakumari – Trivandrum",
        description:
          "Visit the famous Vivekananda Rock Memorial, Thiruvalluvar Statue, Kanyakumari Amman Temple, Triveni Sangam, Suchindram Temple, and the newly developed Glass Bridge. Later proceed to Trivandrum. (Special Treat: Kanyakumari Special Sundal with Tea). Overnight stay in Trivandrum.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Trivandrum",
      },
      {
        day: 6,
        title: "Trivandrum Departure",
        description:
          "After breakfast, visit the sacred Padmanabhaswamy Temple, followed by the Raja Ravi Varma Art Gallery and Napier Museum. Later proceed to Trivandrum airport or railway station (departure after 2:00 PM) with wonderful memories of the South India Temple Tour. (Special Treat: Kerala Banana Chips & Elaichi Tea).",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing basis",
      "5 Breakfasts, 5 Lunches, 5 Dinners",
      "All transfers & sightseeing by A/C vehicle",
      "Professional Tour Manager",
      "Entrance Tickets",
      "Evening Tea/Coffee",
      "One Mineral Water Bottle per person daily",
      "Travel Insurance",
      "Traditional Tamil Nadu Banana Leaf Meal",
      "Traditional South Indian Wellness Therapy",
      "VIP Darshan Pass at Padmanabhaswamy Temple",
      "Visit to Pamban Bridge",
      "Meenakshi Amman Temple Visit",
      "Dhanushkodi Excursion",
      "Daily Local Special Treats",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Train Fare",
      "Guide Charges",
      "Early Check-in & Late Check-out",
      "Additional Meals & Sightseeing",
      "Auto Rickshaw Charges",
      "Personal Expenses",
      "Anything not mentioned under Inclusions",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹28,599/- Per Person + 5% GST\n• Single Occupancy: ₹38,798/- Per Person + 5% GST\n• Extra Adult with Bed/Mattress: ₹21,999/- Per Person + 5% GST\n• Extra Child with Bed/Mattress: ₹21,999/- Per Person + 5% GST\n• Extra Adult without Bed/Mattress: ₹18,999/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for South India Temple Tour?",
        answer:
          "Departure Dates 2026:\n• September: 06 September\n• October: 02, 14, 22 October\n• November: 12, 18, 25 November\n• December: 02, 16, 24 December",
      },
      {
        question: "What are the dress codes and arrival/departure flight timings?",
        answer:
          "• Women should carry a scarf/dupatta while visiting temples.\n• At Sree Padmanabhaswamy Temple: Men must wear a plain white/black lungi, and women must wear a saree.\n• Arrival at Madurai should be before 10:00 AM.\n• Departure from Trivandrum should be after 02:00 PM.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation Charges Before Departure:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 00–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "special-kerala",
    title: "Special Kerala – 6 Nights / 7 Days",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹36,450",
    highlights: [
      "Munnar Tea Gardens & Tea Museum",
      "Cheeyappara Waterfalls",
      "Eravikulam National Park (Nilgiri Tahr)",
      "Mattupetty Dam & Kundala Lake",
      "Spice Plantation Visit in Thekkady",
      "1-Hour Kathakali Dance Show",
      "1-Hour Kalaripayattu Martial Arts Show",
      "Jatayu Earth's Center with Ropeway Ride",
      "Varkala Cliff & Beach",
      "VIP Darshan Pass at Sree Padmanabhaswamy Temple",
      "Kuthiramalika Museum & Napier Museum",
      "Alleppey Houseboat Stay & Backwater Cruise",
      "1-Hour Shikara Ride",
      "Ayurvedic Spa Experience",
      "Traditional Kerala Sadhya Meal",
      "Periyar Wildlife Experience (Boat Ride / Elephant Ride)",
      "Daily Bandhan Special Treats across destinations",
    ],
    category: "Domestic",
    isPopular: true,
    tagline: "Munnar 2N – Thekkady 1N – Varkala 1N – Kovalam 1N – Alleppey Houseboat 1N · 6N/7D",
    overview:
      "A magical 6 Nights / 7 Days journey through God's Own Country. Experience the lush tea plantations and waterfalls of Munnar, endangered Nilgiri Tahr at Eravikulam, Kathakali and Kalaripayattu cultural performances in Thekkady, the gigantic bird sculpture at Jatayu Earth's Center, cliffside beaches of Varkala, royal heritage and VIP darshan in Trivandrum, and an unforgettable overnight stay on a traditional houseboat cruising Alleppey's backwaters.\n\nDeparture Dates: Sep 07, 28 | Oct 02, 12, 23 | Nov 01, 12, 20, 27 | Dec 07, 21, 25.",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=90&w=3200",
    bestTime: "September to March",
    startingPoint: "Cochin Airport / Railway Station (Approx. 130 KM / 4 hrs to Munnar)",
    groupSize: "Group departures",
    themes: ["Backwaters", "Nature", "Culture"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800", caption: "Alleppey backwaters and houseboats" },
      { image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1800", caption: "Tea hills of Munnar" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Cochin – Munnar (Approx. 130 KM / 4 Hrs)",
        description:
          "Arrive at Cochin Airport/Railway Station where our representative will receive you and proceed to Munnar. En route visit the beautiful Cheeyappara Waterfalls. Check into the hotel and relax. Later visit the Tea Museum and in the evening you may visit Blossom International Park. (Bandhan Special Treat: Juice Sachet at Cheeyappara Waterfalls). Overnight stay in Munnar.",
        meals: "Lunch, Dinner",
        stay: "Munnar",
      },
      {
        day: 2,
        title: "Munnar Sightseeing (Approx. 45 KM)",
        description:
          "After breakfast visit Eravikulam National Park, home to the endangered Nilgiri Tahr. Later enjoy the scenic tea gardens followed by Mattupetty Dam and Kundala Lake. (Bandhan Special Treat: Bhutta at Flower Garden). Overnight stay in Munnar.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Munnar",
      },
      {
        day: 3,
        title: "Munnar – Thekkady (Approx. 97 KM / 3 Hrs)",
        description:
          "After breakfast proceed to Thekkady. En route visit spice plantations. Check into the hotel and in the evening enjoy the famous Kathakali Dance Show followed by the traditional Kalaripayattu Martial Arts performance. (Bandhan Special Treat: Garam Masala Tea at Masala Garden). Overnight stay in Thekkady.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Thekkady",
      },
      {
        day: 4,
        title: "Thekkady – Varkala (Approx. 180 KM / 5 Hrs)",
        description:
          "After breakfast proceed towards Varkala. Visit the famous Jatayu Earth's Center with breathtaking hilltop views via ropeway ride. Continue to Varkala, check into the hotel and spend the evening near the beautiful cliffside beaches. (Bandhan Special Treat: Jackfruit Chips at Jatayu Earth's Center). Overnight stay in Varkala.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Varkala",
      },
      {
        day: 5,
        title: "Varkala – Kovalam via Trivandrum (Approx. 60 KM / 2 Hrs)",
        description:
          "After breakfast proceed to Trivandrum. Visit Sree Padmanabhaswamy Temple with VIP Darshan Pass, Kuthiramalika Museum and Napier Museum. Explore the local markets before proceeding to Kovalam. (Bandhan Special Treat: Coconut Water at Kovalam Beach). Overnight stay in Kovalam.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kovalam",
      },
      {
        day: 6,
        title: "Kovalam – Alleppey Houseboat (Approx. 172 KM / 5 Hrs)",
        description:
          "After breakfast proceed to Alleppey. Board a traditional houseboat and enjoy a memorable cruise through Kerala's famous backwaters while witnessing village life, coconut groves and lush green landscapes. (Bandhan Special Treat: Coconut Water with Banana Chips). Overnight stay in Alleppey Houseboat.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Alleppey Houseboat",
      },
      {
        day: 7,
        title: "Alleppey – Cochin Departure (Approx. 95 KM / 2 Hrs)",
        description:
          "After breakfast check out from the houseboat and proceed to Cochin Airport/Railway Station for your onward journey with unforgettable memories of God's Own Country.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation on Double/Triple Sharing Basis",
      "6 Breakfasts, 6 Lunches, 6 Dinners",
      "AC Vehicle for all Transfers & Sightseeing (AC on hill roads at driver's discretion)",
      "Professional Tour Manager",
      "Entrance Tickets",
      "Evening Tea/Coffee",
      "Daily 1 Bottle Mineral Water per person",
      "Traditional Kerala Sadhya Meal",
      "Jatayu Earth's Center Ropeway Ride",
      "1 Hour Shikara Ride",
      "1 Hour Kathakali Dance Show",
      "1 Hour Kalaripayattu Show",
      "Ayurvedic Spa Experience",
      "Periyar Wildlife Experience (Boat Ride / Elephant Ride)",
      "VIP Darshan Pass at Sree Padmanabhaswamy Temple",
      "Daily Bandhan Special Treats",
    ],
    exclusions: [
      "5% GST",
      "Airfare / Train Fare",
      "Guide Charges",
      "Early Check-in & Late Check-out",
      "Additional Meals & Sightseeing",
      "Personal Expenses & activity charges not mentioned",
      "Expenses due to weather, roadblocks, illness or flight cancellation",
      "Travel insurance is not included",
    ],
    faqs: [
      {
        question: "What is the tour package pricing across sharing categories?",
        answer:
          "Tour Cost:\n• Double Occupancy: ₹36,450/- Per Person + 5% GST\n• Single Occupancy: ₹47,449/- Per Person + 5% GST\n• Adult with Extra Bed: ₹29,999/- Per Person + 5% GST\n• Child with Extra Bed: ₹29,999/- Per Person + 5% GST\n• Child without Bed: ₹25,999/- Per Person + 5% GST",
      },
      {
        question: "What are the departure dates for Special Kerala?",
        answer:
          "Departure Dates:\n• September: 07, 28\n• October: 02, 12, 23\n• November: 01, 12, 20, 27\n• December: 07, 21, 25",
      },
      {
        question: "What is the dress code for Sree Padmanabhaswamy Temple?",
        answer:
          "At Sree Padmanabhaswamy Temple:\n• Men must wear Plain White/Black Lungi.\n• Ladies must wear Saree.\n(Most temples in Kerala remain closed between 12:00 PM and 4:00 PM).",
      },
      {
        question: "What are the payment terms and cancellation charges?",
        answer:
          "Payment Terms:\n• 50% payment at booking confirmation.\n• Full payment completed 15 days before departure.\n\nCancellation Policy:\n• 121 Days & Above: 5%\n• 91–120 Days: 10%\n• 61–90 Days: 15%\n• 46–60 Days: 25%\n• 31–45 Days: 50%\n• 16–30 Days: 70%\n• 06–15 Days: 80%\n• 0–05 Days / No Show: 100%",
      },
    ],
  },
  {
    id: "swiss-paris-highlights",
    title: "Swiss & Paris Highlights",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹1,99,999",
    highlights: [
      "Guided tour in Paris & guided tour of Versailles Palace",
      "Eiffel Tower 3rd level panoramic visit",
      "Full day at Disneyland® Paris (Park or Studios)",
      "River Seine romantic cruise",
      "Paris by Night tour with illuminations",
      "Orientation tour of Geneva (Jet d'Eau, UN Office, Flower Clock)",
      "Excursion to Jungfraujoch – Top of Europe with Eiger Express cable car",
      "Mount Titlis with Rotair revolving cable car & Cliff Walk",
      "Scenic cruise on Lake Lucerne",
      "Orientation tour of Bern, Swiss capital",
      "Rhine Falls with exciting boat ride",
      "Lindt Home of Chocolate in Zurich",
    ],
    category: "International",
    isPopular: true,
    tagline: "France & Switzerland · 7N/8D · Departures: 10, 23 Oct & 06, 20 Nov",
    overview:
      "A breathtaking 7 Nights / 8 Days journey across France and Switzerland. Discover the magic of Paris with a guided city tour, Eiffel Tower (3rd level), Palace of Versailles, Seine River Cruise, Paris by Night tour, and a full day at Disneyland® Paris. Continue through Switzerland with an orientation of Geneva, Jungfraujoch (Top of Europe), Mount Titlis with Rotair revolving cable car and Cliff Walk, Lake Lucerne cruise, Bern orientation, Rhine Falls boat ride, and the Lindt Home of Chocolate in Zurich.\n\nDeparture Dates: 10, 23 Oct & 06, 20 Nov.",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "October & November",
    startingPoint: "Paris CDG Airport (Flight landing time: 08:00 AM – 02:00 PM)",
    groupSize: "Group departures: 10, 23 Oct & 06, 20 Nov",
    themes: ["City", "Mountains", "Family"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Paris landmarks" },
      { image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800", caption: "Swiss Alps" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Paris – The City of Romance, Lights and Glamour",
        description:
          "Welcome! Today, board your flight to one of the world's most beautiful and elegant cities – Paris, renowned for its haute couture, world-class museums, breathtaking monuments, and vibrant cabarets. Upon arrival, collect your baggage and proceed to the arrival hall, where you will be warmly welcomed by our professional Tour Manager. You will then be escorted to your hotel. Check in and relax after your journey. Overnight stay at the hotel in Paris. (Dinner)",
        meals: "Dinner",
        stay: "Paris",
      },
      {
        day: 2,
        title: "Guided City Tour of Paris – Eiffel Tower (3rd Level) – Palace of Versailles – Seine River Cruise – Paris by Night Tour",
        description:
          "After breakfast, proceed on a guided city tour of Paris. Discover some of the city's most iconic attractions, including Place Vendôme, Place de l'Opéra Garnier, Musée d'Orsay, Place de la Concorde, Champs-Élysées, Arc de Triomphe, Alexander Bridge, Les Invalides, and many more. Next, visit the iconic Eiffel Tower and ascend to the 3rd Level for spectacular panoramic views of the city. Continue to the magnificent Palace of Versailles, a UNESCO World Heritage Site located approximately 19 km west of Paris. Later, enjoy a romantic cruise along the River Seine, passing beneath elegant bridges and famous landmarks. In the evening, experience the enchanting Paris by Night Tour as the City of Light comes alive with illuminated monuments. (Note: Access to Eiffel Tower 3rd Level subject to operational status; 2nd Level provided if closed). Overnight stay at the hotel in Paris. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 3,
        title: "Disneyland® Paris – Choice of Disneyland® Park or Walt Disney Studios® Park",
        description:
          "After breakfast, proceed for a fun-filled day at Disneyland® Paris. Choose between Disneyland® Park, where fairy tales come to life across five magical themed lands featuring classic attractions, spectacular shows, and colourful Disney character parades, or Walt Disney Studios® Park, where you can experience thrilling attractions, fascinating stunt shows, movie sets, and behind-the-scenes film-making experiences. Return to the hotel in the evening. Overnight stay at the hotel in Paris. (Breakfast, Packed Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 4,
        title: "Orientation Tour of Geneva",
        description:
          "After breakfast, check out from your hotel and proceed towards Switzerland, a beautiful Central European country renowned for its picturesque lakes, charming villages, and majestic Alpine peaks. Upon arrival, enjoy an orientation tour of Geneva. Visit the famous Jet d'Eau, one of the city's most iconic landmarks, the United Nations Office, and the Flower Clock located beside beautiful Lake Geneva. Later, proceed to your hotel for check-in and relax. Overnight stay at the hotel in Geneva. (Breakfast, Packed Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Geneva",
      },
      {
        day: 5,
        title: "Excursion to Jungfraujoch – Top of Europe & Scenic Interlaken",
        description:
          "Today, embark on an unforgettable alpine excursion to Jungfraujoch – the 'Top of Europe', one of the highlights of your Swiss holiday. Proceed to Grindelwald Terminal and board the modern Eiger Express 3S cable car to Eigergletscher Station. From there, continue by cogwheel train to Europe's highest railway station at 11,333 feet above sea level. Explore the magical Ice Palace, admire intricate ice sculptures, and visit the Sphinx Observatory for breathtaking panoramic views of the Aletsch Glacier. Later, enjoy a scenic visit to the charming town of Interlaken before returning to your hotel. Overnight stay at the hotel in Central Switzerland. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 6,
        title: "Mount Titlis – Lucerne – Lake Lucerne Cruise",
        description:
          "After breakfast, proceed to Mount Titlis for an unforgettable mountain experience. Travel aboard a series of cable cars, including the world's first revolving cable car, the Rotair, which takes you to an altitude of 3,020 metres. Enjoy breathtaking 360-degree views of snow-covered peaks, deep crevasses, glaciers, and pristine alpine landscapes. Don't miss the famous Cliff Walk, Europe's highest suspension bridge. Later, proceed for an orientation tour of Lucerne. Visit the Lion Monument and the iconic Kapellbrücke (Chapel Bridge), followed by free time to shop for famous Swiss watches, knives, chocolates, and souvenirs. Conclude the day with a relaxing cruise on picturesque Lake Lucerne. Overnight stay at the hotel in Central Switzerland. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 7,
        title: "Orientation Tour of Bern – Rhine Falls – Lindt Home of Chocolate",
        description:
          "Today, travel to Bern, the capital city of Switzerland and a UNESCO World Heritage Site. During the orientation tour, view the famous Clock Tower, Parliament Building, and the city's historic medieval fountains. Later, continue to Schaffhausen to experience the magnificent Rhine Falls, the largest waterfall in Europe. Enjoy an exciting boat ride offering spectacular close-up views of the powerful cascading waters. Continue to Zurich to visit the famous Lindt Home of Chocolate. Discover interactive exhibits, admire the impressive chocolate fountain, and learn about the fascinating journey of Swiss chocolate-making. Overnight stay at the hotel in Central Switzerland. (Breakfast, Lunch, Dinner)",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 8,
        title: "Fly Back Home",
        description:
          "After breakfast, check out from the hotel and proceed to Zurich Airport (ZRH) for your return flight. (The coach will drop at ZRH Airport by 11:00 AM). Depart with unforgettable memories of Paris, Switzerland, and the breathtaking Alpine landscapes. (Breakfast)",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation in 4-star hotels with daily buffet breakfast",
      "Sightseeing & attraction tickets as mentioned in the itinerary",
      "Tips to coach drivers and guide tips for the duration of the tour is included",
      "Daily Continental Buffet Breakfast",
      "06 Indian Jain/Vegetarian/Non-Vegetarian Lunches",
      "07 Indian Jain/Vegetarian/Non-Vegetarian Dinners",
      "Daily Mineral Water Bottle (500ml) per person",
      "Packed lunch served on Disneyland Paris day and drive to Geneva",
      "Eiffel Tower 3rd Level, Versailles Palace, Seine Cruise, Paris by Night",
      "Full day Disneyland® Paris pass (Disneyland Park or Studios)",
      "Jungfraujoch - Top of Europe excursion with Eiger Express 3S cable car & cogwheel train",
      "Mount Titlis excursion with Rotair revolving cable car & Cliff Walk",
      "Scenic cruise on Lake Lucerne",
      "Rhine Falls boat ride at Schaffhausen",
      "Lindt Home of Chocolate entrance in Zurich",
    ],
    exclusions: [
      "5% GST & 2% TCS and any other applicable taxes",
      "Airfare (international & domestic unless specified)",
      "Visa, Passport & POE charges, Travel Insurance",
      "Airport taxes and other applicable charges",
      "Cost of excursions, sightseeing, entrance fees, and local guides not mentioned in Inclusions",
      "Personal expenses such as porterage, laundry, telephone calls, shopping, snacks, etc.",
      "Cost of pre/post tour hotel accommodation",
      "Any expenses arising due to flight delays, cancellations, weather conditions, political issues, or technical faults",
      "Porterage charges, City tax",
    ],
    faqs: [
      {
        question: "What is the total tour cost across sharing categories?",
        answer:
          "Total Tour Cost (valid till 31st July 2026):\n• Double/Triple sharing basis: ₹1,99,999/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹2,56,320/- + 5% GST + 2% TCS per person\n• Child with bed (below 12 years): ₹1,63,360/- + 5% GST + 2% TCS\n• Child no bed (below 12 years): ₹1,40,400/- + 5% GST + 2% TCS\n• Infant (below 02 years): ₹10,600/- + 5% GST + 2% TCS",
      },
      {
        question: "What are the departure dates for Swiss & Paris Highlights?",
        answer: "Departure dates: 08, 16 & 27 March 2027",
      },
      {
        question: "What are the coach transfer timings for arrival and departure?",
        answer:
          "• Paris (CDG Airport) Arrival Transfer: Flight landing time should be between 08:00 AM – 02:00 PM.\n• Zurich (ZRH Airport) Departure Transfer: The coach will drop at ZRH Airport by 11:00 AM.\n(Waiting up to 02 hours post arrival may occur for coach transfers).",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "Payment Terms:\n• At booking: 50% non-refundable booking amount.\n• 30 days prior to departure (D-30): Full balance payment (ROE calculated as XE.com + 2).\n\nCancellation Charges:\n• Up to 45 days before departure: INR 40,000 per adult/child.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
    ],
  },
  {
    id: "best-of-austria",
    title: "Best of Austria (3N Vienna | 2N Salzburg | 2N Innsbruck)",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹1,41,999",
    highlights: [
      "Explore the best of Vienna, Salzburg & Innsbruck",
      "Discover Vienna aboard a 24-Hour Hop-On Hop-Off City Tour",
      "Visit the magnificent Schönbrunn Palace, a UNESCO World Heritage Site",
      "Scenic 2nd Class high-speed train journeys through Austrian landscapes",
      "Explore the historic Salt Mine with Celtic Village and underground salt lake",
      "Visit the world-famous Swarovski Crystal Worlds in Wattens",
      "Ride the Top of Innsbruck Cable Car for spectacular Alpine views",
      "Private airport, hotel, and railway station transfers throughout",
      "Daily breakfast and comfortable hotel accommodation",
    ],
    category: "International",
    tagline: "Imperial Vienna, Mozart's Baroque Salzburg & panoramic Alpine vistas in Innsbruck.",
    overview:
      "Experience the ultimate Austrian journey with 3 nights in Vienna, 2 nights in Salzburg, and 2 nights in Innsbruck. From the imperial splendour of Schönbrunn Palace and a 24-Hour Hop-On Hop-Off bus tour in Vienna, to the historic Salt Mine and charming Baroque streets in Salzburg, and the dazzling Swarovski Crystal Worlds with the Top of Innsbruck cable car, all seamlessly connected by comfortable scenic train rides.",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "May to October & Festive Season",
    startingPoint: "Vienna International Airport (VIE)",
    groupSize: "Min 2 travellers (Private & SIC)",
    themes: ["Imperial Heritage", "Scenic Train Journeys", "Alpine Adventures", "Cultural Exploration"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Vienna's imperial architecture and Schonbrunn" },
      { image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800", caption: "Alpine scenery near Innsbruck" },
      { image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=85&w=1800", caption: "Salzburg Old Town and fortress" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Vienna",
        description: "Welcome to Austria! Upon arrival at Vienna International Airport, you will be met by your private transfer and driven to your hotel. Check-in (from 15:00 hrs). Spend the rest of the day at leisure exploring the nearby streets, relaxing at a café, or simply enjoying the elegant atmosphere of Austria's capital at your own pace. Overnight stay in Vienna.",
        meals: "—",
        stay: "Vienna",
      },
      {
        day: 2,
        title: "Explore Vienna",
        description: "After breakfast, make your way to the designated meeting point to begin your 24-Hour Hop-On Hop-Off City Tour. Discover Vienna's iconic landmarks at your own pace, including the State Opera, Parliament, City Hall, and St. Stephen's Cathedral. Visit the magnificent Schönbrunn Palace with your included entrance ticket (without guide) and explore its grand imperial gardens and staterooms. Overnight stay in Vienna.",
        meals: "Breakfast",
        stay: "Vienna",
      },
      {
        day: 3,
        title: "Vienna – Salzburg",
        description: "Enjoy breakfast at the hotel before checking out. A private transfer will take you to Vienna Train Station for your comfortable (2nd Class) scenic train journey to Salzburg. Upon arrival, another private transfer will escort you to your hotel. Check-in (from 15:00 hrs). Spend the evening strolling through Salzburg's charming Old Town, famous for its Baroque architecture and rich musical heritage. Overnight stay in Salzburg.",
        meals: "Breakfast",
        stay: "Salzburg",
      },
      {
        day: 4,
        title: "Hallstatt & Salt Mine Experience",
        description: "After breakfast, proceed to the designated meeting point for your shared shuttle transfer to the world-famous Salt Mine. Explore one of the world’s oldest salt mines, marvel at the Celtic village, and enjoy the subterranean salt lake experience. Later, spend time exploring the picturesque alpine lakeside surroundings at your own pace before returning to Salzburg. Overnight stay in Salzburg.",
        meals: "Breakfast",
        stay: "Salzburg",
      },
      {
        day: 5,
        title: "Salzburg – Innsbruck",
        description: "After breakfast, check out from the hotel. A private transfer will take you to Salzburg Train Station for your train journey to Innsbruck (2nd Class). Upon arrival, meet your private transfer and proceed to your hotel. Check-in (from 15:00 hrs). The remainder of the day is free to explore Innsbruck's charming historic Old Town, admire the Golden Roof, or enjoy shopping at local boutiques. Overnight stay in Innsbruck.",
        meals: "Breakfast",
        stay: "Innsbruck",
      },
      {
        day: 6,
        title: "Top of Innsbruck & Swarovski Crystal Worlds",
        description: "Enjoy breakfast before heading to the meeting point for your shared transfer to the world-famous Swarovski Crystal Worlds in Wattens. Discover dazzling crystal art exhibits, chambers of wonder, and beautifully landscaped gardens. Later, experience the spectacular Top of Innsbruck with your included round-trip cable car ticket, taking in breathtaking panoramic vistas of the surrounding Tyrolean Alps. Overnight stay in Innsbruck.",
        meals: "Breakfast",
        stay: "Innsbruck",
      },
      {
        day: 7,
        title: "Innsbruck – Vienna",
        description: "After breakfast, check out of your hotel and take a private transfer to Innsbruck Train Station. Board your scenic return train to Vienna (2nd Class). Upon arrival at Vienna Train Station, a private transfer will take you to your hotel. Check-in (from 15:00 hrs) and enjoy the remainder of the day shopping along the Graben and Kärntner Straße or relaxing in Vienna's historic coffeehouses. Overnight stay in Vienna.",
        meals: "Breakfast",
        stay: "Vienna",
      },
      {
        day: 8,
        title: "Departure from Vienna",
        description: "After breakfast, check out from the hotel. A private transfer will take you to Vienna International Airport for your onward flight home, taking back wonderful memories of your Austrian holiday. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation with breakfast in well-appointed hotels (except day 1)",
      "Private transfer: Vienna Airport → Vienna Hotel",
      "Private transfer: Vienna Hotel → Vienna Train Station",
      "Private transfer: Salzburg Train Station → Salzburg Hotel",
      "Private transfer: Salzburg Hotel → Salzburg Train Station",
      "Private transfer: Innsbruck Train Station → Innsbruck Hotel",
      "Private transfer: Innsbruck Hotel → Innsbruck Train Station",
      "Private transfer: Vienna Train Station → Vienna Hotel",
      "Private transfer: Vienna Hotel → Vienna Airport",
      "Train Ticket: Vienna → Salzburg (2nd Class reserved seats)",
      "Train Ticket: Salzburg → Innsbruck (2nd Class reserved seats)",
      "Train Ticket: Innsbruck → Vienna (2nd Class reserved seats)",
      "Vienna: 24-Hour Hop-On Hop-Off City Bus Tour (SIC Basis)",
      "Vienna: Schönbrunn Palace Entrance Ticket (Audio Guide / No Guide)",
      "Salzburg: Salt Mine Tour, Celtic Village & Subterranean Salt Lake with Shuttle Bus Return Transfers (Shared Basis)",
      "Innsbruck: Swarovski Crystal Worlds Admission Ticket & Shared Transfers (SIC Basis)",
      "Innsbruck: Roundtrip Cable Car Ticket (Top of Innsbruck / Nordkette)",
    ],
    exclusions: [
      "Any International or Domestic Airfare & Airport Taxes",
      "5% GST & 2% TCS (applicable per government regulations)",
      "Schengen Visa fees & Mandatory Travel Insurance",
      "Meals and beverages not explicitly mentioned in the itinerary",
      "City tax / tourist tax payable directly at hotels where applicable",
      "Tips, gratuities, porterage, minibar and personal telephone charges",
      "Transfers to/from meeting points unless explicitly listed as private transfers",
      "Any services, entrance fees or activities not specifically listed under inclusions",
    ],
    faqs: [
      {
        question: "What are the tour costs and validity for Best of Austria?",
        answer: "Per Person Double sharing basis is ₹1,41,999/- + 5% GST + 2% TCS. Per Person Single sharing basis is ₹2,41,999/- + 5% GST + 2% TCS. Rates are valid for travel until 31st October 2026 (not applicable during Diwali, Christmas, New Year, or peak festival periods).",
      },
      {
        question: "What is the payment and cancellation schedule?",
        answer: "A 50% non-refundable deposit is required at booking, with the balance due 30 days prior to departure (D-30). Rate of Exchange (ROE) will be XE.com + 2 at final settlement. Cancellations up to 45 days prior incur INR 40,000 per person; cancellations within 30 days incur 100% charges.",
      },
      {
        question: "How are transfers and rail connections handled?",
        answer: "All station and airport transfers in Vienna, Salzburg, and Innsbruck are private point-to-point transfers. Intercity rail travel is on comfortable 2nd-class high-speed trains. Excursions in Vienna (Hop-On Hop-Off), Salzburg (Salt Mine shuttle), and Innsbruck (Swarovski shuttle) operate on scheduled SIC/shared basis.",
      },
    ],
  },
  {
    id: "classic-italy",
    title: "Classic Italy (1N Milan | 1N Venice | 2N Florence | 2N Rome)",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹1,82,999",
    highlights: [
      "Explore four iconic Italian cities – Milan, Venice, Florence & Rome",
      "Scenic 2nd Class high-speed train journeys across Italy",
      "Classic Grand Canal Gondola Ride in Venice (Shared Basis)",
      "Discover Florence with a 24-Hour Hop-On Hop-Off Bus Tour",
      "Full-day guided Tuscany day trip to Pisa, Siena & San Gimignano",
      "Explore Rome with a 24-Hour Hop-On Hop-Off Bus Tour",
      "Guided tour of the Colosseum, Roman Forum & Palatine Hill",
      "Private airport, hotel, and railway station transfers throughout (including Venice Water Taxi)",
      "Daily breakfast and comfortable hotel accommodation",
    ],
    category: "International",
    tagline: "1N Milan | 1N Venice | 2N Florence | 2N Rome · 6N/7D · Valid till 31st Oct 2026",
    overview:
      "A classic 6 Nights / 7 Days Italian journey linking Milan (1N), Venice (1N), Florence (2N), and Rome (2N) via scenic high-speed trains. Enjoy a private water taxi and romantic gondola ride in Venice, Florence's Renaissance treasures, a picturesque full-day excursion through the Tuscan countryside to Pisa, Siena, and San Gimignano, and a comprehensive guided tour of Ancient Rome including the Colosseum, Roman Forum, and Palatine Hill.\n\nRates are valid for travel until 31st October 2026 (not applicable during peak/festival periods).",
    heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200",
    bestTime: "April to October (Valid till 31st Oct 2026)",
    startingPoint: "Milan Airport",
    groupSize: "2+ guests",
    themes: ["Heritage", "City", "Scenic"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Canals of Venice" },
      { image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=85&w=1800", caption: "Ancient Rome" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Milan",
        description:
          "Welcome to Italy! Upon arrival at Milan Airport, you will be met by your private transfer and driven to your hotel. Check in (from 1500 hrs). Spend the rest of the day at leisure exploring Milan's stylish streets, vibrant cafés, or shopping districts at your own pace. Overnight stay in Milan.",
        meals: "—",
        stay: "Milan",
      },
      {
        day: 2,
        title: "Milan – Venice",
        description:
          "After breakfast, check out from the hotel and take a private transfer to Milano Centrale Railway Station. Board your comfortable train to Venice (2nd Class). Upon arrival at Venezia Santa Lucia Station, enjoy a private water taxi transfer to your hotel. Check in (from 1500 hrs). Later, proceed to the designated meeting point for a memorable shared Grand Canal Gondola Ride, gliding through Venice’s enchanting canals and historic waterways. Spend the remainder of the evening exploring the city’s charming alleys and picturesque squares. Overnight stay in Venice.",
        meals: "Breakfast",
        stay: "Venice",
      },
      {
        day: 3,
        title: "Venice – Florence",
        description:
          "Enjoy breakfast before checking out and taking a private water taxi transfer to Venice Train Station. Board your train to Florence (2nd Class). On arrival at Firenze Santa Maria Novella Station, a private transfer will take you to your hotel. Check in (from 1500 hrs). Later, proceed to the meeting point for your 24-Hour Hop-On Hop-Off Bus Tour, allowing you to discover Florence's iconic attractions at your own pace. Overnight stay in Florence.",
        meals: "Breakfast",
        stay: "Florence",
      },
      {
        day: 4,
        title: "Tuscany Day Trip",
        description:
          "After breakfast, proceed to the designated meeting point for a full-day guided excursion through the beautiful Tuscan countryside. Visit the historic cities of Pisa, Siena, and the medieval hill town of San Gimignano, each offering remarkable architecture, charming streets, and rich cultural heritage. Return to Florence in the evening. Overnight stay in Florence.",
        meals: "Breakfast",
        stay: "Florence",
      },
      {
        day: 5,
        title: "Florence – Rome",
        description:
          "After breakfast, check out from the hotel and transfer privately to Florence Train Station. Board your train to Rome (2nd Class). Upon arrival at Roma Termini Station, a private transfer will take you to your hotel. Check in (from 1500 hrs). The remainder of the day is free to relax or explore Rome’s lively streets, cafés, and shopping areas at your own pace. Overnight stay in Rome.",
        meals: "Breakfast",
        stay: "Rome",
      },
      {
        day: 6,
        title: "Discover Rome",
        description:
          "After breakfast, make your way to the designated meeting point to begin your 24-Hour Hop-On Hop-Off Bus Tour. Explore Rome's world-famous landmarks, including the Vatican area, Piazza Venezia, Trevi Fountain, and Circus Maximus. Your tour also includes a guided visit to the magnificent Colosseum, Roman Forum, and Palatine Hill (arena access not included), where you'll discover the fascinating history of Ancient Rome. Spend the remainder of the day exploring the Eternal City at your leisure. Overnight stay in Rome.",
        meals: "Breakfast",
        stay: "Rome",
      },
      {
        day: 7,
        title: "Departure from Rome",
        description:
          "After breakfast, check out from the hotel. A private transfer will take you to Rome Airport for your onward flight home, bringing your unforgettable Italian holiday to a memorable conclusion. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation with breakfast (except day 1)",
      "Private transfers (per vehicle): Milan Airport → Milan hotel, Milan hotel → Milan Train Station, Venice Train Station → Venice hotel (Water Taxi), Venice hotel → Venice Train Station (Water Taxi), Florence Train Station → Florence hotel, Florence hotel → Florence Train Station, Rome Train Station → Rome hotel, Rome hotel → Rome Airport",
      "Train: Milano Centrale → Venezia S. Lucia (2nd class), Train: Venezia S. Lucia → Firenze S.M. Novella (2nd class), Train: Firenze S.M. Novella → Roma Termini (2nd class)",
      "Venice: Grand Canal Gondola Ride (Shared Basis)",
      "Florence: 24-Hours Hop-On Hop-Off Bus Tour (SIC Basis)",
      "Florence: Pisa, Siena and San Gimignano Day Trip– Basic Tour (SIC Basis)",
      "Rome: 24-hours Hop-on Hop-off bus tour (SIC Basis)",
      "Rome: Colosseum, Roman Forum & Palatine Hill entrance & Guided Tour - No Arena access (SIC)",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Visa Fees",
      "Travel Insurance",
      "Meals not mentioned above",
      "Anything not mentioned above",
      "Hotel city tax",
      "Tips and gratuities",
      "Any services not explicitly listed in inclusions",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing options?",
        answer:
          "Tour Pricing (valid till 31st Oct 2026):\n• Double sharing basis: ₹1,82,999/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹2,84,999/- + 5% GST + 2% TCS per person",
      },
      {
        question: "What are the payment terms and booking milestones?",
        answer:
          "• At the time of booking: A 50% non-refundable booking amount is required to confirm the reservation.\n• 30 days prior to departure (D-30): The balance payment must be made.\nNote: At the time of final payment, the Rate of Exchange (ROE) will be calculated as XE.com + 2 on the outstanding amount.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "• Up to 45 days before departure: A cancellation charge of INR 40,000 per adult/child is applicable.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
      {
        question: "What are the travel documents and luggage guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid tourist visa is mandatory. We recommend carrying one check-in bag and one handbag per person due to train and coach space restrictions.",
      },
    ],
  },
  {
    id: "london-edinburgh-bliss",
    title: "London & Edinburgh Bliss (4N London | 3N Edinburgh)",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹1,95,999",
    highlights: [
      "Explore two iconic UK destinations – London & Edinburgh",
      "London 48-Hour Hop-On Hop-Off Bus Tour",
      "Panoramic city views from the London Eye",
      "Meet celebrities at Madame Tussauds London",
      "Scenic 1-Way River Thames Cruise",
      "Historic Tower of London and the Crown Jewels",
      "Full-day guided excursion to the Cotswolds & Oxford",
      "Comfortable 2nd Class train from London to Edinburgh",
      "Edinburgh 24-Hour Hop-On Hop-Off Bus Tour",
      "Visit the magnificent Edinburgh Castle",
      "Private airport, hotel, and railway station transfers for a hassle-free journey",
      "Daily breakfast and comfortable hotel accommodation throughout",
    ],
    category: "International",
    tagline: "4N London | 3N Edinburgh · 7N/8D · Valid till 31st Oct 2026",
    overview:
      "A scenic 7 Nights / 8 Days UK journey spanning London (4N) and Edinburgh (3N). Discover London's famous landmarks with a 48-hour Hop-On Hop-Off pass, the London Eye, Madame Tussauds, a Thames cruise, the Tower of London, and a full-day excursion through Oxford's university colleges and the idyllic honey-stone villages of the Cotswolds. Then journey north by rail to explore Edinburgh Castle, the Royal Mile, and Scotland's historic capital.\n\nRates are valid for travel until 31st October 2026 (not applicable during peak/festival periods).",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "May to October (Valid till 31st Oct 2026)",
    startingPoint: "London Heathrow Airport (LHR)",
    groupSize: "2+ guests",
    themes: ["City", "Heritage", "Scenic"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "London landmarks" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Edinburgh's historic streets" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in London",
        description:
          "Welcome to London! Upon arrival at London Heathrow Airport, meet your private transfer and proceed to your hotel. Check in (from 1500 hrs) and spend the rest of the day at leisure. You may relax after your journey or take a short walk around the nearby streets and cafés. Overnight stay in London.",
        meals: "—",
        stay: "London",
      },
      {
        day: 2,
        title: "London City Tour, London Eye & Madame Tussauds",
        description:
          "After breakfast, make your way to the designated meeting point to begin your sightseeing. Enjoy a 48-Hour Hop-On Hop-Off Bus Tour, allowing you to explore London's famous landmarks at your own pace. Experience breathtaking panoramic views from the iconic London Eye and visit Madame Tussauds to see lifelike wax figures of celebrities, historical personalities, and sports stars. Overnight stay in London.",
        meals: "Breakfast",
        stay: "London",
      },
      {
        day: 3,
        title: "Thames River Cruise & Tower of London",
        description:
          "Enjoy breakfast at the hotel. Make your way to the designated meeting point and continue exploring London with the second day of your Hop-On Hop-Off Bus Tour. Take a scenic one-way Thames River Cruise and visit the historic Tower of London, home to the Crown Jewels and centuries of British history. Spend some free time shopping or exploring nearby attractions before returning to the hotel. Overnight stay in London.",
        meals: "Breakfast",
        stay: "London",
      },
      {
        day: 4,
        title: "Oxford & Cotswolds Excursion",
        description:
          "After breakfast, proceed to the meeting point for your full-day guided tour to the charming Cotswolds and the historic university city of Oxford on a shared coach basis. Explore picturesque villages, beautiful countryside, and Oxford's famous colleges before returning to London in the evening. Overnight stay in London.",
        meals: "Breakfast",
        stay: "London",
      },
      {
        day: 5,
        title: "London to Edinburgh",
        description:
          "After breakfast, check out of the hotel and enjoy a private transfer to London's train station. Board your train to Edinburgh (2nd Class). Upon arrival, a private transfer will take you to your hotel. Check in (from 1500 hrs) and enjoy the remainder of the day at leisure to explore Scotland's capital at your own pace. Overnight stay in Edinburgh.",
        meals: "Breakfast",
        stay: "Edinburgh",
      },
      {
        day: 6,
        title: "Edinburgh City Tour & Edinburgh Castle",
        description:
          "After breakfast, proceed to the meeting point on own and enjoy a 24-Hour Hop-On Hop-Off Bus Tour of Edinburgh. Visit the magnificent Edinburgh Castle, one of Scotland's most iconic landmarks, and explore the city's historic streets, viewpoints, and attractions at your leisure. Overnight stay in Edinburgh.",
        meals: "Breakfast",
        stay: "Edinburgh",
      },
      {
        day: 7,
        title: "Leisure Day in Edinburgh",
        description:
          "Enjoy breakfast at the hotel before spending the day at your own pace. Discover the charming Royal Mile, shop for Scottish souvenirs, visit local cafés, or simply enjoy the city's vibrant atmosphere. Overnight stay in Edinburgh.",
        meals: "Breakfast",
        stay: "Edinburgh",
      },
      {
        day: 8,
        title: "Departure from Edinburgh",
        description:
          "After breakfast, check out of the hotel and enjoy a private transfer to Edinburgh Airport for your onward flight, taking home unforgettable memories of your London and Scotland holiday.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation with breakfast (except day 1)",
      "Train: London → Edinburgh (2nd class)",
      "Private transfers: London airport → London hotel, London hotel → London train station, Edinburgh train station → Edinburgh hotel, Edinburgh hotel → Edinburgh airport",
      "London: 48-Hour Hop-On, Hop-Off Bus Tour (SIC)",
      "London: The London Eye – Standard Entrance Ticket",
      "London: Madame Tussauds London Entrance Ticket",
      "London: River Thames 1-Way Cruise (Shared Basis)",
      "London: Tower of London Entrance Ticket",
      "London: Cotswolds and Oxford Guided Tour (SIC Basis)",
      "Edinburgh: 24 Hours Hop-On Hop-Off Bus Tour (SIC Basis)",
      "Edinburgh Castle entrance ticket",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Visa Fees",
      "Travel Insurance",
      "Meals not mentioned above",
      "Anything not mentioned above",
      "Hotel city tax",
      "Tips and gratuities",
      "Any services not explicitly listed in inclusions",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing options?",
        answer:
          "Tour Pricing (valid till 31st Oct 2026):\n• Double sharing basis: ₹1,95,999/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹3,21,999/- + 5% GST + 2% TCS per person",
      },
      {
        question: "What are the payment terms and booking milestones?",
        answer:
          "• At the time of booking: A 50% non-refundable booking amount is required to confirm the reservation.\n• 30 days prior to departure (D-30): The balance payment must be made.\nNote: At the time of final payment, the Rate of Exchange (ROE) will be calculated as XE.com + 2 on the outstanding amount.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "• Up to 45 days before departure: A cancellation charge of INR 40,000 per adult/child is applicable.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
      {
        question: "What are the passport, baggage, and travel guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid UK tourist visa is mandatory. We recommend carrying one check-in bag and one handbag per person due to train luggage restrictions.",
      },
    ],
  },
  {
    id: "paris-swiss-delights",
    title: "Paris & Swiss Delights (3N Paris | 3N Zurich)",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹1,94,999",
    highlights: [
      "Explore two of Europe's most iconic destinations – Paris & Zurich",
      "Discover Paris with a 48-Hour Hop-On Hop-Off Bus Tour",
      "Visit the world-famous Eiffel Tower (2nd Level)",
      "Enjoy a scenic 1-Hour Seine River Cruise",
      "Explore the renowned Louvre Museum with a digital audio guide",
      "Experience a comfortable high-speed train journey from Paris to Zurich (2nd Class)",
      "Travel across Switzerland with a 3-Day Swiss Travel Pass (2nd Class)",
      "Spectacular mountain excursion to Mount Titlis via Engelberg",
      "Witness the breathtaking beauty of Rhine Falls, Europe's largest waterfall",
      "Private airport and railway station transfers for a seamless travel experience",
      "Daily breakfast and comfortable hotel accommodation throughout",
    ],
    category: "International",
    tagline: "3N Paris | 3N Zurich · 6N/7D · Valid till 31st Oct 2026",
    overview:
      "A scenic 6 Nights / 7 Days European escape pairing Paris (3N) and Zurich (3N). Admire Parisian icons with a 48-hour Hop-On Hop-Off pass, Eiffel Tower second-level entry, a Seine River cruise, and the treasures of the Louvre Museum with audio guide. Connect to Switzerland by high-speed rail and use your 3-day Swiss Travel Pass for unlimited exploration including a mountain ascent of Mount Titlis via Engelberg and the roaring waters of Rhine Falls at Schaffhausen.\n\nRates are valid for travel until 31st October 2026 (not applicable during peak/festival periods).",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "April to October (Valid till 31st Oct 2026)",
    startingPoint: "Paris Charles de Gaulle Airport (CDG)",
    groupSize: "2+ guests",
    themes: ["City", "Mountains", "Scenic"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Paris and Eiffel Tower" },
      { image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800", caption: "Swiss Alps & Lakes" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Paris",
        description:
          "Welcome to France! Upon arrival at Paris Charles de Gaulle (CDG) Airport, you will be met by your private transfer and driven to your hotel. Check in (from 1500 hrs). Spend the remainder of the day at leisure, relaxing after your journey or exploring the nearby streets and cafés at your own pace. Overnight stay in Paris.",
        meals: "—",
        stay: "Paris",
      },
      {
        day: 2,
        title: "Paris City Tour, Eiffel Tower & Seine River Cruise",
        description:
          "After breakfast, proceed to the designated meeting point to begin your 48-Hour Hop-On Hop-Off Bus Tour. Discover Paris's famous landmarks including the Champs-Élysées, Arc de Triomphe, Notre-Dame Cathedral, and Place de la Concorde. Visit the iconic Eiffel Tower with your included second-level entrance ticket (subject to availability), then enjoy a relaxing 1-hour Seine River Cruise, offering beautiful views of Paris's historic monuments. Continue exploring the city at your own pace before returning to the hotel. Overnight stay in Paris.",
        meals: "Breakfast",
        stay: "Paris",
      },
      {
        day: 3,
        title: "Louvre Museum & Paris Exploration",
        description:
          "Enjoy breakfast at the hotel before making your way to the meeting point to continue your second day of the 48-Hour Hop-On Hop-Off Bus Tour. Visit the world-renowned Louvre Museum with your general admission ticket and digital audio guide, where you can admire masterpieces including the Mona Lisa and countless other artistic treasures. Spend the rest of the day exploring Paris at your leisure. Overnight stay in Paris.",
        meals: "Breakfast",
        stay: "Paris",
      },
      {
        day: 4,
        title: "Paris – Zurich",
        description:
          "After breakfast, check out from the hotel and take a private transfer to Paris Gare de Lyon Railway Station. Board your comfortable train to Zurich (2nd Class). Upon arrival at Zurich Hauptbahnhof, use your activated 3-Day Swiss Travel Pass (2nd Class) to travel to your hotel. Check in (from 1500 hrs). The evening is free to explore Zurich's charming Old Town, lakeside promenade, or local cafés. Overnight stay in Zurich.",
        meals: "Breakfast",
        stay: "Zurich",
      },
      {
        day: 5,
        title: "Excursion to Mount Titlis",
        description:
          "After breakfast, travel by train from Zurich to Engelberg using your Swiss Travel Pass. Continue your journey to the spectacular Mount Titlis, where you'll experience breathtaking Alpine scenery, snow-covered peaks, and unforgettable panoramic views. Enjoy free time to explore the mountain attractions before returning by train to Zurich. Overnight stay in Zurich.",
        meals: "Breakfast",
        stay: "Zurich",
      },
      {
        day: 6,
        title: "Rhine Falls Excursion",
        description:
          "After breakfast, travel by train from Zurich to Schaffhausen using your Swiss Travel Pass. Visit the magnificent Rhine Falls, Europe's largest waterfall, and admire its impressive natural beauty from the viewing platforms (boat ride not included). After enjoying the scenic surroundings, return to Zurich by train. Overnight stay in Zurich.",
        meals: "Breakfast",
        stay: "Zurich",
      },
      {
        day: 7,
        title: "Departure from Zurich",
        description:
          "After breakfast, check out from the hotel. A private transfer will take you to Zurich Airport for your onward flight home, carrying unforgettable memories of your Paris and Switzerland holiday. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation with breakfast (except day 1)",
      "Private transfers: Paris CDG airport → Paris hotel, Paris hotel → Paris Train Station, Zurich hotel → Zurich airport",
      "Day Train: Paris → Zurich (2nd class)",
      "Swiss Pass for 3 continuous days (2nd class) – includes unlimited travel on trains, buses, boats, and free entry to 500+ museums",
      "Paris: 48-Hours Hop-On Hop-Off Bus Tour (SIC Basis)",
      "Paris: Eiffel Tower Second Level Entrance Ticket (Subject to availability)",
      "Paris: 1-Hour Seine Cruise (Shared Basis)",
      "Paris: Louvre Museum General Ticket with Digital Audio Guide",
      "Engelberg: Mount Titlis (with Swiss Pass)",
      "Visit Rhine Falls (No Boat Ride)",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Visa Fees",
      "Travel Insurance",
      "Meals not mentioned above",
      "Anything not mentioned above",
      "Hotel city tax",
      "Tips and gratuities",
      "Any services not explicitly listed in inclusions",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing options?",
        answer:
          "Tour Pricing (valid till 31st Oct 2026):\n• Double sharing basis: ₹1,94,999/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹2,84,999/- + 5% GST + 2% TCS per person",
      },
      {
        question: "What are the payment terms and booking milestones?",
        answer:
          "• At the time of booking: A 50% non-refundable booking amount is required to confirm the reservation.\n• 30 days prior to departure (D-30): The balance payment must be made.\nNote: At the time of final payment, the Rate of Exchange (ROE) will be calculated as XE.com + 2 on the outstanding amount.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "• Up to 45 days before departure: A cancellation charge of INR 40,000 per adult/child is applicable.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
      {
        question: "What are the passport, baggage, and European travel guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid Schengen tourist visa is mandatory. We recommend carrying one check-in bag and one handbag per person due to train and coach space restrictions.",
      },
    ],
  },
  {
    id: "splendid-germany",
    title: "Splendid Germany (3N Munich | 1N Stuttgart | 2N Frankfurt)",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹1,47,999",
    highlights: [
      "Explore three of Germany's most vibrant cities – Munich, Stuttgart & Frankfurt",
      "Discover Munich on a Hop-On Hop-Off City Tour",
      "Visit the world-famous Neuschwanstein Castle",
      "Explore the magnificent Linderhof Palace",
      "Enjoy scenic 2nd Class train journeys between Munich, Stuttgart, and Frankfurt",
      "Explore Stuttgart with a 24-Hour Hop-On Hop-Off Bus Tour",
      "Discover Frankfurt's iconic landmarks on a 24-Hour Hop-On Hop-Off Grand Tour",
      "Relax on a scenic 1-Hour Panorama Boat Cruise along the River Main",
      "Private airport, hotel, and railway station transfers throughout the journey",
      "Daily breakfast and comfortable hotel accommodation",
    ],
    category: "International",
    tagline: "3N Munich | 1N Stuttgart | 2N Frankfurt · 6N/7D · Valid till 31st Oct 2026",
    overview:
      "Explore three of Germany's most vibrant cities: Munich (3N), Stuttgart (1N), and Frankfurt (2N). Highlights include a 1-day Munich Hop-On Hop-Off tour, an excursion to the fairytale Neuschwanstein Castle and King Ludwig II's Linderhof Palace, 2nd-class scenic rail journeys, a 24-hour Stuttgart Hop-On Hop-Off tour, Frankfurt Grand Tour with a 1-hour River Main panorama cruise, and seamless private transfers throughout.",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "May to October (Valid till 31st Oct 2026)",
    startingPoint: "Munich Airport",
    groupSize: "2+ guests",
    themes: ["City", "Heritage", "Scenic"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Bavarian castles" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Frankfurt's riverside skyline" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Munich",
        description:
          "Welcome to Germany! Upon arrival at Munich Airport, you will be met by your private transfer and driven to your hotel. Check-in (from 1500 hrs). Spend the remainder of the day at leisure, relaxing after your journey or exploring Munich's charming streets, cafés, and shopping areas at your own pace. Overnight stay in Munich.",
        meals: "—",
        stay: "Munich",
      },
      {
        day: 2,
        title: "Explore Munich",
        description:
          "After breakfast, proceed to the designated meeting point to begin your 1-Day Hop-On Hop-Off Bus Tour. Discover Munich’s most iconic landmarks, including Marienplatz, the English Garden, Nymphenburg Palace, Olympic Park, and other popular attractions while exploring the city at your own pace. Overnight stay in Munich.",
        meals: "Breakfast",
        stay: "Munich",
      },
      {
        day: 3,
        title: "Neuschwanstein & Linderhof Castle Excursion",
        description:
          "After breakfast, make your way to the designated meeting point for a full-day shared tour to two of Bavaria's most spectacular royal palaces. Visit the fairytale Neuschwanstein Castle, famous for inspiring Disney's Sleeping Beauty Castle, and explore the elegant Linderhof Palace, the smallest but most lavish palace built by King Ludwig II. Your tour includes entrance to both castles. Return to Munich in the evening. Overnight stay in Munich.",
        meals: "Breakfast",
        stay: "Munich",
      },
      {
        day: 4,
        title: "Munich – Stuttgart",
        description:
          "After breakfast, check out from the hotel and take a private transfer to Munich Central Station. Board your train to Stuttgart (2nd Class). Upon arrival, a private transfer will take you to your hotel. Check-in (from 1500 hrs). Later, proceed to the designated meeting point for your 24-Hour Hop-On Hop-Off Bus Tour, allowing you to explore Stuttgart’s major attractions, cultural landmarks, and beautiful cityscape at your own pace. Overnight stay in Stuttgart.",
        meals: "Breakfast",
        stay: "Stuttgart",
      },
      {
        day: 5,
        title: "Stuttgart – Frankfurt",
        description:
          "After breakfast, check out from the hotel and transfer privately to Stuttgart Central Station. Board your train to Frankfurt (2nd Class). Upon arrival, a private transfer will take you to your hotel. Check-in (from 1500 hrs). Spend the rest of the day exploring Frankfurt's vibrant city center, riverside promenade, or shopping streets at your leisure. Overnight stay in Frankfurt.",
        meals: "Breakfast",
        stay: "Frankfurt",
      },
      {
        day: 6,
        title: "Discover Frankfurt",
        description:
          "After breakfast, proceed to the designated meeting point for your 24-Hour Hop-On Hop-Off Grand Tour. Explore Frankfurt’s famous attractions, including Römer Square, St. Bartholomew’s Cathedral, the financial district, and the Museumsufer. Later, enjoy a relaxing 1-hour Panorama Boat Cruise along the River Main, offering scenic views of the city’s impressive skyline and historic waterfront. Overnight stay in Frankfurt.",
        meals: "Breakfast",
        stay: "Frankfurt",
      },
      {
        day: 7,
        title: "Departure from Frankfurt",
        description:
          "After breakfast, check out from the hotel. A private transfer will take you to Frankfurt Airport for your onward flight home, taking wonderful memories of your unforgettable journey through Germany. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation with breakfast (except day 1)",
      "Private transfers: Munich Airport → Munich hotel, Munich hotel → Munich Train Station",
      "Private transfers: Stuttgart Train Station → Stuttgart hotel, Stuttgart hotel → Stuttgart Train Station",
      "Private transfers: Frankfurt Train Station → Frankfurt hotel, Frankfurt hotel → Frankfurt Airport",
      "2nd Class train: Munich Central Station → Stuttgart Central Station",
      "2nd Class train: Stuttgart Central Station → Frankfurt Central Station",
      "Munich: 1-Day Hop-On Hop-Off Bus Tour",
      "Bavaria: Full-day Neuschwanstein & Linderhof Castle excursion with entrance included",
      "Stuttgart: 24-Hour Hop-On Hop-Off Bus Tour",
      "Frankfurt: 24-Hour Hop-On Hop-Off Grand Tour",
      "Frankfurt: 1-Hour Panorama Boat Cruise along River Main",
    ],
    exclusions: [
      "Any Airfare",
      "Airport Taxes",
      "5% GST & 2% TCS",
      "Visa Fees",
      "Travel Insurance",
      "Meals not mentioned above",
      "Anything not mentioned above",
      "Hotel city tax",
      "Tips and gratuities",
      "Any services not explicitly listed in inclusions",
      "Transfers to and from meeting & dropping points unless specified as private transfer",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing options?",
        answer:
          "Tour Pricing (valid till 31st Oct 2026):\n• Double sharing basis: ₹1,47,999/- + 5% GST + 2% TCS per person\n• Single sharing basis: ₹1,95,999/- + 5% GST + 2% TCS per person",
      },
      {
        question: "What are the payment terms and booking milestones?",
        answer:
          "• At the time of booking: A 50% non-refundable booking amount is required to confirm the reservation.\n• 30 days prior to departure (D-30): The balance payment must be made.\nNote: At the time of final payment, the Rate of Exchange (ROE) will be calculated as XE.com + 2 on the outstanding amount.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "• Up to 45 days before departure: A cancellation charge of INR 40,000 per adult/child is applicable.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
      {
        question: "What are the passport, baggage, and European travel guidelines?",
        answer:
          "Passport must be valid for at least 6 months from the return date with a minimum of 2 blank pages. A valid tourist visa is mandatory. We recommend carrying one check-in bag and one handbag per person due to coach/train storage regulations. Hotel check-in is from 15:00 hrs.",
      },
    ],
  },
  {
    id: "turkish-wonders",
    title: "Turkish Wonders - 7 Nights & 8 Days (2N Istanbul | 1N Pamukkale | 2N Antalya | 2N Cappadocia)",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=85&w=1800",
    duration: "7 Nights / 8 Days",
    price: "₹2,56,999",
    highlights: [
      "Guided comprehensive tours of Istanbul, Pamukkale, Antalya & Cappadocia",
      "Hagia Sophia, Blue Mosque & the historic Roman Hippodrome",
      "Dazzling white Pamukkale Travertine Terraces & UNESCO ruins of Hierapolis",
      "Antalya Historic Old Town (Kaleiçi) & scenic Düden Waterfalls",
      "Göreme Open Air Museum & fascinating Ozkonak Underground City",
      "Love Valley, Devrent Imagination Valley & Three Beauties Fairy Chimneys",
      "Authentic Turkish carpet, pottery and textile craft demonstrations",
      "Optional sunrise Hot Air Balloon rides over Pamukkale and Cappadocia",
      "Stay in premium hotels including 5* Istanbul and authentic Cappadocia Cave Hotel",
    ],
    category: "International",
    tagline: "Byzantine treasures, Mediterranean cascades, Pamukkale cotton terraces & Cappadocia's fairy chimneys.",
    overview:
      "Immerse yourself in the timeless wonders of Turkey on a magnificent 7-night, 8-day journey spanning continents and millennia. Explore Istanbul's Hagia Sophia and Blue Mosque, marvel at the sparkling calcified travertine pools of Pamukkale and ancient Hierapolis, soak in the Mediterranean charm of Antalya's Kaleiçi and Düden Waterfalls, and discover Cappadocia's underground cities, valleys of fairy chimneys, and cave dwellings.",
    heroImage: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=90&w=3200",
    bestTime: "April to October",
    startingPoint: "Istanbul International Airport (IST)",
    groupSize: "Min 2 travellers",
    themes: ["Ancient Heritage", "Fairy Chimney Landscapes", "Mediterranean Coast", "Cultural Exploration"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=85&w=1800", caption: "The Blue Mosque, Istanbul" },
      { image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=85&w=1800", caption: "Hagia Sophia Grand Mosque" },
      { image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=85&w=1800", caption: "Hot air balloons rising over Cappadocia" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Istanbul",
        description: "Upon arrival at Istanbul International Airport, meet your local representative and transfer to your hotel. After check-in, relax and enjoy the rest of the day at leisure. Istanbul, the only city in the world spanning both Europe and Asia, is renowned for its rich imperial history, magnificent monuments, vibrant bazaars, and unique cultural heritage. Overnight stay in Istanbul.",
        meals: "—",
        stay: "Istanbul (5* La Quinta by Wyndham or similar)",
      },
      {
        day: 2,
        title: "Istanbul City Tour",
        description: "After breakfast, proceed for a guided city tour of Istanbul. Visit the historic Hippodrome of Constantinople, followed by the magnificent Blue Mosque, famed for its cascading domes and intricate blue Iznik tiles. Continue to the iconic Hagia Sophia Grand Mosque, a crowning masterpiece of Byzantine architecture. Later, visit a traditional Turkish shopping centre to discover Turkish delight, spices, ceramics, handicrafts, and souvenirs. Return to the hotel for an overnight stay in Istanbul. (Note: Please carry a headscarf for mosque visits).",
        meals: "Breakfast",
        stay: "Istanbul",
      },
      {
        day: 3,
        title: "Istanbul – Denizli – Pamukkale",
        description: "After breakfast, enjoy free time until your scheduled transfer to Istanbul Airport for your domestic flight to Denizli. Upon arrival at Denizli Cardak Airport, meet your representative and transfer to Pamukkale. Check in to your hotel and spend the evening relaxing by the thermal pools. Overnight stay in Pamukkale.",
        meals: "Breakfast",
        stay: "Pamukkale (4* Tripolis Hotel or similar)",
      },
      {
        day: 4,
        title: "Pamukkale Tour – Antalya",
        description: "After breakfast, visit the spectacular white travertine terraces of Pamukkale, formed by mineral-rich thermal waters, and explore the sprawling ancient ruins of Hierapolis, a UNESCO World Heritage Site featuring ancient theatres and Roman baths. Enjoy free time to stroll across the natural pools before visiting a local textile factory. Later, board your comfortable coach and journey across the Taurus Mountains to Antalya. Check in to your hotel for an overnight stay in Antalya. (Optional: Sunrise Hot Air Balloon ride over Pamukkale).",
        meals: "Breakfast",
        stay: "Antalya (4* Best Western Plus Khan Hotel or similar)",
      },
      {
        day: 5,
        title: "Antalya Old City Tour",
        description: "After breakfast, explore historic Kaleiçi (Antalya's Old Town). Walk through Hadrian's Gate, see the Clock Tower, the Broken Minaret, the historic Hıdırlık Tower, and the picturesque Roman Harbour marina. Later, visit the spectacular Lower Düden Waterfalls, where dramatic torrents cascade directly into the azure Mediterranean Sea. Return to the hotel for an overnight stay in Antalya.",
        meals: "Breakfast",
        stay: "Antalya",
      },
      {
        day: 6,
        title: "Antalya – Cappadocia",
        description: "After breakfast, transfer to Antalya Airport for your domestic flight to Cappadocia. Upon arrival at Kayseri or Nevşehir Airport, transfer to your unique cave-style hotel and check in. The remainder of the day is free to relax and soak in the magical landscape of fairy chimneys and volcanic tuff formations. Register for tomorrow's optional sunrise balloon ride. Overnight stay in Cappadocia.",
        meals: "Breakfast",
        stay: "Cappadocia (3* El Puente Cave Hotel or similar)",
      },
      {
        day: 7,
        title: "Cappadocia Tour",
        description: "After breakfast, embark on a full-day guided tour across Cappadocia's most iconic wonders. Explore the subterranean chambers of Ozkonak Underground City, carved deep into volcanic rock. Continue to the UNESCO-listed Göreme Open Air Museum with its rock-hewn Byzantine churches and ancient frescoes, visit the historic troglodyte village of Çavuşin, and watch master artisans at a traditional pottery workshop in Avanos. Marvel at the natural rock sculptures in Love Valley, Devrent (Imagination) Valley, and the iconic Three Beauties Fairy Chimneys in Ürgüp. Overnight stay in Cappadocia.",
        meals: "Breakfast",
        stay: "Cappadocia",
      },
      {
        day: 8,
        title: "Cappadocia – Istanbul – Departure",
        description: "After breakfast, enjoy free time for some final souvenir shopping before transferring to Kayseri or Nevşehir Airport for your domestic flight back to Istanbul. Connect with your onward international flight back home, carrying unforgettable memories of Turkey's magical landscapes and ancient history. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "07 Nights' accommodation with breakfast (except Day 1)",
      "Hotel accommodations: 2N Istanbul (5*), 1N Pamukkale (4*), 2N Antalya (4*), 2N Cappadocia (3* Cave Hotel)",
      "All airport transfers as mentioned in the itinerary",
      "All entrance fees to attractions mentioned in the itinerary",
      "Transportation in a fully air-conditioned, non-smoking coach",
      "Services of professional English-speaking licensed tour guides",
      "Hotel room and municipal city taxes",
    ],
    exclusions: [
      "5% GST & 2% TCS (statutory government charges)",
      "International and Domestic airfares and airport taxes",
      "Turkey Visa charges & Comprehensive Travel Insurance",
      "Optional sunrise Hot Air Balloon rides in Pamukkale and Cappadocia",
      "Lunches, dinners, and beverages unless specifically mentioned",
      "Early check-in and late check-out charges",
      "Tips for tour guides, drivers, porterage, and personal expenses",
      "Camera/video fees wherever applicable",
    ],
    faqs: [
      {
        question: "What are the rates and hotel categories for Turkish Wonders?",
        answer: "Per Person Cost on Double/Twin sharing basis is INR 2,56,999/- + 5% GST + 2% TCS (based on minimum 2 passengers). The package features 5-star accommodation in Istanbul (La Quinta by Wyndham), 4-star in Pamukkale (Tripolis Hotel), 4-star in Antalya (Best Western Plus Khan), and an authentic 3-star cave hotel in Cappadocia (El Puente Cave Hotel). Rates are valid until 31st October.",
      },
      {
        question: "Are domestic flights and hot air balloon rides included?",
        answer: "Domestic flights (Istanbul–Denizli, Antalya–Cappadocia, Cappadocia–Istanbul) and the world-famous sunrise Hot Air Balloon rides in Cappadocia and Pamukkale are optional additions and can be arranged upon request.",
      },
      {
        question: "What should I know about visiting mosques and religious sites?",
        answer: "When visiting active religious sites such as the Blue Mosque and Hagia Sophia Grand Mosque, modest attire covering knees and shoulders is mandatory, and women are required to carry and wear a headscarf.",
      },
    ],
  },
  {
    id: "south-african-delights",
    title: "South Africa (3N Cape Town | 2N Sun City | 1N Johannesburg)",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹1,42,999",
    highlights: [
      "Guided Half-Day Mother City Tour of Cape Town & Bo-Kaap",
      "Ascend the iconic Table Mountain by Cable Car (weather permitting)",
      "Full-day scenic Cape Peninsula tour along the Atlantic Seaboard",
      "Cape of Good Hope Nature Reserve & Flying Dutchman Funicular",
      "Meet the charming colony of African Penguins at Boulders Beach",
      "Two nights at the world-class Sun City Resort & Valley of Waves",
      "Opportunity for an optional Big Five Safari in adjacent Pilanesberg National Park",
      "Visit Gold Reef City in Johannesburg with gold pouring demonstrations",
      "Private airport arrival, departure and intercity road transfers",
    ],
    category: "International",
    tagline: "Cape Town's coastal splendor, Table Mountain, Boulders Beach penguins, and Sun City resort fun.",
    overview:
      "Discover the extraordinary diversity of South Africa on a 6-night, 7-day tour. Spend 3 nights in breathtaking Cape Town taking in the vibrant Bo-Kaap, Table Mountain cable car, and a full-day Cape Peninsula excursion to the Cape of Good Hope and Boulders Beach penguins. Continue with 2 nights at the glamorous Sun City Resort with options for a Big Five safari in Pilanesberg, concluding with 1 night in Johannesburg visiting Gold Reef City.",
    heroImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=90&w=3200",
    bestTime: "October to April",
    startingPoint: "Cape Town International Airport (CPT)",
    groupSize: "Min 2 travellers",
    themes: ["Wildlife & Safari", "Coastal Wonders", "Resort Living", "City & Culture"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800", caption: "Table Mountain overlooking Cape Town" },
      { image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=85&w=1800", caption: "African sunset over the bushveld" },
      { image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&q=85&w=1800", caption: "African penguins at Boulders Beach" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Cape Town",
        description: "Welcome to South Africa! Upon arrival at Cape Town International Airport, you will be greeted by your local representative and transferred to your hotel. Set dramatically between the majestic Table Mountain and the sparkling Atlantic Ocean, Cape Town is one of the world's most beautiful cities. After check-in, the remainder of the day is free to relax or explore the bustling Victoria & Alfred Waterfront, cafés, and nearby attractions at your own pace. Overnight stay in Cape Town.",
        meals: "—",
        stay: "Cape Town",
      },
      {
        day: 2,
        title: "Cape Town City Tour & Table Mountain",
        description: "After breakfast, set out on a guided Half-Day Mother City Tour. Drive through the scenic suburbs of Clifton and Sea Point before visiting some of Cape Town’s most iconic landmarks, including the Houses of Parliament, Castle of Good Hope, South African Museum, District Six, Slave Lodge, the colorful Bo-Kaap neighborhood, and Greenmarket Square. Later, ascend world-famous Table Mountain by cable car (weather permitting) to take in breathtaking 360-degree views of Cape Town, Table Bay, and Robben Island. (If closed due to wind/weather, Signal Hill will be visited). Overnight stay in Cape Town.",
        meals: "Breakfast",
        stay: "Cape Town",
      },
      {
        day: 3,
        title: "Cape Peninsula & Cape of Good Hope",
        description: "After breakfast, embark on a full-day excursion along the spectacular Cape Peninsula. Travel via the Atlantic coastline passing Sea Point, Camps Bay, Clifton, Llandudno, Hout Bay, and Scarborough before reaching the legendary Cape of Good Hope Nature Reserve. Ride the famous Flying Dutchman Funicular up to the historic lighthouse and admire dramatic cliffs. Continue to Boulders Beach, home to a world-famous colony of African Penguins, and visit the historic naval town of Simon’s Town. Overnight stay in Cape Town.",
        meals: "Breakfast",
        stay: "Cape Town",
      },
      {
        day: 4,
        title: "Cape Town – Johannesburg – Sun City",
        description: "After breakfast, transfer to Cape Town International Airport for your domestic flight to Johannesburg (airfare not included). Upon arrival at O.R. Tambo International Airport, meet your representative and travel by scenic road transfer to the famous Sun City Resort, South Africa's premier luxury leisure complex. Surrounded by lush gardens, swimming pools, the Valley of Waves, and golf courses, spend the remainder of the day exploring the resort's world-class attractions. Overnight stay in Sun City.",
        meals: "Breakfast",
        stay: "Sun City",
      },
      {
        day: 5,
        title: "Leisure in Sun City (Optional Safari)",
        description: "Enjoy breakfast at the hotel before spending the day at your leisure. Relax by the pools, experience the wave pool at the Valley of Waves, or take an exciting optional open-vehicle game safari into the adjacent Pilanesberg National Park, home to the Big Five (lion, leopard, elephant, rhino, buffalo) roaming freely in an extinct volcanic crater. Overnight stay in Sun City.",
        meals: "Breakfast",
        stay: "Sun City",
      },
      {
        day: 6,
        title: "Sun City – Johannesburg & Gold Reef City",
        description: "After breakfast, depart by road for Johannesburg. Upon arrival, enjoy a guided visit to Gold Reef City, a unique living-history theme park and museum complex recreated around a 19th-century gold rush mine. Discover reconstructed miners' cottages, underground mine tours, gold-pouring demonstrations, and traditional cultural experiences. Later, transfer to your hotel in Johannesburg. Overnight stay in Johannesburg.",
        meals: "Breakfast",
        stay: "Johannesburg",
      },
      {
        day: 7,
        title: "Departure from Johannesburg",
        description: "After breakfast, check out from the hotel and transfer to O.R. Tambo International Airport for your onward international flight home, departing with unforgettable memories of South Africa's majestic beauty and vibrant heritage. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "06 Nights' 3* hotel accommodation with daily breakfast",
      "Private Airport Arrival and Departure Transfers in Cape Town & Johannesburg",
      "Intercity private road transfers between Johannesburg, Sun City, and Gold Reef City",
      "Cape Town Half-Day Mother City & Bo-Kaap Tour with Table Mountain Cable Car Ticket (Weather Permitting)",
      "Full-Day Cape Peninsula Tour including Cape Point Nature Reserve entrance",
      "Flying Dutchman Funicular round-trip ride at Cape Point",
      "Entrance ticket to Boulders Beach African Penguin Colony",
      "Entrance ticket and guided tour at Gold Reef City Theme Park & Museum",
      "All sightseeing and transfers in private air-conditioned vehicle as per itinerary",
    ],
    exclusions: [
      "5% GST & 2% TCS (payable as per Indian regulatory requirements)",
      "International & Domestic flights (including the Cape Town – Johannesburg sector)",
      "South Africa Visa fees & Mandatory Travel Insurance",
      "Lunches & Dinners throughout the tour",
      "Optional open-vehicle safari game drives in Pilanesberg National Park",
      "Hotel city taxes, tips, gratuities, porterage, and telephone/minibar expenses",
      "Additional entrance fees or activities not explicitly listed under inclusions",
    ],
    faqs: [
      {
        question: "What are the costs and validity for the South Africa tour?",
        answer: "Total Cost Per Person on Double sharing basis is ₹1,42,999/- + 5% GST + 2% TCS; Single sharing basis is ₹1,84,999/- + 5% GST + 2% TCS (based on min 2 passengers). Rates are valid until 29th September 2026 (excluding Diwali, Christmas, New Year, and peak festival dates).",
      },
      {
        question: "How do the Cape Town to Johannesburg transfers work?",
        answer: "Guests take a domestic flight from Cape Town to Johannesburg (booked separately). Upon arrival at O.R. Tambo Airport, private vehicle road transfers convey guests directly to Sun City, Gold Reef City, and back to the airport.",
      },
      {
        question: "Is a safari included in the tour?",
        answer: "Sun City is situated directly adjacent to Pilanesberg National Park. Guests have Day 5 at leisure with the option to book a thrilling Big Five morning or afternoon 4x4 safari game drive directly through the resort.",
      },
    ],
  },
  {
    id: "japan-autumn-delights",
    title: "Japan Autumn Delights – 9 Nights / 10 Days",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=85&w=1800",
    duration: "9 Nights / 10 Days",
    price: "₹2,84,999",
    highlights: [
      "Tokyo Skytree (350m observation deck - admission included)",
      "Sensō-ji Temple, Nakamise Shopping Street & Shibuya Scramble Crossing",
      "TeamLab Planets TOKYO DMM immersive digital art (admission included)",
      "Mount Fuji 5th Station (weather permitting)",
      "Interactive Sumo Show & Experience (admission included)",
      "Mt. Fuji Panoramic Ropeway over Lake Kawaguchi (admission included)",
      "Toyota Commemorative Museum of Industry and Technology in Nagoya",
      "Nabana no Sato Botanical Gardens & illumination displays",
      "Traditional Kimono Wearing Experience (admission included)",
      "Todaiji Temple (Great Buddha) & Nara Deer Park",
      "Umeda Sky Building – Floating Garden Observatory",
      "Arashiyama Bamboo Grove & Sagano Romantic Train along Hozugawa River",
      "Kinkaku-ji (Golden Pavilion) & Fushimi Inari Taisha (thousand torii gates)",
      "Mount Rokko Cable Car & Himeji Castle UNESCO feudal castle",
      "Hiroshima Peace Memorial Museum, Atomic Bomb Dome & Gandhi Statue",
      "Miyajima Ferry & Itsukushima Shrine Floating Torii Gate",
      "Shinkansen (Bullet Train) Regular Class to Okayama",
      "Osaka Kaiyukan Aquarium (Whale Shark) & Dotonbori shopping",
      "Rinku Premium Outlets shopping near Kansai Airport",
    ],
    category: "International",
    tagline: "Tokyo – Mt. Fuji – Nagoya – Nara – Kyoto – Kobe – Hiroshima – Okayama – Osaka · 9N/10D",
    overview:
      "An unforgettable 9 Nights / 10 Days autumn voyage through the Land of the Rising Sun. Experience the ultra-modern pulse of Tokyo with teamLab Planets and Tokyo Skytree, panoramic views of Mount Fuji with a sumo wrestling experience, Nagoya's Toyota museum and Nabana no Sato illuminations, sacred Nara with friendly deer and giant Buddha, timeless Kyoto temples and the Sagano Romantic train, Himeji Castle, the resilient spirit of Hiroshima and Miyajima's floating torii gate, high-speed Shinkansen bullet train rides, and vibrant Osaka food and shopping.\n\nDeparture Date: 16 Nov 2026.",
    heroImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=90&w=3200",
    bestTime: "November",
    startingPoint: "Narita International Airport (NRT), Tokyo",
    groupSize: "Group departure: 16 Nov 2026",
    themes: ["Culture", "City", "Scenic", "Heritage"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=85&w=1800", caption: "Mount Fuji in Autumn" },
      { image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=85&w=1800", caption: "Kyoto Golden Pavilion" },
    ],
    itinerary: [
      {
        day: 1,
        title: "16th Nov – Arrival in Tokyo",
        description:
          "Welcome to Japan! Upon arrival at Narita International Airport, complete immigration and baggage formalities before meeting your representative for a private transfer to your hotel in Tokyo. After check-in, take some time to relax and recover from your journey. In the evening, enjoy a delicious Indian dinner at a local restaurant. (Sightseeing is subject to your flight arrival time). Overnight stay in Tokyo.",
        meals: "Dinner",
        stay: "Tokyo",
      },
      {
        day: 2,
        title: "17th Nov – Tokyo Full Day Tour",
        description:
          "After breakfast, depart at 09:30 Hrs for a full-day exploration of Tokyo. Visit Tokyo Skytree's 350-metre observation deck for spectacular skyline views. Explore Sensō-ji, Tokyo's oldest Buddhist temple, and stroll through Nakamise Shopping Street. Drive past Shibuya Scramble Crossing, the world's most famous pedestrian crossing. Experience an extraordinary world of immersive digital art at TeamLab Planets TOKYO DMM. Return to hotel after sightseeing. Overnight stay in Tokyo.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Tokyo",
      },
      {
        day: 3,
        title: "18th Nov – Tokyo – Mount Fuji Full Day Tour – Mishima",
        description:
          "After breakfast, check out and depart at 09:00 Hrs for a scenic excursion to Mount Fuji. Visit the famous 5th Station (weather permitting) for breathtaking views. Discover Japan's national sport through an interactive Sumo Show & Experience. Enjoy a scenic ride on the Mt. Fuji Panoramic Ropeway overlooking Lake Kawaguchi. Continue to Mishima for check-in. Overnight stay in Mishima.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Mishima",
      },
      {
        day: 4,
        title: "19th Nov – Mishima – Nagoya Full Day Tour",
        description:
          "After breakfast, check out and depart at 09:00 Hrs for Nagoya. Visit the Toyota Commemorative Museum of Industry and Technology to learn about Toyota's journey through interactive exhibits. Explore Nabana no Sato, one of Japan's most famous botanical gardens renowned for seasonal flowers and spectacular illumination displays. Check in to hotel in Nagoya. Overnight stay in Nagoya.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Nagoya",
      },
      {
        day: 5,
        title: "20th Nov – Nagoya – Nara – Osaka",
        description:
          "After breakfast, journey towards Nara. Dress in a traditional Japanese kimono for memorable photos. Visit Todaiji Temple, home to the magnificent Great Buddha statue, and stroll through Nara Deer Park among hundreds of free-roaming deer. Proceed to Osaka and end the day with panoramic views from the Umeda Sky Building Floating Garden Observatory. Check in to hotel in Osaka. Overnight stay in Osaka.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Osaka",
      },
      {
        day: 6,
        title: "21st Nov – Osaka – Kyoto – Osaka Full Day Tour",
        description:
          "After breakfast, depart at 09:00 Hrs for Kyoto, Japan's ancient capital. Walk through the peaceful Arashiyama Bamboo Grove. Enjoy a scenic train journey on the Sagano Romantic Train through the picturesque Hozugawa River valley. Visit Kinkaku-ji (Golden Pavilion) surrounded by tranquil gardens. Explore Fushimi Inari Taisha, famous for its thousands of vibrant vermilion torii gates. Return to Osaka. Overnight stay in Osaka.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Osaka",
      },
      {
        day: 7,
        title: "22nd Nov – Osaka – Kobe – Okayama Full Day Tour",
        description:
          "After breakfast, check out and depart at 09:00 Hrs for Kobe. Enjoy a scenic ride on the Mount Rokko Cable Car with panoramic views of Kobe, Osaka Bay, and surrounding mountains. Visit Himeji Castle, Japan's finest feudal castle and UNESCO World Heritage Site with its elegant white architecture. Continue to Okayama and check in to hotel. Overnight stay in Okayama.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Okayama",
      },
      {
        day: 8,
        title: "23rd Nov – Okayama – Hiroshima – Okayama Full Day Tour",
        description:
          "After breakfast, depart at 09:00 Hrs for Hiroshima. Visit the Hiroshima Peace Memorial Museum, Atomic Bomb Dome, Cenotaph & Sadako Monument, and the statue of Mahatma Gandhi. Board the Miyajima Ferry to visit the UNESCO-listed Itsukushima Shrine and its iconic Floating Torii Gate. Experience Japan's high-speed rail on the Shinkansen (Bullet Train) back to Okayama. Overnight stay in Okayama.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Okayama",
      },
      {
        day: 9,
        title: "24th Nov – Okayama – Osaka – Kansai Airport Area",
        description:
          "After breakfast, check out and depart at 09:00 Hrs for Osaka. Explore the lively Dotonbori & Shinsaibashi-suji shopping district with its neon lights and local treats. Visit Osaka Kaiyukan Aquarium, home to whale sharks and marine species. Enjoy last-minute shopping at Rinku Premium Outlets before proceeding to your hotel near Kansai Airport. Overnight stay near Kansai Airport.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Kansai Airport Area",
      },
      {
        day: 10,
        title: "25th Nov – Kansai Airport Departure",
        description:
          "After breakfast, check out from the hotel. Take the complimentary hotel shuttle service to Kansai International Airport (KIX) (approx. 20 minutes) for your onward flight home. Guests with later departures may explore the nearby Kansai Outlet Mall within walking distance. Sayonara!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "09 Nights' accommodation in 4-star hotels on twin/double sharing basis",
      "Multicuisine Meal Options – Veg, Non-Veg and Jain (8 set lunches, 9 dinners)",
      "Tour Manager throughout the tour",
      "02 x 500 ml bottled water per person on coach service days",
      "Services of an English-speaking guide/assistant as per itinerary",
      "All Sightseeing Entrance Tickets: Tokyo Skytree, TeamLab Planets, Sumo Show, Mt. Fuji Ropeway, Toyota Museum, Nabana no Sato, Kimono experience, Todaiji Temple, Umeda Sky Observatory, Sagano Romantic Train, Kinkaku-ji, Mt. Rokko Cable Car, Himeji Castle, Hiroshima Peace Museum, Miyajima Ferry, Itsukushima Shrine, Kaiyukan Aquarium",
      "Regular Class (2nd Class) Shinkansen (Bullet Train) tickets",
      "One baggage transfer (up to 23 kg) per adult/child",
      "Airport transfers and sightseeing by air-conditioned coach as per itinerary",
    ],
    exclusions: [
      "5% GST & 2% TCS",
      "International & Domestic Airfare",
      "Visa & Travel Insurance",
      "Driver and guide tips",
      "Hotel city tax (payable directly at hotel, where applicable)",
      "Guaranteed early check-in or late check-out",
      "Personal expenses such as laundry, phone calls, mini bar, shopping",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing pricing?",
        answer:
          "Tour Pricing (valid till 15th Sep 2026):\n• Double sharing basis: ₹2,84,999/- + 5% GST + 2% TCS per person\n• Single occupancy supplement will be charged separately.",
      },
      {
        question: "What are the departure dates and visa requirements?",
        answer:
          "• Tour Departure Date: 16 Nov 2026.\n• Passport must be valid for at least 6 months from the date of return.\n• Grant of Japan Visa is solely at the discretion of the Embassy/Consulate.",
      },
      {
        question: "What is the payment policy and cancellation schedule?",
        answer:
          "Payment Terms:\n• At booking: 50% non-refundable booking amount.\n• 30 days prior to departure (D-30): Full balance payment (ROE calculated as XE.com + 2).\n\nCancellation Charges:\n• Up to 45 days before departure: INR 40,000 per adult/child.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
    ],
  },
  {
    id: "scandinavia-northern-lights",
    title: "Highlights of Scandinavia with Northern Lights (8 Nights / 9 Days)",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=85&w=1800",
    duration: "8 Nights / 9 Days",
    price: "₹4,73,999",
    highlights: [
      "To and Fro Flights Included (into Oslo & out of Rovaniemi)",
      "Oslo City Orientation Tour & scenic Oslo Fjord Cruise",
      "Holmenkollen Ski Jump & Historic Ski Museum",
      "Guided Stockholm City Tour & picturesque Gamla Stan Old Town",
      "Overnight Baltic Sea Cruise from Stockholm to Helsinki with dinner onboard",
      "Guided Helsinki City Tour & Temppeliaukio Rock Church",
      "Excursion to the charming medieval wooden town of Porvoo",
      "High-speed ferry day excursion to Tallinn, Estonia (UNESCO Old Town & Toompea Castle)",
      "Overnight sleeper train aboard the legendary Santa Claus Express to Rovaniemi",
      "Ranua Wildlife Park (polar bears, Arctic foxes, wolves, snowy owls)",
      "Thrilling Night Northern Lights (Aurora Borealis) Hunting Excursion",
      "Santa Claus Village Excursion at the Arctic Circle & Santa's Post Office",
      "Traditional Husky Farm visit with an included Husky Sled Ride",
    ],
    category: "International",
    tagline: "Oslo – Stockholm – Baltic Cruise – Helsinki – Tallinn – Rovaniemi · 8N/9D",
    overview:
      "A once-in-a-lifetime 8 Nights / 9 Days Arctic and Scandinavian winter wonderland journey spanning Norway, Sweden, Finland, and Estonia. Sail the Oslo Fjord, explore Stockholm's cobbled streets, cruise the Baltic Sea to Helsinki, ferry across to medieval Tallinn, cross the Arctic Circle on the Santa Claus Express sleeper train, meet polar bears at Ranua Wildlife Park, hunt the magical Northern Lights (Aurora Borealis) in the night sky, meet Santa Claus at his official village in Rovaniemi, and mush Siberian huskies through snow-draped forests.\n\nDeparture Date: 07 Dec 2026.",
    heroImage: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=90&w=3200",
    bestTime: "December (Departure: 07 Dec 2026)",
    startingPoint: "Oslo Airport (OSL) / Return from Rovaniemi Airport (RVN)",
    groupSize: "Group departure: 07 Dec 2026",
    themes: ["Snow", "Northern Lights", "Cruise", "Family"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=85&w=1800", caption: "Northern Lights in Lapland" },
      { image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800", caption: "Santa Claus Village, Rovaniemi" },
    ],
    itinerary: [
      {
        day: 1,
        title: "07th Dec – Arrival in Oslo",
        description:
          "Welcome to Norway! Upon arrival at Oslo Airport, meet your tour manager and transfer to your hotel. Norway's vibrant capital blends Scandinavian charm with modern architecture, Viking heritage, and stunning waterfront views. The rest of the day is at leisure to relax after your journey. In the evening, enjoy dinner followed by a short tour briefing. Overnight stay in Oslo.",
        meals: "Dinner",
        stay: "Oslo",
      },
      {
        day: 2,
        title: "Oslo Fjord Cruise & Holmenkollen Ski Jump",
        description:
          "After breakfast, begin the day with a scenic cruise on the beautiful Oslo Fjord, sailing past charming islands, picturesque harbors, and the city’s impressive skyline. Later, visit the iconic Holmenkollen Ski Jump, offering spectacular panoramic views over Oslo. Explore the historic Ski Museum, showcasing over 4,000 years of skiing history. The afternoon is free to explore the city at your own pace. Overnight stay in Oslo.",
        meals: "Breakfast, Dinner",
        stay: "Oslo",
      },
      {
        day: 3,
        title: "Oslo City Tour – Stockholm",
        description:
          "Enjoy breakfast before setting out on an orientation tour of Oslo, passing the Royal Palace, Karl Johans Gate, Oslo City Hall, Parliament House, and the striking Oslo Opera House. Later, depart by luxury coach for Stockholm, enjoying scenic Nordic landscapes of forests, lakes, and charming villages. Check in to hotel in Stockholm and relax before dinner. Overnight stay in Stockholm.",
        meals: "Breakfast, Dinner",
        stay: "Stockholm",
      },
      {
        day: 4,
        title: "Stockholm City Tour & Overnight Baltic Cruise",
        description:
          "After breakfast, discover the highlights of Stockholm on a guided city tour. Explore the charming cobbled streets of Gamla Stan (Old Town), admire the Royal Palace, Stockholm Cathedral, City Hall, and enjoy beautiful views from Fjällgatan. After some free time, transfer to the port and board your overnight Baltic Sea cruise to Helsinki. Enjoy dinner on board while sailing through the stunning archipelago. Overnight onboard the cruise.",
        meals: "Breakfast, Dinner",
        stay: "Overnight Baltic Cruise",
      },
      {
        day: 5,
        title: "Helsinki City Tour & Porvoo",
        description:
          "Arrive in Helsinki after breakfast and begin a guided city tour covering Senate Square, Helsinki Cathedral, the remarkable Rock Church (Temppeliaukio Church), the Sibelius Monument, and Uspenski Cathedral. Continue to the charming medieval town of Porvoo, famous for its colorful wooden houses and cobbled riverside streets. Return to Helsinki in the evening and relax at your hotel. Overnight stay in Helsinki.",
        meals: "Breakfast, Dinner",
        stay: "Helsinki",
      },
      {
        day: 6,
        title: "Tallinn Excursion & Santa Claus Express",
        description:
          "After breakfast, board a high-speed ferry to Tallinn, Estonia’s enchanting medieval capital. Explore the UNESCO-listed Old Town, including Toompea Castle, Alexander Nevsky Cathedral, Town Hall Square, and narrow streets lined with cafés and boutiques. Return to Helsinki by ferry. In the evening, board the legendary Santa Claus Express overnight train to Rovaniemi, travelling across the Arctic Circle while you sleep. Overnight onboard Santa Claus Express.",
        meals: "Breakfast, Dinner",
        stay: "Santa Claus Express Train",
      },
      {
        day: 7,
        title: "Ranua Wildlife Park & Northern Lights Experience",
        description:
          "Arrive in Rovaniemi and begin your Arctic adventure with a visit to Ranua Wildlife Park, Finland’s northernmost zoo. Walk through snowy forest trails to observe Arctic wildlife including polar bears, Arctic foxes, wolves, lynx, moose, and snowy owls. Return to Rovaniemi, enjoy dinner, and head out on an exciting Northern Lights hunting excursion to witness the magical Aurora Borealis in shades of green and violet (weather permitting). Overnight stay in Rovaniemi.",
        meals: "Breakfast, Dinner",
        stay: "Rovaniemi",
      },
      {
        day: 8,
        title: "Santa Claus Village & Husky Safari",
        description:
          "After breakfast, visit the world-famous Santa Claus Village, where Christmas is celebrated every day. Cross the Arctic Circle, meet Santa Claus, visit his official post office, and browse festive souvenir shops. Later, visit a traditional Husky Farm, meet energetic Siberian huskies, and enjoy an exhilarating husky sled ride through snow-covered forests. Return to hotel for a farewell dinner. Overnight stay in Rovaniemi.",
        meals: "Breakfast, Dinner",
        stay: "Rovaniemi",
      },
      {
        day: 9,
        title: "Departure from Rovaniemi",
        description:
          "After breakfast, check out from the hotel and transfer to Rovaniemi Airport for your onward flight home, taking unforgettable memories of Scandinavia's fjords, medieval towns, Arctic adventures, magical Northern Lights, and the home of Santa Claus. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "To and Fro Flights Included (into Oslo & out of Rovaniemi)",
      "International flights include 23 kg check-in baggage and in-flight meals",
      "Meals Included as per itinerary (Packed Indian Dinner / On-Board Cruise Dinner)",
      "4* Hotels conveniently situated on the outskirts",
      "All Driver Tips Included",
      "Group Tour with dedicated Tour Manager",
      "All sightseeing and entrance fees as per itinerary",
      "Travel by luxury air-conditioned coach, overnight Baltic cruise, and Santa Claus Express train",
      "Oslo Fjord cruise & Holmenkollen Ski Jump",
      "Entrance to Temppeliaukio Rock Church in Helsinki",
      "Day trip high-speed ferry to Tallinn, Estonia return",
      "Ranua Wildlife Park entrance & Arctic wildlife experience",
      "Night Northern Lights (Aurora Borealis) hunting excursion",
      "Santa Claus Village excursion at the Arctic Circle",
      "Husky Farm visit with an included husky sled ride",
    ],
    exclusions: [
      "5% GST & 2% TCS",
      "Domestic Airfare (within India)",
      "Visa fees & Travel insurance",
      "Personal expenses, shopping, and laundry",
      "Hotel city tax",
      "Tips and gratuities not mentioned",
    ],
    faqs: [
      {
        question: "What is the total tour cost and sharing options?",
        answer:
          "Tour Pricing (valid till 15th Sep 2026):\n• Double sharing basis: ₹4,73,999/- + 5% GST + 2% TCS per person (Flights Included)\n• Single sharing basis: ₹5,98,999/- + 5% GST + 2% TCS per person (Flights Included)",
      },
      {
        question: "Are international flights and baggage included?",
        answer:
          "Yes, to-and-fro international flights (into Oslo and out of Rovaniemi) are included in the package, including 23 kg check-in baggage and complimentary in-flight meals.",
      },
      {
        question: "What are the payment terms and cancellation charges?",
        answer:
          "Payment Terms:\n• At booking: 50% non-refundable booking amount.\n• 30 days prior to departure (D-30): Full balance payment (ROE calculated as XE.com + 2).\n\nCancellation Charges:\n• Up to 45 days before departure: INR 40,000 per adult/child.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
    ],
  },
  {
    id: "best-of-georgia",
    title: "Best of Georgia - 6 Nights & 7 Days (4N Tbilisi | 2N Batumi)",
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹64,999",
    highlights: [
      "Tbilisi Panoramic & City Tour: Holy Trinity (Sameba), Bridge of Peace & Sulfur Baths",
      "Mtatsminda Mountain Funicular Ride & Cable Car to historic Narikala Fortress",
      "Ancient capital of Mtskheta: UNESCO Jvari Monastery & Svetitskhoveli Cathedral",
      "Batumi Black Sea City Tour: Piazza Square, Boulevard & Miracle Park",
      "Moving Ali & Nino kinetic statue & architectural Alphabet Tower",
      "Prometheus Cave limestone chambers & scenic Martvili Canyon turquoise gorges",
      "Scenic Georgian Military Highway: Ananuri Fortress, Gudauri & Kazbegi",
      "Private air-conditioned vehicle transfers (Sedan/Minivan/Sprinter) with English-speaking guide",
      "Comfortable hotel stays with daily breakfast",
    ],
    category: "International",
    tagline: "Tbilisi's old town, Batumi's Black Sea waterfront and the Caucasus road to Kazbegi.",
    overview:
      "Experience the soul of the Caucasus on a 6-night, 7-day tour through Georgia. Spend 4 nights in Tbilisi taking in the Mtatsminda Funicular, Narikala Cable Car, the spiritual sanctuary of Mtskheta, and the majestic Caucasus vistas of Gudauri and Kazbegi along the Georgian Military Highway. Spend 2 nights in coastal Batumi exploring its vibrant seaside boulevard, Piazza Square, moving Ali & Nino statue, the subterranean stalactites of Prometheus Cave, and Martvili Canyon.",
    heroImage: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=90&w=3200",
    bestTime: "April to October",
    startingPoint: "Tbilisi International Airport (TBS)",
    groupSize: "Min 2 travellers",
    themes: ["Caucasus Mountains", "Black Sea Coast", "Ancient Christian Heritage", "Scenic Gorges"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=85&w=1800", caption: "Tbilisi old town and Narikala Fortress at dusk" },
      { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1800", caption: "Caucasus peaks along the Georgian Military Highway" },
      { image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800", caption: "Batumi seaside boulevard and Black Sea waterfront" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Georgia – Tbilisi Panoramic Tour",
        description:
          "Upon arrival at Tbilisi International Airport, meet your representative and transfer to the hotel. After check-in and some leisure time, proceed for an evening panoramic city tour by car. Visit Mtatsminda Mountain and enjoy the Funicular Ride, offering beautiful panoramic views of Tbilisi. Later, return to the hotel for an overnight stay in Tbilisi.",
        meals: "—",
        stay: "Tbilisi",
      },
      {
        day: 2,
        title: "Tbilisi City Tour",
        description:
          "After breakfast, proceed for a full-day Tbilisi City Tour. Begin with the magnificent Holy Trinity Cathedral (Sameba), followed by a visit to Rike Park and the iconic Bridge of Peace. Continue to the famous Rezo Gabriadze Clock Tower, Anchiskhati Basilica and Sioni Cathedral. Explore the historic Sulfur Bath District and walk through the charming Sharden Area, known for its cafés, wine bars and souvenir shops. Continue to Metekhi Church and the monument of King Vakhtang Gorgasali, the legendary founder of Tbilisi. Later, enjoy a Cable Car Ride to Narikala Fortress, one of the best viewpoints overlooking the old city. Return to the hotel and overnight in Tbilisi.",
        meals: "Breakfast",
        stay: "Tbilisi",
      },
      {
        day: 3,
        title: "Mtskheta Tour – Transfer to Batumi",
        description:
          "After breakfast, proceed towards the ancient city of Mtskheta, one of Georgia’s most historic and religious destinations, often referred to as the 'Second Jerusalem.' Visit the beautiful Jvari Monastery, situated on a hill overlooking the confluence of the Aragvi and Mtkvari rivers, followed by Svetitskhoveli Cathedral, one of Georgia’s most revered religious sites. After sightseeing, continue your journey towards Batumi on the Black Sea coast. Upon arrival, check in to the hotel and relax. Overnight stay in Batumi.",
        meals: "Breakfast",
        stay: "Batumi",
      },
      {
        day: 4,
        title: "Batumi City Tour",
        description:
          "After breakfast, proceed for a city tour of Batumi. Visit charming Piazza Square and St. Nicholas Church, followed by a relaxing walk through Seaside Park and Batumi Boulevard. Continue to Miracle Park, home to several of Batumi’s iconic landmarks. See the famous Ali & Nino Statue, a unique kinetic moving sculpture symbolizing eternal love and unity. You will also have an opportunity to admire the Alphabet Tower, an architectural landmark inspired by the ancient Georgian script. Later, enjoy leisure time along the beautiful Batumi waterfront before returning to the hotel. Overnight stay in Batumi.",
        meals: "Breakfast",
        stay: "Batumi",
      },
      {
        day: 5,
        title: "Prometheus Cave & Martvili Canyon – Return to Tbilisi",
        description:
          "After breakfast, check out and proceed towards Prometheus Cave, one of Georgia’s most spectacular natural attractions. Explore the impressive underground chambers decorated with beautiful stalactites, stalagmites and limestone formations. Continue to Martvili Canyon, known for its turquoise waters, lush surroundings and dramatic canyon landscapes. Enjoy a walk along the scenic trails and, subject to operation and weather conditions, experience the optional boat ride through the canyon. After sightseeing, continue towards Tbilisi. Upon arrival, check in to the hotel and relax. Overnight stay in Tbilisi.",
        meals: "Breakfast",
        stay: "Tbilisi",
      },
      {
        day: 6,
        title: "Ananuri – Gudauri – Kazbegi Tour",
        description:
          "After breakfast, proceed towards the scenic Georgian Military Highway. Visit Ananuri Fortress, a historic architectural complex overlooking the turquoise Zhinvali Reservoir. Continue towards Gudauri, a popular mountain resort surrounded by the magnificent Caucasus Mountains. Proceed further to Kazbegi (Stepantsminda), offering breathtaking views of the surrounding alpine landscape and Mount Kazbek. Enjoy the scenic drive through the Caucasus region before returning to Tbilisi. Overnight stay in Tbilisi.",
        meals: "Breakfast",
        stay: "Tbilisi",
      },
      {
        day: 7,
        title: "Departure from Georgia",
        description:
          "After breakfast, check out from the hotel and proceed to Tbilisi International Airport for your return flight, marking the end of your memorable Georgia tour. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation in Hotel including breakfast: 4 nights in Tbilisi, 2 nights in Batumi",
      "Sightseeing as mentioned in the itinerary",
      "Meals as per itinerary: Breakfast",
      "English-speaking driver cum guide / guide",
      "Entrance fees included: Cable Car Tbilisi, Funicular, Botanical Garden Batumi, 4x4 car for Gergeti, Martvili Canyon, Prometheus Cave",
      "2 Bottles of water per person per day",
      "All transfers according to program including airport transfers (Sedan / Minivan / Sprinter)",
    ],
    exclusions: [
      "Any International or Domestic Airfare",
      "5% GST & 2% TCS (payable per government regulations)",
      "Cost of pre or post tour hotel accommodation",
      "Expenses of personal nature such as drinks, telephone, shopping, snacks, porterage and laundry bills",
      "Tips and porter charges",
      "Any additional expenses incurred due to flight delays, cancellations, or weather conditions",
    ],
    faqs: [
      {
        question: "What are the package rates and validity for Best of Georgia?",
        answer:
          "Total Tour Cost on Double sharing basis is ₹64,999/- + 5% GST + 2% TCS (based on minimum 2 passengers). Rates are valid for travel until 31st October 2026 (excluding Diwali, Christmas, New Year, and peak festival periods).",
      },
      {
        question: "Which entrance tickets, cable cars, and vehicles are included?",
        answer:
          "The package includes entrance fees for the Mtatsminda Funicular, Narikala Cable Car, Batumi Botanical Garden, Prometheus Cave, Martvili Canyon, and a 4x4 vehicle for Gergeti.",
      },
      {
        question: "What is the payment and cancellation schedule?",
        answer:
          "A 50% non-refundable deposit is required at booking, with balance due 30 days prior to departure (D-30). ROE will be calculated as XE.com + 2. Cancellations up to 45 days prior incur INR 40,000 per adult/child; cancellations within 30 days incur 100% cancellation charges.",
      },
    ],
  },
  {
    id: "best-of-europe-2027",
    title: "Best of Europe (10 Nights / 11 Days)",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    duration: "10 Nights / 11 Days",
    price: "₹2,99,376",
    highlights: [
      "Guided tour of Paris, Palace of Versailles, Vaduz & Florence",
      "Eiffel Tower 3rd Level (Top Level)",
      "Romantic Seine River Cruise & Paris by Night illumination tour",
      "Full day at Disneyland® Paris (Park or Studios)",
      "Geneva Orientation Tour (Jet d'Eau, UN Office, Flower Clock)",
      "Excursion to Jungfraujoch – Top of Europe with Eiger Express & cogwheel train",
      "Mount Titlis with Rotair revolving cable car & Cliff Walk",
      "Scenic cruise on Lake Lucerne",
      "Rhine Falls with a thrilling boat ride",
      "Mini Train Ride in Vaduz, Liechtenstein",
      "Swarovski Crystal Worlds in Wattens & Innsbruck Golden Roof",
      "Venice: Private boat to St. Mark's & romantic Gondola Ride",
      "Florence Walking Tour & Square of Miracles / Leaning Tower of Pisa",
      "Rome: Vatican City, St. Peter's Basilica, Colosseum & Trevi Fountain",
    ],
    category: "International",
    tagline: "Paris – Geneva – Central Swiss – Innsbruck – Venice – Tuscany – Rome · 10N/11D",
    overview:
      "A magnificent 10 Nights / 11 Days classical European voyage spanning France, Switzerland, Liechtenstein, Austria, and Italy. Highlights include Paris icons, Eiffel Tower 3rd level, Versailles Palace, Disneyland® Paris, Geneva, the alpine wonderland of Jungfraujoch (Top of Europe) and Mount Titlis, Rhine Falls boat ride, Vaduz mini train, Swarovski Crystal Worlds in Innsbruck, a romantic Venetian Gondola ride, Renaissance Florence and the Leaning Tower of Pisa, concluding in the Eternal City of Rome with the Vatican and Colosseum.\n\nDeparture Dates: 8, 16 & 27 March 2027.",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    bestTime: "March 2027 (Departures: 8, 16 & 27 March 2027)",
    startingPoint: "Paris CDG Airport (Flight landing time: 08:00 AM – 02:00 PM)",
    groupSize: "Group departures: 8, 16 & 27 March 2027",
    themes: ["City", "Mountains", "Heritage", "Family"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800", caption: "Paris and Eiffel Tower" },
      { image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800", caption: "Rome Colosseum" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Paris – The City of Romance, Lights & Glamour",
        description:
          "Welcome to Paris, one of Europe’s most elegant and enchanting cities, renowned for its haute couture, world-famous museums, magnificent monuments and vibrant culture. Upon arrival, complete immigration formalities and collect your baggage. Meet your professional Tour Manager and transfer to your hotel for check-in. Relax and enjoy the comforts of your hotel. Overnight stay in Paris.",
        meals: "Dinner",
        stay: "Paris",
      },
      {
        day: 2,
        title: "Paris City Tour – Eiffel Tower – Versailles – Seine Cruise – Paris by Night",
        description:
          "After breakfast, proceed for a guided city tour of Paris covering Place Vendôme, Opéra Garnier, Musée d’Orsay, Place de la Concorde, Champs-Élysées, Arc de Triomphe, Alexander Bridge, and Les Invalides. Ascend to the 3rd Level (Top Level) of the Eiffel Tower for spectacular views. Continue to the magnificent Palace of Versailles, a masterpiece of French architecture. Enjoy a relaxing cruise on the River Seine. In the evening, experience Paris by Night with illuminated monuments. (Note: 3rd level access subject to operation; 2nd level provided if closed). Overnight stay in Paris.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 3,
        title: "Disneyland® Paris – A Day of Fun & Adventure",
        description:
          "Today, get ready for an exciting day at Disneyland® Paris. Choose between Disney® Park with its classic fairy-tale attractions and Disney character parades, or Walt Disney Studios® Park featuring thrilling stunt shows, movie magic, and behind-the-scenes experiences. Return to hotel in the evening. Overnight stay in Paris.",
        meals: "Breakfast, Packed Lunch, Dinner",
        stay: "Paris",
      },
      {
        day: 4,
        title: "Paris – Geneva Orientation Tour",
        description:
          "After breakfast, check out and proceed towards Switzerland. On arrival in Geneva, enjoy an orientation tour of this elegant Swiss city. See the famous Jet d’Eau, the United Nations Office, and the beautiful Flower Clock located near Lake Geneva. Proceed to your hotel and check in. Overnight stay in Geneva.",
        meals: "Breakfast, Packed Lunch, Dinner",
        stay: "Geneva",
      },
      {
        day: 5,
        title: "Jungfraujoch – Top of Europe – Grindelwald – Interlaken",
        description:
          "Embark on an unforgettable excursion to Jungfraujoch – The Top of Europe. Board the spectacular Eiger Express 3S cable car from Grindelwald Terminal to Eigergletscher, then continue by cogwheel train to Europe's highest railway station at 3,454 metres. Explore the Ice Palace and visit the Sphinx Observatory for panoramic views of the Aletsch Glacier. Enjoy the picturesque surroundings of Interlaken before returning to your hotel. Overnight stay in Central Switzerland.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 6,
        title: "Mount Titlis – Lucerne – Lake Lucerne Cruise",
        description:
          "After breakfast, proceed for an exciting excursion to Mount Titlis (3,020 metres) aboard the famous Titlis Rotair, the world's first revolving cable car. Experience the spectacular Cliff Walk suspension bridge. Proceed to Lucerne for an orientation tour covering the Lion Monument and Chapel Bridge (Kapellbrücke), with free time for Swiss watch and chocolate shopping. Later, enjoy a relaxing cruise on Lake Lucerne. Overnight stay in Central Switzerland.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Central Switzerland",
      },
      {
        day: 7,
        title: "Rhine Falls – Vaduz – Swarovski Crystal World – Innsbruck",
        description:
          "After breakfast, check out and proceed to Schaffhausen to experience Rhine Falls with a thrilling boat ride. Continue to Vaduz, capital of Liechtenstein, for a guided mini-train ride. Proceed to Wattens to explore the sparkling installations of Swarovski Crystal Worlds. Continue to Innsbruck for an orientation tour seeing the Golden Roof and Maria-Theresien-Strasse. Overnight stay in Innsbruck / Seefeld.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Innsbruck / Seefeld",
      },
      {
        day: 8,
        title: "Innsbruck – Venice – Gondola Ride",
        description:
          "After breakfast, check out and proceed towards Venice, the floating city. Board a private boat to St. Mark's Square. View St. Mark's Basilica, Bell Tower, Clock Tower, and the Bridge of Sighs. Enjoy a traditional Gondola Ride through the picturesque Venetian canals gliding past historic palaces. Proceed to your hotel for check-in. Overnight stay in Padova / Ferrara.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Padova / Ferrara",
      },
      {
        day: 9,
        title: "Florence Walking Tour – Pisa – Leaning Tower",
        description:
          "After breakfast, check out and proceed to Florence for a guided walking tour covering the Duomo, Campanile, Baptistery, Piazza della Signoria, and Ponte Vecchio. Later, proceed to Pisa to visit the Square of Miracles (Piazza dei Miracoli) and admire the world-renowned Leaning Tower of Pisa. Continue to hotel in Tuscany region. Overnight stay in Tuscany Region.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Tuscany Region",
      },
      {
        day: 10,
        title: "Florence / Tuscany – Rome – Vatican City – Colosseum – Trevi Fountain",
        description:
          "After breakfast, proceed towards Rome. Visit Vatican City and explore the magnificent St. Peter's Basilica. Continue sightseeing with a visit to the iconic ancient Colosseum and toss a coin into the beautiful Trevi Fountain. Check in to hotel. Overnight stay in Rome.",
        meals: "Breakfast, Lunch, Dinner",
        stay: "Rome",
      },
      {
        day: 11,
        title: "Rome – Departure – Fly Back Home",
        description:
          "After breakfast, check out from the hotel and transfer to Rome FCO Airport (coach drop by 11:00 AM) for your return flight. Say goodbye to Europe with memories that will last a lifetime.",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "Accommodation in 4-star hotels with daily buffet breakfast",
      "Sightseeing & attraction tickets as mentioned in the itinerary",
      "Tips to coach drivers for the duration of the tour is included",
      "Daily Mineral Water Bottle (500ml) per person",
      "Daily Continental Buffet Breakfast, 09 Indian Lunches, 10 Indian Dinners (packed lunch on Geneva drive & Disneyland Paris day)",
      "Eiffel Tower 3rd Level, Versailles Palace, Seine Cruise, Paris by Night",
      "Full day Disneyland® Paris pass",
      "Jungfraujoch Top of Europe with Eiger Express 3S cable car & cogwheel train",
      "Mount Titlis Rotair revolving cable car & Cliff Walk",
      "Lake Lucerne scenic cruise",
      "Rhine Falls thrilling boat ride",
      "Vaduz (Liechtenstein) guided mini train ride",
      "Swarovski Crystal Worlds entrance in Wattens",
      "Venice private boat transfer & romantic Gondola ride",
      "Florence walking tour & Leaning Tower of Pisa photo-stop",
      "Rome: St. Peter's Basilica, Colosseum, Trevi Fountain",
    ],
    exclusions: [
      "5% GST & 2% TCS",
      "International & Domestic Airfare",
      "Visa & Travel Insurance",
      "Airport taxes and other applicable charges",
      "Cost of excursions and sightseeing not mentioned in Inclusions",
      "Personal expenses such as laundry, telephone calls, shopping, etc.",
      "City tax and porterage charges",
    ],
    faqs: [
      {
        question: "What is the total tour cost across sharing categories?",
        answer:
          "Total Tour Cost (valid till 15th Sep 2026):\n• Double/Triple sharing basis: ₹2,99,376/- + 5% GST + 2% TCS per person\n• Single basis: ₹3,96,144/- + 5% GST + 2% TCS per person\n• Child with bed (below 12 years): ₹2,39,652/- + 5% GST + 2% TCS\n• Child no bed (below 12 years): ₹2,01,096/- + 5% GST + 2% TCS\n• Infant (below 02 years): ₹7,560/- + 5% GST + 2% TCS",
      },
      {
        question: "What are the departure dates for Best of Europe?",
        answer: "Departure dates: 8, 16 & 27 March 2027.",
      },
      {
        question: "What are the coach transfer timings for arrival and departure?",
        answer:
          "• Paris (CDG Airport) Arrival Transfer: Flight landing time should be between 08:00 AM – 02:00 PM.\n• Rome (FCO Airport) Departure Transfer: The coach will drop at FCO Airport by 11:00 AM.\n(Waiting up to 02:30 hours in arrival hall may be required for scheduled coach transfers).",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "Payment Terms:\n• At booking: 50% non-refundable booking amount.\n• 30 days prior to departure (D-30): Full balance payment (ROE calculated as XE.com + 2).\n\nCancellation Charges:\n• Up to 45 days before departure: INR 40,000 per adult/child.\n• Less than 30 days prior to departure: 100% cancellation charges apply.",
      },
    ],
  },
  {
    id: "azerbaijan-highlights",
    title: "Azerbaijan Highlights – 6 Nights & 7 Days (5N Baku | 1N Gabala)",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹51,999",
    highlights: [
      "Evening Panoramic City Tour: Highland Park, Flame Towers & Caspian Sea",
      "Full-Day Baku City Tour: UNESCO Icherisheher, Maiden Tower & Heydar Aliyev Center",
      "Scenic mountain getaway to Gabala surrounded by the Greater Caucasus",
      "Tufandag Mountain Resort with 2-line Cable Car ride & peaceful Nohur Lake",
      "Full-Day Gobustan National Park: Prehistoric petroglyphs & rock art",
      "Land of Fire Tour: Ateshgah Fire Temple & Yanardag Burning Mountain",
      "Full-Day Shahdag Mountain Resort excursion with 1-line Cable Car ride",
      "Shopping at premier venues: Deniz Mall on the Caspian & Ganjlik Mall",
      "Private air-conditioned vehicle transfers throughout with English-speaking guide",
    ],
    category: "International",
    tagline: "Baku's futuristic Flame Towers, ancient petroglyphs, burning fires & Caucasus mountain resorts.",
    overview:
      "Embark on an unforgettable journey through Azerbaijan, the enchanting Land of Fire. Spend 5 nights in Baku exploring the UNESCO-listed Icherisheher Old City, Zaha Hadid's Heydar Aliyev Center, the eternal fires of Ateshgah and Yanardag, and the prehistoric petroglyphs of Gobustan. Head into the Greater Caucasus Mountains for an overnight in Gabala with the Tufandag cable car and Nohur Lake, followed by a full-day adventure at Shahdag Mountain Resort.",
    heroImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=90&w=3200",
    bestTime: "April to October & Winter for Shahdag Skiing",
    startingPoint: "Heydar Aliyev International Airport (GYD), Baku",
    groupSize: "Min 2 travellers",
    themes: ["Land of Fire", "Caucasian Mountain Resorts", "Ancient Silk Road", "Modern Architecture"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=85&w=1800", caption: "Baku's Caspian waterfront and Flame Towers" },
      { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1800", caption: "The Greater Caucasus above Gabala" },
      { image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800", caption: "Shahdag Mountain Resort alpine scenery" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Baku & Panoramic City Tour",
        description: "Welcome to Azerbaijan! Upon arrival at Heydar Aliyev International Airport, meet your local representative and transfer to your hotel. After check-in and time to relax, assemble in the evening for a panoramic city tour. Visit Highland Park (Alley of Martyrs), offering breathtaking views of Baku's skyline and the Caspian Sea. Continue past the National Assembly (Milli Majlis) and admire the magnificent Flame Towers, the city's most iconic illuminated landmarks. Overnight stay in Baku.",
        meals: "—",
        stay: "Baku (3* Diamond Hotel Baku or similar)",
      },
      {
        day: 2,
        title: "Discover Historic & Modern Baku",
        description: "After breakfast, begin your exploration of Icherisheher (Old City), the UNESCO World Heritage-listed historic heart of Baku. Wander through its ancient stone alleys while visiting landmarks such as the Maiden Tower and the Palace of the Shirvanshahs. Later, enjoy a photo stop at the stunning Heydar Aliyev Center, an architectural masterpiece designed by Zaha Hadid. Continue with a relaxing walk along Baku Boulevard stretching along the Caspian Sea waterfront. Overnight stay in Baku.",
        meals: "Breakfast",
        stay: "Baku",
      },
      {
        day: 3,
        title: "Gabala Tour",
        description: "After breakfast, depart for the scenic mountain town of Gabala in northwestern Azerbaijan. Surrounded by the majestic Greater Caucasus Mountains, visit the Tufandag Mountain Resort and enjoy an exhilarating 2-line cable car ride offering spectacular alpine views. Later, visit the tranquil Nohur Lake, a picturesque alpine lake surrounded by dense forests, perfect for photography and relaxation. Overnight stay in Gabala.",
        meals: "Breakfast",
        stay: "Gabala (5* Gabala Garden Hotel or similar)",
      },
      {
        day: 4,
        title: "Gobustan & Deniz Mall",
        description: "Enjoy breakfast before departing for Gobustan National Park, a UNESCO World Heritage Site famous for ancient rock carvings dating back tens of thousands of years. Explore fascinating prehistoric petroglyphs depicting hunting scenes, wildlife, and early human life, alongside the interactive museum. Later, return towards Baku to visit the modern Deniz Mall overlooking the Caspian Sea for shopping, dining, and leisure. Overnight stay in Baku.",
        meals: "Breakfast",
        stay: "Baku",
      },
      {
        day: 5,
        title: "Flames Tour",
        description: "After breakfast, visit the historic Ateshgah Fire Temple in Surakhani, an ancient place of worship for Zoroastrians and Hindu pilgrims with eternal flames fed by natural gas vents. Continue to Yanardag (Burning Mountain), where natural gas flames have burned continuously on the hillside for centuries, showcasing the origin of Azerbaijan's title as the 'Land of Fire'. Later, enjoy leisure and shopping at Ganjlik Mall. Overnight stay in Baku.",
        meals: "Breakfast",
        stay: "Baku",
      },
      {
        day: 6,
        title: "Shahdag Mountain Resort Tour",
        description: "After breakfast, travel to the spectacular Shahdag Mountain Resort, nestled high in the Greater Caucasus Mountains. As Azerbaijan's premier mountain resort, Shahdag offers dramatic alpine scenery and an included 1-line cable car ride, with a wide range of seasonal activities such as the alpine coaster, zipline, quad biking, and winter snow sports (activities at own expense). Return to Baku in the evening. Overnight stay in Baku.",
        meals: "Breakfast",
        stay: "Baku",
      },
      {
        day: 7,
        title: "Departure from Baku",
        description: "After breakfast, check out from the hotel and transfer to Heydar Aliyev International Airport for your onward flight. Depart Azerbaijan with unforgettable memories of its ancient heritage, modern architecture, scenic mountain landscapes, and unique natural wonders. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "05 Nights' accommodation in Baku (3* Diamond Hotel or similar) & 1 Night in Gabala (5* Gabala Garden Hotel or similar)",
      "Daily buffet breakfast at hotels",
      "Sightseeing across Baku, Absheron, Gobustan, Gabala, and Shahdag",
      "Entrance fees included: Flame Temple (Ateshgah), Burning Mountain (Yanardag), Gobustan Museum, Gabala Cable Car (2 lines), Shahdag Cable Car (1 line)",
      "2 bottles of mineral water per person per day",
      "All transfers including airport arrival & departure transfers",
      "Private air-conditioned vehicle for all sightseeing and point-to-point transfers",
      "English-speaking driver/guide throughout the itinerary",
      "All applicable parking fees, road tolls, and fuel charges",
      "All applicable local government taxes",
    ],
    exclusions: [
      "5% GST & 2% TCS",
      "International & Domestic airfares",
      "Azerbaijan Visa fees & Comprehensive Travel Insurance",
      "Lunches, dinners, and beverages unless specifically mentioned",
      "Optional adventure sports and activities at Shahdag Mountain Resort (coaster, zipline, ski equipment, etc.)",
      "Additional cable car lines or activities not mentioned in inclusions",
      "Early check-in and late check-out fees",
      "Personal expenses (laundry, telephone calls, minibar, camera/video fees)",
      "Tips and gratuities for drivers and guides",
    ],
    faqs: [
      {
        question: "What is the price and hotel selection for Azerbaijan Highlights?",
        answer: "Per Person Cost on Double/Twin sharing basis is ₹51,999/- + 5% GST + 2% TCS (based on a minimum of 2 passengers). Accommodation includes 5 nights at the 3-star Diamond Hotel Baku (or similar) and 1 night at the 5-star Gabala Garden Hotel (or similar).",
      },
      {
        question: "Which entrance tickets and cable cars are included in the package?",
        answer: "The package includes entrance fees for Ateshgah Fire Temple, Yanardag Burning Mountain, Gobustan Museum & Petroglyphs, Tufandag Gabala Cable Car (2 lines), and Shahdag Mountain Resort Cable Car (1 line).",
      },
      {
        question: "What is the booking and cancellation policy?",
        answer: "A 50% non-refundable deposit is required at booking, with balance payable 30 days prior to departure (D-30). ROE is XE.com + 2. Cancellations up to 45 days prior incur INR 40,000 per person; under 30 days incurs 100% cancellation charges.",
      },
    ],
  },
  {
    id: "almaty-bliss",
    title: "Almaty Bliss - 6 Nights & 7 Days (6N Almaty)",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=85&w=1800",
    duration: "6 Nights / 7 Days",
    price: "₹74,999",
    highlights: [
      "Kok-Tobe Hill panoramic cable car ride overlooking Almaty",
      "Almaty City & Golden Square: Panfilov Park, Ascension Cathedral & Arbat",
      "Medeu High-Altitude Rink & Shymbulak Mountain Resort (3-line Cable Car)",
      "Alma-Arasan Gorge excursion & traditional Kazakh Eagle Hunting Show",
      "Oi-Qaragai Mountain Resort in the coniferous Zailiyskiy Alatau foothills",
      "Full-day excursion to Charyn Canyon & the famous Valley of Castles",
      "Scenic alpine Kolsai Lakes, the 'Pearls of the Tien Shan'",
      "Shopping at authentic venues: Green Bazaar, Rakhat Chocolate Shop & MEGA Mall",
      "All transfers and excursions by comfortable air-conditioned coach with guide",
      "6 nights' hotel accommodation in Almaty with daily breakfast",
    ],
    category: "International",
    tagline: "Kazakhstan's mountain city — cable cars, canyons, alpine lakes and Green Bazaar shopping.",
    overview:
      "Experience the enchanting beauty of Kazakhstan with 6 nights based in Almaty beneath the snow-capped Zailiyskiy Alatau mountains. Enjoy panoramic cable car rides at Kok-Tobe and Shymbulak, visit the world-famous Medeu skating rink, witness an authentic Kazakh nomadic eagle hunting show in Alma-Arasan Gorge, relax at Oi-Qaragai Mountain Resort, and embark on a breathtaking full-day expedition to the grand red formations of Charyn Canyon and the pristine turquoise waters of Kolsai Lakes.",
    heroImage: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=90&w=3200",
    bestTime: "May to October & Winter for Shymbulak Skiing",
    startingPoint: "Almaty International Airport (ALA)",
    groupSize: "Min 2 travellers",
    themes: ["Tien Shan Mountains", "Canyons & Lakes", "Nomadic Traditions", "Alpine Resorts"],
    gallery: [
      { image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=85&w=1800", caption: "Pristine alpine waters of Kolsai Lake" },
      { image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=85&w=1800", caption: "Snow-covered peaks at Shymbulak Mountain Resort" },
      { image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800", caption: "Dramatic red rock formations of Charyn Canyon" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Welcome to Almaty – Kok-Tobe Tour",
        description:
          "Upon arrival at Almaty International Airport, meet your representative and transfer to the hotel. After check-in and some leisure time, proceed for a half-day visit to Kok-Tobe Hill. Enjoy the scenic Cable Car Ride, offering beautiful panoramic views of Almaty and the surrounding mountains. Spend some time exploring Kok-Tobe before returning to the hotel. Overnight stay in Almaty.",
        meals: "—",
        stay: "Almaty",
      },
      {
        day: 2,
        title: "Almaty City Tour – Medeu & Shymbulak",
        description:
          "After breakfast, proceed for a city tour covering the highlights of Almaty’s Golden Square. Visit 28 Panfilov Guardsmen Park, the Eternal Flame, Ascension Cathedral, Green Bazaar and Arbat Shopping Street. Later, proceed towards the mountains for a visit to Medeu, one of the world’s highest-altitude skating rinks. Continue to Shymbulak Mountain Resort, surrounded by the beautiful Zailiyskiy Alatau mountains. Enjoy the scenic mountain atmosphere and breathtaking views before returning to the hotel. Overnight stay in Almaty.",
        meals: "Breakfast",
        stay: "Almaty",
      },
      {
        day: 3,
        title: "Alma-Arasan Gorge – Eagle Hunting Show – Dostyk Plaza",
        description:
          "After breakfast, proceed for a half-day excursion to Alma-Arasan Gorge, a beautiful mountain valley known for its forests, fresh mountain air and scenic landscapes. Later, experience a traditional Birds of Prey / Eagle Hunting Show, showcasing the ancient Kazakh nomadic tradition of hunting with golden eagles and other birds of prey. Continue to Dostyk Plaza for some leisure and shopping time before returning to the hotel. Overnight stay in Almaty.",
        meals: "Breakfast",
        stay: "Almaty",
      },
      {
        day: 4,
        title: "Shopping Tour – Green Bazaar, Rakhat & Mega Mall",
        description:
          "After breakfast, enjoy a shopping day in Almaty. Visit the famous Green Bazaar, where you can explore local delicacies, dried fruits, nuts, spices and traditional Kazakh products. Continue to Rakhat Chocolate Factory/Shop, one of Kazakhstan’s well-known confectionery brands, where you can shop for chocolates and sweets. Later, visit MEGA Mall for shopping and leisure. Return to the hotel. Overnight stay in Almaty.",
        meals: "Breakfast",
        stay: "Almaty",
      },
      {
        day: 5,
        title: "Oi-Qaragai Mountain Resort",
        description:
          "After breakfast, proceed towards Oi-Qaragai Mountain Resort, located in the picturesque foothills of the Zailiyskiy Alatau, surrounded by dense coniferous forests and mountain landscapes. Enjoy the resort’s natural surroundings and leisure activities. Depending on availability and operating conditions, guests can enjoy activities such as the Trolley Park, Rope Adventure Park, Mountain Karting, Climbing Park, Electric Bike, Aport Coaster, Horse Riding and other outdoor experiences. Later, return to Almaty. Overnight stay in Almaty.",
        meals: "Breakfast",
        stay: "Almaty",
      },
      {
        day: 6,
        title: "Charyn Canyon & Kolsai Lakes",
        description:
          "After an early breakfast, proceed for a full-day excursion to Charyn Canyon, one of Kazakhstan’s most spectacular natural attractions. Explore the dramatic rock formations and the famous Valley of Castles, created over millions of years by natural erosion. Continue towards the beautiful Kolsai Lakes, often known as the 'Pearls of the Tien Shan.' Surrounded by mountains and forests, these scenic alpine lakes offer breathtaking views and excellent opportunities for photography. After sightseeing, drive back to Almaty. Overnight stay in Almaty.",
        meals: "Breakfast",
        stay: "Almaty",
      },
      {
        day: 7,
        title: "Departure from Almaty",
        description:
          "After breakfast, enjoy some free time at the hotel or for last-minute shopping, depending on your flight schedule. Later, check out and proceed to Almaty International Airport for your return flight. End of the tour with wonderful memories of Kazakhstan. Safe travels!",
        meals: "Breakfast",
        stay: "—",
      },
    ],
    inclusions: [
      "06 Nights' accommodation with breakfast in Almaty (except Day 1)",
      "All Airport transfers mentioned within the Itinerary by coach",
      "Sightseeing in Alma-Arasan, Oi-Qaragai, Almaty City, Medeu, Shymbulak, and Kok-Tobe",
      "Full-day excursion to Kolsai Lake and Charyn Canyon Valley of Castles",
      "Shymbulak Cable Car – 3 lines",
      "Kok-Tobe Cable Car – Round Trip",
      "Traditional Eagle Hunting / Birds of Prey Show admission",
      "English-speaking guide or driver-guide as per group arrangements",
      "2 bottles of water (0.5L) per person per day",
    ],
    exclusions: [
      "International and Domestic airfare and airport taxes",
      "5% GST & 2% TCS",
      "Kazakhstan Visa charges and Comprehensive Travel Insurance",
      "Optional outdoor activities at Oi-Qaragai Mountain Resort (Trolley Park, Aport Coaster, Karting, etc.)",
      "Lunches and dinners unless specifically mentioned",
      "Personal expenses (laundry, telephone calls, minibar, room service, shopping)",
      "Tips and gratuities for drivers and guides",
      "Early check-in and late check-out charges",
    ],
    faqs: [
      {
        question: "What are the tour costs and validity for Almaty Bliss?",
        answer:
          "Per Person Cost on Double/Twin sharing basis is ₹74,999/- + 5% GST + 2% TCS (based on minimum 2 passengers). Rates are valid for travel until 31st October 2026 (not applicable during Diwali, Christmas, New Year, or other peak/festival periods).",
      },
      {
        question: "Which cable cars and attraction admissions are included?",
        answer:
          "The package includes round-trip Kok-Tobe Cable Car, all 3 lines of the Shymbulak Cable Car, entry to the Alma-Arasan traditional Eagle Hunting Show, and full-day excursions to Charyn Canyon and Kolsai Lake.",
      },
      {
        question: "What is the booking, payment, and cancellation policy?",
        answer:
          "A 50% non-refundable deposit is required at booking, with balance due 30 days prior to departure (D-30). ROE will be XE.com + 2. Cancellations up to 45 days prior incur INR 40,000 per adult/child; under 30 days incurs 100% cancellation charges.",
      },
    ],
  }
];

/**
 * Adds a practical second paragraph to every catalogue itinerary day.
 *
 * The package data already records the factual route and included visits. These
 * notes add the operational context travellers usually ask for without inventing
 * hotel names, fixed timings or inclusions that have not been contracted.
 */
function itineraryTravelNote(day: ItineraryDay, index: number, totalDays: number): string {
  const text = `${day.title} ${day.description}`.toLowerCase();
  const isFinalDay = index === totalDays - 1;

  if (isFinalDay || /departure|airport|railway|return flight|onward journey/.test(text)) {
    return "Travel note: Your final pickup time will be matched to the confirmed flight or train schedule. Keep photo ID, tickets and essential medicines in your hand luggage, and allow for the standard hotel check-out time.";
  }

  if (/arrival|welcome|check-in|check in/.test(text)) {
    return "Travel note: A local representative will coordinate the arrival pickup and hotel transfer. Standard check-in time applies, so early arrivals may have a short wait; the rest of the day is intentionally kept light.";
  }

  if (/flight|fly to|by air/.test(text)) {
    return "Travel note: Flight timing and baggage allowance are subject to the operating airline. The airport transfer will be planned around the confirmed schedule, with sightseeing adjusted if the flight timing changes.";
  }

  if (/ferry|cruise|speedboat|boat|island|houseboat/.test(text)) {
    return "Travel note: Carry a small day bag for the crossing and keep valuables protected from spray. Boarding time, sailing sequence and water activities remain subject to sea conditions and local authority clearance.";
  }

  if (/safari|national park|wildlife|jungle|elephant ride/.test(text)) {
    return "Travel note: Safari zone, vehicle and entry time are assigned by the forest authority and cannot be guaranteed in advance. Carry original photo ID, avoid bright clothing and follow the naturalist's safety instructions.";
  }

  if (/pass|snow|glacier|mountain|altitude|tawang|lachung|yumthang|nathula|shymbulak|kolsai/.test(text)) {
    return "Travel note: This is a weather-sensitive mountain day. Carry original photo ID, a warm layer, water and any prescribed medication; permits, road access and the order of stops may change at short notice.";
  }

  if (/temple|darshan|monastery|church|mosque|shrine|cathedral|gurudwara/.test(text)) {
    return "Travel note: Dress modestly and keep footwear easy to remove. Entry queues, prayer timings and local restrictions can affect the sequence of visits, while special darshan or rituals are included only when specifically listed.";
  }

  if (/beach|snorkel|water sport|coral|swim/.test(text)) {
    return "Travel note: Pack sun protection, a towel and suitable footwear in a day bag. Swimming and water sports depend on weather and safety conditions, and optional activities are payable locally unless specifically included.";
  }

  if (/transfer|drive| to |en route|onward/.test(text)) {
    return "Travel note: This is primarily a travel day, with comfort and meal stops planned along the route. Driving time can vary with traffic, road and weather conditions; hotel check-in follows on arrival.";
  }

  if (/sightseeing|city tour|museum|fort|palace|heritage|walking tour|old town/.test(text)) {
    return "Travel note: Expect a moderately paced day with periods of walking and standing. The local guide may reorder visits around opening hours, traffic and crowd levels while retaining the listed sightseeing.";
  }

  if (/leisure|free time|shopping|market/.test(text)) {
    return "Travel note: This time is left flexible for rest or independent plans. Transport, meals and paid attractions during leisure time are not included unless they are specifically mentioned in the package services.";
  }

  return "Travel note: The day's sequence may be adjusted locally for opening hours, traffic or weather. Your tour manager will confirm the reporting time, meeting point and any clothing or document requirements the evening before.";
}

function withDetailedItinerary(pkg: TourPackage): TourPackage {
  const itinerary = pkg.itinerary?.map((day, index, days) => ({
    ...day,
    description: `${day.description}\n\n${itineraryTravelNote(day, index, days.length)}`,
  }));

  return {
    ...pkg,
    itinerary,
    status: pkg.status ?? "active",
  };
}

export const featuredPackages: TourPackage[] = packageCatalogue.map(withDetailedItinerary);

export const whyChooseUs: WhyChooseItem[] = [
  {
    id: "w1",
    title: "15+ Years Experience",
    description: "Crafting customized journeys and guiding travelers since 2011 with deep local expertise.",
    stat: "15+ Years",
    iconName: "experience",
  },
  {
    id: "w2",
    title: "5000+ Happy Travellers",
    description: "Creating a loyal community of travelers who choose us year after year for their holidays.",
    stat: "5,000+",
    iconName: "happy",
  },
  {
    id: "w3",
    title: "Expert Tour Planning",
    description: "Our dedicated destination designers plan every detail so you can enjoy standard ease.",
    stat: "Hand-Crafted",
    iconName: "planning",
  },
  {
    id: "w4",
    title: "24×7 Support",
    description: "Round-the-clock backup and assistance during your tour for total peace of mind.",
    stat: "24/7 Care",
    iconName: "support",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ramesh Sen",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=320",
    destination: "Explored Sikkim",
    review: "Bandhan Tours organized our Sikkim tour flawlessly. The hotels chosen had excellent views, the drivers were polite and handled the mountainous terrain very safely. Highly recommended!",
    rating: 5,
  },
  {
    id: "t2",
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=320",
    destination: "Explored Kashmir",
    review: "The Kashmir group tour was fantastic. We had a great guide, seamless transportation, and the houseboats in Srinagar were a dream. Thank you, Bandhan, for this colorful memory!",
    rating: 5,
  },
  {
    id: "t3",
    name: "Amit & Sneha Patel",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=320",
    destination: "Explored Singapore",
    review: "We booked our customized Singapore honeymoon package with Bandhan Tours. The itinerary was perfectly balanced - giving us plenty of romantic free time along with smooth tours.",
    rating: 5,
  },
];

export const galleryImages: GalleryItem[] = [
  {
    id: "g1",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
    location: "Kerala",
    title: "Alleppey Houseboat",
  },
  {
    id: "g2",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800",
    location: "Sikkim",
    title: "Himalayan Valleys",
  },
  {
    id: "g3",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
    location: "Agra, India",
    title: "The Taj Mahal",
  },
  {
    id: "g4",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800",
    location: "Goa Beaches",
    title: "Golden Hour Shores",
  },
  {
    id: "g5",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1800",
    location: "Bali, Indonesia",
    title: "Ubud Rice Terraces",
  },
  {
    id: "g6",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    location: "Paris, France",
    title: "Eiffel Tower Mornings",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-kashmir-when-to-go",
    slug: "best-time-to-visit-kashmir",
    title: "The Best Time to Visit Kashmir: A Season-by-Season Guide",
    excerpt:
      "Tulip blooms in spring, houseboats under summer stars, saffron fields in autumn, or snow in Gulmarg — here's how to pick the right month for your Kashmir escape.",
    content:
      "Kashmir wears a different face in every season, and the 'best' time truly depends on the trip you're dreaming of.\n\nSpring (March–May) is when the valley wakes up. The Tulip Garden in Srinagar — Asia's largest — bursts into colour through late March and April, and the Mughal gardens are at their greenest. Days are mild and evenings still cool enough for a pheran.\n\nSummer (June–August) is peak season for good reason: warm days, blooming meadows in Gulmarg and Pahalgam, and long golden evenings on the Dal Lake houseboats. Book early — this is when families and honeymooners arrive in numbers.\n\nAutumn (September–November) is our quiet favourite. The chinar leaves turn crimson and gold, the saffron fields near Pampore are harvested, and the crowds thin out.\n\nWinter (December–February) belongs to the snow. Gulmarg becomes one of Asia's finest ski destinations, and the Gondola ride over a white valley is unforgettable.\n\nWhichever season calls you, our Kashmir designers will match the itinerary to the weather, the blooms, and your pace.",
    coverImage:
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=90&w=2400",
    author: "Bandhan Travel Desk",
    category: "Destinations",
    readTime: "6 min read",
    date: "18 Jul 2026",
    isPublished: true,
  },
  {
    id: "blog-northeast-first-timers",
    slug: "north-east-india-first-timers-guide",
    title: "North East India for First-Timers: Permits, Routes & Pacing",
    excerpt:
      "Sikkim, Meghalaya, and Arunachal reward the prepared traveller. A practical primer on inner-line permits, the smartest routes, and how not to over-pack your days.",
    content:
      "The North East is India's most rewarding frontier — but the routes, permits, and pace are genuinely different from the rest of the country, which is exactly why we run it as its own category.\n\nPermits first. Indian nationals need an Inner Line Permit (ILP) for parts of Sikkim (like Nathula and Tsomgo Lake), and for Arunachal Pradesh. Foreign nationals have their own Protected Area rules. We arrange these for you, but plan for a day of lead time.\n\nOn pacing: the single biggest mistake first-timers make is cramming too much. Mountain roads are slow and gloriously scenic — a 120km hop can take five hours. Build in buffer days, especially in North Sikkim where weather closes passes without notice.\n\nOur go-to first-timer loop pairs Gangtok and Tsomgo Lake with a slow descent into Darjeeling's tea country. Meghalaya's living root bridges and Shillong are a wonderful standalone second trip.\n\nCarry layers, cash for remote stretches, and a flexible attitude — the North East pays it all back in views.",
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=90&w=2400",
    author: "Bandhan Travel Desk",
    category: "Travel Tips",
    readTime: "7 min read",
    date: "10 Jul 2026",
    isPublished: true,
  },
  {
    id: "blog-packing-checklist",
    slug: "smart-packing-checklist-for-india-tours",
    title: "The Smart Packing Checklist for Indian Holidays",
    excerpt:
      "From the backwaters of Kerala to the snows of Manali, one carry-on can cover it. Our travel designers share the layering trick and the ten things people always forget.",
    content:
      "After planning thousands of trips, we've noticed the same items get forgotten again and again. Here's the checklist we quietly wish every traveller carried.\n\nThe layering rule: pack for the coldest morning and the warmest afternoon of your trip, not the average. A light thermal, a fleece, and a windcheater cover almost every Indian hill station without bulk.\n\nAlways forgotten: a universal power bank, a small torch (power cuts happen), motion-sickness tablets for winding roads, a reusable water bottle, sunscreen even in the hills, and copies of your ID stored separately from the originals.\n\nDocuments: keep digital and printed copies of your booking vouchers and permits. On group departures, your tour captain carries master copies too.\n\nFootwear: one pair of broken-in walking shoes beats three pairs of new ones. Your feet will thank you on day three.\n\nPack light, layer smart, and leave room for what you'll bring home.",
    coverImage:
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=90&w=2400",
    author: "Bandhan Travel Desk",
    category: "Guides",
    readTime: "4 min read",
    date: "28 Jun 2026",
    isPublished: true,
  },
];
