export interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  tour: string;
  destination: string;
  category: "Family" | "Honeymoon" | "Group" | "Friends" | "Corporate" | "Solo";
  rating: number;
  review: string;
  shortReview?: string;
  profileImage: string;
  tripImages: string[];
  travelMonth: string;
  isVerified: boolean;
  tourManager?: string;
  language?: "English" | "Marathi" | "Hindi";
}

export interface TrustStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: "users" | "award" | "calendar" | "map" | "smile";
  description: string;
}

export const trustStats: TrustStat[] = [
  {
    id: "happy-travellers",
    label: "Happy Travellers",
    value: 15,
    suffix: "K+",
    icon: "users",
    description: "Delighted guests across India & abroad",
  },
  {
    id: "tours-completed",
    label: "Tours Completed",
    value: 1250,
    suffix: "+",
    icon: "award",
    description: "Seamlessly executed luxury & group trips",
  },
  {
    id: "years-experience",
    label: "Years of Experience",
    value: 14,
    suffix: "+",
    icon: "calendar",
    description: "Crafting memorable journeys since 2012",
  },
  {
    id: "destinations-covered",
    label: "Destinations Covered",
    value: 65,
    suffix: "+",
    icon: "map",
    description: "Exotic domestic & international locations",
  },
  {
    id: "satisfaction-rate",
    label: "Customer Satisfaction",
    value: 99.4,
    suffix: "%",
    icon: "smile",
    description: "Based on post-tour guest reviews",
  },
];

