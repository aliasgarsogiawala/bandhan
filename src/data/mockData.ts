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
    "id": "bali-island-dreams",
    "title": "Bali – The Island of Dreams",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹61,900",
    "highlights": [
      "Nusa Penida speedboat island tour",
      "Uluwatu Temple sunset & Kecak Dance",
      "Bali Swing & jungle experiences",
      "Tanjung Benoa water sports"
    ],
    "category": "International",
    "isPopular": true,
    "tagline": "Temples, jungle swings and speedboat islands across Kuta, Ubud and Nusa Penida.",
    "overview": "Six nights across Kuta and Ubud combine Bali's signature temples and volcano viewpoints with a full-day speedboat tour of Nusa Penida's Kelingking Beach, Broken Beach and Crystal Bay.",
    "heroImage": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Ngurah Rai International Airport, Denpasar",
    "groupSize": "Min 25 pax for quoted rate",
    "themes": [
      "Beach",
      "Culture",
      "Adventure"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1800",
        "caption": "Kuta and Ubud, Bali"
      },
      {
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
        "caption": "Island-hopping to Nusa Penida"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Bali — Traditional Garland Welcome & Coastal Leisure",
        "description": "Touch down at Ngurah Rai International Airport in Denpasar, where your dedicated Bandhan tour representative greets you with a fragrant frangipani flower garland welcome. Board your private air-conditioned coach for a smooth transfer to your resort in Kuta. Spend your afternoon settling in, relaxing poolside, or taking your first walk along the golden sands of Kuta Beach as the sun dips into the Indian Ocean. In the evening, gather for a delicious Indian dinner at a renowned local restaurant.",
        "meals": "Lunch, Dinner",
        "stay": "Kuta"
      },
      {
        "day": 2,
        "title": "Tanjung Benoa Water Sports — Clifftop Uluwatu Temple & Sunset Kecak Fire Dance",
        "description": "After a wholesome breakfast, head south to the azure waters of Tanjung Benoa Peninsula for an exhilarating morning of water sports: feel the thrill of a high-speed Jet Ski ride with instructor, a classic Banana Boat splash, and a tandem Parasailing flight over the tropical bay. Following an authentic Indian buffet lunch, journey down to the rugged Bukit Peninsula to visit Uluwatu Temple, perched dramatically 70 metres atop sheer oceanic cliffs. As twilight illuminates the horizon, take your amphitheatre seats for the spellbinding Kecak & Fire Dance performance, accompanied by the hypnotic chanting of 50+ performers enacting the Ramayana epic.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kuta"
      },
      {
        "day": 3,
        "title": "West Nusa Penida Island Speedboat Day Tour — Kelingking Cliff & Broken Beach",
        "description": "Board an early-morning high-speed catamaran from Sanur Harbor across the Badung Strait to the pristine island of Nusa Penida. Hop into private 4x4 island transport to explore world-famous landmarks: gaze down at the iconic T-Rex shaped limestone cliff and turquoise surf of Kelingking Beach, marvel at the natural rock arch spanning Broken Beach, and peer into the emerald infinity pool of Angel's Billabong. Savor a hot local Indonesian/Indian lunch before swimming in the calm, palm-fringed bay of Crystal Bay. Return by speedboat to Bali in the late afternoon for dinner in Kuta.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kuta"
      },
      {
        "day": 4,
        "title": "Ulun Danu Beratan Lake Temple — Handara Iconic Gate — Sunset at Tanah Lot",
        "description": "Journey into the cool central highlands of Bedugul. Arrive at Lake Beratan to marvel at Pura Ulun Danu Beratan, the postcard-famous 17th-century Hindu-Buddhist water temple that appears to float on the misty lake surface. Continue to the iconic Handara Golf Gate for majestic photos framed against emerald mountain peaks. After lunch, wind down through terraced countryside to the southwestern coast to witness Tanah Lot Sea Temple, perched on an offshore wave-swept rock formation, surrounded by crashing tides as the golden sun sets into the horizon.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kuta"
      },
      {
        "day": 5,
        "title": "Royal Tirta Gangga Water Palace & Afternoon Leisure in Seminyak",
        "description": "Travel to East Bali to discover the royal Tirta Gangga Water Palace, constructed in 1946 by the King of Karangasem. Walk across stone stepping-pads laid over ornate ponds teeming with giant golden koi, framed by eleven-tiered fountains and lush tropical flora. Return to Kuta/Seminyak for an afternoon dedicated to relaxation: indulge in a traditional Balinese herbal massage, browse chic boutiques along Seminyak Square, or unwind by the beach shacks before an evening Indian dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kuta"
      },
      {
        "day": 6,
        "title": "Kintamani Mount Batur Volcano — Celuk Silver Craft — Bali Jungle Swing — Ubud Transfer",
        "description": "Check out from Kuta and journey toward the cultural highland capital of Ubud. Stop at Celuk village to watch master goldsmiths and silversmiths at work, and visit a traditional Luwak coffee plantation for sensory tastings. Ascend to the ridge of Kintamani for sweeping panoramic views of active Mount Batur volcano and its glistening caldera lake during an expansive buffet lunch. In the afternoon, soar above lush ravines on the famous Bali Jungle Swing and walk through the stepped green amphitheatre of Tegallalang Rice Terraces, ending with shopping at the Ubud Art Market before checking into your Ubud resort.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Ubud"
      },
      {
        "day": 7,
        "title": "Ubud Morning Leisure — Departure from Bali",
        "description": "Enjoy a leisurely final breakfast surrounded by the gentle morning sounds of Ubud's rainforest valley. Enjoy free time for last-minute souvenir shopping on Monkey Forest Road or a peaceful stroll through local artisan stalls. Meet your private chauffeur for your transfer to Ngurah Rai International Airport in Denpasar, boarding your flight home with treasured memories of your Bali adventure.",
        "meals": "Breakfast, Lunch",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Traditional garland welcome on arrival",
      "3-star hotel accommodation on double sharing",
      "Daily breakfast, lunch and dinner at Indian restaurants",
      "1L mineral water per person daily",
      "Water sports: jet ski, banana boat, couple parasailing",
      "Nusa Penida speedboat day tour, Bali Swing and Ubud tour",
      "Bali visa, English-speaking guide and Indian tour leader (25+ pax)",
      "Travel insurance up to 59 years, all transfers on private basis"
    ],
    "exclusions": [
      "International and domestic airfare, airport charges",
      "5% GST and 2% TCS",
      "Beverages and meals not mentioned in the itinerary",
      "Pre/post-tour accommodation, tips and porterage",
      "Personal expenses and costs from flight delays or cancellations"
    ]
  },
  {
    "id": "3-sisters-tour",
    "title": "3 Sisters Tour — Assam, Meghalaya & Arunachal Pradesh",
    "image": "/pdf-assets/kanchenjunga-darjeeling.jpg",
    "duration": "11 Nights / 12 Days",
    "price": "₹57,000",
    "highlights": [
      "Kaziranga elephant & jeep safari",
      "Living Root Bridge, Mawlynnong",
      "Tawang Monastery & Bumla Pass",
      "Sela Pass & Nathula border region"
    ],
    "category": "North East",
    "isPopular": true,
    "tagline": "Assam's tea gardens, Meghalaya's living bridges and Arunachal's Himalayan passes in one grand loop.",
    "overview": "A comprehensive 12-day loop through Assam, Meghalaya and Arunachal Pradesh — from Kamakhya Temple and Kaziranga's rhinos to the cleanest village in Asia and the high-altitude monastery town of Tawang near the China border.",
    "heroImage": "/pdf-assets/kanchenjunga-darjeeling.jpg",
    "bestTime": "September to December",
    "startingPoint": "Guwahati Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Mountains",
      "Culture",
      "Wildlife"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800",
        "caption": "Himalayan foothills of Arunachal Pradesh"
      },
      {
        "image": "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=85&w=1800",
        "caption": "Misty mornings in Meghalaya"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Guwahati Arrival — Maa Kamakhya Devi Temple Darshan",
        "description": "Arrive at Lokpriya Gopinath Bordoloi International Airport in Guwahati where your dedicated Bandhan tour manager welcomes you. Transfer to your hotel to freshen up before driving up the sacred Nilachal Hills for a special Mukh Darshan at the revered Maa Kamakhya Devi Temple, one of the foremost 51 Shakti Peethas of India. Admire panoramic views of the mighty Brahmaputra River from the hill crest, followed by an evening orientation briefing and welcome dinner at your hotel.",
        "meals": "—",
        "stay": "Guwahati"
      },
      {
        "day": 2,
        "title": "Guwahati to Shillong — Umiam Lake — Don Bosco Museum",
        "description": "Depart Guwahati after breakfast for a scenic 100 km drive into the pine-covered hills of Meghalaya. Stop at the breathtaking Umiam Lake (Barapani) viewpoint for photography and fresh refreshments. Upon arriving in Shillong, the 'Scotland of the East', visit the world-class Don Bosco Museum of Indigenous Cultures featuring 7 floors of tribal heritage, musical instruments, and traditional attire. Enjoy an evening walk around colonial-era Ward's Lake and the lively markets of Police Bazar before dinner.",
        "meals": "Breakfast",
        "stay": "Shillong"
      },
      {
        "day": 3,
        "title": "Mawlynnong Cleanest Village — Living Root Bridge — Dawki River Boating",
        "description": "Set off early for Mawlynnong, celebrated as Asia's cleanest village. Stroll through spotless paved lanes lined with orchids and bamboo cane baskets, climb the Sky Walk treehouse for sweeping vistas of the Bangladesh plains, and walk down to Riwai village to marvel at the centuries-old Living Root Bridge crafted from living Ficus elastica trees. Proceed to Dawki on the Indo-Bangladesh border for an unforgettable country boat cruise on the crystal-clear emerald waters of the Umngot River, where boats appear to glide over thin air. Return to Shillong for overnight stay.",
        "meals": "Breakfast",
        "stay": "Shillong"
      },
      {
        "day": 4,
        "title": "Cherrapunjee (Sohra) — Nohkalikai Falls, Mawsmai Cave & Seven Sisters",
        "description": "Drive south across high Khasi plateaus to Cherrapunjee, historically renowned as one of the wettest places on earth. Stand before the dramatic 1,115-foot plunge of Nohkalikai Falls (India's tallest plunge waterfall) and admire the Seven Sisters Falls cascading down deep limestone gorges. Explore the illuminated limestone caverns of Mawsmai Cave to view ancient stalactites and fossils, followed by a visit to the Garden of Caves with its hidden waterfalls and natural stone bridges before heading back to Shillong.",
        "meals": "Breakfast",
        "stay": "Shillong"
      },
      {
        "day": 5,
        "title": "Shillong to Kaziranga National Park via Maha Mrityunjay Temple",
        "description": "Descend from Meghalaya's hills and journey east through Assam's lush Brahmaputra valley to Kaziranga National Park (approx. 240 km / 6 hrs), a UNESCO World Heritage biodiversity hotspot. En route, stop at the magnificent 126-foot-tall Maha Mrityunjay Temple in Nagaon, the world's largest Shivling-structured temple. Reach Kaziranga by late afternoon, check into your nature resort, and enjoy evening tea amidst sprawling tea gardens followed by a warm dinner.",
        "meals": "Breakfast",
        "stay": "Kaziranga"
      },
      {
        "day": 6,
        "title": "Kaziranga Elephant & Jeep Safaris — Orchid Park & Traditional Bihu Dance",
        "description": "Awake before sunrise for an unforgettable early-morning Elephant Safari through the misty grasslands of the Western (Bagori) Range, bringing you within arm's reach of majestic Indian One-Horned Rhinoceroses, wild water buffaloes, and swamp deer. Return to the resort for breakfast, then visit the Kaziranga Orchid and Biodiversity Park to explore over 500 orchid species and savor a traditional 20-item Assamese thali lunch. In the afternoon, embark on an open-top 4x4 Jeep Safari through the Central (Kohora) Range, concluding the day with an evening Bihu folk dance performance at the resort.",
        "meals": "Breakfast",
        "stay": "Kaziranga"
      },
      {
        "day": 7,
        "title": "Kaziranga to Dirang (Arunachal Pradesh) via Tipi Orchidarium",
        "description": "Bid farewell to Kaziranga and cross the inner border at Bhalukpong into Arunachal Pradesh. Drive along the scenic Kameng River gorge and stop at the Tipi Orchidarium, housing over 7,500 species of exotic orchids in a massive glass pavilion. Continue your ascent through subtropical forests and apple orchards to the peaceful valley of Dirang. Visit the historic 17th-century Dirang Dzong (fortress monastery) and check into your valley-view hotel for dinner.",
        "meals": "Breakfast",
        "stay": "Dirang"
      },
      {
        "day": 8,
        "title": "Dirang to Tawang via Sela Pass (13,703 ft), Sela Lake & Jaswant Garh",
        "description": "Embark on one of the Himalayas' most legendary high-altitude drives from Dirang to Tawang (140 km / 6 hrs). Wind up hairpin bends to cross the snow-clad Sela Pass at 13,703 feet, pausing at the pristine alpine Sela Lake and the sacred Sela Gate. Pay homage at the Jaswant Garh War Memorial, honoring Rifleman Jaswant Singh Rawat (Maha Vir Chakra) who held off enemy forces in the 1962 war. Marvel at the thunderous 100-metre Nuranang (Jang) Waterfall before arriving in the spiritual fortress town of Tawang for dinner.",
        "meals": "Breakfast",
        "stay": "Tawang"
      },
      {
        "day": 9,
        "title": "Indo-China Border at Bumla Pass (15,200 ft) & Serene Madhuri Lake",
        "description": "Board local 4x4 mountain vehicles (Sumo/Bolero) for an extraordinary excursion to the snow-covered Indo-China border at Bumla Pass (15,200 ft), standing where Indian and Chinese army posts face each other across the Line of Actual Control. On the return descent, visit the enchanting Madhuri Lake (Sangetsar Tso), famous for dead tree trunks emerging from turquoise glacial waters against snow-capped peaks. In the evening, attend the moving Light & Sound Show at the Tawang War Memorial.",
        "meals": "Breakfast",
        "stay": "Tawang"
      },
      {
        "day": 10,
        "title": "Tawang Monastery — Urgelling Gompa — Scenic Drive to Bomdila",
        "description": "Dedicate the morning to exploring the majestic 400-year-old Tawang Monastery (Galden Namgyal Lhatse), the second-largest Buddhist monastery in the world, founded in 1681 and home to over 400 lamas, priceless golden scriptures, and a magnificent 28-foot Buddha statue. Visit Urgelling Gompa, the sacred birthplace of the 6th Dalai Lama, before beginning the scenic downhill drive to Bomdila. Check in to your hotel in Bomdila for dinner.",
        "meals": "Breakfast",
        "stay": "Bomdila"
      },
      {
        "day": 11,
        "title": "Bomdila to Guwahati — Brahmaputra Sunset River Cruise",
        "description": "Descend through the lush hills of West Kameng and cross back into the plains of Assam, arriving in Guwahati by late afternoon. Check into your hotel. In the evening, celebrate the grand conclusion of your Himalayan expedition aboard a luxury river cruise on the mighty Brahmaputra River, taking in panoramic twilight water views, traditional Assamese folk music, and a celebratory farewell dinner.",
        "meals": "Breakfast",
        "stay": "Guwahati"
      },
      {
        "day": 12,
        "title": "Guwahati Cultural Exploration — Airport Transfer & Departure",
        "description": "Enjoy a leisurely breakfast. Time permitting, visit the Sri Shankardeva Kalakshetra, an expansive cultural center showcasing the rich art, living traditions, and tribal architecture of Assam. Transfer to Lokpriya Gopinath Bordoloi International Airport for your return flight, carrying unforgettable memories of the Seven Sisters' raw beauty.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star premium hotels on double sharing as per itinerary",
      "Breakfast, lunch and dinner daily, 1L water bottle per day",
      "Travel insurance, Dawki river boating",
      "Elephant safari and jeep safari at Kaziranga, Brahmaputra river cruise",
      "All entry fees, Inner Line Permit, Bumla Pass/Madhuri Lake by Sumo/Bolero",
      "Cultural Bihu dance program, A/C Force Urbania vehicle with driver and parking"
    ],
    "exclusions": [
      "Airfare or train fare",
      "Personal expenses such as tips, laundry and camera fees"
    ]
  },
  {
    "id": "4-sisters-tour",
    "title": "4 Sisters Tour — Nagaland, Manipur, Tripura & Mizoram",
    "image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=85&w=1800",
    "duration": "9 Nights / 10 Days",
    "price": "₹59,999",
    "highlights": [
      "Kohima War Cemetery",
      "Loktak Lake, Imphal",
      "Neermahal & Unakoti rock carvings",
      "Aizawl's Solomon's Temple & Sky Walk"
    ],
    "category": "North East",
    "tagline": "The four lesser-travelled sister states — Nagaland, Manipur, Tripura and Mizoram — in one circuit.",
    "overview": "A 10-day journey through India's least-visited corner: WWII history in Kohima, the floating Loktak Lake in Imphal, the lake palace of Neermahal in Tripura, and Mizoram's hill capital Aizawl.",
    "heroImage": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "September to December",
    "startingPoint": "Dimapur Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Culture",
      "Heritage",
      "Off the beaten path"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=85&w=1800",
        "caption": "Hills of Nagaland and Manipur"
      },
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Heritage sites of Tripura"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Dimapur Arrival — Scenic Hill Drive to Kohima (Nagaland)",
        "description": "Arrive at Dimapur Airport in Nagaland where your Bandhan representative welcomes you. Drive up the winding pine-flanked hills to Kohima, the highland capital of Nagaland situated at 4,737 feet. Check into your hotel, relax with a hot cup of Naga tea, and enjoy an evening walking tour of the local Kohima night bazaar featuring indigenous crafts and organic produce.",
        "meals": "—",
        "stay": "Kohima"
      },
      {
        "day": 2,
        "title": "Kohima War Cemetery — Khonoma Green Village & Kisama Heritage Village",
        "description": "Visit the historic Commonwealth Kohima War Cemetery, where Allied forces halted the Japanese advance in 1944 on the famous tennis court battleground. Drive to Khonoma, India's first recognized 'Green Village', famed for its self-sustaining alder tree agriculture, stone bastions, and courageous Angami warrior history. Continue to Kisama Heritage Village, the grand open-air venue of the world-famous Hornbill Festival, displaying the distinct traditional morungs (dormitories) of all 17 Naga tribes.",
        "meals": "Breakfast",
        "stay": "Kohima"
      },
      {
        "day": 3,
        "title": "Kohima to Imphal (Manipur) via Mao Border & Kangla Fort",
        "description": "Depart Kohima and drive south across the scenic Mao border into the lush Manipur valley (approx. 140 km / 4.5 hrs). Arrive in Imphal and visit the historic Kangla Fort on the banks of the Imphal River, the ancient seat of the Meitei kings, housing sacred dragon shrines and royal coronation sites. Check in to your Imphal hotel for dinner.",
        "meals": "Breakfast",
        "stay": "Imphal"
      },
      {
        "day": 4,
        "title": "Floating Loktak Lake — Keibul Lamjao National Park & INA Memorial",
        "description": "Embark on a full-day excursion to the legendary Loktak Lake, the largest freshwater lake in North East India, famous for its unique floating circular islands of vegetation called 'phumdis'. Visit Keibul Lamjao National Park, the world's only floating national park and last natural sanctuary of the endangered Sangai (dancing deer). Stop at Moirang to visit the historic INA Memorial Complex where Netaji Subhas Chandra Bose's Indian National Army first hoisted the tricolor on Indian soil in 1944. Explore Ima Keithel (Mother's Market) in Imphal, run entirely by over 5,000 women.",
        "meals": "Breakfast",
        "stay": "Imphal"
      },
      {
        "day": 5,
        "title": "Imphal to Agartala (Tripura) by Air — Ujjayanta Palace Exploration",
        "description": "Transfer to Imphal Airport for your short flight across to Agartala, the royal capital of Tripura. Check into your hotel and embark on an afternoon heritage tour of the magnificent Ujjayanta Palace, a gleaming white neoclassical royal residence built in 1901 by Maharaja Radha Kishore Manikya, set amidst Mughal-style gardens and musical fountains.",
        "meals": "Breakfast",
        "stay": "Agartala"
      },
      {
        "day": 6,
        "title": "Neermahal Water Palace & Sepahijala Wildlife Sanctuary",
        "description": "Drive to Rudrasagar Lake to board a motorboat to Neermahal ('Water Palace'), North East India's only floating lake palace, blending Hindu and Mughal architectural domes. In the afternoon, visit the lush Sepahijala Wildlife Sanctuary, home to the rare Phayre's Spectacled Langur and clouded leopards, followed by a visit to the sacred 500-year-old Tripura Sundari (Matabari) Temple, one of the 51 Shakti Peethas.",
        "meals": "Breakfast",
        "stay": "Agartala"
      },
      {
        "day": 7,
        "title": "Agartala to Kumarghat via Ancient Unakoti Rock-Cut Carvings",
        "description": "Journey into the forested hills of North Tripura to witness Unakoti ('One Less than a Crore'), a prehistoric Shaivite pilgrimage site dating from the 7th to 9th centuries. Marvel at the monumental 30-foot bas-relief rock carvings of Lord Shiva (Unakotiswara Kal Bhairava) and Ganesha sculpted directly into sheer jungle rock faces along roaring waterfalls. Proceed to Kumarghat for overnight stay.",
        "meals": "Breakfast",
        "stay": "Kumarghat"
      },
      {
        "day": 8,
        "title": "Kumarghat to Aizawl (Mizoram) Scenic Mountain Drive",
        "description": "Embark on an exhilarating full-day mountain drive crossing the border into Mizoram, climbing through bamboo forests, mist-shrouded gorges, and ridge-top Mizo villages. Arrive in Aizawl, the dramatically perched cliffside capital of Mizoram situated along a high ridgeline at 3,700 feet. Check in to your hotel and soak in the dazzling evening lights cascading down the valley.",
        "meals": "Breakfast",
        "stay": "Aizawl"
      },
      {
        "day": 9,
        "title": "Aizawl City Tour — Solomon's Temple, Durtlang Hills & Sky Walk",
        "description": "Explore the pristine white marble architecture of Solomon's Temple, a landmark cathedral seating over 3,000 worshippers. Drive up to Durtlang Hills for panoramic bird's-eye views across the entire Aizawl ridge, visit the Mizoram State Museum to discover tribal textiles and ancient weaponry, and walk out on the glass Sky Walk at KV Paradise, a memorial structure known locally as the 'Taj Mahal of Mizoram'.",
        "meals": "Breakfast",
        "stay": "Aizawl"
      },
      {
        "day": 10,
        "title": "Aizawl Departure — Flight Home",
        "description": "After breakfast, enjoy free time for shopping at Bara Bazar for hand-woven Mizo Puan textiles and bamboo cane handicrafts. Transfer to Lengpui Airport in Aizawl for your onward flight, concluding an extraordinary voyage through four of India's most mystical and untouched states.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Accommodation on double sharing as per itinerary, 1L water per day",
      "Inner Line Permit, breakfast, lunch and dinner",
      "Exclusive private vehicle for all transfers and sightseeing, changing by sector",
      "Driver allowance, parking fees and travel insurance"
    ],
    "exclusions": [
      "All airfare",
      "Personal expenses such as laundry, tips and telephone calls",
      "Adventure activities or optional sightseeing"
    ]
  },
  {
    "id": "amazing-thailand",
    "title": "Amazing Thailand — Pattaya & Bangkok",
    "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
    "duration": "4 Nights / 5 Days",
    "price": "₹34,900",
    "highlights": [
      "Alcazar Cabaret Show, Pattaya",
      "Coral Island speedboat tour",
      "Golden & Marble Buddha temples",
      "Safari World & Marine Park"
    ],
    "category": "International",
    "tagline": "A quick, vibrant escape through Pattaya's nightlife and Bangkok's temples and safari parks.",
    "overview": "A short but full getaway pairing Pattaya's beaches, water sports and famous Alcazar Cabaret Show with Bangkok's gilded temples, jewellery galleries and a full day at Safari World.",
    "heroImage": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "November to February",
    "startingPoint": "Bangkok Airport",
    "groupSize": "Min 25 pax for quoted rate",
    "themes": [
      "Beach",
      "City",
      "Family"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Pattaya coastline"
      },
      {
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
        "caption": "Coral Island day trip"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Bangkok Arrival — Transfer to Pattaya — World-Famous Alcazar Cabaret Show",
        "description": "Arrive at Bangkok's Suvarnabhumi Airport where our local tour manager assists you with immigration and boarding your private AC coach for a scenic 2-hour drive along the Gulf of Thailand to the coastal resort city of Pattaya. Check in to your hotel and unwind. In the evening, attend the world-famous Alcazar Cabaret Show — a spectacular theatrical production featuring dazzling lighting, elaborate sequined costumes, and music that rivals the best of Las Vegas. Conclude the night with a delicious Indian dinner.",
        "meals": "Lunch, Dinner",
        "stay": "Pattaya"
      },
      {
        "day": 2,
        "title": "Coral Island (Koh Larn) Speedboat Adventure with Water Sports",
        "description": "Board a high-speed speedboat across the turquoise Gulf to Coral Island (Koh Larn). Spend a sun-drenched morning swimming in crystalline waters or participating in exhilarating optional water sports including parasailing, sea walking among tropical coral reefs, and banana boat rides. Enjoy a hot Indian buffet lunch served beachside before returning to Pattaya for an afternoon of leisure, pool relaxation, or shopping at Central Festival Mall.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Pattaya"
      },
      {
        "day": 3,
        "title": "Pattaya to Bangkok — Golden Buddha (Wat Traimit) & Marble Temple Tour",
        "description": "Check out from Pattaya after breakfast and drive back to the bustling capital of Bangkok. Embark on a guided city and temple tour: visit Wat Traimit to marvel at the solid 5.5-ton Golden Buddha statue dating from the Sukhothai period, and admire the Carrara Italian marble elegance of Wat Benchamabophit (The Marble Temple). Visit the world's largest Gems Gallery with an interactive tram ride, followed by checking into your Bangkok hotel and an evening exploring the night markets.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bangkok"
      },
      {
        "day": 4,
        "title": "Full Day at Safari World & Marine Park with Stunt & Dolphin Shows",
        "description": "Dedicate a thrilling full day to Safari World, Thailand's premier open zoo and leisure park. Drive through the African wilderness in the Safari Park to observe roaming lions, tigers, zebras, and hundreds of giraffes up close. Move into Marine Park for an action-packed series of world-class performances: the Hollywood Cowboy Stunt Show, Dolphin Show, Sea Lion Show, and Orangutan Boxing Show. Enjoy an international buffet lunch inside the park before returning to Bangkok for dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bangkok"
      },
      {
        "day": 5,
        "title": "Bangkok Shopping at Indira Market — Airport Departure",
        "description": "Savor breakfast at your hotel before enjoying free morning time for bargain shopping at Pratunam Market, Platinum Fashion Mall, or MBK Center. Meet your tour manager for your private transfer to Suvarnabhumi Airport for your return flight home, with wonderful memories of Thailand's temples, beaches, and vibrant culture.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star hotel accommodation on double/twin sharing",
      "Daily breakfast, lunch and dinner at Indian restaurants",
      "Coral Island tour with lunch, Thailand visa on arrival",
      "Safari World and Marine Park entry, sightseeing entry tickets",
      "Indian tour leader and English-speaking guide (25+ pax)",
      "Travel insurance up to 59 years, private transfers"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS",
      "Personal expenses, tips and porterage",
      "Costs from flight delays or cancellations"
    ]
  },
  {
    "id": "andaman-tour",
    "title": "Andaman Tour",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800",
    "duration": "5 Nights / 6 Days",
    "price": "₹33,499",
    "highlights": [
      "Cellular Jail Light & Sound Show",
      "Radhanagar Beach, Havelock Island",
      "Elephanta Beach snorkeling",
      "Ross Island colonial ruins"
    ],
    "category": "Domestic",
    "isPopular": true,
    "tagline": "Port Blair's history, Havelock's beaches, and Neil Island's coral bridge in one island-hopping loop.",
    "overview": "Five nights across Port Blair, Havelock (Swaraj Dweep) and Neil (Shaheed Dweep) covering the Cellular Jail's freedom-struggle history, the world-famous Radhanagar Beach, and complimentary snorkeling at Elephanta Beach.",
    "heroImage": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to May",
    "startingPoint": "Port Blair Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Beach",
      "Island",
      "History"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800",
        "caption": "Radhanagar Beach, Havelock Island"
      },
      {
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
        "caption": "Snorkeling off Elephanta Beach"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Port Blair Arrival — Corbyn's Cove Beach & Cellular Jail Light & Sound Show",
        "description": "Arrive at Veer Savarkar International Airport in Port Blair where our tour coordinator welcomes you. Transfer to your hotel to freshen up before visiting Corbyn's Cove Beach, framed by coconut palms and gentle blue surf. In the late afternoon, tour the historic Cellular Jail (Kalapani), visiting Veer Savarkar's cell and the memorial gallows. As darkness falls, attend the moving Light & Sound Show in the jail courtyard, narrating the poignant saga of India's heroic freedom fighters.",
        "meals": "Lunch, Dinner",
        "stay": "Port Blair"
      },
      {
        "day": 2,
        "title": "Private Cruise to Havelock Island (Swaraj Dweep) — Radhanagar Beach Sunset",
        "description": "Board a luxury high-speed catamaran cruise from Phoenix Bay Jetty to Swaraj Dweep (Havelock Island). Check into your beachside resort. In the afternoon, head to Radhanagar Beach (Beach No. 7), rated by Time Magazine as one of Asia's best beaches. Stroll barefoot along soft powdery white sands, swim in crystal-clear calm waves, and witness an unforgettable golden sunset reflecting across the Andaman Sea.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Havelock Island"
      },
      {
        "day": 3,
        "title": "Elephanta Beach Snorkeling Adventure & Scenic Kala Pathar Beach",
        "description": "Board a motorized boat to Elephanta Beach, renowned for its shallow coral reefs and vibrant marine life. Enjoy a 5-minute complimentary guided snorkeling session to observe live coral formations and colourful tropical fish. Later in the afternoon, visit Kala Pathar Beach, famous for its dramatic contrast of black volcanic rocks against white sand and turquoise water, perfect for relaxed photography.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Havelock Island"
      },
      {
        "day": 4,
        "title": "Inter-Island Ferry to Neil Island (Shaheed Dweep) — Natural Coral Bridge",
        "description": "Take a morning inter-island ferry to Shaheed Dweep (Neil Island), the tranquil vegetable bowl of the Andamans. Explore the pristine waters of Bharatpur Beach, ideal for swimming and glass-bottom boat rides, visit the tranquil shell-strewn shores of Laxmanpur Beach, and walk out onto the natural living rock formation known as the Howrah Natural Coral Bridge during low tide.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Neil Island"
      },
      {
        "day": 5,
        "title": "Return Cruise to Port Blair — Ross Island Colonial Ruins & Japanese Bunkers",
        "description": "Cruise back to Port Blair in the morning. Embark on a short boat ride to Ross Island (Netaji Subhash Chandra Bose Island), the erstwhile British administrative capital of the islands. Walk through the atmospheric ruins of the Chief Commissioner's House, the old church, bakery, and WWII Japanese bunkers, where friendly spotted deer and peacocks roam freely under ancient banyan trees. Return to Port Blair for shopping at Sagarika Government Emporium.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Port Blair"
      },
      {
        "day": 6,
        "title": "Departure from Port Blair",
        "description": "Enjoy a final tropical breakfast at your hotel before your transfer to Veer Savarkar Airport, departing with unforgettable memories of the Andaman archipelago's turquoise waters and historic heritage.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Accommodation on double/triple sharing, all meals",
      "AC vehicle transfers and sightseeing, professional tour manager",
      "Entrance tickets, 1 water bottle per day, travel insurance",
      "Cruise tickets (base category), Cellular Jail Light & Sound Show",
      "5-minute complimentary snorkeling at Elephanta Beach"
    ],
    "exclusions": [
      "5% GST, airfare/ship fare",
      "Guide charges, early check-in/late check-out",
      "Water sports beyond complimentary snorkeling",
      "Personal expenses"
    ]
  },
  {
    "id": "andaman-baratang-tour",
    "title": "Andaman with Baratang Tour",
    "image": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹38,499",
    "highlights": [
      "Baratang mangrove creek & mud volcano",
      "Radhanagar Beach, Havelock Island",
      "Limestone Caves",
      "Ross Island colonial ruins"
    ],
    "category": "Domestic",
    "tagline": "The classic Andaman loop plus a day trip to Baratang's mangroves, limestone caves and mud volcano.",
    "overview": "Everything in the classic Andaman itinerary — Cellular Jail, Havelock's Radhanagar Beach, Neil Island's coral bridge and Ross Island — plus a full day at Baratang Island, reached through the Jarawa Tribal Reserve.",
    "heroImage": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to May",
    "startingPoint": "Port Blair Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Beach",
      "Island",
      "Adventure"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
        "caption": "Baratang mangrove creek"
      },
      {
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800",
        "caption": "Radhanagar Beach, Havelock"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Port Blair Arrival — Corbyn's Cove & Cellular Jail Light & Sound",
        "description": "Arrive in Port Blair, meet our representative, and transfer to your hotel. Head out to Corbyn's Cove Beach for coconut water and gentle sea breezes, followed by an afternoon tour of the historic Cellular Jail. Experience the patriotic Light & Sound Show in the evening narrating the sacrifices of freedom fighters.",
        "meals": "Lunch, Dinner",
        "stay": "Port Blair"
      },
      {
        "day": 2,
        "title": "Luxury Cruise to Havelock Island — Radhanagar Beach Sunset",
        "description": "Sail by private catamaran to Havelock Island. Check in to your resort and spend an enchanting afternoon at the world-renowned Radhanagar Beach, strolling along miles of pure white sand and watching the sun set over the calm Andaman Sea.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Havelock Island"
      },
      {
        "day": 3,
        "title": "Elephanta Beach Coral Reef Snorkeling & Kala Pathar Beach",
        "description": "Boat trip to Elephanta Beach for a complimentary guided snorkeling session exploring colourful shallow coral gardens. In the afternoon, visit Kala Pathar Beach with its distinctive black volcanic boulders and turquoise water.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Havelock Island"
      },
      {
        "day": 4,
        "title": "Neil Island (Shaheed Dweep) — Bharatpur, Laxmanpur & Natural Rock Bridge",
        "description": "Ferry to Neil Island. Visit Bharatpur Beach for beach activities, explore Laxmanpur Beach's secluded shoreline, and trek to the famous Howrah Bridge — a natural limestone arch carved by sea tides.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Neil Island"
      },
      {
        "day": 5,
        "title": "Return to Port Blair — Ross Island Historic Ruins Tour",
        "description": "Cruise back to Port Blair and take an excursion to Ross Island to explore the colonial British headquarters, Japanese bunkers, and deer sanctuaries shaded by massive wild ficus roots.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Port Blair"
      },
      {
        "day": 6,
        "title": "Full-Day Baratang Island Expedition — Mangrove Creeks, Limestone Caves & Mud Volcano",
        "description": "Depart before dawn along the Andaman Trunk Road passing through the Jarawa Tribal Reserve. Board a speed fiber boat cruising through dense, arching mangrove creeks to reach the prehistoric Limestone Caves with magnificent stalactites and stalagmites. Continue by jeep to observe India's only active Mud Volcano emitting bubbling natural mud fountains, returning to Port Blair by evening.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Port Blair"
      },
      {
        "day": 7,
        "title": "Port Blair Departure",
        "description": "Breakfast at the hotel, followed by airport transfer for your flight home with rich memories of the Andaman Islands.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Accommodation on double/triple sharing, all meals",
      "AC vehicle transfers and sightseeing, professional tour manager",
      "Entrance tickets, water bottle per day, travel insurance",
      "Cruise tickets, Cellular Jail Light & Sound Show, Elephanta snorkeling",
      "Ross Island and Radhanagar Beach visits"
    ],
    "exclusions": [
      "5% GST, airfare/ship fare",
      "Guide charges, early check-in/late check-out",
      "Water sports beyond complimentary snorkeling",
      "Personal expenses"
    ]
  },
  {
    "id": "ayodhya-varanasi",
    "title": "Ayodhya – Varanasi Spiritual Tour",
    "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹33,499",
    "highlights": [
      "Shri Ram Janmabhoomi Temple darshan",
      "Prayagraj Triveni Sangam",
      "Mahabodhi Temple, Bodhgaya",
      "Ganga Aarti at Dashashwamedh Ghat"
    ],
    "category": "Domestic",
    "tagline": "A pilgrimage across Ayodhya, Chitrakoot, Prayagraj, Bodhgaya and Varanasi.",
    "overview": "A spiritual circuit from Ram Janmabhoomi in Ayodhya through Chitrakoot's exile sites and Prayagraj's Triveni Sangam to Bodhgaya's Mahabodhi Temple, closing with sunrise on the Ganga and the evening Aarti at Varanasi.",
    "heroImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to March",
    "startingPoint": "Lucknow",
    "groupSize": "2+ guests",
    "themes": [
      "Spiritual",
      "Heritage"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Temples of Ayodhya and Varanasi"
      },
      {
        "image": "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&q=85&w=1800",
        "caption": "Ghats of the Ganga"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Lucknow Arrival — Transfer to Holy Ayodhya & Ram Janmabhoomi Darshan",
        "description": "Arrive in Lucknow and drive to the sacred city of Ayodhya (135 km / 3 hrs). Check in to your hotel and visit the magnificent new Shri Ram Janmabhoomi Mandir for blissful darshan of Ram Lalla. Visit the fortress-like Hanuman Garhi temple to seek the blessings of Lord Hanuman, the golden palace Kanak Bhawan gifted to Goddess Sita, Ramkot, and the ancient Nageshwarnath Temple on the banks of the Sarayu River. Attend the peaceful Sarayu Aarti in the evening.",
        "meals": "Lunch, Dinner",
        "stay": "Ayodhya"
      },
      {
        "day": 2,
        "title": "Ayodhya to Sacred Chitrakoot — Footsteps of Lord Rama",
        "description": "Drive to Chitrakoot where Lord Rama, Sita, and Lakshmana spent eleven years of their exile. Visit Ram Ghat along the Mandakini River, perform the Kamadgiri Parikrama, and visit Bharat Milap Temple where Prince Bharat met Rama. Explore the scenic hilltop shrines of Hanuman Dhara and Sati Anusuya Ashram before dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Chitrakoot"
      },
      {
        "day": 3,
        "title": "Chitrakoot to Prayagraj (Triveni Sangam) — Drive to Kashi Varanasi",
        "description": "Drive to Prayagraj to perform holy rituals and take a sacred boat ride at the Triveni Sangam, the mystical confluence of Ganga, Yamuna, and Saraswati rivers. Visit the underground Patalpuri Temple, the immortal Akshayavat tree, Alopi Devi Shakti Peeth, and the historical Anand Bhavan (ancestral home of the Nehrus) before continuing your journey to Varanasi.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Varanasi"
      },
      {
        "day": 4,
        "title": "Varanasi to Bodhgaya — Mahabodhi Temple & Sacred Bodhi Tree",
        "description": "Travel to Bodhgaya in Bihar, where Siddhartha Gautama attained enlightenment. Visit the UNESCO World Heritage Mahabodhi Temple Complex, sit beneath the sacred Bodhi Tree where the Buddha meditated, gaze upon the towering 80-foot Great Buddha Statue, and explore monasteries built by Buddhist communities from Japan, Thailand, Bhutan, and Sri Lanka.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bodhgaya"
      },
      {
        "day": 5,
        "title": "Bodhgaya & Gaya (Vishnupad Temple) — Return to Varanasi",
        "description": "Visit the holy town of Gaya on the banks of the Phalgu River. Visit the sacred Vishnupad Temple featuring Lord Vishnu's footprint carved in basalt rock, where pilgrims perform ancestral Pind Daan rituals. Explore Tibetan monasteries and return to Varanasi in the evening for dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Varanasi"
      },
      {
        "day": 6,
        "title": "Varanasi Sunrise Boat Cruise, Kashi Vishwanath VIP Darshan & Ganga Aarti",
        "description": "Begin before sunrise with an enchanting private boat ride along the sacred Ganga Ghats, witnessing morning prayers, cremation rituals at Manikarnika, and centuries-old palaces along Assi and Dashashwamedh Ghats. Proceed for special VIP Darshan of the Kashi Vishwanath Jyotirlinga through the grand Kashi Corridor. Visit Annapurna Temple, Sankat Mochan Hanuman Temple, and Banaras Hindu University (BHU) New Vishwanath Temple. In the evening, take prime boat seats for the world-famous Grand Ganga Aarti at Dashashwamedh Ghat with multi-tiered brass oil lamps and conch shells.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Varanasi"
      },
      {
        "day": 7,
        "title": "Varanasi — Sarnath Buddhist Shrine & Departure",
        "description": "Visit Sarnath, the sacred deer park where Lord Buddha delivered his first sermon (Dhammacakkappavattana Sutta). View the ancient Dhamek Stupa, the Ashoka Pillar, and the Archaeological Museum housing the Lion Capital of Ashoka (India's national emblem). Transfer to Varanasi Airport or railway station for your onward journey.",
        "meals": "Breakfast, Lunch",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Double/triple sharing at premium hotels, 6 breakfasts, 7 lunches, 6 dinners",
      "AC vehicle transfers and sightseeing, professional tour manager",
      "Entrance tickets, evening tea/coffee, water bottle per day",
      "Ganga Aarti experience, morning boat ride, VIP Kashi Vishwanath darshan",
      "Ram Janmabhoomi darshan, Triveni Sangam visit, BHU visit"
    ],
    "exclusions": [
      "5% GST, airfare/train fare",
      "Guide charges, early check-in/late check-out",
      "Additional meals or sightseeing",
      "Personal expenses"
    ]
  },
  {
    "id": "singapore-malaysia-best",
    "title": "Best of Singapore & Malaysia",
    "image": "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=85&w=1800",
    "duration": "5 Nights / 6 Days",
    "price": "₹91,900",
    "highlights": [
      "Genting Highlands cable car",
      "Night Safari, Singapore",
      "Sentosa Island & Gardens by the Bay",
      "Universal Studios Singapore"
    ],
    "category": "International",
    "isPopular": true,
    "tagline": "Kuala Lumpur's hill resorts to Singapore's Sentosa Island and Universal Studios.",
    "overview": "A fast-paced tour from Putrajaya and Kuala Lumpur's Batu Caves and Genting Highlands, across the causeway to Singapore's Night Safari, Sentosa Island, Gardens by the Bay and Universal Studios.",
    "heroImage": "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "Year-round",
    "startingPoint": "Kuala Lumpur Airport",
    "groupSize": "Min 25 pax for quoted rate",
    "themes": [
      "City",
      "Family",
      "Theme Park"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=85&w=1800",
        "caption": "Sentosa Island, Singapore"
      },
      {
        "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1800",
        "caption": "Singapore skyline"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Kuala Lumpur Arrival — Putrajaya Administrative Capital & KL City Tour",
        "description": "Arrive at Kuala Lumpur International Airport (KLIA) and board your luxury AC coach. En route to the capital, tour Putrajaya — Malaysia's intelligent garden city — admiring the pink-domed Putra Mosque and Prime Minister's office complex. Check into your hotel in KL. Later, take photo stops at the world-famous 88-storey Petronas Twin Towers, King's Palace (Istana Negara), National Monument, and ascend the KL Tower observation deck for panoramic 360-degree city views, followed by an Indian buffet dinner.",
        "meals": "Lunch, Dinner",
        "stay": "Kuala Lumpur"
      },
      {
        "day": 2,
        "title": "Batu Caves Temple & Genting Highlands Skyway Cable Car Day Trip",
        "description": "Drive to the limestone caves of Batu Caves to marvel at the 140-foot golden Lord Murugan statue and climb the 272 colourful steps into Cathedral Cave. Next, ride the Genting Skyway cable car soaring over 100-million-year-old rainforest canopies to the cool peak of Genting Highlands (6,000 ft). Enjoy free time exploring the SkyAvenue lifestyle mall, indoor theme parks, and Casino de Genting before returning to KL.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kuala Lumpur"
      },
      {
        "day": 3,
        "title": "Kuala Lumpur to Singapore — Open-Air Night Safari Tram Tour",
        "description": "Board an air-conditioned executive coach south across the Johor-Singapore Causeway. Complete customs formalities and arrive in the pristine city-state of Singapore. Check in to your hotel and unwind. In the evening, head to the world's first Night Safari: ride the guided open tram through 6 geographical zones observing over 900 nocturnal animals in natural habitats, followed by the exciting Creatures of the Night animal presentation.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Singapore"
      },
      {
        "day": 4,
        "title": "Sentosa Island Cable Car — Madame Tussauds — Gardens by the Bay",
        "description": "Ride the scenic Singapore Cable Car high over Keppel Harbour onto Sentosa Island. Visit Madame Tussauds and Images of Singapore Live. In the afternoon, explore Gardens by the Bay: walk through the misty Flower Dome and the mountain-cool Cloud Forest with its 35-metre indoor waterfall. In the evening, watch the magical Garden Rhapsody light-and-sound show beneath the 50-metre Supertree Grove, followed by dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Singapore"
      },
      {
        "day": 5,
        "title": "Full Day at Universal Studios Singapore & Wings of Time Night Show",
        "description": "Spend an unforgettable full day at Universal Studios Singapore at Resorts World Sentosa. Experience pulse-pounding rides and immersive themed lands: Battlestar Galactica duelling roller coasters, Transformers The Ride 3D, Jurassic Park Rapids Adventure, and Revenge of the Mummy. Conclude your Sentosa evening with the Wings of Time outdoor laser, water jet, and pyrotechnic night show set against the open ocean.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Singapore"
      },
      {
        "day": 6,
        "title": "Singapore City Tour — Merlion Park — Jewel Changi & Departure",
        "description": "Embark on a morning city tour visiting Merlion Park for photos with Singapore's iconic half-lion half-fish mascot, Parliament House, the Esplanade, and Chinatown. Transfer to Singapore Changi Airport to marvel at the 40-metre indoor Rain Vortex waterfall inside Jewel Changi before boarding your return flight home.",
        "meals": "Breakfast, Lunch",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star hotel accommodation on double/twin sharing",
      "Daily breakfast, lunch and dinner at Indian restaurants",
      "Night Safari, Putrajaya tour, Petronas Towers photo stop, KL Tower deck",
      "Universal Studios, Singapore visa, Malaysia arrival card",
      "Sentosa cable car, coach transfer, tour leader/guide (25+ pax)",
      "Travel insurance up to 59 years, private transfers"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS",
      "Personal expenses, tips and porterage",
      "Costs from flight delays or cancellations"
    ]
  },
  {
    "id": "bhutan-tour",
    "title": "Bhutan Tour",
    "image": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹47,000",
    "highlights": [
      "Taktsang Monastery (Tiger's Nest) hike",
      "Punakha Dzong & Suspension Bridge",
      "Buddha Dordenma statue",
      "Gorumara jeep safari"
    ],
    "category": "International",
    "tagline": "The Land of the Thunder Dragon — Thimphu's monasteries to the hike up Tiger's Nest.",
    "overview": "An overland journey from Phuentsholing through Thimphu and Punakha to Paro, culminating in the hike to Taktsang Monastery — Bhutan's most sacred cliffside temple — with a jeep safari at Gorumara on the way home.",
    "heroImage": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "March to May, September to November",
    "startingPoint": "Bagdogra Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Mountains",
      "Culture",
      "Spiritual"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800",
        "caption": "Himalayan valleys of Bhutan"
      },
      {
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800",
        "caption": "Prayer flags and mountain passes"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Bagdogra Airport Arrival — Drive to Phuentsholing (Border Gateway)",
        "description": "Arrive at Bagdogra Airport in West Bengal where your Bandhan guide meets you. Drive through scenic tea plantations of the Dooars region to Phuentsholing, the southern border gateway to the Kingdom of Bhutan. Complete entry permit verification and check in to your hotel for dinner and overnight stay.",
        "meals": "—",
        "stay": "Phuentsholing"
      },
      {
        "day": 2,
        "title": "Phuentsholing to Thimphu — Scenic Himalayan Highway via Gedu & Chukha Dam",
        "description": "After breakfast and immigration clearance, embark on a spectacular 170 km mountain drive winding upward into the Kingdom of Bhutan. Enjoy stops at Wangkha Waterfall, Chukha Hydroelectric Dam viewpoint, and Gedu town, climbing from subtropical plains into cool pine valleys. Arrive in Thimphu (7,600 ft), the world's only capital city without traffic lights, and check in to your hotel.",
        "meals": "Breakfast",
        "stay": "Thimphu"
      },
      {
        "day": 3,
        "title": "Thimphu City Sightseeing — Buddha Dordenma & National Memorial Chorten",
        "description": "Explore the spiritual and cultural treasures of Thimphu: gaze up at the colossal 169-foot bronze Buddha Dordenma statue overlooking the valley, circumambulate the National Memorial Chorten alongside local Bhutanese elders, visit the Zorig Chusum (School of 13 Traditional Arts & Crafts), and tour the Simply Bhutan living museum for archery and traditional butter tea demonstrations.",
        "meals": "Breakfast",
        "stay": "Thimphu"
      },
      {
        "day": 4,
        "title": "Punakha Excursion via Dochula Pass (108 Chortens) & Punakha Dzong",
        "description": "Drive over the breathtaking Dochula Pass at 10,170 feet, adorned with 108 Druk Wangyal Chortens and sweeping views of the snow-clad Eastern Himalayas. Descend into the warm subtropical Punakha valley to visit the majestic Punakha Dzong ('Palace of Great Happiness'), situated at the confluence of the Pho Chhu and Mo Chhu rivers. Walk across the 160-metre Punakha Suspension Bridge before returning to Thimphu.",
        "meals": "Breakfast",
        "stay": "Thimphu"
      },
      {
        "day": 5,
        "title": "High-Altitude Chele La Pass (13,083 ft) — Scenic Valley of Paro",
        "description": "Drive to Chele La Pass, Bhutan's highest motorable mountain pass at 13,083 feet, with prayer flags fluttering against views of sacred Mount Jomolhari. Descend into the scenic Paro valley to visit Kyichu Lhakhang (one of Bhutan's oldest 7th-century temples) and the Ta Dzong National Museum showcasing centuries of sacred thangka paintings and cultural artifacts.",
        "meals": "Breakfast",
        "stay": "Paro"
      },
      {
        "day": 6,
        "title": "Pilgrimage Hike to Taktsang Monastery (The Tiger's Nest)",
        "description": "Embark on the legendary pilgrimage hike up to Taktsang Monastery (Tiger's Nest), clinging to a sheer granite cliff 3,000 feet above the Paro Valley floor. Trek through pine and rhododendron forests with views of waterfalls, stopping at the halfway cafeteria for tea. Explore the sacred cliffside shrines where Guru Padmasambhava meditated in the 8th century, descending back to Paro for a celebratory dinner.",
        "meals": "Breakfast",
        "stay": "Paro"
      },
      {
        "day": 7,
        "title": "Paro to Lataguri (Dooars, West Bengal)",
        "description": "Bid farewell to Bhutan and begin the scenic descent from Paro back across the border at Phuentsholing into West Bengal's Dooars plains. Arrive at Lataguri on the edge of Gorumara National Park and check in to your nature resort for dinner.",
        "meals": "Breakfast",
        "stay": "Lataguri"
      },
      {
        "day": 8,
        "title": "Gorumara National Park Morning Jeep Safari — Bagdogra Departure",
        "description": "Take an early-morning open jeep safari through Gorumara National Park, home to Indian one-horned rhinos, Asian elephants, gaur, and exotic hornbills. Return for breakfast, then transfer to Bagdogra Airport for your return flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Sustainable Development Fee for Indian nationals",
      "3-star hotels on double sharing, breakfast/lunch/dinner",
      "1L water per day, Hindi/English-speaking guide, all entry fees",
      "Gorumara jeep safari, private vehicle, Bhutan tourist SIM for tour leader"
    ],
    "exclusions": [
      "Train/air ticket",
      "Taktsang Monastery entry fee",
      "Personal expenses such as tips, calls, laundry and liquor"
    ]
  },
  {
    "id": "eastern-europe-highlights",
    "title": "Eastern Europe Highlights",
    "image": "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=85&w=1800",
    "duration": "8 Nights / 9 Days",
    "price": "₹1,44,900",
    "highlights": [
      "Danube River cruise in Budapest",
      "Schönbrunn Palace gardens, Vienna",
      "Prague Castle & Charles Bridge",
      "Bratislava old town tour"
    ],
    "category": "International",
    "tagline": "Imperial grandeur across Vienna, Bratislava, Budapest and Prague in one loop.",
    "overview": "Nine days through Central and Eastern Europe's most storied capitals: Vienna's Ringstrasse and Schönbrunn Palace, Bratislava's medieval lanes, an evening cruise on the Danube in Budapest, and Prague's Gothic towers and Astronomical Clock.",
    "heroImage": "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Vienna Airport",
    "groupSize": "Min 25 pax for quoted rate",
    "themes": [
      "Heritage",
      "Culture",
      "City"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=85&w=1800",
        "caption": "Prague Castle and Charles Bridge"
      },
      {
        "image": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=85&w=1800",
        "caption": "Vienna Ringstrasse architecture"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Vienna Arrival — Imperial Capital Orientation & Welcome",
        "description": "Arrive at Vienna International Airport (VIE), meet your dedicated Bandhan tour manager, and transfer by private luxury coach to your hotel. Settle in and enjoy an introductory evening orientation walk along the elegant Kärntner Strasse, taking in views of the illuminated St. Stephen's Cathedral before a warm Indian welcome dinner.",
        "meals": "Lunch, Dinner",
        "stay": "Vienna"
      },
      {
        "day": 2,
        "title": "Vienna Imperial City Tour — Schönbrunn Palace & Ringstrasse Landmarks",
        "description": "Embark on a comprehensive guided city tour along the grand Ringstrasse: view the Austrian Parliament, the neo-Gothic City Hall (Rathaus), the Vienna State Opera, and the grand Hofburg Imperial Palace. Tour the magnificent UNESCO-listed Schönbrunn Palace, the summer residence of the Habsburg monarchs, exploring its lavish staterooms and strolling through the manicured Great Parterre gardens.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Vienna"
      },
      {
        "day": 3,
        "title": "Vienna to Budapest via Bratislava (Slovakia) Old Town Tour",
        "description": "Depart Vienna and cross the border into Slovakia for a walking tour of Bratislava's charming cobblestone Old Town: see St. Martin's Cathedral, Michael's Gate, and the hilltop Bratislava Castle overlooking the Danube. Continue onward across the Hungarian border into the twin cities of Buda and Pest. Check into your hotel and enjoy dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Budapest"
      },
      {
        "day": 4,
        "title": "Budapest Grand City Tour & Romantic Danube Evening River Cruise",
        "description": "Explore the twin cities of Budapest: visit the hilltop Fisherman's Bastion and Matthias Church on the Buda side for sweeping river panoramas. Drive past Heroes' Square, St. Stephen's Basilica, and the iconic Hungarian Parliament Building. In the evening, embark on a scenic Danube River Cruise, admiring the illuminated bridges and architectural landmarks reflected on the water.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Budapest"
      },
      {
        "day": 5,
        "title": "Budapest to Prague (Czech Republic) — Scenic Cross-Country Drive",
        "description": "Board your coach for a scenic journey north across the rolling plains of Moravia into the Czech Republic. Arrive in the 'City of a Hundred Spires', check in to your Prague hotel, and enjoy an evening stroll around Wenceslas Square followed by dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Prague"
      },
      {
        "day": 6,
        "title": "Prague Castle, St. Vitus Cathedral & Historic Charles Bridge Walk",
        "description": "Explore the historic Prague Castle Complex, the largest ancient castle in the world: marvel at the soaring Gothic spires of St. Vitus Cathedral and the historic Royal Palace. Walk down through the picturesque Malá Strana quarter and across the famous statue-lined Charles Bridge spanning the Vltava River into the Old Town.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Prague"
      },
      {
        "day": 7,
        "title": "Prague Old Town Square, Astronomical Clock & Vltava River Cruise",
        "description": "Visit Prague's Old Town Square to watch the mechanical procession of the Twelve Apostles on the 600-year-old medieval Astronomical Clock. Enjoy a relaxing sightseeing cruise on the Vltava River and spend the afternoon shopping for authentic Bohemian crystal and Czech wooden toys before dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Prague"
      },
      {
        "day": 8,
        "title": "Prague to Vienna Return Journey — Shopping at Parndorf Designer Outlet",
        "description": "Drive south through the Czech countryside back into Austria, stopping at the famous Designer Outlet Parndorf for duty-free luxury fashion shopping. Arrive in Vienna for a celebratory farewell Indian dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Vienna"
      },
      {
        "day": 9,
        "title": "Vienna Departure — Flight Home",
        "description": "Enjoy breakfast at your hotel before transferring to Vienna International Airport for your return flight home, carrying cherished memories of Eastern Europe's imperial capitals.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star premium hotel accommodation on twin sharing",
      "Daily Indian breakfast, lunch and dinner",
      "Danube River cruise in Budapest, Vltava cruise in Prague",
      "Schönbrunn Palace gardens, Prague Castle, Bratislava orientation",
      "Schengen visa guidance, Indian tour manager (25+ pax)",
      "Luxury AC coach transfers, travel insurance up to 59 years"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS",
      "Personal expenses, tips and porterage",
      "Costs from flight delays or cancellations"
    ]
  },
  {
    "id": "grand-tour-europe",
    "title": "Grand Tour of Europe",
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    "duration": "15 Nights / 16 Days",
    "price": "₹4,13,700",
    "highlights": [
      "Eiffel Tower 3rd level & Disneyland Paris",
      "Jungfraujoch — Top of Europe",
      "Venice gondola ride",
      "Vatican Museum & Sistine Chapel"
    ],
    "category": "International",
    "isPopular": true,
    "tagline": "London to Rome across ten countries — the definitive first-time Europe itinerary.",
    "overview": "A sixteen-day grand circuit spanning the UK, France, Belgium, the Netherlands, Germany, Switzerland, Liechtenstein, Austria and Italy — London's icons, a day at Disneyland Paris, the Top of Europe at Jungfraujoch, and Rome's Vatican and Colosseum.",
    "heroImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "London Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Heritage",
      "City",
      "Family"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Iconic landmarks across Europe"
      },
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Historic old towns"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "London Arrival — Welcome to the British Capital",
        "description": "Arrive at London Heathrow Airport, meet your Bandhan Tour Manager, and transfer by private luxury coach to your hotel. Settle in, relax, and join the group for an evening welcome Indian dinner.",
        "meals": "Dinner",
        "stay": "London"
      },
      {
        "day": 2,
        "title": "London Guided City Tour — Buckingham Palace, London Eye & Thames River Cruise",
        "description": "Embark on a comprehensive guided city tour of London: see Big Ben, the Houses of Parliament, Westminster Abbey, and witness the Changing of the Guard at Buckingham Palace. Pose with lifelike wax celebrities at Madame Tussauds, board the giant glass capsules of the London Eye for sweeping 360-degree skyline views, and cruise along the River Seine past Tower Bridge.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "London"
      },
      {
        "day": 3,
        "title": "Lord's Cricket Ground & Tower of London (Crown Jewels)",
        "description": "Enjoy a VIP guided tour of Lord's Cricket Ground — the Home of Cricket — walking through the historic Long Room, players' dressing rooms, and the MCC Museum. In the afternoon, tour the medieval Tower of London to marvel at the dazzling British Crown Jewels and the legendary Koh-i-Noor diamond, followed by shopping on Oxford Street.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "London"
      },
      {
        "day": 4,
        "title": "London to Paris via Eurostar High-Speed Channel Tunnel",
        "description": "Board the high-speed Eurostar train darting beneath the English Channel to arrive at Paris Gare du Nord. Check into your Parisian hotel and enjoy an introductory evening drive along the illuminated boulevards of Paris.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 5,
        "title": "Paris City Tour — Eiffel Tower 3rd Level, Versailles Palace & Seine Cruise",
        "description": "Tour Paris landmarks: drive down the Champs-Élysées, view the Arc de Triomphe, and ascend to the top 3rd Level of the Eiffel Tower for panoramic city vistas. Explore the opulent Hall of Mirrors at the Royal Palace of Versailles, followed by an evening cruise along the River Seine under illuminated historic bridges.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 6,
        "title": "Magical Full Day at Disneyland Paris",
        "description": "Spend an unforgettable full day at Disneyland Paris. Experience thrilling rides like Space Mountain, Big Thunder Mountain, and Pirates of the Caribbean, meet beloved Disney characters, and witness the breathtaking evening Disney Illuminations fireworks over Sleeping Beauty Castle.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 7,
        "title": "Paris to Brussels (Belgium) — Grand Place, Atomium & Onward to Netherlands",
        "description": "Drive into Belgium to explore Brussels: marvel at the gilded guildhalls of Grand Place, see the playful Manneken Pis statue, and take photos at the monumental Atomium and Mini Europe miniature park. Continue through the Dutch countryside to your hotel in the Netherlands.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Netherlands"
      },
      {
        "day": 8,
        "title": "Keukenhof Tulip Gardens (or Zaanse Schans Windmills) & Amsterdam Canal Cruise",
        "description": "Visit Keukenhof (in season) to wander among 7 million blooming tulips and orchids, or visit Zaanse Schans to explore working historic windmills, wooden clog carving, and Dutch Gouda cheese making. In Amsterdam, board a glass-topped boat for a scenic cruise through the UNESCO-listed canal ring.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Germany"
      },
      {
        "day": 9,
        "title": "Heidelberg Castle — Black Forest Cuckoo Clock & Roaring Rhine Falls",
        "description": "Drive to historic Heidelberg to view its hilltop castle and Old Town. Journey deep into the Black Forest to witness traditional hand-carved Cuckoo Clock making and sample Black Forest gateau. Cross the Swiss border to take a boat right up to the roaring rock basin of Rhine Falls, Europe's largest waterfall, before arriving in Central Switzerland.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 10,
        "title": "Jungfraujoch — The Top of Europe (11,333 ft) & Aletsch Glacier",
        "description": "Board the cogwheel Alpine railway climbing through the Eiger mountain to Jungfraujoch, the highest railway station in Europe at 11,333 feet. Walk through the crystalline Ice Palace, step out onto the snow plateau overlooking the massive Aletsch Glacier, and take in the 360-degree panorama from the Sphinx Observation Terrace.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 11,
        "title": "Mount Titlis Revolving Rotair Cable Car & Scenic Lucerne Tour",
        "description": "Ascend to 10,000 feet aboard the world's first revolving cable car (Titlis Rotair). Cross the Titlis Cliff Walk — Europe's highest suspension bridge — explore the Glacier Cave, and ride the Ice Flyer chairlift over glacial crevasses. In the afternoon, tour Lucerne's historic Chapel Bridge, Lion Monument, and indulge your sweet tooth at the Lindt Home of Chocolate.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 12,
        "title": "Liechtenstein (Vaduz) — Swarovski Crystal Worlds & Innsbruck",
        "description": "Ride a mini road-train through Vaduz, the capital of the tiny Alpine Principality of Liechtenstein. Cross into the Austrian Tyrol to explore the sparkling underground chambers of Swarovski Crystal Worlds in Wattens. In Innsbruck, visit the famous 15th-century Golden Roof (Goldenes Dachl) and the imperial Hofburg Palace.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Innsbruck / Seefeld"
      },
      {
        "day": 13,
        "title": "Venice Island Arrival — Private Water Taxi & Romantic Gondola Ride",
        "description": "Drive south into Italy and board a private water taxi across the Venetian lagoon to St. Mark's Square. Gaze upon St. Mark's Basilica, Doge's Palace, and the Bridge of Sighs. Watch a master glassblower create intricate Murano glass art, and board a traditional black gondola for a serene ride through Venice's picturesque labyrinth of canals.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Padova / Ferrara"
      },
      {
        "day": 14,
        "title": "Renaissance Florence Duomo & the Iconic Leaning Tower of Pisa",
        "description": "Explore Florence, the cradle of the Renaissance: admire Giotto's Bell Tower, the terracotta-tiled Duomo of Florence, Piazza della Signoria, and the historic jewelry shops of Ponte Vecchio over the River Arno. Later, drive to Pisa to pose with the world-famous Romanesque Leaning Tower of Pisa in the Field of Miracles.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Tuscany region"
      },
      {
        "day": 15,
        "title": "Rome — Colosseum, Roman Forum, Trevi Fountain & Vatican St. Peter's",
        "description": "Discover the Eternal City of Rome: step inside the world's smallest sovereign state, Vatican City, to explore St. Peter's Basilica, the Vatican Museums, and the Sistine Chapel with Michelangelo's famous ceiling frescoes. Tour ancient Rome: view the monumental Colosseum, the ruins of the Roman Forum, and toss a coin into the baroque Trevi Fountain to guarantee your return to Rome.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Rome"
      },
      {
        "day": 16,
        "title": "Departure from Rome — Flight Home",
        "description": "Savor a final Italian breakfast before transferring to Rome Fiumicino Airport for your flight home, concluding the definitive, life-changing Grand Tour of Europe.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "4-star hotels with daily buffet breakfast",
      "Sightseeing and attraction tickets as per itinerary",
      "6 Indian lunches, 7 Indian dinners, daily 500ml water bottle",
      "Coach driver tips included"
    ],
    "exclusions": [
      "5% GST and 2% TCS and other taxes",
      "Airfare (unless specified)",
      "Visa, passport, POE charges and travel insurance",
      "Personal expenses, pre/post-tour stay"
    ]
  },
  {
    "id": "kerala-kanyakumari",
    "title": "Kerala with Kanyakumari",
    "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹39,999",
    "highlights": [
      "Munnar tea gardens & Eravikulam National Park",
      "Kanyakumari's Vivekananda Memorial",
      "Alleppey houseboat backwaters",
      "Sree Padmanabhaswamy VIP darshan"
    ],
    "category": "Domestic",
    "isPopular": true,
    "tagline": "Kerala's hill stations and backwaters extended to India's southernmost tip.",
    "overview": "From Munnar's tea gardens to Thekkady's Kathakali performances, Varkala's cliffside beach and a full-day Kanyakumari excursion, ending with a traditional houseboat cruise through Alleppey's backwaters.",
    "heroImage": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "September to March",
    "startingPoint": "Cochin Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Nature",
      "Backwaters",
      "Culture"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
        "caption": "Backwaters of Kerala"
      },
      {
        "image": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1800",
        "caption": "Munnar tea plantations"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Cochin Arrival — Scenic Mountain Drive to Munnar Tea Country",
        "description": "Arrive at Cochin International Airport where your chauffeur welcomes you. Ascend into the Western Ghats towards Munnar (130 km / 4 hrs). En route, pause at the tiered cascades of Cheeyappara and Valara Waterfalls amidst lush spice hills. In Munnar, visit the Tata Tea Museum to learn the art of orthodox tea processing and enjoy a fresh tasting session before checking into your plantation resort for dinner.",
        "meals": "Lunch, Dinner",
        "stay": "Munnar"
      },
      {
        "day": 2,
        "title": "Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam & Echo Point",
        "description": "Embark on a morning safari in Eravikulam National Park, home to the endangered Nilgiri Tahr mountain goat and the blooming Neelakurinji shrub. Stroll through manicured tea gardens, visit Mattupetty Dam for speedboating options, shout into Echo Point, and take photographs beside the scenic waters of Kundala Arch Dam.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Munnar"
      },
      {
        "day": 3,
        "title": "Munnar to Thekkady (Periyar) — Spice Plantations & Kathakali Show",
        "description": "Drive through aromatic cardamom hills to Thekkady (90 km / 3 hrs). Tour an organic spice garden with a botanist explaining cardamom, pepper, cinnamon, and vanilla cultivation. In the evening, watch classical Kathakali facial drama and a thrilling Kalaripayattu martial arts demonstration at the Kadathanadan Kalari Centre.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Thekkady"
      },
      {
        "day": 4,
        "title": "Thekkady to Varkala Cliff via Jatayu Earth's Center Giant Sculpture",
        "description": "Travel towards the Arabian Sea coast, stopping at Jatayu Earth's Center in Chadayamangalam. Ride the cable car up the granite hill to behold the world's largest bird sculpture (200 ft long) commemorating the mythical demi-god Jatayu. Continue to Varkala and spend a tranquil evening strolling along the red laterite cliffside promenade lined with cafes and sunset viewpoints.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Varkala"
      },
      {
        "day": 5,
        "title": "Varkala to Kovalam — Sree Padmanabhaswamy Temple VIP Darshan",
        "description": "Drive to Trivandrum for special VIP Darshan at the ancient Sree Padmanabhaswamy Temple, the world's wealthiest temple famed for its Dravidian gold gopuram. Tour the horse-carved wooden ceilings of Kuthiramalika Palace and the Napier Art Museum before proceeding to the crescent beaches of Kovalam for dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kovalam"
      },
      {
        "day": 6,
        "title": "Full-Day Kanyakumari Excursion — Triveni Sangam & Vivekananda Memorial",
        "description": "Drive to Kanyakumari, the southernmost tip of mainland India. Visit the 16th-century teakwood Padmanabhapuram Palace and Suchindram Thanumalayan Temple. Board a ferry to the offshore Vivekananda Rock Memorial and the 133-foot stone Thiruvalluvar Statue. Witness the majestic sunset over the Triveni Sangam where the Arabian Sea, Bay of Bengal, and Indian Ocean merge, returning to Kovalam for the night.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kovalam"
      },
      {
        "day": 7,
        "title": "Kovalam to Alleppey (Alappuzha) — Traditional Houseboat Backwater Cruise",
        "description": "Drive north to Alleppey and board your traditional thatch-roofed Kerala Kettuvallam (Houseboat). Cruise along serene palm-fringed canals, paddy fields, and duck farms. Enjoy a freshly prepared authentic Kerala Sadhya lunch served on plantain leaves on board. Relax on your private deck as the golden sun sets over the quiet lagoons, followed by a candlelit dinner on the water.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Alleppey houseboat"
      },
      {
        "day": 8,
        "title": "Alleppey — Cochin Airport Departure",
        "description": "Enjoy breakfast as your houseboat glides back to the jetty. Disembark and transfer to Cochin International Airport for your flight home, carrying cherished memories of God's Own Country.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Premium accommodation on double/triple sharing, 7 breakfasts, 7 lunches, 7 dinners",
      "AC vehicle for all transfers and sightseeing, professional tour manager",
      "Entrance tickets, evening tea/coffee, water bottle per day",
      "Kerala Sadhya meal, Jatayu ropeway ride, 1-hour Shikara ride",
      "Kathakali and Kalaripayattu shows, Ayurvedic spa, Periyar wildlife experience",
      "VIP darshan pass at Sree Padmanabhaswamy Temple"
    ],
    "exclusions": [
      "5% GST, airfare/train fare",
      "Guide charges, early check-in/late check-out",
      "Additional meals or activities",
      "Personal expenses"
    ]
  },
  {
    "id": "mesmerizing-vietnam",
    "title": "Mesmerizing Vietnam",
    "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹78,900",
    "highlights": [
      "Mekong Delta excursion",
      "Ba Na Hills cable car & Golden Bridge",
      "Hoi An Ancient Town",
      "Overnight Ha Long Bay cruise"
    ],
    "category": "International",
    "tagline": "Ho Chi Minh City to Ha Long Bay via the Golden Bridge and an overnight cruise.",
    "overview": "From Ho Chi Minh City's Mekong Delta and Cu Chi Tunnels to Da Nang's Marble Mountains and the Golden Bridge at Ba Na Hills, finishing with Hanoi's old quarter and an overnight cruise through Ha Long Bay's limestone islands.",
    "heroImage": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to April",
    "startingPoint": "Ho Chi Minh City Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Culture",
      "Scenic",
      "Cruise"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Golden Bridge, Ba Na Hills"
      },
      {
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1800",
        "caption": "Ha Long Bay limestone islands"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Ho Chi Minh City (Saigon) Arrival & Colonial Landmarks Tour",
        "description": "Arrive at Tan Son Nhat International Airport in Ho Chi Minh City. Transfer to your hotel and embark on a city orientation tour: visit the French colonial Notre-Dame Cathedral Basilica, the historic Central Post Office designed by Gustave Eiffel, the War Remnants Museum, and browse bustling Ben Thanh Market before an Indian dinner.",
        "meals": "Lunch, Dinner",
        "stay": "Ho Chi Minh City"
      },
      {
        "day": 2,
        "title": "Mekong Delta River Safari — Coconut Groves & Village Life at My Tho",
        "description": "Drive to My Tho in the fertile Mekong Delta. Board a motorized boat cruising past floating fish farms on the Tien River, then transfer into traditional hand-rowed sampans through narrow water-coconut canals. Visit honey bee farms, listen to traditional southern folk music (Don Ca Tai Tu), and sample fresh tropical fruits before returning to Saigon.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Ho Chi Minh City"
      },
      {
        "day": 3,
        "title": "Cu Chi Tunnels Guerrilla Network — Flight to Coastal Da Nang",
        "description": "Explore the subterranean Cu Chi Tunnels network used by Viet Cong guerrillas during the Vietnam War, featuring trapdoors, living quarters, and weapon workshops. Return to Saigon for your short domestic flight to coastal Da Nang. Check into your beachside hotel in Da Nang.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Da Nang"
      },
      {
        "day": 4,
        "title": "Marble Mountains Caves & UNESCO Hoi An Ancient Lantern Town",
        "description": "Visit the five sacred Marble Mountains (Ngu Hanh Son) to explore hidden Buddhist sanctuaries inside Huyen Khong Cave and climb to panoramic viewpoints. In the afternoon, head to the UNESCO World Heritage town of Hoi An: walk past ancient merchant houses, cross the 400-year-old Japanese Covered Bridge, and take a magical evening lantern boat ride on the Thu Bon River.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Da Nang"
      },
      {
        "day": 5,
        "title": "Sun World Ba Na Hills & Iconic Golden Giant Hands Bridge",
        "description": "Ride one of the world's longest single-cable car systems up to Sun World Ba Na Hills (1,487m). Stroll across the world-famous Golden Bridge, held aloft by two giant stone hands emerging from the misty mountain jungle. Explore the French Village, Le Jardin D'Amour flower gardens, and Linh Ung Pagoda before descending back to Da Nang.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Da Nang"
      },
      {
        "day": 6,
        "title": "Flight to Hanoi Capital — Ho Chi Minh Mausoleum & Old Quarter Cyclo Ride",
        "description": "Fly north to the millennium-old capital of Hanoi. Visit the Ho Chi Minh Mausoleum complex, the One Pillar Pagoda resting on a single lotus pillar, and the historic Temple of Literature (Vietnam's first university). Enjoy a traditional cycle-rickshaw (cyclo) tour through the 36 ancient guild streets of Hanoi's vibrant Old Quarter.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Hanoi"
      },
      {
        "day": 7,
        "title": "Overnight Luxury Ha Long Bay Cruise — Limestone Karsts & Sung Sot Cave",
        "description": "Drive to the UNESCO natural wonder of Ha Long Bay and board a luxury overnight cruise ship. Sail among thousands of towering emerald limestone karsts rising dramatically from turquoise waters. Explore the massive stalactite chambers of Sung Sot (Surprise) Cave, kayak around secluded lagoons, and enjoy a sunset party on the sundeck followed by a seafood/Indian dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Ha Long Bay cruise"
      },
      {
        "day": 8,
        "title": "Ha Long Bay Sunrise Tai Chi — Return to Hanoi & Flight Home",
        "description": "Begin your morning with a calming Tai Chi session on the sun deck as mist lifts over the limestone islands. Visit Ti Top Island for swimming or hiking to its peak for 360-degree bay panoramas. Enjoy a brunch buffet as the cruise docks at the harbor, transferring to Hanoi Noi Bai Airport for your flight home.",
        "meals": "Breakfast, Brunch",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star hotel accommodation on double sharing, 1 night Ha Long Bay cruise",
      "Daily breakfast, lunch and dinner, Hanoi and Ho Chi Minh City tours",
      "Marble Mountain visit, private transfers, English guide/tour leader (20+ pax)",
      "Water bottle per day, Vietnam e-visa, travel insurance up to 59 years"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS",
      "Personal expenses, tips and porterage",
      "Costs from flight delays or cancellations"
    ]
  },
  {
    "id": "rajasthan-marwad",
    "title": "Rajasthan Marwad",
    "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹34,999",
    "highlights": [
      "Sam Sand Dunes desert safari",
      "Jaisalmer Fort & Patwon Ki Haveli",
      "Mehrangarh Fort, Jodhpur",
      "Khatu Shyam Ji Temple darshan"
    ],
    "category": "Domestic",
    "tagline": "Temples, forts and the Thar Desert across Bikaner, Jaisalmer and Jodhpur.",
    "overview": "From temple darshans at Khatu Shyam Ji and Salasar Balaji through Bikaner's Junagarh Fort to a desert safari and camel ride at the Sam Sand Dunes, ending among Jodhpur's Blue City and Mehrangarh Fort.",
    "heroImage": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to March",
    "startingPoint": "Jaipur Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Heritage",
      "Desert",
      "Culture"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=85&w=1800",
        "caption": "Forts of Rajasthan"
      },
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Sam Sand Dunes desert safari"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Jaipur Arrival — Transfer to Khatu Shyam Ji Mandir Darshan",
        "description": "Arrive at Jaipur Airport/Railway Station and drive to the pilgrimage town of Khatu in Sikar (80 km / 2 hrs). Check in to your hotel and attend the devotional evening Aarti and Darshan of Barbarik at the revered Khatu Shyam Ji Temple.",
        "meals": "Lunch, Dinner",
        "stay": "Khatu Shyam Ji"
      },
      {
        "day": 2,
        "title": "Khatu Shyam Ji to Salasar Balaji — Onward to Bikaner",
        "description": "Drive to Salasar to seek blessings at the famous Salasar Balaji Temple, dedicated to Lord Hanuman with a distinct round face and beard. Continue your journey into the desert kingdom of Bikaner (approx. 180 km), checking in to your heritage hotel for dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bikaner"
      },
      {
        "day": 3,
        "title": "Bikaner Sightseeing — Junagarh Fort, Karni Mata (Deshnok) & Camel Farm",
        "description": "Explore the unconquered Junagarh Fort, featuring gold-leafed courtyards of Anup Mahal and Badal Mahal. Visit the National Research Centre on Camel to observe camel breeding and taste fresh camel milk ice cream. Drive 30 km to Deshnok to visit the famous 600-year-old Karni Mata Temple, revered for over 25,000 sacred black rats (kabbas).",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bikaner"
      },
      {
        "day": 4,
        "title": "Bikaner to the Golden City of Jaisalmer",
        "description": "Drive west through the heart of the Great Indian Thar Desert to Jaisalmer (330 km / 6 hrs), passing desert scrublands and sand dunes. Check in to your yellow sandstone hotel in Jaisalmer and enjoy an evening stroll around the picturesque Gadisar Lake.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Jaisalmer"
      },
      {
        "day": 5,
        "title": "Tanot Mata Temple — Longewala War Memorial — Sam Sand Dunes Desert Safari",
        "description": "Visit the miraculous Tanot Mata Temple near the Indo-Pak border, where unexploded enemy bombs from the 1965 war are preserved. Visit the Longewala War Memorial commemorating the famous 1971 Battle of Longewala. Arrive at the Sam Sand Dunes in the late afternoon for a camel safari over golden undulating dunes, a 4x4 dune bashing ride, and an evening Rajasthani Kalbelia folk dance and musical performance under the stars around a campfire.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Jaisalmer"
      },
      {
        "day": 6,
        "title": "Jaisalmer Living Fort & Patwon Ki Haveli — Drive to Jodhpur (Sun City)",
        "description": "Tour Sonar Qila (Jaisalmer Golden Fort), one of the world's few fully functioning living forts with thousands of residents, ancient Jain temples, and the intricately carved 5-storey Patwon Ki Haveli. In the afternoon, drive south to Jodhpur, the 'Blue City' of Rajasthan (280 km / 5 hrs), checking into your hotel for dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Jodhpur"
      },
      {
        "day": 7,
        "title": "Jodhpur Sightseeing — Mehrangarh Fort, Jaswant Thada & Umaid Bhawan",
        "description": "Ascend to the towering Mehrangarh Fort, perched 400 feet above Jodhpur's blue rooftops, housing royal palanquins, weaponry, and ornate chambers like Sheesh Mahal. Visit the gleaming white marble cenotaph of Jaswant Thada and tour the museum at the grand Art Deco Umaid Bhawan Palace.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Jodhpur"
      },
      {
        "day": 8,
        "title": "Jodhpur Departure",
        "description": "After breakfast, explore the Clock Tower market for famous Jodhpuri spices and handicrafts before transferring to Jodhpur Airport or Railway Station for your departure.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Double/triple sharing, 7 breakfasts, 8 lunches, 7 dinners",
      "AC vehicle transfers and sightseeing, professional tour manager",
      "Entrance tickets, evening tea/coffee, water bottle per day, travel insurance",
      "Sam Sand Dunes experience, all major fort and temple visits"
    ],
    "exclusions": [
      "5% GST, airfare/train fare",
      "Guide charges, early check-in/late check-out",
      "Extra meals or sightseeing",
      "Personal expenses"
    ]
  },
  {
    "id": "singapore-malaysia-thailand",
    "title": "Singapore Malaysia Thailand",
    "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1800",
    "duration": "9 Nights / 10 Days",
    "price": "₹1,05,000",
    "highlights": [
      "Alcazar Cabaret Show & Coral Island, Pattaya",
      "Golden & Marble Buddha Temples, Bangkok",
      "Genting Highlands cable car",
      "Universal Studios & Wings of Time, Singapore"
    ],
    "category": "International",
    "tagline": "Three countries, one grand Southeast Asian holiday — Thailand, Malaysia and Singapore.",
    "overview": "A ten-day sweep from Pattaya's beaches and Bangkok's temples through Kuala Lumpur's Genting Highlands to Singapore's Night Safari, Sentosa Island and Universal Studios.",
    "heroImage": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "Year-round",
    "startingPoint": "Bangkok Airport",
    "groupSize": "Min 25 pax for quoted rate",
    "themes": [
      "City",
      "Family",
      "Theme Park"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=85&w=1800",
        "caption": "Singapore skyline"
      },
      {
        "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Bangkok and Pattaya"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Bangkok Arrival — Transfer to Pattaya & Alcazar Cabaret Show",
        "description": "Arrive in Bangkok and transfer by luxury coach to the coastal city of Pattaya. Check into your hotel and attend the famous Alcazar Cabaret Show featuring grand music, dazzling lighting, and extravagant costumes, followed by an Indian buffet dinner.",
        "meals": "Lunch, Dinner",
        "stay": "Pattaya"
      },
      {
        "day": 2,
        "title": "Coral Island Speedboat Tour with Water Sports & Beach Time",
        "description": "Speedboat across the Gulf of Thailand to Koh Larn Coral Island. Enjoy parasailing, banana boat rides, and swimming in clear waters, followed by an Indian lunch beachside and an evening at leisure in Pattaya.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Pattaya"
      },
      {
        "day": 3,
        "title": "Pattaya to Bangkok — Wat Traimit Golden Buddha & Marble Temple",
        "description": "Drive to Bangkok for a guided city tour: visit Wat Traimit to view the solid gold 5.5-ton Buddha and Wat Benchamabophit (The Marble Temple). Visit the World Gems Gallery and check into your Bangkok hotel.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bangkok"
      },
      {
        "day": 4,
        "title": "Safari World & Marine Park Full-Day Entertainment",
        "description": "Full day exploring Bangkok Safari World: ride through open wilderness to observe lions, giraffes, and zebras, followed by dolphin, stunt, and sea lion shows at Marine Park with an international buffet lunch.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Bangkok"
      },
      {
        "day": 5,
        "title": "Fly Bangkok to Kuala Lumpur (Malaysia) — Putrajaya & KL City Tour",
        "description": "Fly from Bangkok to Kuala Lumpur. Tour Putrajaya government center en route, view the Petronas Twin Towers, King's Palace, and ascend the KL Tower observation deck for sunset vistas before dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kuala Lumpur"
      },
      {
        "day": 6,
        "title": "Batu Caves Lord Murugan Shrine & Genting Highlands Cable Car",
        "description": "Climb the 272 steps at Batu Caves temple, then ride the Genting Skyway cable car up into the cool misty mountains of Genting Highlands to explore SkyAvenue indoor theme parks and shopping malls.",
        "meals": "Breakfast",
        "stay": "Kuala Lumpur"
      },
      {
        "day": 7,
        "title": "Kuala Lumpur to Singapore by AC Coach — World's First Night Safari",
        "description": "Drive across the causeway into the lion city of Singapore. In the evening, explore the world's premier Night Safari aboard an open tram spotting nocturnal wildlife in natural habitats, followed by the Creatures of the Night show.",
        "meals": "Breakfast, Dinner",
        "stay": "Singapore"
      },
      {
        "day": 8,
        "title": "Sentosa Island Cable Car, Gardens by the Bay & Supertree Light Show",
        "description": "Cable car to Sentosa Island for Madame Tussauds. In the afternoon, tour Gardens by the Bay's Flower Dome and Cloud Forest with its 35m indoor waterfall, ending with the Garden Rhapsody light show at Supertree Grove.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Singapore"
      },
      {
        "day": 9,
        "title": "Full Day at Universal Studios Singapore & Wings of Time Night Show",
        "description": "Spend the entire day enjoying thrill rides and shows at Universal Studios: Transformers 3D, Battlestar Galactica, and Jurassic Park Rapids, concluding with the Wings of Time fireworks and laser show on Sentosa Beach.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Singapore"
      },
      {
        "day": 10,
        "title": "Singapore City Tour — Merlion Park & Changi Airport Departure",
        "description": "Morning city tour of Merlion Park, Chinatown, and Little India. Transfer to Singapore Changi Airport to explore the Rain Vortex at Jewel before boarding your return flight home.",
        "meals": "Breakfast, Lunch",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star hotel accommodation on double/twin sharing",
      "Daily breakfast, lunch and dinner, Coral Island tour, Night Safari",
      "Putrajaya tour, Petronas Towers photo stop, KL Tower deck, Universal Studios",
      "Thailand visa on arrival, Singapore visa, Malaysia arrival card, Sentosa cable car",
      "Tour leader/guide (25+ pax), travel insurance up to 59 years, private transfers"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS",
      "Personal expenses, tips and porterage",
      "Costs from flight delays or cancellations"
    ]
  },
  {
    "id": "sampurna-karnataka",
    "title": "Sampurna Karnataka",
    "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹40,499",
    "highlights": [
      "Hampi UNESCO World Heritage Site",
      "Murudeshwar's giant Shiva statue",
      "Jog Falls",
      "St. Mary's Island ferry ride"
    ],
    "category": "Domestic",
    "tagline": "Karnataka end-to-end — Badami's cave temples, Hampi's ruins and the Malabar coast.",
    "overview": "A full sweep of Karnataka: Badami's rock-cut cave temples, the UNESCO sites of Pattadakal and Hampi, Jog Falls, Murudeshwar's coastal Shiva temple, and a ferry ride to the basalt shores of St. Mary's Island.",
    "heroImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to February",
    "startingPoint": "Hubli Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Heritage",
      "Coastal",
      "Culture"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Hampi's ancient ruins"
      },
      {
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1800",
        "caption": "Temples and coastline of Karnataka"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Hubli Arrival — City Orientation & Sunset at Unkal Lake",
        "description": "Arrive at Hubli Airport or Railway Station, meet your tour director, and transfer to your hotel. In the evening, visit Unkal Lake featuring a statue of Swami Vivekananda in the center, followed by a welcome dinner.",
        "meals": "Dinner",
        "stay": "Hubli"
      },
      {
        "day": 2,
        "title": "Badami Cave Temples — Aihole Cradle of Temple Architecture & Pattadakal to Hampi",
        "description": "Tour the 6th-century rock-cut Badami Cave Temples carved into red sandstone cliffs overlooking Agastya Lake. Explore Aihole's Durga Temple complex and the UNESCO World Heritage site of Pattadakal showcasing fusion Dravidian and Nagara temple architecture, arriving in Hampi for overnight stay.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Hampi"
      },
      {
        "day": 3,
        "title": "Hampi UNESCO World Heritage Exploration — Vijayanagara Empire Grandeur",
        "description": "Spend the day exploring the ruined capital of the Vijayanagara Empire: visit the active Virupaksha Temple, the iconic Stone Chariot and musical pillars of Vijaya Vittala Temple, the royal Lotus Mahal, Queen's Bath, and the Elephant Stables.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Hampi"
      },
      {
        "day": 4,
        "title": "Anegundi (Mythological Kishkindha) & Coracle Boat Ride on Tungabhadra",
        "description": "Cross the Tungabhadra River on a traditional round coracle boat to explore Anegundi, identified with the monkey kingdom Kishkindha from the Ramayana. Visit Anjaneya Hill (birthplace of Lord Hanuman) and Pampa Sarovar before returning to Hubli.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Hubli"
      },
      {
        "day": 5,
        "title": "Sahastra Linga — Mighty Jog Falls & Coastal Gokarna",
        "description": "Visit Sahasralinga where hundreds of Shiva Lingas are carved into the riverbed rocks. Drive through the Western Ghats to witness Jog Falls, India's second-highest plunge waterfall. Continue to the coastal holy town of Gokarna to visit the ancient Mahabaleshwar Temple housing the sacred Atmalinga.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Gokarna"
      },
      {
        "day": 6,
        "title": "Gokarna to Murudeshwar — World's 2nd-Tallest Shiva Statue & Coastal Beach",
        "description": "Drive to Murudeshwar along the Arabian Sea coast. Gaze upon the towering 123-foot statue of Lord Shiva and ride the elevator to the top of the 20-storey Raja Gopuram for sweeping ocean views. Enjoy sunset on Murudeshwar beach.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Murudeshwar"
      },
      {
        "day": 7,
        "title": "Murudeshwar to Sringeri Sharada Peetham & Temple Town of Udupi",
        "description": "Drive through the rainforests of Kudremukh to Sringeri to visit the 8th-century Sri Sharada Peetham established by Adi Shankaracharya and the architectural marvel of Sri Vidyashankara Temple with zodiac pillars. Proceed to the holy town of Udupi.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Udupi"
      },
      {
        "day": 8,
        "title": "St. Mary's Island Hexagonal Basalt Rocks — Udupi Sri Krishna Darshan & Departure",
        "description": "Take a ferry to St. Mary's Island to walk on unique volcanic hexagonal basalt columnar rock formations. Return to Udupi to seek blessings through the nine-hole silver window (Kanakana Kindi) at the historic Sri Krishna Matha before transferring to Mangalore Airport for departure.",
        "meals": "Breakfast, Lunch",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Double/triple sharing, all meals, AC vehicle transfers and sightseeing",
      "Professional tour manager, entrance tickets, evening tea/coffee",
      "Water bottle per day, travel insurance, coracle ride, St. Mary's Island ferry",
      "Hampi UNESCO heritage tour, Badami Cave Temples, Jog Falls visit"
    ],
    "exclusions": [
      "5% GST, airfare/train fare",
      "Guide charges, early check-in/late check-out",
      "Extra meals or sightseeing",
      "Personal expenses"
    ]
  },
  {
    "id": "sikkim-darjeeling-6n",
    "title": "Sikkim Darjeeling",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹38,900",
    "highlights": [
      "Tsomgo Lake & Nathula Pass",
      "Pemayangtse Monastery, Pelling",
      "Tiger Hill sunrise, Darjeeling",
      "Pelling Sky Walk"
    ],
    "category": "North East",
    "tagline": "Gangtok's high-altitude lakes, Pelling's monasteries and Darjeeling's tea-country sunrise.",
    "overview": "A classic Eastern Himalaya loop through Gangtok's Tsomgo Lake and Nathula Pass, Pelling's monasteries and Sky Walk, ending with a pre-dawn climb to Tiger Hill for sunrise over Kanchenjunga.",
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "September to December",
    "startingPoint": "Bagdogra Airport / NJP",
    "groupSize": "2+ guests",
    "themes": [
      "Mountains",
      "Culture",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "/pdf-assets/kanchenjunga-darjeeling.jpg",
        "caption": "Kangchenjunga from Darjeeling - EJH / public domain"
      },
      {
        "image": "/pdf-assets/yumthang-valley-sikkim.jpg",
        "caption": "Yumthang Valley - Soumyajit Pramanick / CC BY-SA"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "NJP / Bagdogra Arrival — Scenic Mountain Climb to Gangtok",
        "description": "Arrive at New Jalpaiguri Railway Station (NJP) or Bagdogra Airport (IXB). Board your private vehicle for a picturesque 125 km drive along the Teesta River into the Himalayan kingdom of Sikkim. Arrive in Gangtok (5,500 ft), check into your hotel, and spend your evening taking a relaxed stroll along the pedestrian-only MG Marg.",
        "meals": "—",
        "stay": "Gangtok"
      },
      {
        "day": 2,
        "title": "Glacial Tsomgo Lake, Baba Harbhajan Singh Mandir & Nathula Pass",
        "description": "Embark on a high-altitude mountain excursion to the sacred glacial Tsomgo (Changu) Lake situated at 12,400 feet, surrounded by snow-draped peaks. Continue higher to Baba Harbhajan Singh Mandir (13,200 ft), dedicated to the legendary Indian soldier. Subject to permit and weather, visit the historic Indo-China border trade outpost at Nathula Pass (14,140 ft).",
        "meals": "Breakfast",
        "stay": "Gangtok"
      },
      {
        "day": 3,
        "title": "Gangtok City Highlights — Scenic Drive across West Sikkim to Pelling",
        "description": "Tour Gangtok's top sights: the Directorate of Handicrafts & Handloom, Flower Show Hall, Do Drul Chorten Stupa, and the roaring Banjhakri Waterfalls. Drive westward across mountain valleys to Pelling (6,800 ft), offering spectacular unobstructed views of Mount Kanchenjunga.",
        "meals": "Breakfast",
        "stay": "Pelling"
      },
      {
        "day": 4,
        "title": "Pelling Sightseeing — Sacred Khecheopalri Lake, Pemayangtse & Sky Walk",
        "description": "Explore the wish-fulfilling Khecheopalri Lake hidden in dense holy forests, the cascading Khangchendzonga Waterfalls, and the historic 1705 Pemayangtse Monastery. Walk along the glass Pelling Sky Walk leading to the giant statue of Chenrezig and wander among the royal 17th-century stone ruins of Rabdentse Palace.",
        "meals": "Breakfast",
        "stay": "Pelling"
      },
      {
        "day": 5,
        "title": "Pelling to Darjeeling via Namchi Chardham (Siddhesvara Dham)",
        "description": "Drive to Namchi in South Sikkim to visit the massive 108-foot statue of Lord Shiva at Siddhesvara Dham (Char Dham replica) and the towering statue of Guru Padmasambhava at Samdruptse Hill. Cross into West Bengal's Darjeeling hills, checking in to your colonial hill-station hotel.",
        "meals": "Breakfast",
        "stay": "Darjeeling"
      },
      {
        "day": 6,
        "title": "Tiger Hill Kanchenjunga Sunrise, Ghoom Monastery & Himalayan Zoo",
        "description": "Wake at 4:00 AM for the drive up to Tiger Hill (8,400 ft) to witness the sunrise turning Mount Everest and Kanchenjunga into molten gold. On the return drive, visit the 1850 Ghoom Monastery and the Batasia Loop Toy Train war memorial. Later, tour the Padmaja Naidu Himalayan Zoological Park (home to Red Pandas and Snow Leopards), the Himalayan Mountaineering Institute (HMI), and Happy Valley Tea Estate.",
        "meals": "Breakfast",
        "stay": "Darjeeling"
      },
      {
        "day": 7,
        "title": "Darjeeling to NJP / Bagdogra Departure",
        "description": "Enjoy breakfast with views of the tea hills before your downhill transfer through Kurseong to NJP Railway Station or Bagdogra Airport for your journey home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star accommodation on double sharing, breakfast/lunch/dinner",
      "Entry fees, 1L water bottle per day, Nathula Pass and Namchi",
      "Innova/Xylo or similar vehicle for all transfers, driver allowance and parking"
    ],
    "exclusions": [
      "Train/airfare, heater charges",
      "Travel or medical insurance",
      "Personal expenses such as tips, laundry and camera fees"
    ]
  },
  {
    "id": "sikkim-darjeeling-9n",
    "title": "Sikkim Darjeeling — Gangtok, Lachung & Darjeeling",
    "image": "/pdf-assets/yumthang-valley-sikkim.jpg",
    "duration": "9 Nights / 10 Days",
    "price": "₹52,500",
    "highlights": [
      "Yumthang Valley — Valley of Flowers",
      "Tsomgo Lake & Nathula Pass",
      "Pelling Sky Walk",
      "Tiger Hill sunrise, Darjeeling"
    ],
    "category": "North East",
    "tagline": "The extended Sikkim loop, reaching all the way to Lachung and the Yumthang Valley.",
    "overview": "A longer version of the Sikkim–Darjeeling circuit that pushes north to Lachung and the rhododendron meadows of Yumthang Valley, before looping back through Pelling and Darjeeling.",
    "heroImage": "/pdf-assets/yumthang-valley-sikkim.jpg",
    "bestTime": "March to May, September to December",
    "startingPoint": "Bagdogra Airport / NJP",
    "groupSize": "2+ guests",
    "themes": [
      "Mountains",
      "Culture",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "/pdf-assets/yumthang-valley-sikkim.jpg",
        "caption": "Yumthang Valley - Soumyajit Pramanick / CC BY-SA"
      },
      {
        "image": "/pdf-assets/kanchenjunga-darjeeling.jpg",
        "caption": "Kangchenjunga from Darjeeling - EJH / public domain"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "NJP / Bagdogra / Siliguri to Gangtok",
        "description": "Meet-and-greet on arrival, then a scenic hill transfer along the Teesta River to Gangtok. Check in, unwind after the climb, and enjoy an evening free to explore MG Marg's bakeries and craft shops at your own pace.",
        "meals": "—",
        "stay": "Gangtok"
      },
      {
        "day": 2,
        "title": "Glacial Tsomgo Lake, New Baba Mandir & Nathula Pass",
        "description": "Full-day high-altitude excursion to glacial Tsomgo Lake (12,400 ft) and the patriotic shrine of New Baba Mandir, with Nathula Pass (14,140 ft) on the Indo-China border subject to permit and weather clearance.",
        "meals": "Breakfast",
        "stay": "Gangtok"
      },
      {
        "day": 3,
        "title": "Gangtok to North Sikkim (Lachung) via Seven Sisters Waterfalls",
        "description": "Drive into the rugged wilderness of North Sikkim (125 km / 6 hrs), stopping at Singhik Viewpoint for Kanchenjunga views, Seven Sisters Waterfalls, and Naga Waterfall before reaching the peaceful alpine village of Lachung (8,610 ft).",
        "meals": "Breakfast",
        "stay": "Lachung"
      },
      {
        "day": 4,
        "title": "Yumthang Valley (Valley of Flowers) & Hot Springs Excursion",
        "description": "Early morning drive to the breathtaking Yumthang Valley at 11,800 feet, famed for its sprawling rhododendron sanctuaries, yak grazing pastures, and steaming natural hot springs. Optional excursion to snow-bound Zero Point (Yumesamdong at 15,300 ft) before returning to Lachung.",
        "meals": "Breakfast",
        "stay": "Lachung"
      },
      {
        "day": 5,
        "title": "Lachung to Gangtok Descent via Bheema & Twin Falls",
        "description": "Descend through the Chungthang valley along roaring mountain rivers, pausing at Bheema Falls and Twin Falls before arriving back in Gangtok for an evening of relaxation.",
        "meals": "Breakfast",
        "stay": "Gangtok"
      },
      {
        "day": 6,
        "title": "Gangtok City Tour — Onward to Pelling (West Sikkim)",
        "description": "Morning tour of the Handicraft Centre, Flower Show Hall, and Do Drul Chorten Stupa, followed by a scenic drive across mountain passes to Pelling with panoramic views of Mount Kanchenjunga.",
        "meals": "Breakfast",
        "stay": "Pelling"
      },
      {
        "day": 7,
        "title": "Pelling Local Sightseeing — Sky Walk, Khecheopalri Lake & Pemayangtse",
        "description": "Visit sacred Khecheopalri Lake where birds are said not to let a single leaf float on the water, Khangchendzonga Waterfalls, the 1705 Pemayangtse Monastery, the glass Pelling Sky Walk, and the royal Rabdentse Palace ruins.",
        "meals": "Breakfast",
        "stay": "Pelling"
      },
      {
        "day": 8,
        "title": "Pelling to Darjeeling via Namchi Char Dham Complex",
        "description": "Drive via Namchi to visit the colossal 108-foot statue of Lord Shiva at Siddhesvara Dham and the Samdruptse hill stupa, continuing into the world-famous tea gardens of Darjeeling.",
        "meals": "Breakfast",
        "stay": "Darjeeling"
      },
      {
        "day": 9,
        "title": "Tiger Hill Sunrise over Kanchenjunga, Ghoom Monastery & Himalayan Zoo",
        "description": "Pre-dawn excursion to Tiger Hill (8,400 ft) for sunrise over Kanchenjunga and Mount Everest, followed by Ghoom Monastery, Batasia Loop Toy Train track, Himalayan Mountaineering Institute, and Darjeeling Himalayan Zoo.",
        "meals": "Breakfast",
        "stay": "Darjeeling"
      },
      {
        "day": 10,
        "title": "Darjeeling to NJP / Bagdogra Departure",
        "description": "Breakfast at the hotel, then a scenic downhill transfer through Kurseong to NJP railway station or Bagdogra Airport for your onward flight.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Double sharing accommodation, breakfast/lunch/dinner",
      "Nathula Pass and Namchi, 1L water bottle per day, all entry fees and permits",
      "AC Innova/Xylo or similar vehicle (AC off in hilly areas), tolls, parking and driver allowance"
    ],
    "exclusions": [
      "Train/airfare, heater charges, Zero-Point excursion",
      "Travel and medical insurance",
      "Personal expenses"
    ]
  },
  {
    "id": "south-india-temple-tour",
    "title": "South India Temple Tour",
    "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1800",
    "duration": "5 Nights / 6 Days",
    "price": "₹28,599",
    "highlights": [
      "Meenakshi Amman Temple, Madurai",
      "Dhanushkodi — Ghost Town of India",
      "Triveni Sangam sunset, Kanyakumari",
      "Padmanabhaswamy Temple VIP darshan"
    ],
    "category": "Domestic",
    "tagline": "Madurai to Kanyakumari through Tamil Nadu and Kerala's most sacred temples.",
    "overview": "A temple pilgrimage from Madurai's Meenakshi Amman Temple across the Pamban Bridge to Rameshwaram, the abandoned town of Dhanushkodi, and Kanyakumari's Triveni Sangam, finishing at Trivandrum's Padmanabhaswamy Temple.",
    "heroImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to March",
    "startingPoint": "Madurai",
    "groupSize": "2+ guests",
    "themes": [
      "Spiritual",
      "Heritage"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1800",
        "caption": "Temples of Tamil Nadu"
      },
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Kanyakumari's coastline"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Madurai Arrival — Historic Meenakshi Amman Temple & Thirumalai Nayakkar Mahal",
        "description": "Arrive in the cultural capital of Tamil Nadu. Check in to your hotel and visit the world-famous Meenakshi Amman Temple, admiring its towering sculptured gopurams and the Hall of Thousand Pillars. Visit the 17th-century Thirumalai Nayakkar Mahal, famous for its giant stucco pillars, and attend the night bed-chamber procession (Palliyarai) ceremony at the temple.",
        "meals": "Lunch, Dinner",
        "stay": "Madurai"
      },
      {
        "day": 2,
        "title": "Madurai to Rameshwaram across the Sea over Pamban Bridge",
        "description": "Drive to Rameshwaram Island across the legendary Pamban Sea Bridge. Check into your hotel and visit the sacred Ramanathaswamy Temple, home to the longest corridor in the world with over 1,200 intricately carved sandstone pillars. Bathe in the sacred Agnitheertham waters and visit Ramjharoka Temple holding Lord Rama's footprints.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Rameshwaram"
      },
      {
        "day": 3,
        "title": "Dhanushkodi Excursion (Ghost Town) & Ram Setu Point",
        "description": "Drive to the ghost town of Dhanushkodi, submerged in the 1964 cyclone: view the evocative ruins of the railway station, church, and post office. Stand at Arichal Munai (Ram Setu point), where the waters of the Bay of Bengal and Indian Ocean meet, just 18 miles from Sri Lanka.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Rameshwaram"
      },
      {
        "day": 4,
        "title": "Rameshwaram (22 Holy Theerthams) — Tiruchendur — Kanyakumari",
        "description": "Take part in the sacred ritual of bathing in all 22 Holy Theertham wells inside Ramanathaswamy Temple and attend the early morning Sphatik Lingam Darshan. Drive along the Gulf of Mannar coast to visit the seaside Lord Murugan Temple at Tiruchendur, arriving at Kanyakumari in time for the Triveni Sangam sunset.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kanyakumari"
      },
      {
        "day": 5,
        "title": "Vivekananda Rock Memorial, Thiruvalluvar Statue & Drive to Trivandrum",
        "description": "Take an early boat to the offshore Vivekananda Rock Memorial and the 133-foot Thiruvalluvar Statue. Visit the Kanyakumari Amman Temple and Suchindram Thanumalayan Temple (housing the Trinity of Brahma, Vishnu, Shiva in a single lingam), before driving to Trivandrum.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Trivandrum"
      },
      {
        "day": 6,
        "title": "Sree Padmanabhaswamy Temple VIP Darshan & Departure",
        "description": "Special VIP Darshan at the monumental Sree Padmanabhaswamy Temple. Tour the Kuthiramalika Palace Museum showcasing royal Travancore treasures before transferring to Trivandrum Airport or Railway Station for departure.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Double/triple sharing, 5 breakfasts, 5 lunches, 5 dinners",
      "AC vehicle transfers and sightseeing, professional tour manager",
      "Entrance tickets, evening tea/coffee, water bottle per day, travel insurance",
      "VIP darshan pass at Padmanabhaswamy Temple, Pamban Bridge and Dhanushkodi visits"
    ],
    "exclusions": [
      "5% GST, airfare/train fare",
      "Guide charges, early check-in/late check-out",
      "Extra meals or sightseeing",
      "Personal expenses"
    ]
  },
  {
    "id": "special-kerala",
    "title": "Special Kerala",
    "image": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹36,450",
    "highlights": [
      "Munnar tea gardens & Eravikulam National Park",
      "Kathakali & Kalaripayattu shows",
      "Varkala cliffside beach",
      "Alleppey houseboat backwaters"
    ],
    "category": "Domestic",
    "tagline": "A compact seven-day introduction to Kerala's hills, backwaters and coast.",
    "overview": "Munnar's tea gardens and Thekkady's traditional performances, Varkala's cliffside beach and Kovalam's temples, ending with a houseboat cruise through Alleppey's backwaters.",
    "heroImage": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "September to March",
    "startingPoint": "Cochin Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Nature",
      "Backwaters",
      "Culture"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1800",
        "caption": "Kerala's backwaters"
      },
      {
        "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
        "caption": "Alleppey backwater cruising"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Cochin Arrival — Scenic Mountain Drive to Munnar Tea Country",
        "description": "Arrive at Cochin Airport, meet your private chauffeur, and drive up into the Western Ghats (130 km / 4 hrs). Stop at the foaming Cheeyappara and Valara Waterfalls en route. Visit the Tata Tea Museum in Munnar to witness black tea manufacturing and enjoy a fresh tasting session before dinner at your resort.",
        "meals": "Lunch, Dinner",
        "stay": "Munnar"
      },
      {
        "day": 2,
        "title": "Munnar Sightseeing — Eravikulam National Park, Mattupetty Dam & Echo Point",
        "description": "Tour Eravikulam National Park to spot the rare Nilgiri Tahr mountain goats roaming high alpine grasslands. Stroll through emerald tea estates, visit the Mattupetty Dam reservoir, test your voice at Echo Point, and enjoy photography at Kundala Lake.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Munnar"
      },
      {
        "day": 3,
        "title": "Munnar to Thekkady (Periyar) — Spice Garden Tour & Kathakali Performance",
        "description": "Drive to Thekkady through spice plantations. Take a guided walking tour through organic cardamom, pepper, and cinnamon gardens. In the evening, attend authentic Kathakali classical dance and Kalaripayattu martial arts shows at the local cultural theatre.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Thekkady"
      },
      {
        "day": 4,
        "title": "Thekkady to Varkala Cliff via Jatayu Earth's Center Giant Bird Sculpture",
        "description": "Travel towards the coast to Chadayamangalam to board the cable car up to Jatayu Earth's Center, featuring the world's largest bird sculpture. Continue to Varkala to relax on the famous red-cliff beach overlooking the Arabian Sea.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Varkala"
      },
      {
        "day": 5,
        "title": "Varkala to Kovalam — Sree Padmanabhaswamy Temple & Napier Museum",
        "description": "Drive to Trivandrum to visit the grand Sree Padmanabhaswamy Temple, Kuthiramalika Palace Museum, and the Napier Art Gallery, settling in at the beach resort town of Kovalam for the evening.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kovalam"
      },
      {
        "day": 6,
        "title": "Kovalam to Alleppey — Traditional Kerala Houseboat Backwater Cruise",
        "description": "Drive to Alleppey to board your private traditional thatched Kettuvallam (Houseboat). Cruise through peaceful backwater lagoons, enjoy an authentic Kerala Sadhya feast prepared fresh on board, and watch rural village life glide past at sunset.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Alleppey houseboat"
      },
      {
        "day": 7,
        "title": "Alleppey Houseboat Check-Out — Cochin Airport Departure",
        "description": "Enjoy breakfast as your houseboat sails back to the jetty. Transfer to Cochin International Airport for your return flight, carrying unforgettable memories of Kerala.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Double/triple sharing, 6 breakfasts, 6 lunches, 6 dinners",
      "AC vehicle for all transfers and sightseeing, professional tour manager",
      "Entrance tickets, evening tea/coffee, water bottle per day",
      "Kerala Sadhya meal, Jatayu ropeway ride, 1-hour Shikara ride",
      "Kathakali and Kalaripayattu shows, Ayurvedic spa, Periyar wildlife experience"
    ],
    "exclusions": [
      "5% GST, airfare/train fare",
      "Guide charges, early check-in/late check-out",
      "Additional meals or activities",
      "Personal expenses; travel insurance not included"
    ]
  },
  {
    "id": "swiss-paris-highlights",
    "title": "Swiss & Paris Highlights",
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹1,99,999",
    "highlights": [
      "Eiffel Tower 3rd level & Disneyland Paris",
      "Jungfraujoch — Top of Europe",
      "Mount Titlis & Cliff Walk",
      "Rhine Falls boat ride"
    ],
    "category": "International",
    "tagline": "Paris's icons and Disneyland, then Switzerland's Alps from Jungfraujoch to Rhine Falls.",
    "overview": "Paris's Eiffel Tower, Versailles and a day at Disneyland, followed by Geneva, the Jungfraujoch cable-car excursion, Mount Titlis's Cliff Walk and Rhine Falls near Zurich.",
    "heroImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "March to October",
    "startingPoint": "Paris Airport",
    "groupSize": "Group departures — 8, 16 & 27 March 2027",
    "themes": [
      "City",
      "Mountains",
      "Family"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Paris landmarks"
      },
      {
        "image": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800",
        "caption": "Swiss Alps"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Paris Arrival — City of Lights Welcome",
        "description": "Touch down at Paris Charles de Gaulle Airport (CDG). Meet your Bandhan tour manager and board your private luxury coach to your hotel. Settle in and enjoy a relaxing evening orientation walk followed by a warm welcome Indian dinner.",
        "meals": "Dinner",
        "stay": "Paris"
      },
      {
        "day": 2,
        "title": "Paris Guided City Tour — Eiffel Tower 3rd Level, Versailles & Seine Cruise",
        "description": "Tour iconic Paris landmarks: drive past the Arc de Triomphe, Champs-Élysées, Place de la Concorde, and the Louvre exterior. Ascend to the 3rd Level (Top) of the Eiffel Tower for panoramic city vistas. Tour the Sun King's opulent Palace of Versailles and the Hall of Mirrors, followed by an evening cruise along the River Seine and an illuminated Paris by Night coach drive.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 3,
        "title": "Full Day at Disneyland Paris Theme Park",
        "description": "Spend an exhilarating full day exploring Disneyland Paris (Disneyland Park or Walt Disney Studios Park). Experience world-class thrill rides including Big Thunder Mountain, Star Wars Hyperspace Mountain, and Pirates of the Caribbean, capped off by the Disney Illuminations night fireworks show over Sleeping Beauty Castle.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 4,
        "title": "Paris to Switzerland — Geneva Lake Orientation Tour",
        "description": "Drive south into Switzerland across the Jura Mountains to Geneva. Tour the city: see the 140-metre Jet d'Eau water fountain shooting into Lake Geneva, the United Nations European Headquarters, the iconic Flower Clock at Jardin Anglais, and St. Peter's Cathedral before checking into your hotel.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Geneva"
      },
      {
        "day": 5,
        "title": "Jungfraujoch (Top of Europe 11,333 ft) Cogwheel Train & Interlaken",
        "description": "Ride the cutting-edge Eiger Express tricable gondola and the historic cogwheel train climbing through the Eiger mountain to Jungfraujoch (11,333 ft). Walk through the glistening Ice Palace, step onto the eternal snow plateau overlooking the massive Aletsch Glacier, and enjoy free time in scenic Interlaken between Lake Thun and Lake Brienz.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 6,
        "title": "Mount Titlis Rotair Revolving Cable Car & Scenic Lucerne Walking Tour",
        "description": "Ascend to 10,000 feet on the world's first revolving Titlis Rotair cable car. Cross the thrilling Titlis Cliff Walk suspension bridge, explore the Glacier Cave, and take the Ice Flyer over glacier crevasses. In the afternoon, tour Lucerne's medieval Chapel Bridge (Kapellbrücke), Lion Monument, and take a relaxing scenic cruise on Lake Lucerne.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 7,
        "title": "Bern Capital — Roaring Rhine Falls Boat Ride — Lindt Home of Chocolate",
        "description": "Visit Switzerland's federal capital Bern to admire the medieval Zytglogge clock tower and Federal Palace. Continue north to Schaffhausen to take a boat right up to the roaring rock face of Rhine Falls, Europe's largest waterfall. Visit the Lindt Home of Chocolate in Zurich to admire the world's tallest freestanding chocolate fountain and indulge in unlimited tastings.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 8,
        "title": "Departure from Zurich — Flight Home",
        "description": "Enjoy breakfast before transferring to Zurich Airport (ZRH) for your return flight home, filled with timeless memories of Parisian glamour and the Swiss Alps.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "4-star hotels with daily buffet breakfast",
      "Sightseeing and attraction tickets as per itinerary",
      "6 Indian lunches, 7 Indian dinners, daily 500ml water bottle",
      "Coach driver tips included"
    ],
    "exclusions": [
      "5% GST and 2% TCS and other taxes",
      "Airfare (unless specified)",
      "Visa, passport, POE charges and travel insurance",
      "Personal expenses, pre/post-tour stay"
    ]
  },
  {
    "id": "best-of-austria",
    "title": "Best of Austria",
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹1,41,999",
    "highlights": [
      "Schönbrunn Palace, Vienna",
      "Salzburg Salt Mine excursion",
      "Swarovski Crystal Worlds, Innsbruck",
      "Top of Innsbruck cable car"
    ],
    "category": "International",
    "tagline": "Vienna's imperial palaces, Salzburg's Old Town and Innsbruck's Alpine cable cars, connected by train.",
    "overview": "A train-linked loop through Vienna, Salzburg and Innsbruck — Schönbrunn Palace, a shared shuttle to the Hallstatt Salt Mine, and Innsbruck's Swarovski Crystal Worlds and Top of Innsbruck cable car.",
    "heroImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "May to September",
    "startingPoint": "Vienna Airport",
    "groupSize": "2+ guests",
    "themes": [
      "City",
      "Heritage",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Vienna's imperial architecture"
      },
      {
        "image": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800",
        "caption": "Alpine views near Innsbruck"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Vienna Arrival — Private Transfer & Imperial Evening",
        "description": "Arrive at Vienna International Airport (VIE), meet your private driver, and transfer to your central hotel. Spend your evening strolling along the grand Graben and Kohlmarkt pedestrian avenues, sampling traditional Viennese Sachertorte chocolate cake at a classic coffee house.",
        "meals": "—",
        "stay": "Vienna"
      },
      {
        "day": 2,
        "title": "Vienna Sightseeing — Schönbrunn Imperial Palace & Ringstrasse Tour",
        "description": "Explore the Habsburg legacy with a 24-hour Hop-On Hop-Off ticket: see the Vienna State Opera, Hofburg Imperial Palace, Parliament, and St. Stephen's Cathedral. Take a guided tour inside the staterooms of the UNESCO-listed Schönbrunn Palace, the gilded summer palace of Empress Maria Theresa.",
        "meals": "Breakfast",
        "stay": "Vienna"
      },
      {
        "day": 3,
        "title": "Scenic Train to Salzburg — Sound of Music City Exploration",
        "description": "Board an Austrian ÖBB Railjet high-speed train gliding through the Danube valley to Salzburg. Check into your hotel and wander through the Baroque Old Town (Altstadt), visiting Mozart's Birthplace on Getreidegasse, Mirabell Palace gardens, and taking the funicular up to Hohensalzburg Fortress.",
        "meals": "Breakfast",
        "stay": "Salzburg"
      },
      {
        "day": 4,
        "title": "Hallstatt Fairytale Lake Village & 7,000-Year-Old Salt Mine Excursion",
        "description": "Take an excursion into the Salzkammergut Lake District to Hallstatt, widely regarded as the most picturesque lakeside village in the world. Ascend the funicular to explore the prehistoric Hallstatt Salt Mine, slide down miner's wooden slides, and step out onto the Skywalk viewing platform 350 metres above Lake Hallstatt.",
        "meals": "Breakfast",
        "stay": "Salzburg"
      },
      {
        "day": 5,
        "title": "Salzburg to Innsbruck — Capital of the Austrian Alps",
        "description": "Take a breathtaking Alpine train ride across Tyrol to Innsbruck. Check into your hotel and explore the Old Town: view the Golden Roof (Goldenes Dachl) with its 2,657 fire-gilded copper tiles, the Imperial Hofburg, and stroll along the turquoise Inn River framed by jagged snow peaks.",
        "meals": "Breakfast",
        "stay": "Innsbruck"
      },
      {
        "day": 6,
        "title": "Top of Innsbruck Nordkette Cable Car & Swarovski Crystal Worlds",
        "description": "Ride the Nordkette funicular and cable car from Innsbruck city center directly up to the Top of Innsbruck (Hafelekar at 7,400 ft) for 360-degree Alpine views. In the afternoon, visit Swarovski Crystal Worlds in Wattens to explore the subterranean Chambers of Wonder and the Giant waterfall sculpture.",
        "meals": "Breakfast",
        "stay": "Innsbruck"
      },
      {
        "day": 7,
        "title": "Innsbruck to Vienna by Railjet — Farewell Evening",
        "description": "Board the Railjet back to Vienna. Spend your final afternoon shopping for Austrian souvenirs on Mariahilfer Strasse or enjoying an evening classical Mozart & Strauss concert.",
        "meals": "Breakfast",
        "stay": "Vienna"
      },
      {
        "day": 8,
        "title": "Departure from Vienna",
        "description": "After breakfast, meet your private chauffeur for your transfer to Vienna Airport for your return flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Hotel accommodation with breakfast (except day 1)",
      "Private airport, hotel and rail-station transfers throughout",
      "2nd-class train tickets between Vienna, Salzburg and Innsbruck",
      "Vienna 24-hour Hop-On Hop-Off, Schönbrunn Palace ticket",
      "Salzburg Salt Mine tour, Swarovski Crystal Worlds ticket, Innsbruck cable car"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS, visa fees",
      "Travel insurance, meals beyond breakfast",
      "City tax, tips and gratuities"
    ]
  },
  {
    "id": "classic-italy",
    "title": "Classic Italy",
    "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹1,82,999",
    "highlights": [
      "Grand Canal gondola ride, Venice",
      "Pisa, Siena & San Gimignano day trip",
      "Colosseum, Roman Forum & Palatine Hill",
      "High-speed trains across Italy"
    ],
    "category": "International",
    "tagline": "Milan to Rome by high-speed train, with a gondola ride through Venice along the way.",
    "overview": "Four iconic cities linked by train — Milan's shopping streets, a shared gondola ride through Venice's canals, a Tuscan day trip to Pisa and Siena from Florence, and a guided walk through Rome's Colosseum and Roman Forum.",
    "heroImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Milan Airport",
    "groupSize": "2+ guests",
    "themes": [
      "Heritage",
      "City",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Canals of Venice"
      },
      {
        "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=85&w=1800",
        "caption": "Ancient Rome"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Milan Arrival — Fashion Capital & Duomo di Milano",
        "description": "Arrive at Milan Malpensa Airport (MXP), meet your private driver, and transfer to your hotel. Visit the soaring Gothic Duomo di Milano, walk through the glass-vaulted Galleria Vittorio Emanuele II shopping arcade, and see the famous Teatro alla Scala opera house before enjoying an authentic Italian dinner.",
        "meals": "—",
        "stay": "Milan"
      },
      {
        "day": 2,
        "title": "High-Speed Train to Venice — Water Taxi & Grand Canal Gondola Ride",
        "description": "Board the Frecciarossa high-speed train to Venice Santa Lucia. Take a private water taxi down the Grand Canal to St. Mark's Square. Gaze upon St. Mark's Basilica, Doge's Palace, and the Bridge of Sighs. Board a traditional gondola for a magical gliding cruise through quiet back canals and beneath stone footbridges.",
        "meals": "Breakfast",
        "stay": "Venice"
      },
      {
        "day": 3,
        "title": "Venice to Renaissance Florence — Duomo & Ponte Vecchio",
        "description": "Travel by high-speed train south to Florence, the birthplace of the Italian Renaissance. Explore the city: admire Brunelleschi's magnificent terracotta Dome on the Cathedral of Santa Maria del Fiore, Giotto's Campanile, Piazza della Signoria, and walk across the historic jewelry shops of Ponte Vecchio over the Arno River.",
        "meals": "Breakfast",
        "stay": "Florence"
      },
      {
        "day": 4,
        "title": "Tuscany Full-Day Guided Excursion — Pisa, Siena & San Gimignano",
        "description": "Embark on a full-day guided tour through the rolling hills and vineyards of Tuscany. Pose with the iconic Leaning Tower of Pisa in the Piazza dei Miracoli. Visit the medieval UNESCO hill town of San Gimignano with its 14 ancient stone towers, and tour Siena's seashell-shaped Piazza del Campo and Gothic Duomo.",
        "meals": "Breakfast",
        "stay": "Florence"
      },
      {
        "day": 5,
        "title": "High-Speed Train to Rome — The Eternal City Exploration",
        "description": "Board the bullet train to Rome Termini. Check in to your hotel and spend the afternoon discovering the Spanish Steps, tossing a coin into the baroque Trevi Fountain to ensure your return to Rome, and stepping inside the ancient domed Pantheon.",
        "meals": "Breakfast",
        "stay": "Rome"
      },
      {
        "day": 6,
        "title": "Ancient Rome Guided Tour — Colosseum, Roman Forum & Palatine Hill",
        "description": "Step back 2,000 years into the Roman Empire with skip-the-line guided access into the monumental Colosseum. Walk the triumphal paths of the Roman Forum, the political epicenter of ancient Rome, and ascend the pine-shaded Palatine Hill where Roman emperors built their grand palaces.",
        "meals": "Breakfast",
        "stay": "Rome"
      },
      {
        "day": 7,
        "title": "Departure from Rome",
        "description": "Enjoy a final cappuccino and Italian breakfast before your private transfer to Rome Fiumicino Airport for your departure flight.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Hotel accommodation with breakfast (except day 1)",
      "Private transfers and 2nd-class trains between Milan, Venice, Florence and Rome",
      "Venice Grand Canal Gondola Ride, Florence Hop-On Hop-Off tour",
      "Pisa, Siena and San Gimignano day trip, Rome Hop-On Hop-Off tour",
      "Colosseum, Roman Forum and Palatine Hill guided entry (no arena access)"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS, visa fees",
      "Travel insurance, meals beyond breakfast",
      "City tax, tips and gratuities"
    ]
  },
  {
    "id": "london-edinburgh-bliss",
    "title": "London & Edinburgh Bliss",
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹1,95,999",
    "highlights": [
      "London Eye & Madame Tussauds",
      "Tower of London & Crown Jewels",
      "Cotswolds & Oxford excursion",
      "Edinburgh Castle"
    ],
    "category": "International",
    "tagline": "London's icons and the Cotswolds, then Scotland's capital by train.",
    "overview": "London's landmarks — the Eye, Madame Tussauds, a Thames cruise and the Tower of London — plus a day in the Cotswolds and Oxford, before a train journey north to Edinburgh Castle and the Royal Mile.",
    "heroImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "May to September",
    "startingPoint": "London Heathrow Airport",
    "groupSize": "2+ guests",
    "themes": [
      "City",
      "Heritage",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
        "caption": "London landmarks"
      },
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Edinburgh's historic streets"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "London Heathrow Arrival — Private Transfer & Evening Leisure",
        "description": "Arrive at London Heathrow Airport (LHR), meet your private driver, and transfer to your hotel in central London. Spend your evening exploring Covent Garden's lively street performers or walking along the vibrant South Bank.",
        "meals": "—",
        "stay": "London"
      },
      {
        "day": 2,
        "title": "London Sightseeing — London Eye Flight & Madame Tussauds",
        "description": "Use your 48-hour Hop-On Hop-Off sightseeing pass to view Big Ben, Westminster Abbey, Piccadilly Circus, and Trafalgar Square. Meet wax icons at Madame Tussauds and step inside the glass capsules of the London Eye for sweeping panoramas of the British capital.",
        "meals": "Breakfast",
        "stay": "London"
      },
      {
        "day": 3,
        "title": "Thames River Cruise & Tower of London (British Crown Jewels)",
        "description": "Board a scenic Thames River Cruise from Westminster to Tower Pier. Tour Her Majesty's Royal Palace and Fortress — the Tower of London — to behold the legendary British Crown Jewels, the White Tower, and meet the Yeoman Warders (Beefeaters).",
        "meals": "Breakfast",
        "stay": "London"
      },
      {
        "day": 4,
        "title": "Full-Day Oxford University & Cotswolds Countryside Villages Excursion",
        "description": "Travel by luxury coach into the English countryside to Oxford, the 'City of Dreaming Spires', taking a walking tour past Christ Church and Bodleian Library. Continue into the picturesque Cotswolds, exploring the honey-coloured stone cottages, ancient bridges, and tea rooms of Bourton-on-the-Water and Burford.",
        "meals": "Breakfast",
        "stay": "London"
      },
      {
        "day": 5,
        "title": "Scenic Train to Edinburgh (Scotland) — Royal Mile Evening Walk",
        "description": "Board the LNER East Coast Main Line express train from London King's Cross to Edinburgh Waverley, enjoying coastal views of Northumbria and Berwick. Arrive in Scotland's capital and take an evening stroll along the cobblestone Royal Mile.",
        "meals": "Breakfast",
        "stay": "Edinburgh"
      },
      {
        "day": 6,
        "title": "Edinburgh City Tour & Historic Edinburgh Castle",
        "description": "Tour the UNESCO-listed Old Town and Georgian New Town. Ascend Castle Rock to tour Edinburgh Castle, home to the Scottish Crown Jewels (Honours of Scotland), the ancient Stone of Destiny, and the 12th-century St. Margaret's Chapel.",
        "meals": "Breakfast",
        "stay": "Edinburgh"
      },
      {
        "day": 7,
        "title": "Edinburgh Leisure Day — Holyroodhouse & Arthur's Seat",
        "description": "Enjoy a full day of independent exploration: visit the Palace of Holyroodhouse (King's official residence in Scotland), hike up Arthur's Seat for sweeping city and sea views, or browse Scottish cashmere and shortbread shops along Princes Street.",
        "meals": "Breakfast",
        "stay": "Edinburgh"
      },
      {
        "day": 8,
        "title": "Departure from Edinburgh",
        "description": "After breakfast, meet your private chauffeur for your transfer to Edinburgh Airport (EDI) for your return flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Hotel accommodation with breakfast (except day 1)",
      "2nd-class train London–Edinburgh, private airport and rail transfers",
      "London 48-hour Hop-On Hop-Off, London Eye, Madame Tussauds",
      "Thames River Cruise, Tower of London, Cotswolds and Oxford guided tour",
      "Edinburgh 24-hour Hop-On Hop-Off, Edinburgh Castle entrance"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS, visa fees",
      "Travel insurance, meals beyond breakfast",
      "City tax, tips and gratuities"
    ]
  },
  {
    "id": "paris-swiss-delights",
    "title": "Paris & Swiss Delights",
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹1,94,999",
    "highlights": [
      "Eiffel Tower & Seine River Cruise",
      "Louvre Museum with audio guide",
      "Mount Titlis via Engelberg",
      "Rhine Falls, Europe's largest waterfall"
    ],
    "category": "International",
    "tagline": "Paris's museums and monuments, then Switzerland unlocked by a 3-day Swiss Travel Pass.",
    "overview": "Paris's Eiffel Tower, Seine cruise and Louvre Museum, followed by a high-speed train to Zurich and a 3-day Swiss Travel Pass covering excursions to Mount Titlis and the Rhine Falls.",
    "heroImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Paris Charles de Gaulle Airport",
    "groupSize": "2+ guests",
    "themes": [
      "City",
      "Mountains",
      "Museum"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Eiffel Tower, Paris"
      },
      {
        "image": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1800",
        "caption": "Swiss Alps near Engelberg"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Paris Arrival — Private Airport Transfer & Hotel Check-in",
        "description": "Arrive at Paris CDG Airport, meet your private chauffeur, and transfer to your Parisian hotel. Spend a relaxed afternoon strolling through the Latin Quarter or relaxing at a traditional sidewalk café.",
        "meals": "—",
        "stay": "Paris"
      },
      {
        "day": 2,
        "title": "Paris City Tour, Eiffel Tower 2nd Level & Seine River Cruise",
        "description": "Explore the City of Lights with a 48-hour Hop-On Hop-Off ticket: see the Champs-Élysées, Arc de Triomphe, and Opéra Garnier. Ascend to the 2nd Level of the Eiffel Tower for sweeping vistas, followed by a 1-hour cruise along the River Seine past Notre-Dame Cathedral.",
        "meals": "Breakfast",
        "stay": "Paris"
      },
      {
        "day": 3,
        "title": "Louvre Museum Masterpieces & Montmartre Walking Tour",
        "description": "Tour the world-renowned Louvre Museum with an audio guide, viewing the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace. Later, explore the bohemian artist quarter of Montmartre and the white-domed Sacré-Cœur Basilica.",
        "meals": "Breakfast",
        "stay": "Paris"
      },
      {
        "day": 4,
        "title": "High-Speed TGV Train to Zurich (Switzerland) — Swiss Travel Pass Activation",
        "description": "Board the high-speed TGV Lyria train darting through the French countryside to Zurich. Activate your 3-day Swiss Travel Pass granting unlimited travel on Swiss trains, buses, and lake steamers. Enjoy an evening stroll along Bahnhofstrasse and Lake Zurich.",
        "meals": "Breakfast",
        "stay": "Zurich"
      },
      {
        "day": 5,
        "title": "Mount Titlis Revolving Cable Car (Rotair) & Lucerne Excursion",
        "description": "Take a scenic train to Engelberg and board the Titlis Rotair revolving cable car up to 10,000 feet. Experience the Cliff Walk suspension bridge, the Glacier Cave, and the Ice Flyer snow adventure. On your return, explore Lucerne's 14th-century Chapel Bridge and Lion Monument.",
        "meals": "Breakfast",
        "stay": "Zurich"
      },
      {
        "day": 6,
        "title": "Rhine Falls Waterfall & Historic Schaffhausen Tour",
        "description": "Take the train to Schaffhausen to witness Rhine Falls, Europe's largest waterfall, admiring the thunderous cascades from scenic cliffside viewing platforms. Explore the medieval old town of Schaffhausen and the circular Munot Fortress.",
        "meals": "Breakfast",
        "stay": "Zurich"
      },
      {
        "day": 7,
        "title": "Departure from Zurich",
        "description": "Enjoy breakfast before your private transfer to Zurich Airport (ZRH) for your departure flight.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Hotel accommodation with breakfast (except day 1)",
      "Private transfers, day train Paris–Zurich, 3-day Swiss Travel Pass (2nd class)",
      "Paris 48-hour Hop-On Hop-Off, Eiffel Tower 2nd-level ticket, Seine Cruise",
      "Louvre Museum ticket with digital audio guide",
      "Mount Titlis and Rhine Falls excursions via Swiss Travel Pass"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS, visa fees",
      "Travel insurance, meals beyond breakfast",
      "City tax, tips and gratuities"
    ]
  },
  {
    "id": "splendid-germany",
    "title": "Splendid Germany",
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹1,47,999",
    "highlights": [
      "Neuschwanstein & Linderhof Castles",
      "Munich Hop-On Hop-Off tour",
      "Frankfurt Grand Tour & River Main cruise",
      "Scenic train journeys across Bavaria"
    ],
    "category": "International",
    "tagline": "Bavaria's fairytale castles to Frankfurt's skyline, connected by train.",
    "overview": "Munich's Marienplatz and English Garden, a full day at the fairytale Neuschwanstein and Linderhof castles, then trains to Stuttgart and Frankfurt for city tours and a River Main panorama cruise.",
    "heroImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "May to September",
    "startingPoint": "Munich Airport",
    "groupSize": "2+ guests",
    "themes": [
      "City",
      "Heritage",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
        "caption": "Bavarian castles"
      },
      {
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
        "caption": "Frankfurt's riverside skyline"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Munich Arrival — Bavarian Capital Welcome",
        "description": "Arrive at Munich Airport (MUC), meet your private driver, and transfer to your hotel. Settle in and enjoy an evening stroll around Marienplatz, watching the historic Glockenspiel clock chime above the New Town Hall.",
        "meals": "—",
        "stay": "Munich"
      },
      {
        "day": 2,
        "title": "Munich City Tour — Nymphenburg Palace & English Garden",
        "description": "Explore Munich with a Hop-On Hop-Off pass: visit the Baroque Nymphenburg Palace, the expansive English Garden with its river surfers at Eisbachwelle, the Olympic Park, and BMW Welt automotive showroom.",
        "meals": "Breakfast",
        "stay": "Munich"
      },
      {
        "day": 3,
        "title": "Fairytale Neuschwanstein & Royal Linderhof Castle Excursion",
        "description": "Embark on a full-day guided coach excursion into the Bavarian Alps to visit the fairytale Neuschwanstein Castle (the inspiration for Disney's Sleeping Beauty Castle), perched high above the Pöllat Gorge. Visit King Ludwig II's French-style rococo Linderhof Palace and the woodcarving village of Oberammergau.",
        "meals": "Breakfast",
        "stay": "Munich"
      },
      {
        "day": 4,
        "title": "Train to Stuttgart — Mercedes-Benz & Porsche Heritage City",
        "description": "Take an express train to Stuttgart. Explore the city with a 24-hour Hop-On Hop-Off pass: see Schlossplatz, the Old and New Castles, and visit the futuristic Mercedes-Benz Museum or Porsche Museum.",
        "meals": "Breakfast",
        "stay": "Stuttgart"
      },
      {
        "day": 5,
        "title": "Stuttgart to Frankfurt — Financial Capital of Germany",
        "description": "Board the ICE high-speed train to Frankfurt am Main. Check into your hotel and spend the afternoon exploring the medieval timber-framed buildings of Römerberg square and the Iron Bridge (Eiserner Steg).",
        "meals": "Breakfast",
        "stay": "Frankfurt"
      },
      {
        "day": 6,
        "title": "Frankfurt Grand Tour & River Main Panorama Boat Cruise",
        "description": "Take the Frankfurt Grand Hop-On Hop-Off tour covering St. Paul's Church, Goethe's Birthplace, and the modern skyscraper skyline. Board a 1-hour panorama boat cruise along the River Main with skyline views.",
        "meals": "Breakfast",
        "stay": "Frankfurt"
      },
      {
        "day": 7,
        "title": "Departure from Frankfurt",
        "description": "Enjoy breakfast before your private transfer to Frankfurt International Airport (FRA) for your flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Hotel accommodation with breakfast (except day 1)",
      "Private transfers and 2nd-class trains between Munich, Stuttgart and Frankfurt",
      "Munich Hop-On Hop-Off tour, Neuschwanstein and Linderhof entrance",
      "Stuttgart Hop-On Hop-Off tour, Frankfurt Hop-On Hop-Off Grand Tour",
      "1-hour River Main panorama boat cruise"
    ],
    "exclusions": [
      "Airfare, airport taxes",
      "5% GST and 2% TCS, visa fees",
      "Travel insurance, meals beyond breakfast",
      "City tax, tips and gratuities"
    ]
  },
  {
    "id": "turkish-wonders",
    "title": "Turkish Wonders",
    "image": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=85&w=1800",
    "duration": "7 Nights / 8 Days",
    "price": "₹2,56,999",
    "highlights": [
      "Hagia Sophia, Blue Mosque & Hippodrome",
      "Pamukkale travertines & Hierapolis",
      "Göreme Open Air Museum & Ozkonak Underground City",
      "Antalya Old Town & Düden Waterfalls"
    ],
    "category": "International",
    "tagline": "Istanbul's mosques, Pamukkale's white terraces and Cappadocia's fairy chimneys in one loop.",
    "overview": "Two nights in Istanbul for Hagia Sophia and the Blue Mosque, then domestic flights to Pamukkale's travertine terraces, Antalya's Old Town and Mediterranean waterfalls, and two nights in Cappadocia among its underground cities and fairy chimneys.",
    "heroImage": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Istanbul International Airport",
    "groupSize": "Min 2 pax for quoted rate",
    "themes": [
      "Heritage",
      "Culture",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=85&w=1800",
        "caption": "The Blue Mosque, Istanbul"
      },
      {
        "image": "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&q=85&w=1800",
        "caption": "Hagia Sophia at dusk"
      },
      {
        "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=85&w=1800",
        "caption": "Galata and the Bosphorus"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Istanbul Arrival — Gateway between Europe & Asia",
        "description": "Arrive at Istanbul International Airport (IST), meet your representative, and transfer to your hotel. Spend your evening taking in the energetic atmosphere of Taksim Square and Istiklal Street.",
        "meals": "—",
        "stay": "Istanbul"
      },
      {
        "day": 2,
        "title": "Historic Istanbul Tour — Hagia Sophia, Blue Mosque & Grand Bazaar",
        "description": "Guided tour of the historic Sultanahmet district: step inside the 6th-century Byzantine Hagia Sophia, marvel at the 20,000 blue Iznik tiles of the Sultan Ahmed (Blue) Mosque, walk the Roman Hippodrome, and browse 4,000 artisan shops inside the Grand Bazaar.",
        "meals": "Breakfast",
        "stay": "Istanbul"
      },
      {
        "day": 3,
        "title": "Flight to Denizli — Thermal Springs of Pamukkale",
        "description": "Fly from Istanbul to Denizli. Transfer to Pamukkale and check in to your thermal spa hotel. Spend a relaxing afternoon soaking in the rich mineral hot springs.",
        "meals": "Breakfast",
        "stay": "Pamukkale"
      },
      {
        "day": 4,
        "title": "Pamukkale White Travertine Terraces & Ancient Hierapolis — Drive to Antalya",
        "description": "Walk barefoot on the gleaming white calcium travertine terraces of the 'Cotton Castle' (Pamukkale). Explore the Greco-Roman ruins of Hierapolis, including the ancient amphitheatre, Necropolis, and Cleopatra's Antique Pool with submerged marble Roman columns, driving south to coastal Antalya.",
        "meals": "Breakfast",
        "stay": "Antalya"
      },
      {
        "day": 5,
        "title": "Antalya Mediterranean Old Town (Kaleiçi) & Roaring Düden Waterfalls",
        "description": "Walk through the Roman Hadrian's Gate into Kaleiçi Old Town, past Ottoman wooden mansions to the ancient Roman harbor. Visit the dramatic Lower Düden Waterfall plunging 40 metres off rocky Mediterranean sea cliffs.",
        "meals": "Breakfast",
        "stay": "Antalya"
      },
      {
        "day": 6,
        "title": "Flight to Mystical Cappadocia — Land of Fairy Chimneys",
        "description": "Fly from Antalya to Cappadocia (Kayseri/Nevşehir). Check into your unique cave-style hotel and enjoy an introductory sunset walk across Pigeon Valley with panoramic vistas of volcanic tuff pinnacles.",
        "meals": "Breakfast",
        "stay": "Cappadocia"
      },
      {
        "day": 7,
        "title": "Cappadocia Tour — Göreme Open Air Museum & Ozkonak Underground City",
        "description": "Optional sunrise Hot Air Balloon ride over surreal valleys. Tour the UNESCO Göreme Open Air Museum with rock-cut Byzantine cave churches and frescoes. Descend into the multi-level subterranean Ozkonak Underground City, visit the pottery town of Avanos, and view the Three Beauties rock formations in Ürgüp.",
        "meals": "Breakfast",
        "stay": "Cappadocia"
      },
      {
        "day": 8,
        "title": "Flight from Cappadocia to Istanbul & Departure",
        "description": "Fly from Cappadocia back to Istanbul Airport to connect with your international flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "7 nights' accommodation with breakfast (except day 1)",
      "All airport transfers mentioned in the itinerary",
      "All entrance fees mentioned in the itinerary",
      "Air-conditioned non-smoking coach transport",
      "Professional English-speaking tour guides",
      "Hotel room and city taxes"
    ],
    "exclusions": [
      "5% GST and 2% TCS",
      "International and domestic airfare and airport taxes",
      "Turkey visa charges and travel insurance",
      "Optional activities including the Pamukkale and Cappadocia hot air balloon rides",
      "Lunches, dinners and beverages unless specified",
      "Early check-in, late check-out, tips and porterage"
    ]
  },
  {
    "id": "south-african-delights",
    "title": "South African Delights",
    "image": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹1,42,999",
    "highlights": [
      "Table Mountain cable car",
      "Cape of Good Hope & Flying Dutchman Funicular",
      "Boulders Beach African penguins",
      "Sun City Resort & Gold Reef City"
    ],
    "category": "International",
    "tagline": "Cape Town's Mother City tour, the Cape Peninsula's penguins and Sun City's resort playground.",
    "overview": "Three nights in Cape Town for the Mother City tour, Table Mountain and a full-day Cape Peninsula drive to the Cape of Good Hope and Boulders Beach, then two nights at the Sun City Resort and a final day at Johannesburg's Gold Reef City.",
    "heroImage": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "October to April",
    "startingPoint": "Cape Town International Airport",
    "groupSize": "Min 2 pax for quoted rate",
    "themes": [
      "Wildlife",
      "City",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=85&w=1800",
        "caption": "South African landscapes"
      },
      {
        "image": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=85&w=1800",
        "caption": "Sunset over the bushveld"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Cape Town Arrival — V&A Waterfront Welcome",
        "description": "Arrive at Cape Town International Airport (CPT), meet your driver, and transfer to your hotel. Spend your afternoon exploring the bustling Victoria & Alfred (V&A) Waterfront, enjoying harbor views and seafood dining.",
        "meals": "—",
        "stay": "Cape Town"
      },
      {
        "day": 2,
        "title": "Cape Town Mother City Tour & Table Mountain Cable Car",
        "description": "Guided tour of Cape Town: see the Houses of Parliament, Castle of Good Hope, and the colourful pastel houses of Bo-Kaap (Malay Quarter). Ride the revolving Table Mountain Cable Car up to the flat-topped summit (3,500 ft) for 360-degree vistas across the Atlantic Ocean and Cape Town bowl.",
        "meals": "Breakfast",
        "stay": "Cape Town"
      },
      {
        "day": 3,
        "title": "Full-Day Cape Peninsula — Chapman's Peak, Cape Point & Boulders Beach Penguins",
        "description": "Drive along the Atlantic seaboard via Camps Bay and the breathtaking Chapman's Peak marine drive. Take the Flying Dutchman Funicular to the historic Cape Point Lighthouse in the Cape of Good Hope Nature Reserve. On the return drive, walk on wooden boardwalks at Boulders Beach to observe the famous wild African Penguin colony.",
        "meals": "Breakfast",
        "stay": "Cape Town"
      },
      {
        "day": 4,
        "title": "Cape Town to Johannesburg — Transfer to Sun City Resort",
        "description": "Fly to Johannesburg and transfer by luxury coach to the premier Sun City Resort complex in the North West Province. Check into your resort and enjoy the world-class Valley of Waves water park, artificial surf beach, and the Palace of the Lost City gardens.",
        "meals": "Breakfast",
        "stay": "Sun City"
      },
      {
        "day": 5,
        "title": "Sun City Resort Leisure & Optional Pilanesberg Big 5 Game Safari",
        "description": "Spend a full day enjoying Sun City's leisure activities, golf courses, and water sports. Optional open-top 4x4 Big Five Game Drive in the adjacent Pilanesberg National Park to track lions, leopards, elephants, rhinos, and cape buffaloes.",
        "meals": "Breakfast",
        "stay": "Sun City"
      },
      {
        "day": 6,
        "title": "Sun City to Johannesburg & Historic Gold Reef City Experience",
        "description": "Drive back to Johannesburg. Tour Gold Reef City, a living museum depicting the 1886 gold rush era: descend into an authentic underground gold mine shaft and watch a live liquid gold-pouring demonstration.",
        "meals": "Breakfast",
        "stay": "Johannesburg"
      },
      {
        "day": 7,
        "title": "Departure from Johannesburg",
        "description": "After breakfast, transfer to O.R. Tambo International Airport (JNB) for your flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "3-star accommodation with daily breakfast",
      "Private airport arrival, departure and intercity transfers",
      "All sightseeing and transfers as per the itinerary"
    ],
    "exclusions": [
      "International and domestic flights, including the Cape Town – Johannesburg sector",
      "Visa fees and travel insurance",
      "Lunches and dinners throughout the tour",
      "Optional Pilanesberg safari and game drives",
      "Hotel city tax, tips and gratuities",
      "Entrance fees not mentioned in the itinerary"
    ]
  },
  {
    "id": "japan-autumn-delights",
    "title": "Japan Autumn Delights",
    "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=85&w=1800",
    "duration": "9 Nights / 10 Days",
    "price": "₹2,84,999",
    "highlights": [
      "Tokyo Skytree & teamLab Planets",
      "Mount Fuji 5th Station & Panoramic Ropeway",
      "Kyoto's Golden Pavilion & Sagano Romantic Train",
      "Shinkansen ride & Hiroshima Peace Memorial"
    ],
    "category": "International",
    "tagline": "Tokyo to Osaka in autumn — Mount Fuji, Kyoto's temples, Himeji Castle and a bullet train run.",
    "overview": "A ten-day autumn journey down Japan from Tokyo through Mount Fuji, Nagoya, Nara, Kyoto, Kobe and Hiroshima to Osaka, mixing digital art and observation decks with Todaiji's Great Buddha, the Golden Pavilion, Himeji Castle and a Shinkansen ride.",
    "heroImage": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "November",
    "startingPoint": "Narita International Airport, Tokyo",
    "groupSize": "Group departure — 16 Nov 2026",
    "themes": [
      "Culture",
      "City",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=85&w=1800",
        "caption": "Historic streets of Kyoto"
      },
      {
        "image": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=85&w=1800",
        "caption": "Mount Fuji"
      },
      {
        "image": "https://images.unsplash.com/photo-1522547902298-51566e4fb383?auto=format&fit=crop&q=85&w=1800",
        "caption": "Sensō-ji, Tokyo"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Tokyo Narita Arrival — Welcome to Japan",
        "description": "Arrive at Tokyo Narita International Airport (NRT), meet your tour manager, and transfer by private coach to your Tokyo hotel. Settle in and enjoy an Indian dinner at a renowned local restaurant.",
        "meals": "Dinner",
        "stay": "Tokyo"
      },
      {
        "day": 2,
        "title": "Tokyo Full-Day Tour — Tokyo Skytree, Sensō-ji Temple & teamLab Planets",
        "description": "Ascend the Tokyo Skytree observation deck for sweeping views across Tokyo metropolis. Visit Asakusa's historic Sensō-ji Temple and browse Nakamise shopping street. Drive through the famous Shibuya Crossing and immerse your senses inside the digital art installations of teamLab Planets in Toyosu.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Tokyo"
      },
      {
        "day": 3,
        "title": "Mount Fuji 5th Station — Lake Kawaguchi Panoramic Ropeway & Mishima",
        "description": "Drive to Mount Fuji 5th Station at 7,500 feet (weather permitting) for close-up views of Japan's sacred volcano. Watch an interactive Sumo wrestling demonstration and ride the Mount Fuji Panoramic Ropeway over Lake Kawaguchi for autumn foliage views, proceeding to Mishima for dinner.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Mishima"
      },
      {
        "day": 4,
        "title": "Toyota Commemorative Museum & Nabana no Sato Illumination (Nagoya)",
        "description": "Visit the Toyota Commemorative Museum of Industry and Technology in Nagoya. In the evening, visit Nabana no Sato to witness Japan's largest and most spectacular botanical winter illumination light display with millions of glowing LED tunnels.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Nagoya"
      },
      {
        "day": 5,
        "title": "Kimono Experience — Nara Deer Park & Todaiji Temple to Osaka",
        "description": "Don traditional Japanese kimonos for photography. Visit Nara Park to feed the hundreds of sacred free-roaming sika deer, and enter Todaiji Temple to stand before the world's largest bronze Buddha statue (Daibutsu). Continue to Osaka and ascend the Floating Garden Observatory at the Umeda Sky Building.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Osaka"
      },
      {
        "day": 6,
        "title": "Kyoto Heritage Tour — Golden Pavilion, Arashiyama Bamboo Grove & Fushimi Inari",
        "description": "Explore the imperial treasures of Kyoto: ride the Sagano Romantic Scenic Train through the Hozugawa ravine, walk through the towering green Arashiyama Bamboo Grove, marvel at the gilded Kinkaku-ji (Golden Pavilion) reflecting on mirror ponds, and walk through thousands of vermilion torii gates at Fushimi Inari Taisha Shrine.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Osaka"
      },
      {
        "day": 7,
        "title": "Mount Rokko Cable Car (Kobe) & UNESCO Himeji Castle to Okayama",
        "description": "Ride the Mount Rokko cable car in Kobe for vistas over Osaka Bay. Tour the UNESCO-listed 17th-century Himeji Castle ('White Heron Castle'), Japan's finest surviving samurai fortress with labyrinthine gates and moats, proceeding to Okayama.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Okayama"
      },
      {
        "day": 8,
        "title": "Hiroshima Peace Memorial, Miyajima Island Floating Torii Gate & Shinkansen Bullet Train",
        "description": "Visit the Hiroshima Peace Memorial Park, Atomic Bomb Dome (Genbaku Dome), and Children's Peace Monument. Ferry across to sacred Miyajima Island to view the iconic floating red Torii gate of Itsukushima Shrine. Experience the high-speed Shinkansen Bullet Train at 300 km/h on your return to Okayama.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Okayama"
      },
      {
        "day": 9,
        "title": "Osaka Dotonbori Neon Walk, Kaiyukan Aquarium & Rinku Outlets",
        "description": "Explore Osaka's neon-lit Dotonbori and Shinsaibashi shopping quarters with the iconic Glico Running Man sign. Visit the world-class Osaka Kaiyukan Aquarium housing whale sharks, and shop at Rinku Premium Outlets before checking into your Kansai Airport hotel.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Kansai"
      },
      {
        "day": 10,
        "title": "Kansai Airport Departure",
        "description": "After breakfast, take the hotel shuttle to Kansai International Airport (KIX) for your return flight home, concluding an unforgettable journey through Japan.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "9 nights in 4-star hotels on twin/double sharing",
      "8 set lunches and 9 dinners — veg, non-veg and Jain menus",
      "Tour manager and English-speaking guide as per the itinerary",
      "Entrance tickets to all attractions marked as included",
      "2nd-class Shinkansen (bullet train) tickets as per the itinerary",
      "One baggage transfer (up to 23 kg) per adult/child",
      "Airport transfers and sightseeing by air-conditioned coach",
      "2 x 500ml bottled water per person on coach days"
    ],
    "exclusions": [
      "5% GST and 2% TCS",
      "International and domestic airfare",
      "Visa and travel insurance",
      "Driver and guide tips",
      "Hotel city tax, payable directly at the hotel",
      "Sightseeing and entrance fees not specified in the itinerary",
      "Early check-in, late check-out and personal expenses"
    ]
  },
  {
    "id": "scandinavia-northern-lights",
    "title": "Highlights of Scandinavia with Northern Lights",
    "image": "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=85&w=1800",
    "duration": "8 Nights / 9 Days",
    "price": "₹4,73,999",
    "highlights": [
      "Northern Lights hunt in Rovaniemi",
      "Oslo Fjord cruise & Holmenkollen Ski Jump",
      "Overnight Baltic cruise & Santa Claus Express",
      "Santa Claus Village & husky sled ride"
    ],
    "category": "International",
    "tagline": "Oslo, Stockholm, Helsinki and Tallinn, then the Arctic Circle for the Aurora and Santa Claus Village.",
    "overview": "Nordic capitals by coach, ferry and rail — an Oslo Fjord cruise, Stockholm's Gamla Stan, an overnight Baltic cruise to Helsinki, a day trip to medieval Tallinn, and the Santa Claus Express north to Rovaniemi for Ranua Wildlife Park, a Northern Lights excursion, Santa Claus Village and a husky sled ride.",
    "heroImage": "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "December to March",
    "startingPoint": "Oslo Airport",
    "groupSize": "Group departure — 07 Dec 2026",
    "themes": [
      "Northern Lights",
      "Winter",
      "Scenic"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=85&w=1800",
        "caption": "Aurora Borealis over Arctic forest"
      },
      {
        "image": "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&q=85&w=1800",
        "caption": "Northern Lights above a frozen lake"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Oslo Arrival — Welcome to the Viking Capital",
        "description": "Arrive at Oslo Gardermoen Airport (OSL). Meet your Bandhan tour manager and transfer to your hotel. Attend an evening tour briefing and welcome Scandinavian/Indian dinner.",
        "meals": "Dinner",
        "stay": "Oslo"
      },
      {
        "day": 2,
        "title": "Oslo Fjord Sightseeing Cruise & Holmenkollen Olympic Ski Jump",
        "description": "Board a scenic sightseeing boat cruising past narrow sounds and picturesque summer houses in the Oslo Fjord. In the afternoon, visit the legendary Holmenkollen Ski Jump for panoramic views of the city and fjord, exploring the world's oldest Ski Museum.",
        "meals": "Breakfast, Dinner",
        "stay": "Oslo"
      },
      {
        "day": 3,
        "title": "Oslo Guided City Tour — Cross Country Drive to Stockholm (Sweden)",
        "description": "City tour of Oslo: view the Royal Palace, Parliament, City Hall (Nobel Peace Prize venue), and the unique Vigeland Sculpture Park with over 200 granite statues. Drive through Swedish pine forests and lake districts to Stockholm.",
        "meals": "Breakfast, Dinner",
        "stay": "Stockholm"
      },
      {
        "day": 4,
        "title": "Stockholm Gamla Stan Old Town & Overnight Luxury Baltic Sea Cruise",
        "description": "Tour Stockholm: wander through the medieval cobblestone lanes of Gamla Stan (Old Town), view the Royal Palace and Stockholm Cathedral, and look out over the archipelago from Fjällgatan viewpoint. In the evening, board a luxury cruise ship with dining and entertainment to sail overnight across the Baltic Sea to Finland.",
        "meals": "Breakfast, Dinner",
        "stay": "Onboard the Baltic cruise"
      },
      {
        "day": 5,
        "title": "Helsinki City Tour & Medieval Riverside Town of Porvoo",
        "description": "Disembark in Helsinki, Finland. Tour Senate Square, Helsinki Cathedral, the rock-carved Temppeliaukio Church, and the Sibelius Monument. In the afternoon, drive to the 800-year-old medieval town of Porvoo to walk among red ochre riverside wooden storehouses.",
        "meals": "Breakfast, Dinner",
        "stay": "Helsinki"
      },
      {
        "day": 6,
        "title": "Tallinn (Estonia) Day Trip & Overnight Santa Claus Express Train",
        "description": "Take a high-speed ferry across the Gulf of Finland to medieval Tallinn (Estonia) to explore its UNESCO Old Town, Toompea Castle, and Alexander Nevsky Cathedral. Return to Helsinki to board the famous overnight double-decker Santa Claus Express train bound for Finnish Lapland.",
        "meals": "Breakfast, Dinner",
        "stay": "Onboard the Santa Claus Express"
      },
      {
        "day": 7,
        "title": "Rovaniemi Arrival — Ranua Arctic Wildlife Park & Aurora Borealis Hunt",
        "description": "Arrive in Rovaniemi in the Arctic Circle. Walk through the snowy forest paths of Ranua Wildlife Park to see polar bears, snowy owls, arctic foxes, and lynx. In the evening, head out into the dark wilderness on an Aurora Borealis Northern Lights expedition.",
        "meals": "Breakfast, Dinner",
        "stay": "Rovaniemi"
      },
      {
        "day": 8,
        "title": "Official Santa Claus Village, Arctic Circle Line & Husky Sled Safari",
        "description": "Step across the painted Arctic Circle line at the official Santa Claus Village in Rovaniemi. Meet Santa Claus in his office, send postcards with the Arctic Circle postmark from Santa's Post Office, and take an exhilarating Siberian Husky sled ride through snow-blanketed pine forests, followed by a celebratory farewell dinner.",
        "meals": "Breakfast, Dinner",
        "stay": "Rovaniemi"
      },
      {
        "day": 9,
        "title": "Departure from Rovaniemi (Lapland)",
        "description": "Breakfast at the hotel before your transfer to Rovaniemi Airport for your onward return flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "Return international flights into Oslo and out of Rovaniemi, with 23 kg check-in baggage",
      "4-star hotels and meals as per the itinerary",
      "Group tour with a tour manager, all driver tips included",
      "All sightseeing and entrance fees as per the itinerary",
      "Luxury air-conditioned coach, overnight Baltic ferry and Santa Claus Express train"
    ],
    "exclusions": [
      "Domestic airfare",
      "Visa fees and travel insurance",
      "Hotel city tax, tips and gratuities",
      "Personal expenses, shopping and laundry",
      "Any service not explicitly listed under inclusions"
    ]
  },
  {
    "id": "best-of-georgia",
    "title": "Best of Georgia",
    "image": "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹64,999",
    "highlights": [
      "Narikala Fortress cable car, Tbilisi",
      "Jvari Monastery & Svetitskhoveli Cathedral",
      "Prometheus Cave & Martvili Canyon",
      "Ananuri, Gudauri & Kazbegi drive"
    ],
    "category": "International",
    "tagline": "Tbilisi's old town, Batumi's Black Sea waterfront and the Caucasus road to Kazbegi.",
    "overview": "Four nights in Tbilisi and two in Batumi covering the Holy Trinity Cathedral and Narikala Fortress, the ancient capital of Mtskheta, the Black Sea boulevard and Ali & Nino statue, Prometheus Cave and Martvili Canyon, and a Georgian Military Highway drive to Gudauri and Kazbegi.",
    "heroImage": "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Tbilisi International Airport",
    "groupSize": "Min 2 pax for quoted rate",
    "themes": [
      "Heritage",
      "Mountains",
      "Culture"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=85&w=1800",
        "caption": "Tbilisi at sunset"
      },
      {
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1800",
        "caption": "The Greater Caucasus range"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Tbilisi Arrival — Panoramic Mtatsminda Funicular Ride",
        "description": "Arrive at Shota Rustaveli Tbilisi International Airport (TBS). Meet your guide and transfer to your hotel. In the evening, take the historic funicular railway up to Mtatsminda Park for sweeping panoramic sunset views over the illuminated Georgian capital.",
        "meals": "—",
        "stay": "Tbilisi"
      },
      {
        "day": 2,
        "title": "Tbilisi Old Town Tour — Narikala Cable Car, Bridge of Peace & Sulfur Baths",
        "description": "Tour the Holy Trinity Cathedral (Sameba), walk across the glass Bridge of Peace in Rike Park, and take the aerial cable car up to the 4th-century Narikala Fortress. Walk down through the historic Abanotubani sulfur bath district and explore the quirky leaning clock tower of puppet master Rezo Gabriadze.",
        "meals": "Breakfast",
        "stay": "Tbilisi"
      },
      {
        "day": 3,
        "title": "Ancient Mtskheta UNESCO Capital — Drive to Coastal Batumi (Black Sea)",
        "description": "Visit the ancient capital of Mtskheta: stand at the 6th-century Jvari Monastery perched high above the confluence of the Aragvi and Mtkvari rivers, and visit the 11th-century Svetitskhoveli Cathedral. Drive west through the Surami mountain pass to the Black Sea resort city of Batumi.",
        "meals": "Breakfast",
        "stay": "Batumi"
      },
      {
        "day": 4,
        "title": "Batumi City Tour — Miracle Park, Ali & Nino Moving Statue & Boulevard",
        "description": "Explore Batumi: stroll through Italian-inspired Piazza Square, walk the 7-km Batumi Boulevard palm promenade, and view the 8-metre mechanical metal kinetic sculpture of Ali and Nino merging together. Visit the Batumi Botanical Garden on the Green Cape cliff before evening leisure on the beach.",
        "meals": "Breakfast",
        "stay": "Batumi"
      },
      {
        "day": 5,
        "title": "Prometheus Underground Cave & Martvili Canyon Emerald Boat Ride — Return to Tbilisi",
        "description": "Explore the illuminated stalactite and stalagmite halls of Prometheus Cave. Drive to Martvili Canyon to take an inflatable boat ride down emerald waters between sheer moss-covered limestone canyon walls and waterfalls, returning to Tbilisi for overnight stay.",
        "meals": "Breakfast",
        "stay": "Tbilisi"
      },
      {
        "day": 6,
        "title": "Georgian Military Highway — Ananuri Fortress, Gudauri & Kazbegi 4x4 Mountain Drive",
        "description": "Drive the dramatic Georgian Military Highway along the Zhinvali Reservoir to the 17th-century Ananuri Fortress. Pass through the mountain ski resort of Gudauri and the Russia-Georgia Friendship Monument over Jvari Pass. In Stepantsminda (Kazbegi), board 4x4 vehicles climbing to the 14th-century Gergeti Trinity Church situated at 7,120 feet beneath the soaring snow peak of Mount Kazbek (16,558 ft).",
        "meals": "Breakfast",
        "stay": "Tbilisi"
      },
      {
        "day": 7,
        "title": "Departure from Tbilisi",
        "description": "After breakfast, explore the dry bridge flea market for Georgian enamel art and souvenirs before transferring to Tbilisi International Airport for your departure flight.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "4 nights in Tbilisi and 2 nights in Batumi with breakfast",
      "All sightseeing and transfers as per the itinerary, including airport transfers",
      "English-speaking driver-cum-guide",
      "Entrance fees: Tbilisi cable car, funicular, Batumi Botanical Garden, 4x4 to Gergeti, Martvili Canyon, Prometheus Cave",
      "2 bottles of water per person per day"
    ],
    "exclusions": [
      "Any airfare",
      "5% GST and 2% TCS",
      "Pre and post-tour hotel accommodation",
      "Meals other than breakfast",
      "Tips, porterage and personal expenses",
      "Costs arising from flight delays, cancellations or weather"
    ]
  },
  {
    "id": "best-of-europe-2027",
    "title": "Best of Europe",
    "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1800",
    "duration": "10 Nights / 11 Days",
    "price": "₹2,99,376",
    "highlights": [
      "Eiffel Tower 3rd level & Disneyland Paris",
      "Jungfraujoch and Mount Titlis",
      "Venice gondola ride & Leaning Tower of Pisa",
      "Vatican City, Colosseum & Trevi Fountain"
    ],
    "category": "International",
    "tagline": "Paris, Switzerland, Liechtenstein, Austria and Italy across one grand eleven-day coach tour.",
    "overview": "A five-country grand tour from Paris's Eiffel Tower and Disneyland through Geneva, Jungfraujoch and Mount Titlis, on via Rhine Falls, Vaduz and Innsbruck to Venice's canals, Florence and Pisa, ending with Vatican City, the Colosseum and the Trevi Fountain in Rome.",
    "heroImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "March to October",
    "startingPoint": "Paris CDG Airport",
    "groupSize": "Group departures — 8, 16 & 27 March 2027",
    "themes": [
      "City",
      "Mountains",
      "Heritage"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1800",
        "caption": "The Eiffel Tower, Paris"
      },
      {
        "image": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=85&w=1800",
        "caption": "Venice's Grand Canal"
      },
      {
        "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=85&w=1800",
        "caption": "St. Peter's Square, Vatican City"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Paris Arrival — City of Light Welcome",
        "description": "Arrive at Paris Charles de Gaulle Airport (CDG). Meet your Bandhan Tour Manager and transfer by luxury coach to your hotel. Settle in and enjoy a welcome Indian dinner.",
        "meals": "Dinner",
        "stay": "Paris"
      },
      {
        "day": 2,
        "title": "Paris City Tour — Eiffel Tower 3rd Level, Versailles Palace & Seine Cruise",
        "description": "Guided tour of Paris: drive down the Champs-Élysées, view the Arc de Triomphe and Opéra Garnier. Ascend to the 3rd Level of the Eiffel Tower, tour the Hall of Mirrors at the Royal Palace of Versailles, and take a romantic Seine River Cruise, concluding with an illuminated Paris by Night coach drive.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 3,
        "title": "Disneyland Paris Full-Day Adventure",
        "description": "Full day of excitement at Disneyland Paris with access to Disneyland Park or Walt Disney Studios Park, including packed Indian lunch and the evening fireworks show.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Paris"
      },
      {
        "day": 4,
        "title": "Paris to Geneva (Switzerland) — Lake Geneva & UN Headquarters",
        "description": "Drive into Switzerland to Geneva. View the Jet d'Eau, the United Nations Office, and the Flower Clock beside Lake Geneva before checking into your hotel.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Geneva"
      },
      {
        "day": 5,
        "title": "Jungfraujoch (Top of Europe 11,333 ft) & Scenic Interlaken",
        "description": "Ride the Eiger Express gondola and cogwheel train up to Jungfraujoch (11,333 ft). Walk through the Ice Palace, step onto the Aletsch Glacier plateau, and visit Interlaken.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 6,
        "title": "Mount Titlis Revolving Rotair, Cliff Walk & Lake Lucerne Cruise",
        "description": "Ascend to 10,000 feet on the Titlis Rotair revolving cable car, cross the Cliff Walk suspension bridge, and explore Lucerne's Chapel Bridge and Lion Monument, ending with a Lake Lucerne cruise.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Central Switzerland"
      },
      {
        "day": 7,
        "title": "Rhine Falls — Liechtenstein (Vaduz) — Swarovski Worlds — Innsbruck",
        "description": "Take a boat ride at Rhine Falls, ride the Vaduz mini-train in Liechtenstein, visit Swarovski Crystal Worlds in Wattens, and view Innsbruck's Golden Roof.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Innsbruck / Seefeld"
      },
      {
        "day": 8,
        "title": "Innsbruck to Venice — Private Boat, St. Mark's & Romantic Gondola Ride",
        "description": "Private boat into St. Mark's Square in Venice: view St. Mark's Basilica, Doge's Palace, and take a gondola ride through historic canals.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Padova / Ferrara"
      },
      {
        "day": 9,
        "title": "Florence Renaissance Walking Tour & Leaning Tower of Pisa",
        "description": "Tour Florence: see the Duomo, Ponte Vecchio, and Piazza della Signoria, then drive to Pisa to pose with the Leaning Tower in the Square of Miracles.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Tuscany region"
      },
      {
        "day": 10,
        "title": "Rome — Vatican St. Peter's Basilica, Colosseum & Trevi Fountain",
        "description": "Visit St. Peter's Basilica in Vatican City, view the monumental Colosseum, Roman Forum, and toss a coin into the baroque Trevi Fountain.",
        "meals": "Breakfast, Lunch, Dinner",
        "stay": "Rome"
      },
      {
        "day": 11,
        "title": "Departure from Rome — Flight Home",
        "description": "Breakfast at the hotel, then transfer to Rome Fiumicino Airport for your departure flight.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "4-star hotels with daily continental buffet breakfast",
      "Sightseeing and attraction tickets as listed in the highlights",
      "9 Indian Jain/vegetarian/non-vegetarian lunches and 10 dinners",
      "Packed lunch on the Disneyland Paris and Geneva travel days",
      "Guide tips and coach driver tips for the duration of the tour",
      "Daily 500ml mineral water bottle per person"
    ],
    "exclusions": [
      "5% GST and 2% TCS",
      "International and domestic airfare and airport taxes",
      "Visa, passport and POE charges, travel insurance",
      "Excursions, entrance fees and local guides not listed under inclusions",
      "Pre and post-tour accommodation, porterage and city tax",
      "Expenses arising from flight delays, cancellations or weather"
    ]
  },
  {
    "id": "azerbaijan-highlights",
    "title": "Azerbaijan Highlights",
    "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹51,999",
    "highlights": [
      "Icherisheher Old City & Maiden Tower",
      "Gobustan National Park petroglyphs",
      "Tufandag & Shahdag mountain cable cars",
      "Ateshgah Fire Temple & Yanardag"
    ],
    "category": "International",
    "tagline": "Baku's Flame Towers and Old City, Gobustan's rock art and the Caucasus resorts of Gabala and Shahdag.",
    "overview": "Five nights in Baku and one in Gabala covering the UNESCO-listed Icherisheher Old City, the Heydar Aliyev Center, Gobustan's prehistoric petroglyphs, the eternal flames of Ateshgah and Yanardag, and cable car rides at the Tufandag and Shahdag mountain resorts.",
    "heroImage": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "April to October",
    "startingPoint": "Heydar Aliyev International Airport, Baku",
    "groupSize": "Min 2 pax for quoted rate",
    "themes": [
      "City",
      "Mountains",
      "Heritage"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=85&w=1800",
        "caption": "Baku's Caspian waterfront"
      },
      {
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1800",
        "caption": "The Greater Caucasus above Gabala"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Baku Arrival — Highland Park & Flame Towers Panoramic Tour",
        "description": "Arrive at Heydar Aliyev International Airport (GYD) in Baku. Meet your guide and transfer to your hotel. In the evening, visit Highland Park for breathtaking panoramic views of Baku Bay, the Caspian Sea, and the illuminated 33-storey Flame Towers displaying animated fire effects.",
        "meals": "—",
        "stay": "Baku"
      },
      {
        "day": 2,
        "title": "Historic Icherisheher (Old City), Maiden Tower & Heydar Aliyev Center",
        "description": "Guided walking tour of the UNESCO-listed Icherisheher (Old City): climb the 12th-century Maiden Tower, visit the Palace of the Shirvanshahs, and wander past ancient caravanserais. Admire the futuristic architecture of Zaha Hadid's Heydar Aliyev Center and take a scenic walk along Baku Seaside Boulevard.",
        "meals": "Breakfast",
        "stay": "Baku"
      },
      {
        "day": 3,
        "title": "Baku to Gabala — Tufandag Mountain Cable Car & Nohur Lake",
        "description": "Drive into the forested Greater Caucasus Mountains to Gabala (220 km / 3.5 hrs). Ride the two-tier Tufandag Mountain Resort cable car soaring over mountain valleys, and relax beside the peaceful forested waters of Nohur Lake with optional pedalo boating.",
        "meals": "Breakfast",
        "stay": "Gabala"
      },
      {
        "day": 4,
        "title": "Gobustan Prehistoric Rock Art, Mud Volcanoes & Deniz Mall",
        "description": "Drive to Gobustan National Park to explore over 6,000 prehistoric petroglyphs and 3D interactive museum exhibits. Board 4x4 Lada taxis to witness active bubbling Mud Volcanoes erupting cool mineral mud, returning to Baku for shopping at the lotus-inspired Deniz Mall.",
        "meals": "Breakfast",
        "stay": "Baku"
      },
      {
        "day": 5,
        "title": "Absheron Peninsula Fire Tour — Ateshgah Fire Temple & Burning Mountain (Yanar Dag)",
        "description": "Explore the historic Zoroastrian Ateshgah Fire Temple in Surakhani, where natural subterranean gas flames have burned for centuries. Visit Yanar Dag (Burning Mountain), a natural 10-metre hillside continuously blazing with eternal natural gas fire, followed by shopping at Ganjlik Mall.",
        "meals": "Breakfast",
        "stay": "Baku"
      },
      {
        "day": 6,
        "title": "Shahdag Mountain Alpine Resort Full-Day Excursion",
        "description": "Travel to Shahdag Mountain Resort in the northern Caucasus Mountains. Ride the high-altitude panoramic cable car, walk across alpine meadows, or participate in seasonal activities like mountain coasters, quad biking, or snow sports before returning to Baku.",
        "meals": "Breakfast",
        "stay": "Baku"
      },
      {
        "day": 7,
        "title": "Departure from Baku",
        "description": "After breakfast, explore the Nizami pedestrian street for local baklava and caviar before transferring to Heydar Aliyev Airport for your flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "5 nights in Baku and 1 night in Gabala with daily breakfast",
      "Sightseeing across Baku, Absheron, Gobustan, Gabala and Shahdag",
      "Entrance fees: Fire Temple, Yanardag, Gobustan Museum, Gabala cable car (2 lines), Shahdag cable car (1 line)",
      "Private air-conditioned vehicle for all point-to-point transfers and sightseeing",
      "English-speaking driver/guide, parking, tolls, fuel and local taxes",
      "2 bottles of water per person per day"
    ],
    "exclusions": [
      "5% GST and 2% TCS",
      "International and domestic airfare",
      "Azerbaijan visa charges and travel insurance",
      "Lunches, dinners and beverages unless specified",
      "Optional activities and adventure sports at Shahdag",
      "Additional cable car rides not listed under inclusions",
      "Early check-in, late check-out, tips and porterage"
    ]
  },
  {
    "id": "almaty-bliss",
    "title": "Almaty Bliss",
    "image": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=85&w=1800",
    "duration": "6 Nights / 7 Days",
    "price": "₹74,999",
    "highlights": [
      "Kok-Tobe cable car ride",
      "Medeu & Shymbulak mountain resort",
      "Charyn Canyon's Valley of Castles",
      "Kolsai Lakes & eagle hunting show"
    ],
    "category": "International",
    "tagline": "Kazakhstan's mountain city — cable cars, canyons, alpine lakes and Green Bazaar shopping.",
    "overview": "Six nights based in Almaty beneath the Zailiyskiy Alatau, combining Kok-Tobe and Shymbulak cable cars, the Golden Square city tour, a traditional eagle hunting show, the Oi-Qaragai mountain resort, and a full-day excursion to Charyn Canyon and the Kolsai Lakes.",
    "heroImage": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=90&w=3200",
    "bestTime": "May to October",
    "startingPoint": "Almaty International Airport",
    "groupSize": "Min 2 pax for quoted rate",
    "themes": [
      "Mountains",
      "Adventure",
      "City"
    ],
    "gallery": [
      {
        "image": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=85&w=1800",
        "caption": "Alpine lakes of the Tien Shan"
      },
      {
        "image": "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=85&w=1800",
        "caption": "Shymbulak's snow-covered slopes"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Almaty Arrival — Kok-Tobe Hill Panoramic Cable Car Ride",
        "description": "Arrive at Almaty International Airport (ALA), meet your guide, and transfer to your hotel. In the afternoon, ride the cable car up to Kok-Tobe Hill (3,600 ft) for sweeping panoramic views of the Almaty skyline against the towering Tian Shan mountains, visiting the Beatles Bronze Monument and the mini-zoo.",
        "meals": "—",
        "stay": "Almaty"
      },
      {
        "day": 2,
        "title": "Almaty Golden Square City Tour & Medeu – Shymbulak Ski Resort (10,500 ft)",
        "description": "Tour Almaty's historical center: stroll through Panfilov Park to see the 1907 Ascension Cathedral (Zenkov Cathedral, built entirely of wood without metal nails) and the Glory Memorial. Visit the Medeu High-Altitude Ice Skating Rink (5,550 ft) and ride three connecting cable car gondolas up to Shymbulak Ski Resort and Talgar Pass at 10,500 feet for snow and glacier panoramas.",
        "meals": "Breakfast",
        "stay": "Almaty"
      },
      {
        "day": 3,
        "title": "Forested Alma-Arasan Gorge & Kazakh Nomadic Eagle Hunting Show",
        "description": "Drive into the scenic Alma-Arasan Gorge in the Ile-Alatau National Park. Visit the Sunkar Falcon & Bird of Prey Sanctuary to witness a traditional Kazakh eagle-hunting demonstration showcasing the ancient nomadic art of hunting with Golden Eagles and falcons, followed by leisure time at Dostyk Plaza.",
        "meals": "Breakfast",
        "stay": "Almaty"
      },
      {
        "day": 4,
        "title": "Cultural Shopping — Green Bazaar, Famous Rakhat Chocolate Factory & Mega Center",
        "description": "Immerse in local culture at the vibrant Green Bazaar (Zelyony Bazar), sampling Kazakh dried fruits, honey, spices, and horse cheese. Visit the brand shop of the historic Rakhat Chocolate Factory to stock up on world-famous confectionery, followed by shopping at the MEGA Center on Rozybakiyev.",
        "meals": "Breakfast",
        "stay": "Almaty"
      },
      {
        "day": 5,
        "title": "Oi-Qaragai Mountain Alpine Resort & Forest Adventures",
        "description": "Spend a refreshing day at Oi-Qaragai (Lesnaya Skazka) eco-resort nestled in pine-covered mountain foothills. Enjoy scenic forest nature trails, mountain air, and optional activities like tree-top rope parks, mountain karting, and horseback riding through alpine meadows.",
        "meals": "Breakfast",
        "stay": "Almaty"
      },
      {
        "day": 6,
        "title": "Full-Day Charyn Canyon (Valley of Castles) & Turquoise Kolsai Lakes Expedition",
        "description": "Embark on an expedition to Charyn Canyon, often called the 'Grand Canyon of Central Asia'. Hike down the dramatic red sandstone 'Valley of Castles' carved over 12 million years by the Charyn River. Continue to the emerald mountain waters of Kolsai Lakes, the 'Pearls of the Northern Tien Shan', surrounded by coniferous forests and snowy peaks.",
        "meals": "Breakfast",
        "stay": "Almaty"
      },
      {
        "day": 7,
        "title": "Departure from Almaty",
        "description": "Enjoy breakfast and free time for last-minute shopping at Arbat pedestrian street before your transfer to Almaty International Airport for your flight home.",
        "meals": "Breakfast",
        "stay": "—"
      }
    ],
    "inclusions": [
      "6 nights' accommodation with breakfast (except day 1)",
      "Sightseeing across Almaty city, Kok-Tobe, Medeu, Shymbulak, Alma-Arasan and Oi-Qaragai",
      "Full-day excursion to Charyn Canyon and Kolsai Lakes",
      "Shymbulak cable car (3 lines) and Kok-Tobe cable car return",
      "English-speaking guide or driver-guide",
      "All transfers including airport transfers by coach",
      "2 bottles of water (0.5L) per person per day"
    ],
    "exclusions": [
      "International and domestic airfare and airport taxes",
      "5% GST and 2% TCS",
      "Visa charges and travel insurance",
      "Lunches and dinners unless specified",
      "Optional activities, hard drinks and beverages",
      "Early check-in, late check-out and porterage"
    ]
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
