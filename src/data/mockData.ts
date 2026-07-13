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
    category: "Domestic",
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
