export interface Destination {
  id: string;
  name: string;
  image: string;
  price: string;
  description: string;
  tag?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  image: string;
  duration: string;
  price: string;
  highlights: string[];
  category: string;
  isPopular?: boolean;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  stat?: string;
  iconName: "experience" | "happy" | "planning" | "support";
}

export interface GroupDeparture {
  id: string;
  destination: string;
  date: string;
  duration: string;
  price: string;
  seatsLeft: number;
  totalSeats: number;
  status: "filling-fast" | "limited-seats" | "guaranteed";
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
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800",
    price: "₹34,500",
    description: "Heaven on Earth - experience pristine lakes, snow-capped peaks, and houseboats.",
    tag: "Romantic",
  },
  {
    id: "kerala",
    name: "Kerala",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
    price: "₹28,000",
    description: "God's Own Country - drift through green backwaters and spice plantations.",
    tag: "Nature",
  },
  {
    id: "goa",
    name: "Goa",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    price: "₹18,500",
    description: "Sun-drenched beaches, historical churches, and vibrant coastal night life.",
    tag: "Beach",
  },
  {
    id: "bali",
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    price: "₹65,000",
    description: "Tropical paradise loaded with cultural heritage, temples, and reefs.",
    tag: "Exotic",
  },
  {
    id: "dubai",
    name: "Dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    price: "₹78,000",
    description: "Sleek architecture, futuristic malls, and thrilling desert adventures.",
    tag: "Luxury",
  },
  {
    id: "thailand",
    name: "Thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800",
    price: "₹48,500",
    description: "Fascinating Buddhist temples, exotic street food, and islands.",
    tag: "Adventure",
  },
  {
    id: "europe",
    name: "Europe",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800",
    price: "₹1,85,000",
    description: "Timeless history, iconic architectural marvels, and diverse cultures.",
    tag: "Heritage",
  },
  {
    id: "singapore",
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800",
    price: "₹82,000",
    description: "Ultra-modern garden city featuring advanced technology and luxury lifestyles.",
    tag: "Modern",
  },
];

export const featuredPackages: TourPackage[] = [
  {
    id: "sikkim-special",
    title: "Mystic Northeast & Sikkim Special",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    duration: "9 Nights / 10 Days",
    price: "₹45,500",
    highlights: ["Gangtok sightseeing", "Tsomgo Lake & Baba Mandir", "Darjeeling Tea Estates", "Sunrise at Tiger Hill"],
    category: "North East",
    isPopular: true,
  },
  {
    id: "kashmir-paradise",
    title: "Kashmir Grandeur Group Tour",
    image: "https://images.unsplash.com/photo-1566837430541-11d2798e27c1?auto=format&fit=crop&q=80&w=1200",
    duration: "6 Nights / 7 Days",
    price: "₹38,000",
    highlights: ["Dal Lake Shikara Ride", "Gulmarg Gondola Ride", "Pahalgam Betaab Valley", "Srinagar Mughal Gardens"],
    category: "Domestic",
    isPopular: true,
  },
  {
    id: "royal-rajasthan",
    title: "Royal Heritage of Rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&q=80&w=1200",
    duration: "12 Nights / 13 Days",
    price: "₹52,000",
    highlights: ["Jaipur Pink City Palace", "Udaipur Lake Pichola Cruise", "Jaisalmer Desert Safari", "Jodhpur Mehrangarh Fort"],
    category: "Domestic",
    isPopular: false,
  },
  {
    id: "singapore-malaysia",
    title: "Singapore Wonders & Sentosa",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=1200",
    duration: "9 Nights / 10 Days",
    price: "₹92,000",
    highlights: ["Gardens by the Bay", "Universal Studios", "Sentosa Cable Car Ride", "Night Safari Adventure"],
    category: "International",
    isPopular: true,
  },
  {
    id: "kerala-backwaters",
    title: "Kerala Backwater & Spice Trails",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200",
    duration: "6 Nights / 7 Days",
    price: "₹29,500",
    highlights: ["Munnar Tea plantations", "Thekkady Wildlife Reserve", "Alleppey Houseboat Stay", "Kochi Fort Sightseeing"],
    category: "Domestic",
    isPopular: false,
  },
  {
    id: "thailand-getaway",
    title: "Thailand Island Paradise Escape",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200",
    duration: "7 Nights / 8 Days",
    price: "₹56,000",
    highlights: ["Bangkok Temples Tour", "Pattaya Coral Island Cruise", "Phuket Beach Resort Stay", "Phi Phi Island Day Trip"],
    category: "International",
    isPopular: false,
  },
];

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

export const groupDepartures: GroupDeparture[] = [
  {
    id: "gd1",
    destination: "Leh Ladakh Summer Special",
    date: "Aug 15, 2026",
    duration: "7 Nights / 8 Days",
    price: "₹42,500",
    seatsLeft: 6,
    totalSeats: 30,
    status: "limited-seats",
  },
  {
    id: "gd2",
    destination: "Kashmir Autumn Paradise Group Tour",
    date: "Sep 22, 2026",
    duration: "6 Nights / 7 Days",
    price: "₹36,000",
    seatsLeft: 12,
    totalSeats: 25,
    status: "filling-fast",
  },
  {
    id: "gd3",
    destination: "Sikkim & Northeast Autumn Colors",
    date: "Oct 10, 2026",
    duration: "9 Nights / 10 Days",
    price: "₹48,000",
    seatsLeft: 18,
    totalSeats: 25,
    status: "guaranteed",
  },
  {
    id: "gd4",
    destination: "Scenic Europe Wonders Explorer",
    date: "Nov 02, 2026",
    duration: "11 Nights / 12 Days",
    price: "₹2,10,000",
    seatsLeft: 4,
    totalSeats: 20,
    status: "limited-seats",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ramesh Sen",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    destination: "Explored Sikkim",
    review: "Bandhan Tours organized our Sikkim tour flawlessly. The hotels chosen had excellent views, the drivers were polite and handled the mountainous terrain very safely. Highly recommended!",
    rating: 5,
  },
  {
    id: "t2",
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    destination: "Explored Kashmir",
    review: "The Kashmir group tour was fantastic. We had a great guide, seamless transportation, and the houseboats in Srinagar were a dream. Thank you, Bandhan, for this colorful memory!",
    rating: 5,
  },
  {
    id: "t3",
    name: "Amit & Sneha Patel",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    destination: "Explored Singapore",
    review: "We booked our customized Singapore honeymoon package with Bandhan Tours. The itinerary was perfectly balanced - giving us plenty of romantic free time along with smooth tours.",
    rating: 5,
  },
];

export const galleryImages: GalleryItem[] = [
  {
    id: "g1",
    image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=600",
    location: "Kerala",
    title: "Alleppey Houseboat",
  },
  {
    id: "g2",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
    location: "Sikkim",
    title: "Himalayan Valleys",
  },
  {
    id: "g3",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600",
    location: "Agra, India",
    title: "The Taj Mahal",
  },
  {
    id: "g4",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    location: "Goa Beaches",
    title: "Golden Hour Shores",
  },
  {
    id: "g5",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
    location: "Bali, Indonesia",
    title: "Ubud Rice Terraces",
  },
  {
    id: "g6",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600",
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
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=1600",
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
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
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
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=1600",
    author: "Bandhan Travel Desk",
    category: "Guides",
    readTime: "4 min read",
    date: "28 Jun 2026",
    isPublished: true,
  },
];
