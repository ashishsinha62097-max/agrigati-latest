export type CropCategoryExtended =
  | "Vegetables"
  | "Fruits"
  | "Grains"
  | "Corn"
  | "Spices"
  | "Pulses"
  | "Cash Crops";

export interface CropItem {
  name: string;
  emoji: string;
  category: CropCategoryExtended;
  nameHindi?: string;
}

export const CROP_DATABASE: CropItem[] = [
  // ── Vegetables ──────────────────────────────────────────────────────────────
  { name: "Tomato", emoji: "🍅", category: "Vegetables", nameHindi: "टमाटर" },
  { name: "Onion", emoji: "🧅", category: "Vegetables", nameHindi: "प्याज" },
  { name: "Potato", emoji: "🥔", category: "Vegetables", nameHindi: "आलू" },
  {
    name: "Brinjal / Eggplant",
    emoji: "🍆",
    category: "Vegetables",
    nameHindi: "बैंगन",
  },
  {
    name: "Cauliflower",
    emoji: "🥦",
    category: "Vegetables",
    nameHindi: "फूलगोभी",
  },
  {
    name: "Cabbage",
    emoji: "🥬",
    category: "Vegetables",
    nameHindi: "पत्तागोभी",
  },
  { name: "Spinach", emoji: "🥬", category: "Vegetables", nameHindi: "पालक" },
  {
    name: "Okra / Bhindi",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "भिंडी",
  },
  {
    name: "Green Peas",
    emoji: "🫛",
    category: "Vegetables",
    nameHindi: "हरी मटर",
  },
  {
    name: "Bitter Gourd / Karela",
    emoji: "🥒",
    category: "Vegetables",
    nameHindi: "करेला",
  },
  {
    name: "Bottle Gourd / Lauki",
    emoji: "🥒",
    category: "Vegetables",
    nameHindi: "लौकी",
  },
  {
    name: "Ridge Gourd / Turai",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "तुरई",
  },
  {
    name: "Snake Gourd / Chichinda",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "चिचिंडा",
  },
  {
    name: "Drumstick / Moringa",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "सहजन",
  },
  {
    name: "Radish / Mooli",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "मूली",
  },
  { name: "Beetroot", emoji: "🫑", category: "Vegetables", nameHindi: "चुकंदर" },
  { name: "Carrot", emoji: "🥕", category: "Vegetables", nameHindi: "गाजर" },
  {
    name: "Capsicum",
    emoji: "🫑",
    category: "Vegetables",
    nameHindi: "शिमला मिर्च",
  },
  {
    name: "Green Chilli",
    emoji: "🌶️",
    category: "Vegetables",
    nameHindi: "हरी मिर्च",
  },
  {
    name: "Garlic / Lahsun",
    emoji: "🧄",
    category: "Vegetables",
    nameHindi: "लहसुन",
  },
  {
    name: "Ginger / Adrak",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "अदरक",
  },
  {
    name: "Turmeric / Haldi",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "हल्दी",
  },
  {
    name: "Coriander / Dhaniya",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "धनिया",
  },
  {
    name: "Fenugreek / Methi",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "मेथी",
  },
  {
    name: "Pumpkin / Kaddu",
    emoji: "🎃",
    category: "Vegetables",
    nameHindi: "कद्दू",
  },
  { name: "Mushroom", emoji: "🍄", category: "Vegetables", nameHindi: "मशरूम" },
  {
    name: "Sweet Corn",
    emoji: "🌽",
    category: "Vegetables",
    nameHindi: "मीठा मक्का",
  },
  {
    name: "Cucumber / Kheera",
    emoji: "🥒",
    category: "Vegetables",
    nameHindi: "खीरा",
  },
  {
    name: "Spring Onion",
    emoji: "🧅",
    category: "Vegetables",
    nameHindi: "हरा प्याज",
  },
  {
    name: "Taro / Arbi",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "अरबी",
  },
  {
    name: "Cluster Beans / Guar",
    emoji: "🫛",
    category: "Vegetables",
    nameHindi: "ग्वार फली",
  },
  {
    name: "Flat Beans / Sem",
    emoji: "🫛",
    category: "Vegetables",
    nameHindi: "सेम",
  },
  {
    name: "Pointed Gourd / Parwal",
    emoji: "🌿",
    category: "Vegetables",
    nameHindi: "परवल",
  },

  // ── Fruits ───────────────────────────────────────────────────────────────────
  { name: "Mango / Aam", emoji: "🥭", category: "Fruits", nameHindi: "आम" },
  { name: "Banana / Kela", emoji: "🍌", category: "Fruits", nameHindi: "केला" },
  {
    name: "Papaya / Papita",
    emoji: "🍈",
    category: "Fruits",
    nameHindi: "पपीता",
  },
  {
    name: "Guava / Amrood",
    emoji: "🍏",
    category: "Fruits",
    nameHindi: "अमरूद",
  },
  {
    name: "Pomegranate / Anar",
    emoji: "🍎",
    category: "Fruits",
    nameHindi: "अनार",
  },
  {
    name: "Watermelon / Tarbooz",
    emoji: "🍉",
    category: "Fruits",
    nameHindi: "तरबूज",
  },
  {
    name: "Muskmelon / Kharbooja",
    emoji: "🍈",
    category: "Fruits",
    nameHindi: "खरबूजा",
  },
  { name: "Grape / Angoor", emoji: "🍇", category: "Fruits", nameHindi: "अंगूर" },
  { name: "Strawberry", emoji: "🍓", category: "Fruits", nameHindi: "स्ट्रॉबेरी" },
  {
    name: "Pineapple / Ananas",
    emoji: "🍍",
    category: "Fruits",
    nameHindi: "अनानास",
  },
  { name: "Litchi", emoji: "🍒", category: "Fruits", nameHindi: "लीची" },
  { name: "Sapota / Chiku", emoji: "🍑", category: "Fruits", nameHindi: "चीकू" },
  {
    name: "Coconut / Nariyal",
    emoji: "🥥",
    category: "Fruits",
    nameHindi: "नारियल",
  },
  { name: "Jamun", emoji: "🫐", category: "Fruits", nameHindi: "जामुन" },
  {
    name: "Amla / Indian Gooseberry",
    emoji: "🍏",
    category: "Fruits",
    nameHindi: "आंवला",
  },
  { name: "Fig / Anjeer", emoji: "🍑", category: "Fruits", nameHindi: "अंजीर" },
  {
    name: "Orange / Santra",
    emoji: "🍊",
    category: "Fruits",
    nameHindi: "संतरा",
  },
  {
    name: "Sweet Lime / Mosambi",
    emoji: "🍋",
    category: "Fruits",
    nameHindi: "मौसमी",
  },
  { name: "Lemon / Nimbu", emoji: "🍋", category: "Fruits", nameHindi: "नींबू" },
  { name: "Apple / Seb", emoji: "🍎", category: "Fruits", nameHindi: "सेब" },
  {
    name: "Pear / Nashpati",
    emoji: "🍐",
    category: "Fruits",
    nameHindi: "नाशपाती",
  },
  { name: "Peach / Aadoo", emoji: "🍑", category: "Fruits", nameHindi: "आड़ू" },
  {
    name: "Plum / Aloo Bukhara",
    emoji: "🫐",
    category: "Fruits",
    nameHindi: "आलूबुखारा",
  },
  {
    name: "Dragon Fruit",
    emoji: "🐉",
    category: "Fruits",
    nameHindi: "ड्रैगन फ्रूट",
  },
  { name: "Kiwi", emoji: "🥝", category: "Fruits", nameHindi: "कीवी" },
  {
    name: "Custard Apple / Sitaphal",
    emoji: "🍏",
    category: "Fruits",
    nameHindi: "सीताफल",
  },
  {
    name: "Wood Apple / Bael",
    emoji: "🍊",
    category: "Fruits",
    nameHindi: "बेल",
  },

  // ── Grains ───────────────────────────────────────────────────────────────────
  { name: "Wheat / Gehun", emoji: "🌾", category: "Grains", nameHindi: "गेहूं" },
  {
    name: "Rice / Dhan (Paddy)",
    emoji: "🌾",
    category: "Grains",
    nameHindi: "धान / चावल",
  },
  {
    name: "Bajra / Pearl Millet",
    emoji: "🌾",
    category: "Grains",
    nameHindi: "बाजरा",
  },
  {
    name: "Jowar / Sorghum",
    emoji: "🌾",
    category: "Grains",
    nameHindi: "ज्वार",
  },
  {
    name: "Ragi / Finger Millet",
    emoji: "🌾",
    category: "Grains",
    nameHindi: "रागी",
  },
  { name: "Maize / Makka", emoji: "🌽", category: "Grains", nameHindi: "मक्का" },
  { name: "Barley / Jau", emoji: "🌾", category: "Grains", nameHindi: "जौ" },
  { name: "Oats / Jai", emoji: "🌾", category: "Grains", nameHindi: "जई" },
  { name: "Soybean", emoji: "🫘", category: "Grains", nameHindi: "सोयाबीन" },
  {
    name: "Groundnut / Mungfali",
    emoji: "🥜",
    category: "Grains",
    nameHindi: "मूंगफली",
  },
  {
    name: "Sunflower / Surajmukhi",
    emoji: "🌻",
    category: "Grains",
    nameHindi: "सूरजमुखी",
  },
  {
    name: "Mustard / Sarson",
    emoji: "🌿",
    category: "Grains",
    nameHindi: "सरसों",
  },
  { name: "Sesame / Til", emoji: "🌿", category: "Grains", nameHindi: "तिल" },
  {
    name: "Linseed / Alsi",
    emoji: "🌿",
    category: "Grains",
    nameHindi: "अलसी",
  },
  {
    name: "Safflower / Kusum",
    emoji: "🌸",
    category: "Grains",
    nameHindi: "कुसुम",
  },

  // ── Corn (special category) ──────────────────────────────────────────────────
  {
    name: "Corn / Maize (Yellow)",
    emoji: "🌽",
    category: "Corn",
    nameHindi: "पीला मक्का",
  },
  { name: "Baby Corn", emoji: "🌽", category: "Corn", nameHindi: "बेबी कॉर्न" },
  {
    name: "Popcorn Corn",
    emoji: "🌽",
    category: "Corn",
    nameHindi: "पॉपकॉर्न मक्का",
  },

  // ── Spices ───────────────────────────────────────────────────────────────────
  {
    name: "Red Chilli / Lal Mirch",
    emoji: "🌶️",
    category: "Spices",
    nameHindi: "लाल मिर्च",
  },
  {
    name: "Turmeric / Haldi (Dry)",
    emoji: "🌿",
    category: "Spices",
    nameHindi: "हल्दी पाउडर",
  },
  {
    name: "Coriander Seeds / Dhaniya",
    emoji: "🌿",
    category: "Spices",
    nameHindi: "धनिया बीज",
  },
  { name: "Cumin / Jeera", emoji: "🌿", category: "Spices", nameHindi: "जीरा" },
  {
    name: "Black Pepper / Kali Mirch",
    emoji: "🫙",
    category: "Spices",
    nameHindi: "काली मिर्च",
  },
  {
    name: "Cardamom / Elaichi",
    emoji: "🫙",
    category: "Spices",
    nameHindi: "इलायची",
  },
  { name: "Clove / Laung", emoji: "🫙", category: "Spices", nameHindi: "लौंग" },
  {
    name: "Cinnamon / Dalchini",
    emoji: "🫙",
    category: "Spices",
    nameHindi: "दालचीनी",
  },
  { name: "Fennel / Saunf", emoji: "🌿", category: "Spices", nameHindi: "सौंफ" },
  {
    name: "Ajwain / Carom Seeds",
    emoji: "🌿",
    category: "Spices",
    nameHindi: "अजवाइन",
  },
  {
    name: "Fenugreek Seeds / Methi Dana",
    emoji: "🌿",
    category: "Spices",
    nameHindi: "मेथी दाना",
  },
  {
    name: "Star Anise / Chakra Phool",
    emoji: "⭐",
    category: "Spices",
    nameHindi: "चक्र फूल",
  },
  {
    name: "Dry Ginger / Sonth",
    emoji: "🌿",
    category: "Spices",
    nameHindi: "सोंठ",
  },
  {
    name: "Asafoetida / Hing",
    emoji: "🫙",
    category: "Spices",
    nameHindi: "हींग",
  },
  {
    name: "Nutmeg / Jaiphal",
    emoji: "🫙",
    category: "Spices",
    nameHindi: "जायफल",
  },
  {
    name: "Mace / Javitri",
    emoji: "🫙",
    category: "Spices",
    nameHindi: "जावित्री",
  },
  {
    name: "Bay Leaf / Tejpatta",
    emoji: "🍃",
    category: "Spices",
    nameHindi: "तेजपत्ता",
  },
  {
    name: "Saffron / Kesar",
    emoji: "🌸",
    category: "Spices",
    nameHindi: "केसर",
  },

  // ── Pulses ───────────────────────────────────────────────────────────────────
  {
    name: "Chickpea / Chana",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "चना",
  },
  {
    name: "Black Gram / Urad Dal",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "उड़द दाल",
  },
  {
    name: "Green Gram / Moong Dal",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "मूंग दाल",
  },
  {
    name: "Red Lentil / Masoor Dal",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "मसूर दाल",
  },
  {
    name: "Pigeon Pea / Arhar Dal",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "अरहर दाल",
  },
  {
    name: "Kidney Beans / Rajma",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "राजमा",
  },
  {
    name: "Moth Beans / Matki",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "मटकी",
  },
  {
    name: "Horse Gram / Kulthi",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "कुलथी",
  },
  {
    name: "Cowpea / Lobia",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "लोबिया",
  },
  {
    name: "Field Peas / Matar",
    emoji: "🫛",
    category: "Pulses",
    nameHindi: "मटर (दाल)",
  },
  {
    name: "Bengal Gram / Desi Chana",
    emoji: "🫘",
    category: "Pulses",
    nameHindi: "देसी चना",
  },

  // ── Cash Crops ───────────────────────────────────────────────────────────────
  {
    name: "Sugarcane / Ganna",
    emoji: "🎋",
    category: "Cash Crops",
    nameHindi: "गन्ना",
  },
  {
    name: "Cotton / Kapas",
    emoji: "🌿",
    category: "Cash Crops",
    nameHindi: "कपास",
  },
  { name: "Jute / Paat", emoji: "🌿", category: "Cash Crops", nameHindi: "जूट" },
  {
    name: "Tobacco / Tambaku",
    emoji: "🌿",
    category: "Cash Crops",
    nameHindi: "तंबाकू",
  },
  { name: "Tea / Chai", emoji: "🍵", category: "Cash Crops", nameHindi: "चाय" },
  { name: "Coffee", emoji: "☕", category: "Cash Crops", nameHindi: "कॉफी" },
  { name: "Rubber", emoji: "🌿", category: "Cash Crops", nameHindi: "रबर" },
  { name: "Vanilla", emoji: "🌿", category: "Cash Crops", nameHindi: "वनीला" },
  { name: "Cocoa", emoji: "🍫", category: "Cash Crops", nameHindi: "कोको" },
];

export function searchCrops(query: string): CropItem[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return CROP_DATABASE.filter(
    (c) => c.name.toLowerCase().includes(q) || c.nameHindi?.includes(q),
  ).slice(0, 10);
}

export function getCropEmoji(name: string): string {
  const found = CROP_DATABASE.find((c) =>
    name.toLowerCase().includes(c.name.toLowerCase().split("/")[0].trim()),
  );
  return found?.emoji ?? "🌱";
}