export const testimonialData: TestimonialItem[] = [
  {
    id: "rev-1",
    name: "Vilas Pakale Jain",
    city: "Pune",
    tour: "Yeh Kashmir Hai - Group Tour",
    destination: "Kashmir",
    category: "Group",
    rating: 5,
    review:
      "Kashmir Tour with Bandhan Tours. We, a group of three couples, recently returned from a truly unforgettable Kashmir tour organized by Bandhan Tours, and we are overall satisfied with the experience. Much of the credit goes to the thoughtful planning and smooth execution by the Bandhan Tours team. Our sincere gratitude goes to Mr. Subhodh Bhise, our Tour Manager, who was a constant pillar of support throughout the journey. Thanks to Ms. Kalyani for behind-the-scenes dedication. Breathtaking beauty of Kashmir including Gulmarg, Pahalgam, Sonmarg, Doodhpatri, and Dal Lake. Houseboat stay was charming!",
    shortReview:
      "Unforgettable Kashmir tour organized by Bandhan Tours! Much credit goes to Tour Manager Mr. Subhodh Bhise & Ms. Kalyani. Gulmarg, Pahalgam & Dal Lake houseboat were superb.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Apr, 2025",
    isVerified: true,
    tourManager: "Subodh Bhise & Kalyani",
    language: "English",
  },
  {
    id: "rev-2",
    name: "Hadas Sir & Sau. Hadas",
    city: "Pune",
    tour: "Yeh Kashmir Hai Special Tour",
    destination: "Kashmir",
    category: "Family",
    rating: 5,
    review:
      "ये कश्मीर है - ३१.३.२५ च्या रात्री पुणे येथून प्रयाण केले व मुंबई येथून अकासा एअरने श्रीनगर ला पोहोचलो. पहिल्या दिवशी शंकराचार्य मंदिर दर्शन, दल सरोवर, SPS म्युझियम पाहिले. दुसऱ्या दिवशी सोनमर्ग, झीरो माईल पूल, बालताल लेह बोगदा बघितला. तिसऱ्या दिवशी द्रुंग वॉटर फॉल व गुलमर्ग. ४ थ्या व ५ व्या दिवशी पहेलगाम मधील बैसरन, अराू, बेताब व चंदन व्हॅली बघितली. ६ व्या दिवशी टुलिप गार्डन ला २ तास भेट दिली - निरनिराळ्या टुलिप फुलांच्या प्रजाती अतिशय सुंदर रीतीने मांडणी केलेल्या होत्या. ४ स्टार हाऊस बोट व शिकारा राइड अतिशय उत्तम होती. बंधन टूर्स पुणे, ठाणे ने उत्तम सोई सुविधा दिल्या. टूर मॅनेजर सुबोध भिसे यांनी पूर्ण सहल चांगल्या प्रकारे हाताळली. 🙏",
    shortReview:
      "काश्मीर ट्रीप मध्ये सोनमर्ग, पहलगाम, टुलिप गार्डन आणि आलिशान ४ स्टार हाऊस बोट चा अप्रतिम अनुभव! बंधन टूर्स च्या सोयी सुविधा व टूर मॅनेजर सुबोध भिसे यांचे सुंदर नियोजन.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Apr, 2025",
    isVerified: true,
    tourManager: "Subodh Bhise",
    language: "Marathi",
  },
  {
    id: "rev-3",
    name: "Alka Mane & Friends",
    city: "Mumbai",
    tour: "Karnataka Heritage Tour (Hampi & Badami)",
    destination: "Karnataka",
    category: "Friends",
    rating: 5,
    review:
      "बंधन टूर्स, खूप वर्षापासून हंपी व बदामी पाहण्याची इच्छा होती परंतु योग येण्यासाठी २०२५ साल उजाडले. आम्ही चार मैत्रिणींनी बंधन टूर्सच्या ७ ते १४ ऑक्टोबर या कालावधीतील कर्नाटक सहलीचा भरपूर धमाल करत आनंद लुटला. आमचे टूर गाईड प्रविण जाधव आम्हा ज्येष्ठ नागरिकांची आमच्या मुलांप्रमाणे काळजी घेत होते. हंपी व बदामी येथे लोकल गाईडने ऐतिहासिक ठेव्याची इत्यंभूत माहिती दिली. ड्रायव्हर मल्लिकार्जुन यांनी प्रवास सुखकर केला. टूर कॉर्डिनेटर पूजा वेळोवेळी दूरध्वनीद्वारे संपर्कात होती. बंधन टूर्सना हार्दिक शुभेच्छा! 🌹",
    shortReview:
      "हंपी व बदामी कर्नाटक सहलीचा भरपूर धमाल करत आनंद लुटला! टूर गाईड प्रविण जाधव यांनी आम्हा ज्येष्ठ नागरिकांची मुलांप्रमाणे काळजी घेतली. धन्यवाद बंधन टूर्स!",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Oct, 2025",
    isVerified: true,
    tourManager: "Pravin Jadhav & Pooja",
    language: "Marathi",
  },
  {
    id: "rev-4",
    name: "Sandesh Vanmali & Family",
    city: "Vasai",
    tour: "Andaman & Nicobar Islands Explorer (7D/6N)",
    destination: "Andaman",
    category: "Family",
    rating: 5,
    review:
      "संपूर्ण सात दिवस सहा रात्र अंदमान निकोबार टूर बंधन टूर्स पुणे - दि. २१.११.२०२५ ला पोर्ट ब्लेअर मध्ये आल्यानंतर को-ऑर्डिनेटर श्री. अनोस यांनी पोर्ट ब्लेअर हॉटेल मध्ये राहण्याची पूर्ण सोय केली. सेल्युलर जेल भेट व गाईड ची माहिती उत्कृष्ट होती. टूर मधील सीनियर सिटीजन ची श्री. अनोस यांनी व्हील चेअर व्यवस्था करून काळजी घेतली. दोन्ही बेटांवर राहण्याची व जेवणाची व्यवस्था अतिशय सुंदर केली होती. साऊंड शो रद्द झाल्यावर पूजा मॅडम यांनी विनंतीचा मान राखून परत पाहण्याची संधी मिळवून दिली. खूप खूप आभार बंधन टूर्स पुणे!",
    shortReview:
      "पोर्ट ब्लेअर सेल्युलर जेल, हॅव्हलॉक बेट आणि सुंदर समुद्र किनारे! पूजा मॅडम आणि अनोस यांनी सीनियर सिटीझन्स ची अप्रतिम सोय केली. खूप छान अंदमान टूर!",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Nov, 2025",
    isVerified: true,
    tourManager: "Anos & Pooja",
    language: "Marathi",
  },
  {
    id: "rev-5",
    name: "Sagar Pawar",
    city: "Navi Mumbai",
    tour: "Soulful South India Pilgrimage & Heritage",
    destination: "Tamil Nadu",
    category: "Family",
    rating: 5,
    review:
      "Just returned from a wonderful trip covering Kanyakumari, Rameshwaram, Madurai, Dhanushkodi, and Pondicherry, beautifully organized by Bandhan Tours — and it was an experience we'll cherish forever! From witnessing the breathtaking sunrise at Kanyakumari, to feeling divine energy at Rameshwaram and Meenakshi Temple, exploring Dhanushkodi, and ending with colorful Pondicherry — every moment was magical. Perfect blend of spirituality and beauty!",
    shortReview:
      "Kanyakumari, Rameshwaram, Madurai & Pondicherry! Perfect blend of spirituality, history and beauty seamlessly arranged by Bandhan Tours.",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1400",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Dec, 2025",
    isVerified: true,
    tourManager: "Pooja & Local Guides",
    language: "English",
  },
  {
    id: "rev-6",
    name: "36 Family Members Group",
    city: "Maharashtra",
    tour: "Grand Domestic Family Getaway",
    destination: "North India",
    category: "Group",
    rating: 5,
    review:
      "बंधन टूर्स मधी आम्ही ३६ फॅमिली मेंबर्स गेलो होतो. ५ मार्च ते १२ मार्च अशी टुर झाली ह्या टूर चे अतिशय सुंदर नियोजन करण्यात आले, चांगल्या प्रतीचे जेवण उत्तम क्वालिटी चे हॉटेल व्यवस्था व चांगली प्रवास यंत्रणा होती. सर्वांना खूप आनंद झाला. पुन्हा आपल्याच बंधन टूर ने ट्रीप करू. धन्यवाद!",
    shortReview:
      "बंधन टूर्स सोबत ३६ फॅमिली मेंबर्स चा भव्य ग्रुप! अतिशय सुंदर नियोजन, उत्तम हॉटेल व्यवस्था व जेवण. पुन्हा बंधन टूर्स सोबतच ट्रीप करणार!",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Mar, 2025",
    isVerified: true,
    tourManager: "Bandhan Operations Team",
    language: "Marathi",
  },
  {
    id: "rev-7",
    name: "Sunil Jawale",
    city: "Nashik",
    tour: "Kashmir Spring Experience",
    destination: "Kashmir",
    category: "Family",
    rating: 5,
    review:
      "25 March 2025 Kashmir tour was very enjoyable and happy. Hotels and daily travel arrangements were great. Tour Manager Rishi took good care of everyone and showed them the planned tourist spots, gave information about the places from time to time and helped the tourists to take photos, make reels as well as provided medical assistance on occasion during the trip. The food was always good. This was our second tour with Bandhan and was successful!",
    shortReview:
      "Second successful tour with Bandhan! Tour Manager Rishi guided us exceptionally, helped with photo reels, medical care and delicious food.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Mar, 2025",
    isVerified: true,
    tourManager: "Rishi",
    language: "English",
  },
  {
    id: "rev-8",
    name: "Shashiprabha Ghamandi",
    city: "Thane",
    tour: "Yeh Kashmir Hai - Group Holiday",
    destination: "Kashmir",
    category: "Group",
    rating: 5,
    review:
      "मी बंधन ग्रुप चे आभार मानण्यास मेसेज करीत आहे. बंधन च्या प्रेमात आमचा ग्रुप अर्थात मी पूर्ण अडकले आहे. काश्मीर ट्रिप साठी खूप अगोदर पासून इच्छा होती, ती बंधन ने पूर्ण केली. ईशा मॅडम/पुजा दिदी/प्रिया दिदी/तेजस्विनी दिदी आपले सहकार्य प्रेम कायम माझ्या सोबत राहावे. काश्मीर ट्रिप चे नियोजन अप्रतिम होते. आमचे ग्रुप लीडर सुबोध सर आपले पण आभार. वेळोवेळी आपण आमची काळजी घेतली व जेवण/प्रवासात चहा पाणी व्यवस्थापन उत्तम होते. काश्मीर ट्रिप कायम स्मरणात राहील. 🙏",
    shortReview:
      "बंधन च्या प्रेमात आमचा ग्रुप पूर्ण अडकला आहे! काश्मीर ट्रिपचे अप्रतिम नियोजन, चहा पाणी व जेवणाचे सुंदर व्यवस्थापन. सुबोध सर आणि टीम चे मनःपूर्वक आभार!",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Apr, 2025",
    isVerified: true,
    tourManager: "Subodh Sir, Isha & Pooja",
    language: "Marathi",
  },
  {
    id: "rev-9",
    name: "Madhura Deshpande",
    city: "Pune",
    tour: "Kashmir Highlights Package",
    destination: "Kashmir",
    category: "Honeymoon",
    rating: 5,
    review:
      "We had an amazing experience with Bandhan tours on our Kashmir trip. From designing the itinerary to the execution everything was perfect and fulfilled our expectations since this was our second trip with Bandhan. Special appreciation to the team (specifically to Ms. Kalyani and Ms. Pooja) for their fantastic support 24 hrs in order to make sure everything is going smoothly as per the plan and with the concern of our safety. Highly recommend Bandhan Tours!",
    shortReview:
      "Second trip with Bandhan and expectations fulfilled 100%! Fantastic 24-hr support from Ms. Kalyani & Ms. Pooja for our safety and smooth tour.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Apr, 2025",
    isVerified: true,
    tourManager: "Kalyani & Pooja",
    language: "English",
  },
  {
    id: "rev-10",
    name: "Mohan Dhane",
    city: "Satara",
    tour: "Complete Karnataka Heritage Tour",
    destination: "Karnataka",
    category: "Group",
    rating: 5,
    review:
      "संपूर्ण कर्नाटक टूर्स बंधन टूर्स पुणे - आम्ही सर्व सीनियर सिटीजन असून सुद्धा श्री. प्रवीण जाधव यांनी आमची अत्यंत उत्कृष्ट पणे देखभाल घेतली व सर्व प्रेक्षणीय स्थळे राहण्याची जेवणाची व्यवस्था अतिशय सुंदर केली. या सहलीमध्ये मासे खाण्याची विशेष सोय केली. श्री प्रवीण जाधव टूर मॅनेजर यांनी दिलेल्या प्रोग्रॅम प्रमाणे सर्व स्थळे आम्हाला उत्कृष्ट पणे पाहण्याचा आनंद मिळवून दिला. गाडीचे ड्रायव्हर यांनी सुखरूप प्रवास घडवून आणला. धन्यवाद बंधन टूर पुणे! (मोहन ढाणे, सातारा)",
    shortReview:
      "सीनियर सिटीझन्स ची आई-वडिलांप्रमाणे देखभाल! ऐतिहासिक स्थळांची उत्कृष्ट माहिती, सुखरूप प्रवास व चविष्ट जेवण. सातारा कडून बंधन टूर्स ला धन्यवाद!",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Oct, 2025",
    isVerified: true,
    tourManager: "Pravin Jadhav",
    language: "Marathi",
  },
  {
    id: "rev-11",
    name: "Surekha Bhosale",
    city: "Kolhapur",
    tour: "Delhi & Agra Heritage Family Tour",
    destination: "North India",
    category: "Family",
    rating: 5,
    review:
      "The trip they arranged was really good. We enjoyed Delhi Agra tour with Bandhan Tours. Pooja Mam arranged 2 days plan systematic. That was our Family tour. Short but sweet tour arranged very well. Pooja Mam had given guide with us. He was very helpful. He explained each and every point smoothly. It was my family's first Flight journey but all is gone smoothly. Thanks a lot to Bandhan Tours & specially Pooja Mam!",
    shortReview:
      "Our family's first flight trip went so smoothly! Taj Mahal and Delhi monuments explained systematically by guide. Thanks Pooja Mam & Bandhan!",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "May, 2025",
    isVerified: true,
    tourManager: "Pooja & Local Guide",
    language: "English",
  },
  {
    id: "rev-12",
    name: "Shobha Chavan & Group",
    city: "Mumbai",
    tour: "Karnataka Senior Citizens Special",
    destination: "Karnataka",
    category: "Friends",
    rating: 5,
    review:
      "आमच्या चार मैत्रिणींचा ग्रुप बंधन टूर्ससोबत ७ ते १४ ऑक्टोबर दरम्यान कर्नाटक मध्ये गेला होता. १३ जणांच्या ग्रुपमध्ये आम्ही सर्व जण वयाचे बंधन जुगारून धमाल करत होतो. टूर लीडर प्रविण यांनी खूप सांभाळून घेतले तसेच राहण्याची आणि जेवणाची उत्तम व्यवस्था केली. प्रेक्षणीय स्थळे तसेच मंदिरे याबाबतची माहिती गाईड आणि प्रविण यांच्याकडून मिळाली. बसचे ड्रायव्हर मल्लिकार्जुन यांनी प्रवास सुखकर केला. खूप खूप धन्यवाद पूजा मॅडम!",
    shortReview:
      "वयाचे बंधन जुगारून चार मैत्रिणींनी केली धम्माल! राहण्याची आणि जेवणाची उत्तम व्यवस्था. ड्रायव्हर मल्लिकार्जुन आणि प्रविण सर यांचे आभार!",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Oct, 2025",
    isVerified: true,
    tourManager: "Pravin Jadhav",
    language: "Marathi",
  },
  {
    id: "rev-13",
    name: "Abhijit Sutar",
    city: "Sangli",
    tour: "Mystic Ooty & Nilgiri Hills",
    destination: "Tamil Nadu",
    category: "Family",
    rating: 5,
    review:
      "We had an incredible experience with Bandhan Tours for the Ooty trip. There are no flaws in the arrangements. Thank you so much Pooja for arranging the memorable trip with tea garden visits and cozy botanical garden stays!",
    shortReview:
      "Incredible Ooty hill station experience! Zero flaws in arrangements. Huge thanks to Pooja for crafting a memorable itinerary.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Jun, 2025",
    isVerified: true,
    tourManager: "Pooja",
    language: "English",
  },
  {
    id: "rev-14",
    name: "Mohan More",
    city: "Pune",
    tour: "Andaman Wonders & Cellular Jail Light Show",
    destination: "Andaman",
    category: "Family",
    rating: 5,
    review:
      "खरंच... बंधन टूर्सचे टूर नियोजन उल्लेखनीय आहे. टूरीष्टचे जास्तीत जास्त समाधान होईल याकडे त्यांचे बारीक लक्ष असते. हॉटेल्स, जेवण व येथील प्रवासाची सोय उत्तम दर्जाची असते. पुजा मॅडमचे विशेष आभार. सेल्युलर जेल लाईट शो त्यांच्या खास प्रयत्नांमुळे पहावयास मिळाला. बंधन टूर्सचे सर्वांचे आभार! 🙏🙏",
    shortReview:
      "बंधन टूर्सचे नियोजन खरोखर उल्लेखनीय आहे! सेल्युलर जेल लाईट आणि साऊंड शो पुजा मॅडमच्या खास प्रयत्नांमुळे पाहायला मिळाला.",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Jan, 2025",
    isVerified: true,
    tourManager: "Pooja",
    language: "Marathi",
  },
  {
    id: "rev-15",
    name: "Sumati (Suman) Vanmali",
    city: "Indore",
    tour: "Karnataka Senior Citizens Group Tour",
    destination: "Karnataka",
    category: "Group",
    rating: 5,
    review:
      "सुमती वनमाळी बंधन टूर ७ ते १४ तारीख कर्नाटक सहल. अतिशय सुंदर! सिरियल सिटीजन सगळे असून सुद्धा प्रवीण सरांनी आमची आई-वडिलांसारखी अगदी केर घेतली. कुठेही आम्हाला 'चला चला चला' असं केलं नाही, घाई केली नाही. अतिशय सुंदर माहिती दिली. जेवण खावंत अप्रतिमच होतं! पूजा मॅडम तुम्हाला थँक्यू थँक्यू व्हॅरी मच!",
    shortReview:
      "ज्येष्ठ नागरिकांची आई-वडिलांसारखी काळजी! घाई न करता सुंदर माहिती दिली आणि जेवण अप्रतिम होते. पूजा मॅडम व प्रवीण सरांना थँक्यू!",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Oct, 2025",
    isVerified: true,
    tourManager: "Pravin Jadhav & Pooja",
    language: "Marathi",
  },
  {
    id: "rev-16",
    name: "Pankaj Naskar",
    city: "Kolkata",
    tour: "Kashmir Family Holiday",
    destination: "Kashmir",
    category: "Family",
    rating: 5,
    review:
      "Bandhan tours truly Excellent truly professional. Had arranged my Kashmir tour, we didn't have any problem or trouble. It was arranged very nicely from start to end of the trip. All hotels were excellent whether it be food or service.",
    shortReview:
      "Truly professional! No trouble from start to end of our Kashmir trip. Excellent hotel stay and food service.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Apr, 2025",
    isVerified: true,
    tourManager: "Bandhan Operations Team",
    language: "English",
  },
  {
    id: "rev-17",
    name: "Vanita Pawar",
    city: "Satara",
    tour: "First Family Getaway with Bandhan",
    destination: "Domestic",
    category: "Family",
    rating: 4,
    review:
      "बंधन टूर सोबत आमची पहिलीच फॅमिली ट्रीप होती. या ट्रीपचा अनुभव खूपच आनंददायी होता. ही ट्रीप कमी वेळासाठी होती तरीही बंधन ग्रुपच्या योग्य नियोजनामुळे सर्व पॉईंट्स वेळेमध्ये पाहायला मिळाले. बंधन ग्रुप चे सर्व नियोजन छान होते, त्यामुळे आमची ट्रीप मजेशीर आणि आनंददायी झाली त्याबद्दल बंधन ग्रुपचे खूप खूप आभार!",
    shortReview:
      "पहिलीच फॅमिली ट्रीप खूपच आनंददायी ठरली! योग्य नियोजनामुळे सर्व प्रेक्षणीय स्थळे वेळेत पाहायला मिळाली.",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "May, 2025",
    isVerified: true,
    tourManager: "Bandhan Support",
    language: "Marathi",
  },
  {
    id: "rev-18",
    name: "Suhasini Kadam",
    city: "Mumbai",
    tour: "Kashmir Paradise Group Tour",
    destination: "Kashmir",
    category: "Group",
    rating: 5,
    review:
      "Bandhan tour representative Pooja and Prerana helped me to book the tour to Kashmir efficiently. They guide us very well in each step. Our tour manager Rushikesh helped and supported us throughout the tour for 7 days. Our hotel stay and food was excellent. Thank you Bandhan tours for this memorable trip!",
    shortReview:
      "Pooja and Prerana guided us step by step. Tour manager Rushikesh provided 7 days of stellar support in Kashmir!",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Apr, 2025",
    isVerified: true,
    tourManager: "Rushikesh, Pooja & Prerana",
    language: "English",
  },
  {
    id: "rev-19",
    name: "Maya Satpute & Sunita Vasave",
    city: "Pune",
    tour: "Karnataka Explorer with Friends",
    destination: "Karnataka",
    category: "Friends",
    rating: 5,
    review:
      "Enjoyed the Karnataka tour with Bandhan... it was well managed! Our leader Pravin is very helpful and caring. Thank you all the members for cooperation and playful vibes. Praveen patients manages senior citizens with extreme kindness. Thank you Pooja & team for taking care of us!",
    shortReview:
      "Karnataka tour with friends was well managed! Pravin Jadhav is very caring and patient with senior citizens.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Oct, 2025",
    isVerified: true,
    tourManager: "Pravin Jadhav",
    language: "English",
  },
  {
    id: "rev-20",
    name: "Rajashree Musalay & Family",
    city: "Mumbai",
    tour: "All of Scandinavia & Fjords Explorer",
    destination: "Scandinavia",
    category: "Family",
    rating: 5,
    review:
      "We just returned from our 12-day Scandinavian tour with Bandhan Tours and we are overwhelmed with joy. From the breathtaking cruise through Geirangerfjord in Norway to Stockholm, everything was organized seamlessly. Our tour manager, Kunal Gorekar, looked after every tiny detail — especially ensuring warm vegetarian meals for our elderly parents throughout the journey. Bandhan Tours has earned a client for life!",
    shortReview:
      "12-day Scandinavian tour! Tour manager Kunal Gorekar looked after every detail including special vegetarian meals. Seamless service!",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=400",
    tripImages: [
      "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&q=85&w=1400",
    ],
    travelMonth: "Jul, 2025",
    isVerified: true,
    tourManager: "Kunal Gorekar",
    language: "English",
  },
];
