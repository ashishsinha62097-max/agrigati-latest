export interface AIResponse {
  text: string;
  emoji: string;
}

// ── Best Voice Selector ───────────────────────────────────────────────────────
export function selectBestVoice(
  speechCode: string,
): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langPrefix = speechCode.split("-")[0];

  // Priority 1: Google neural voices matching language
  const googleNeural = voices.find(
    (v) =>
      v.name.toLowerCase().includes("google") && v.lang.startsWith(langPrefix),
  );
  if (googleNeural) return googleNeural;

  // Priority 2: Microsoft neural voices
  const msNeural = voices.find(
    (v) =>
      v.name.toLowerCase().includes("microsoft") &&
      v.lang.startsWith(langPrefix),
  );
  if (msNeural) return msNeural;

  // Priority 3: Any voice matching exact lang code
  const exactMatch = voices.find((v) => v.lang === speechCode);
  if (exactMatch) return exactMatch;

  // Priority 4: Any voice matching language prefix
  const langPrefixMatch = voices.find((v) => v.lang.startsWith(langPrefix));
  if (langPrefixMatch) return langPrefixMatch;

  // Fallback to Hindi
  const hiVoice = voices.find((v) => v.lang.startsWith("hi"));
  if (hiVoice) return hiVoice;

  return null;
}

// ── Normalize text for matching ──────────────────────────────────────────────
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Score a question against keyword sets ──────────────────────────────────────
function scoreMatch(question: string, keywords: string[]): number {
  const q = normalize(question);
  // Also normalize common Hinglish spellings
  const qVariants = [
    q,
    q.replace(/ph/g, "f").replace(/bh/g, "b").replace(/kh/g, "k"),
    q.replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u"),
  ];
  let score = 0;
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    for (const qv of qVariants) {
      if (qv.includes(k)) {
        score += k.length * 2; // exact match weighted by specificity
        break;
      }
    }
    if (k.length > 3) {
      // Partial match for longer keywords
      const partial = k.slice(0, Math.max(3, Math.floor(k.length * 0.65)));
      for (const qv of qVariants) {
        if (qv.includes(partial)) {
          score += partial.length;
          break;
        }
      }
    }
  }
  return score;
}

// ── Fuzzy topic detection for common intents ─────────────────────────────────
function detectTopic(question: string): string | null {
  const q = normalize(question);
  // Price / rate / bhaav
  if (
    /\b(price|rate|bhaav|bhav|dam|daam|kimat|kitna|aaj ka|kya chal|kya mil|live|today|abhi|kal ka|bik|mandi|market)\b/.test(
      q,
    )
  )
    return "mandi_price";
  // Mausam / weather
  if (
    /\b(mausam|weather|barish|rain|garmi|sardi|frost|fog|dhund|baarish|tufan|cyclone|temperature|tapman)\b/.test(
      q,
    )
  )
    return "weather";
  // Tomato
  if (/tamatar|tomato/.test(q)) return "tomato";
  // Onion
  if (/pyaaz|pyaz|onion/.test(q)) return "onion";
  // Wheat
  if (/gehun|wheat|gahu|gehu/.test(q)) return "wheat";
  // Rice/Paddy
  if (/\b(chawal|dhan|rice|paddy|basmati)\b/.test(q)) return "rice";
  // Pests/disease
  if (
    /keede|kida|pest|makode|insect|bug|beemari|rog|bimari|keet|fungas|dawai|spray|ilaj|treatment|safed makhi|aphid/.test(
      q,
    )
  )
    return "pests_disease";
  // Fertilizer
  if (
    /khad|fertilizer|urea|dap|compost|organic|jeevamrut|manure|gobar|nutrient|npk|potassium|nitrogen/.test(
      q,
    )
  )
    return "fertilizer";
  // Irrigation
  if (
    /sinchai|paani|water|drip|irrigation|sprinkler|pump|tubewell|motor|boring/.test(
      q,
    )
  )
    return "irrigation";
  // Selling
  if (
    /\b(bech|sell|sale|list|upload|bazaar|kahan bechun|kaise bechun|order|buyer|kharidar|bikri)\b/.test(
      q,
    )
  )
    return "selling";
  // Seeds/variety
  if (/beej|seed|variety|nasal|kaunsa lagayen|kaunsi|kaunsa beej/.test(q))
    return "seeds";
  // Insurance
  if (/insurance|bima|claim|pmfby|nuksan|fasal ka/.test(q)) return "insurance";
  // Loan
  if (/loan|karz|credit|bank|kcc|kisan credit|yojana|scheme|subsidy/.test(q))
    return "loan";
  // Mango
  if (/aam|mango|alphonso|kesar|langra|dashehari/.test(q)) return "mango";
  // Corn
  if (/makka|corn|maize|bhutta|makai/.test(q)) return "corn_maize";
  // Demand forecast
  if (
    /kya lagayen|kya lagana|forecast|future|aane wale|agla|kaunsa fasal|demand high|zyada bikne/.test(
      q,
    )
  )
    return "demand_forecast";
  // Organic
  if (
    /organic|jaivik|praakritik|chemical free|natural farming|jeevamrut|certification/.test(
      q,
    )
  )
    return "organic";
  // Greeting
  if (
    /namaskar|hello|hi\b|namaste|kaise ho|kaisa|kya hai|kon ho|parichay|madad|help\b/.test(
      q,
    )
  )
    return "greeting";
  return null;
}

// ── Buyer-specific topic detection ───────────────────────────────────────────
function detectBuyerTopic(question: string): string | null {
  const q = normalize(question);
  // Greeting
  if (/namaskar|hello|hi\b|namaste|kaise|kya hai|parichay|madad|help\b/.test(q))
    return "greeting";
  // Price
  if (
    /price|bhaav|bhav|rate|dam|kimat|kitna|kya hai|cost|sasta|mehnga|kya chal|aaj ka|kitne ka|kitne mein/.test(
      q,
    )
  )
    return "price";
  // Availability / location
  if (
    /kahan|where|nearby|aaspaas|paas|close|location|available|milega|kab milega|hai kya|stock/.test(
      q,
    )
  )
    return "availability";
  // Forecast
  if (
    /kal|tomorrow|forecast|aane wala|future|predict|next week|is hafte|agle hafte|badhega|girega|kal ka bhaav/.test(
      q,
    )
  )
    return "forecast";
  // Bulk order
  if (
    /bulk|wholesale|quantity|zyada|large|hotel|restaurant|kitchen|cloud kitchen|caterer|sabse sasta/.test(
      q,
    )
  )
    return "bulk_order";
  // Quality
  if (
    /quality|fresh|organic|certified|pure|taaza|good|accha|guarantee|verified|kitna fresh|kab ka/.test(
      q,
    )
  )
    return "quality";
  // Tracking
  if (
    /track|kahan hai|status|delivery kab|kab aayega|location|truck|live location|map|order status/.test(
      q,
    )
  )
    return "tracking";
  // Payment
  if (
    /payment|pay|upi|card|cod|cash|paise|refund|bill|invoice|gst|kaise bharen/.test(
      q,
    )
  )
    return "payment";
  // Recipe
  if (
    /recipe|kaise banate|banana hai|khana|dish|food|cook|pakana|sabzi kaise|dal kaise/.test(
      q,
    )
  )
    return "recipe_food";
  // Delivery
  if (
    /delivery|deliver|kitne ghante|kab tak pahuchega|express|fast delivery|same day|urgent|aaj hi/.test(
      q,
    )
  )
    return "delivery";
  return null;
}

// ── Pick varied answer based on question hash ────────────────────────────────
function pickAnswer(answers: AIResponse[], question: string): AIResponse {
  const hash = question.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = Date.now() % answers.length;
  return answers[(hash + jitter) % answers.length];
}

// ══════════════════════════════════════════════════════════════════════════════
// FARMER KNOWLEDGE BASE — comprehensive, context-aware
// ══════════════════════════════════════════════════════════════════════════════
const FARMER_KB: {
  topic: string;
  keywords: string[];
  answers: AIResponse[];
}[] = [
  {
    topic: "greeting",
    keywords: [
      "namaskar",
      "hello",
      "hi",
      "namaste",
      "kaise",
      "kaisa",
      "kaun",
      "kya hai",
      "kon ho",
      "parichay",
      "shukriya",
      "dhanyawad",
      "help",
      "madad",
      "kya kar sakte",
    ],
    answers: [
      {
        text: "Namaskar Kisaan Bhai! Main AgriGati ka AI Farming Assistant hoon. Fasal ke bhaav, mausam ki jankari, kaunsi fasal lagayen, keede ka ilaj, khad, ya seedha bechne ke tips - kuch bhi poochein. Main aapki poori madad karunga!",
        emoji: "🙏",
      },
      {
        text: "Jai Kisan! Main aapka AgriGati digital sathi hoon. Mandi bhaav, mausam alert, kaunsi fasal lagayen, kheti ke tips - sab ek jagah. Sawaal bolein - sahi jawab ek pal mein!",
        emoji: "🌾",
      },
      {
        text: "Namaskar! Main AgriGati Assistant hoon. Aapki kheti mein AI ki madad karna mera kaam hai. Bhaav check karein, mausam jaanein, ya fasal ki salah lein. Kya poochna chahte hain?",
        emoji: "🤖",
      },
    ],
  },
  {
    topic: "mandi_price",
    keywords: [
      "bhaav",
      "bhav",
      "price",
      "rate",
      "dam",
      "daam",
      "mandi",
      "market",
      "qeemat",
      "kimat",
      "kitna",
      "kya mil raha",
      "kya chal raha",
      "aaj ka",
      "live",
      "today",
      "abhi",
      "kal ka",
      "bikri",
      "bik raha",
    ],
    answers: [
      {
        text: "Aaj AgriGati par live bhaav:\n• Tamatar ₹35-42/kg (wedding season demand HIGH)\n• Pyaaz ₹28-35/kg (Maharashtra supply kam)\n• Aalu ₹20-25/kg (stable)\n• Mirch ₹85-95/kg (export demand)\nIn bhaav par seedha buyers se deal karein!",
        emoji: "💰",
      },
      {
        text: "Fruits ke aaj ke bhaav:\n• Alphonso Aam ₹180/kg (peak season!)\n• Angoor ₹70-80/kg\n• Kela ₹40/kg\n• Santra ₹55/kg\nHotel buyers zyada pay karte hain - AgriGati par abhi list karein.",
        emoji: "📈",
      },
      {
        text: "Anaj aur dal ke bhaav:\n• Gehun ₹2400-2500/quintal (MSP se zyada!)\n• Dhan (Basmati) ₹3800-4200/quintal\n• Makka ₹18/kg\n• Chana ₹58/kg\n• Masoor ₹75/kg\nSeedha mills se deal par 8-12% zyada milta hai.",
        emoji: "🌾",
      },
      {
        text: "Masale ke live bhaav:\n• Lal Mirch ₹85-95/kg (export demand high!)\n• Haldi ₹65/kg\n• Jeera ₹200-220/kg\n• Dhaniya ₹80/kg\nExport quality ke liye AgriGati par premium buyers available hain.",
        emoji: "🌶️",
      },
      {
        text: "Sabzion ka aaj ka bhaav:\n• Gobi ₹28-35/kg\n• Palak ₹25/kg\n• Baingan ₹22-28/kg\n• Bhindi ₹45/kg\n• Karela ₹40/kg\nWinter vegetables ki demand high hai - abhi list karna sahi rahega!",
        emoji: "🥦",
      },
    ],
  },
  {
    topic: "weather",
    keywords: [
      "mausam",
      "weather",
      "barish",
      "rain",
      "aandhi",
      "tufan",
      "garmi",
      "sardi",
      "frost",
      "fog",
      "dhund",
      "baarish",
      "baadal",
      "dhoop",
      "badal",
      "tufaan",
      "cyclone",
      "temperature",
      "tapman",
      "baarsat",
    ],
    answers: [
      {
        text: "Aaj ka mausam alert:\n• Maharashtra-Goa: Bhari barish ki chetavni\n• Rajasthan-Gujarat: Garmi 42°C+ (shade net lagayen)\n• Punjab-Haryana: Kuhre ki chetavni\nPerishable fasal (tamatar, mirch) turant kaatein - sadne ka darr. AgriGati par emergency list karein - buyers wait kar rahe hain!",
        emoji: "🌧️",
      },
      {
        text: "Mausam forecast (agle 5 din):\n• North India: Garmi ki lehar\n• Maharashtra: Baarish se tamatar/pyaaz supply kam hogi → bhaav upar jaayenge 15-20%\n• Tamil Nadu: Low pressure - tez hawayen\nIs mausam mein kya ugayen? Garmi-tolerant varieties chunein - bhindi, lauki, kaddu best hain.",
        emoji: "☀️",
      },
      {
        text: "Fasal bachaav tips mausam ke hisab se:\n• Barish aane wali ho: Drainage achhi rakhen, fungicide spray karein\n• Garmi zyada ho: Mulching + shaam ko sinchai + shade net\n• Pala girne wala ho: Anti-frost sprinkler ya smoke\n• Aandhi: Bamboo support dein tall crops ko",
        emoji: "🛡️",
      },
    ],
  },
  {
    topic: "tomato",
    keywords: ["tamatar", "tomato", "tomatoe", "tomatoes"],
    answers: [
      {
        text: "Tamatar ki best kheti:\n• Best time: Aug-Sep ya Jan-Feb mein beej lagayen\n• Top varieties: Pusa Ruby, Pusa Hybrid-2, Arka Vikas\n• 60-75 din mein phal\n• Yield: 30-35 ton/hectare\n• NPK 120:60:60 kg/ha dein\n• Drip irrigation se 50% paani bachta hai",
        emoji: "🍅",
      },
      {
        text: "Tamatar mein aaj HIGH demand hai!\n• Current rate: ₹35-42/kg\n• Wedding season + restaurant demand\n• AgriGati par abhi list karein\n• Delhi, Mumbai ke buyers wait kar rahe hain\n• Minimum order ₹500 set karein → zyada orders milenge",
        emoji: "📈",
      },
      {
        text: "Tamatar mein keede ka ilaj:\n• Safed makhi → yellow sticky traps + neem tel (5ml/L) spray\n• Fruit borer → Spinosad use karein\n• Fungal bimari → copper oxychloride (3g/L)\n• Shaam ko spray karna best - bees nahi hoti, pani nahi udate",
        emoji: "🌱",
      },
      {
        text: "Tamatar yield badhane ke tips:\n• Potassium fertilizer fruits set ke baad dein\n• Calcium spray se cracking 40% kam\n• Drip irrigation se 50% paani bachta hai\n• Mulching se temperature regulate\n• Overripe tamatar AgriGati 'Imperfect Produce' pe list karein - ₹12-15/kg juice factories se",
        emoji: "🌿",
      },
    ],
  },
  {
    topic: "onion",
    keywords: ["pyaaz", "onion", "piaz", "pyaz"],
    answers: [
      {
        text: "Pyaaz ki kheti:\n• Rabi variety → Oct-Nov mein beej lagayen\n• 120-150 din mein taiyaar\n• Best variety: Red Nashik, Agrifound Dark Red\n• AgriGati par seedha exporters milte hain → premium price\n• Export ke liye grading zaroori: Grade A = 55-65mm",
        emoji: "🧅",
      },
      {
        text: "Pyaaz storage sahi tarike se:\n• Hawadaar godam mein rakhen\n• 65-70% humidity maintain karein\n• Gila pyaaz jaldi sadta hai - pehle achhi tarah sukhayein\n• Cold storage par -2°C pe 6-8 mahine tak safe\n• AgriGati ki cold chain service bhi use karein",
        emoji: "🏠",
      },
      {
        text: "Pyaaz bimari ka ilaj:\n• Purple blotch → Mancozeb (2.5g/L) spray\n• Onion maggot → Chlorpyrifos soil treatment\n• Thrips → Imidacloprid 0.5ml/L\n• Downy mildew → Metalaxyl 0.25% spray\nEarly detection se 80% fasal bach sakti hai!",
        emoji: "💊",
      },
    ],
  },
  {
    topic: "wheat",
    keywords: ["gehun", "wheat", "gahu", "gehu", "gehoon"],
    answers: [
      {
        text: "Gehun ki kheti:\n• November mein beej dagein (ideal time!)\n• Best varieties: HD-2967, HD-3086, PBW-343\n• 120-125 din mein ready\n• NPK 120:60:60 kg/ha\n• MSP ₹2275 lekin AgriGati par mills ₹2400-2500 de rahe hain!\n• Seedha deal karein - 8-12% zyada milega",
        emoji: "🌾",
      },
      {
        text: "Gehun sinchai ka sahi schedule:\n• 1st: 20-25 din (CRI stage)\n• 2nd: 40-45 din (Tillering)\n• 3rd: 60-65 din (Jointing)\n• 4th: 80-85 din (Boot stage)\nKul 4-5 baar kaafi hai. Sprinkler se 35% paani bachta hai.",
        emoji: "💧",
      },
      {
        text: "Gehun mein rust bimari:\n• Yellow rust, Brown rust, Black rust teeno ke liye Propiconazole 25EC (0.1%) spray\n• Early morning spray best hai\n• Affected area turant treat karein\n• Resistant variety HD-3086 lagayen - zyada safe hoti hai",
        emoji: "💊",
      },
    ],
  },
  {
    topic: "rice",
    keywords: ["chawal", "dhan", "rice", "paddy", "dhaan", "basmati", "dhaan"],
    answers: [
      {
        text: "Dhan ki kheti:\n• June-July mein nursery lagayen\n• Basmati ke liye Pusa Basmati 1121 best - ₹50-80/kg hotels se!\n• SRI method → 30-40% zyada yield + 50% kam paani\n• Yield target: 7-8 ton/hectare with SRI\nAgriGati par hotels directly Basmati khareedna chahte hain!",
        emoji: "🌾",
      },
      {
        text: "Dhan mein paani management:\n• 5cm standing water rakhen\n• Zyada paani → tiller growth rokta hai\n• SRI method mein intermittent irrigation → mitti ko thoda sukhne dein\n• Leaf color chart se nitrogen ka sahi time pata chalega",
        emoji: "💧",
      },
      {
        text: "Dhan mein keede:\n• Brown plant hopper → Imidacloprid 0.3ml/L\n• Neck blast → Tricyclazole fungicide\n• Yellowing pe turant treat karein\n• Flood-based nursery mein zyada problem hoti hai - SRI better hai",
        emoji: "🌱",
      },
    ],
  },
  {
    topic: "pests_disease",
    keywords: [
      "keede",
      "kida",
      "pest",
      "makode",
      "insect",
      "bug",
      "beemari",
      "rog",
      "bimari",
      "keet",
      "fungas",
      "fungus",
      "dawai",
      "spray",
      "medicine",
      "treatment",
      "ilaj",
      "roket",
      "safed makhi",
      "aphid",
      "whitefly",
      "borer",
    ],
    answers: [
      {
        text: "Smart Pest Management (IPM):\n1. Neem ka tel (5ml/L) - 80% keede nahi aayenge\n2. Yellow sticky traps - safed makhi, thrips\n3. Bio-pesticide (Bt) - caterpillars\n4. Chemical last option rakhein\nIPM se organic certification milti hai → 30% zyada price!",
        emoji: "🌿",
      },
      {
        text: "Safed makhi (Whitefly):\n• Yellow sticky traps + neem tel (5ml/L) shaam ko spray\n• Imidacloprid 0.5ml/L chemical option\n• Gobi, tamatar, mirch par zyada hoti hai\n• Neem cake mitti mein milane se 6 mahine safe\n• Early detection → ek chhidkav se control",
        emoji: "🍃",
      },
      {
        text: "Fruit fly (aam, amrood, mirch pe):\n• Protein bait traps mein Malathion + sugar solution\n• Spinosad (GF-120) effective hai\n• Infected phal turant haatein\n• Export ke liye zero tolerance hai - zaroor control karein\n• Coverage spray 7 din mein repeat karein",
        emoji: "🍎",
      },
      {
        text: "Fungal bimari ka ilaj:\n• Leaf spot/blight → Mancozeb 2.5g/L\n• Powdery mildew → Sulphur 3g/L ya Karathane\n• Root rot → Trichoderma viride in soil\n• Downy mildew → Metalaxyl + Mancozeb\nSpray baad barish ke karo - baarish se wash ho jaata hai",
        emoji: "💊",
      },
    ],
  },
  {
    topic: "fertilizer",
    keywords: [
      "khad",
      "fertilizer",
      "urea",
      "dap",
      "compost",
      "organic",
      "jeevamrut",
      "manure",
      "gobar",
      "nutrient",
      "NPK",
      "potassium",
      "nitrogen",
      "phosphorus",
      "zinc",
      "micronutrient",
    ],
    answers: [
      {
        text: "Organic kheti ke fayde:\n• Vermicompost 5-10 ton/hectare → mitti ki sehat badhti hai\n• Jeevamrut: 10L cow dung + 10L urine + 1kg jaggery + 1kg besan + 200L paani\n• Har 15 din spray karein\n• Yield 25-30% badh sakti hai\n• Premium price bhi milta hai market mein!",
        emoji: "🌱",
      },
      {
        text: "Chemical fertilizer ka sahi use:\n• NPK 120:60:60 kg/ha standard dose\n• Urea 3 parts mein dein (planting/tillering/heading)\n• Ek baar sab dene se 40% waste hota hai\n• Split dose → 20% zyada efficiency\n• Soil test pe based dose → aur bhi sahi",
        emoji: "🧪",
      },
      {
        text: "Soil health card banwayen:\n• Agriculture department FREE mein karta hai\n• Test → targeted fertilizer dein\n• Zinc deficiency sabse common - ZnSO4 25kg/ha dein\n• Har 2-3 saal test karayen\n• Extra fertilizer cost bachta hai - paisa bhi aur mitti bhi safe!",
        emoji: "🔬",
      },
    ],
  },
  {
    topic: "irrigation",
    keywords: [
      "sinchai",
      "paani",
      "water",
      "drip",
      "irrigation",
      "sprinkler",
      "pani",
      "pump",
      "tubewell",
      "motor",
      "boring",
      "nali",
      "kheti ka paani",
      "irrigation",
    ],
    answers: [
      {
        text: "Drip irrigation ki subsidy:\n• SC/ST farmers → 90% subsidy\n• General farmers → 75% subsidy\n• PMKSY scheme se apply karein\n• District agriculture office mein form milega\n• Install hone ke baad 50% paani bachta hai + 30-40% zyada yield!",
        emoji: "💧",
      },
      {
        text: "Sinchai ka sahi time:\n• Subah ya shaam ko sinchai karein\n• Dopahar garmi mein roots burn ho sakti hain\n• Soil mein 2-3 inch gehraai tak nami maintain karein\n• Sandy mitti → frequent lekin kam paani\n• Clay mitti → kam frequent lekin zyada paani",
        emoji: "🌿",
      },
      {
        text: "Rainwater harvesting:\n• Farm pond (50x50ft for 5 acres) banayein\n• PMKSY mein 50% subsidy milti hai\n• Ek achha pond poori rabi season ki sinchai ke liye kaafi\n• Gujarat ke farmers ki income 40% badhi pond se\n• Apne agriculture officer se contact karein!",
        emoji: "🏞️",
      },
    ],
  },
  {
    topic: "selling",
    keywords: [
      "bechna",
      "sell",
      "sale",
      "listing",
      "list",
      "upload",
      "market",
      "bazaar",
      "kahan bechun",
      "kaise bechun",
      "order",
      "buyer",
      "kharidar",
      "bikri",
      "sell kaise",
    ],
    answers: [
      {
        text: "AgriGati par list karna bahut aasaan hai:\n1. 'My Crops' tab pe jaayein\n2. 'Add New' dabayein\n3. Fasal ka naam, category, quantity, price aur photo bharein\n4. 5 minute mein LIVE!\nDelhi-Mumbai ke buyers seedha order karte hain - koi middleman nahi!",
        emoji: "📱",
      },
      {
        text: "Seedha bechne ke fayde:\n• Middleman nahi → 20-30% zyada price\n• Payment 24-48 ghante mein seedha account mein\n• No cash - 100% digital\n• Bulk orders ke liye 'Negotiable Price' option rakhein\n• Hotels, cloud kitchens, retail chains - sab yahan hain!",
        emoji: "💰",
      },
      {
        text: "Rating 4.5+ ke liye tips:\n• Fresh harvest hi list karein\n• Sahi weight dein, photo achhi ho\n• Time pe deliver karein\n• Buyer messages ka jaldi jawab dein\n• 4.5+ rating = 40% zyada orders guarantee! (proven data)",
        emoji: "⭐",
      },
    ],
  },
  {
    topic: "seeds",
    keywords: [
      "beej",
      "seed",
      "variety",
      "nasal",
      "strain",
      "kaunsa lagayen",
      "kaunsi variety",
      "kaunsa beej",
      "best variety",
    ],
    answers: [
      {
        text: "Top sabzi varieties:\n• Tamatar: Pusa Ruby, Pusa Hybrid-2\n• Mirch: Pusa Jwala, Bharat\n• Gobi: Pusa Snowball K-1\n• Aalu: Kufri Jyoti, Kufri Chandramukhi\n• Bhindi: Pusa A-4, Parbhani Kranti\nICAR ki certified varieties tested aur reliable hain.",
        emoji: "🌱",
      },
      {
        text: "Top fruit varieties by demand:\n• Aam: Alphonso (hotels/export), Kesar (juice), Langra (general)\n• Angoor: Thompson Seedless (export)\n• Amrood: Allahabad Safeda, Lalit\n• Kela: Grand Naine, Rasthali\nApni location ke hisab se variety chunein - AgriGati par demand data bhi hai!",
        emoji: "🥭",
      },
    ],
  },
  {
    topic: "insurance",
    keywords: [
      "insurance",
      "bima",
      "fasal bima",
      "claim",
      "pmfby",
      "nuksan",
      "fasal ka nuksan",
      "coverage",
      "claim kaise",
    ],
    answers: [
      {
        text: "PMFBY (Pradhan Mantri Fasal Bima Yojana):\n• Kharif ke liye → July 31 deadline\n• Rabi ke liye → December 31 deadline\n• Premium sirf 2% (Kharif) aur 1.5% (Rabi)\n• Baaki government deti hai!\n• Apne bank ya CSC center pe turant register karein",
        emoji: "🛡️",
      },
      {
        text: "PMFBY Claim process:\n• Fasal kharab hone ke 72 ghante ke andar helpline 14447 pe call karein\n• Mobile app pe photo ke saath complaint register karein\n• Delay hone se claim reject ho sakta hai\n• Surveyor aayega, 45 din mein paise seedha account mein",
        emoji: "📞",
      },
    ],
  },
  {
    topic: "loan",
    keywords: [
      "loan",
      "karz",
      "credit",
      "bank",
      "kcc",
      "kisan credit",
      "paise",
      "subsidy",
      "sarkari madad",
      "yojana",
      "scheme",
    ],
    answers: [
      {
        text: "Kisan Credit Card (KCC):\n• 4% interest pe ₹3 lakh tak ka revolving credit!\n• Bank mein: fasal receipt + Aadhar + land papers lekar jayen\n• 7-14 din mein card milta hai\n• PM Kisan Helpline: 155261",
        emoji: "💳",
      },
      {
        text: "Sarkari schemes:\n• PM Kisan Samman Nidhi: ₹6000/saal seedha account mein\n• Agri infrastructure fund: 3% interest subsidy\n• NABARD RIDF: tractor/equipment ke liye 9-12% interest\n• Drip irrigation: 75-90% subsidy (PMKSY)\nGram Panchayat ya CSC center se apply karein!",
        emoji: "🏦",
      },
    ],
  },
  {
    topic: "mango",
    keywords: [
      "aam",
      "mango",
      "alphonso",
      "kesar",
      "langra",
      "dashehari",
      "chausa",
      "fazli",
    ],
    answers: [
      {
        text: "Aam ki peak season chal rahi hai!\n• Alphonso: ₹180-220/kg\n• Kesar: ₹120/kg\n• Langra: ₹90/kg\nHotels, juice factories aur exporters sab khareedna chahte hain. AgriGati par abhi list karein - premium buyers ready hain!",
        emoji: "🥭",
      },
      {
        text: "Aam harvesting tips:\n• Colour change aur soft touch se pata chalta hai pakne ka\n• Export ke liye ek hafte pehle kaatein (green stage)\n• Calcium carbide mat use karein - AgriGati buyers certified natural ripening maangte hain\n• QR code ke saath certified = 25% zyada price",
        emoji: "🌿",
      },
    ],
  },
  {
    topic: "corn_maize",
    keywords: ["makka", "corn", "maize", "bhutta", "makai"],
    answers: [
      {
        text: "Makka ki kheti:\n• Kharif: June-July mein lagayen\n• Best varieties: Ganga-5, Pro-311, DKC-9141\n• 90-100 din mein ready\n• Yield: 6-8 ton/hectare\n• Poultry aur starch industry se HIGH demand\n• Current bhaav: ₹18-22/kg",
        emoji: "🌽",
      },
      {
        text: "Makka mein Fall Armyworm (FAW):\n• Patta mein chhote chhid = early stage\n• Emamectin benzoate 5% SG (0.5g/L) spray karein\n• Biological: Metarhizium spray effective hai\n• Monitoring traps lagayen - early detection zaroori\n• Ek baar faiIne ke baad poori fasal khatam ho sakti hai",
        emoji: "💊",
      },
    ],
  },
  {
    topic: "demand_forecast",
    keywords: [
      "kya lagayen",
      "kya lagana chahiye",
      "plan",
      "forecast",
      "future demand",
      "aane wale mahine",
      "next season",
      "agla mahina",
      "kaunsa fasal",
      "demand high",
      "zyada bikne wala",
    ],
    answers: [
      {
        text: "AgriGati AI demand forecast (next 4 months):\n• Tamatar: HIGH (summer weddings)\n• Aam: HIGH (tourist season)\n• Pyaaz: MEDIUM (supply recovering)\n• Makka: HIGH (poultry feed)\n• Mirch: HIGH (export orders)\nTomato aur corn ab lagayen - peak season mein best price milega!",
        emoji: "🔮",
      },
      {
        text: "Festival season crops:\n• Holi ke baad: Hara dhaniya, poodina, kaddu HIGH\n• Eid season: Khajoor, meva HIGH\n• Diwali: Dry fruits, maize HIGH\n3-4 mahine pehle se planning → best bhaav milte hain.\nAgriGati AI dashboard par full forecast dekhen!",
        emoji: "📅",
      },
    ],
  },
  {
    topic: "organic",
    keywords: [
      "organic",
      "jaivik",
      "praakritik",
      "chemical free",
      "natural farming",
      "jeevamrut",
      "certification",
      "apeda",
    ],
    answers: [
      {
        text: "Organic farming ke fayde:\n• 30-40% zyada price market mein\n• APEDA certification ke baad export bhi\n• Mitti ki long-term sehat\n• Jeevamrut + Vermicompost + neem cake se shuru karein\n• 3 saal practice ke baad certification milti hai\nAgriGati par organic premium buyers available hain!",
        emoji: "♻️",
      },
    ],
  },
  {
    topic: "general_fallback",
    keywords: [],
    answers: [
      {
        text: "Kisan bhai, aapka sawaal samajh aaya! Koi bhi specific fasal ka naam bolen jaise 'tamatar', 'pyaaz', 'gehun', 'aam', 'makka' - aur main us fasal ke bhaav, keede ka ilaj, best variety, aur bechne ke tips sab bataunga. Ya poochein: mausam, loan, bima, khad - kuch bhi!",
        emoji: "🌾",
      },
      {
        text: "AgriGati par seedha Delhi-Mumbai ke buyers se deal karein - 20-30% zyada price guaranteed. Listing free hai! Koi specific fasal ya problem batayein - jaise 'tamatar mein keede' ya 'gehun ka bhaav' - seedha sahi jawab milelga.",
        emoji: "📱",
      },
      {
        text: "Fasal bima zaroor karayen - PMFBY mein sirf 1.5-2% premium. Helpline: 14447. Aur KCC (Kisan Credit Card) se ₹3 lakh tak 4% interest. Koi specific sawaal hai? Crop ka naam ya problem type karein!",
        emoji: "🛡️",
      },
      {
        text: "Season-wise best crops:\n• Rabi (Oct-Mar): gehun, sarson, chole, methi\n• Kharif (Jun-Sep): dhan, makka, soybean, moong\n• Zaid (Mar-Jun): lauki, khira, tarbooz\nDemand forecast ke liye AgriGati AI dashboard dekhen! Kaunsi fasal ke baare mein jaanna hai?",
        emoji: "📅",
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// BUYER KNOWLEDGE BASE — comprehensive, context-aware
// ══════════════════════════════════════════════════════════════════════════════
const BUYER_KB: { topic: string; keywords: string[]; answers: AIResponse[] }[] =
  [
    {
      topic: "greeting",
      keywords: [
        "namaskar",
        "hello",
        "hi",
        "namaste",
        "kaise",
        "kaun",
        "parichay",
        "help",
        "madad",
        "kya kar sakte",
        "kya jaante ho",
      ],
      answers: [
        {
          text: "Namaskar! Main AgriGati Buyer Assistant hoon. Aapke restaurant/hotel/business ke liye:\n• Fresh produce ki availability\n• Aaj ke live bhaav\n• Kal ka price forecast\n• Bulk deals aur weekly orders\n...sab kuch ek jagah! Kya poochna chahte hain?",
          emoji: "🙏",
        },
        {
          text: "Namaskar! AgriGati Buyer AI here! Main jaanta hoon:\n• Kahan se kya fresh mil raha hai\n• Aaj aur kal ka rate\n• Bulk discount kahan milega\n• Delivery kitne time mein hogi\nKoi bhi sawaal karein - seedha sahi jawab dunga!",
          emoji: "🤖",
        },
      ],
    },
    {
      topic: "price",
      keywords: [
        "price",
        "bhaav",
        "rate",
        "dam",
        "kimat",
        "bhav",
        "kitna",
        "kya hai",
        "cost",
        "kitne ka",
        "kitne mein",
        "sasta",
        "mehnga",
      ],
      answers: [
        {
          text: "Aaj ke live bhaav (AgriGati):\n• Tamatar: ₹35-42/kg (Nashik, super fresh!)\n• Pyaaz: ₹28-30/kg (Pune)\n• Aalu: ₹20-23/kg (Agra)\n• Aam Alphonso: ₹165/kg (Ratnagiri)\n• Mirch: ₹80/kg (Andhra)\nBulk 500kg+ par 10-15% discount milega!",
          emoji: "💰",
        },
        {
          text: "Premium restaurant-grade produce:\n• Organic tamatar: ₹55/kg\n• Cherry tomato: ₹90/kg\n• Mushroom: ₹120/kg\n• Baby corn: ₹70/kg\n• Organic spinach: ₹45/kg\nQR traceability ke saath - farm se aapki kitchen tak certified!",
          emoji: "⭐",
        },
        {
          text: "Anaj ke bulk bhaav:\n• Basmati: ₹75/kg (50kg+ order)\n• Non-Basmati chawal: ₹38/kg\n• Gehun atta: ₹32/kg\n• Makka: ₹17/kg\nWeekly standing order setup karein - guaranteed price stability!",
          emoji: "🌾",
        },
        {
          text: "Masale ke bhaav (bulk):\n• Dhaniya powder: ₹80/kg\n• Haldi: ₹65/kg\n• Lal Mirch powder: ₹95/kg\n• Jeera: ₹200/kg\nCloud kitchen aur restaurant owners ke liye weekly order best option hai!",
          emoji: "🌶️",
        },
      ],
    },
    {
      topic: "availability",
      keywords: [
        "kahan",
        "where",
        "nearby",
        "aaspaas",
        "paas",
        "close",
        "location",
        "available",
        "milega",
        "kab milega",
        "kab tak",
        "stock",
        "hai kya",
        "available hai",
      ],
      answers: [
        {
          text: "Aapke city ke hisab se availability:\n• Delhi NCR: Haryana gobi, UP aalu-tamatar, Punjab gehun - aaj available!\n• Mumbai: Nashik tamatar, Pune pyaaz, Ratnagiri aam - 6-10 ghante delivery\n• Bangalore: Karnataka veggies same day delivery!\n• Chennai: Tamil Nadu greens + Kerala spices",
          emoji: "📍",
        },
        {
          text: "AgriGati par 50,000+ farmers hain poore India mein!\n• Aapka order dein - nearest farmer se match karenge\n• Average distance sirf 150km hai\n• Delivery: 8-24 ghante guaranteed\n• Cold chain logistics se freshness preserve hoti hai",
          emoji: "🗺️",
        },
        {
          text: "Seasonal availability guide:\n• Jan-Mar: Strawberry, matar, aalu, gobi, gajar\n• Apr-Jun: Aam, tarbooz, angoor, kharbuja\n• Jul-Sep: Makka, sehjan, karela, drumstick\n• Oct-Dec: Seb, anar, broccoli, shimla mirch\nSeasonal items sabse saste aur freshest hote hain!",
          emoji: "📅",
        },
      ],
    },
    {
      topic: "forecast",
      keywords: [
        "kal",
        "tomorrow",
        "forecast",
        "aane wala",
        "future",
        "predict",
        "next week",
        "is hafte",
        "agle hafte",
        "badhega",
        "girega",
        "future price",
        "kal ka bhaav",
      ],
      answers: [
        {
          text: "Kal ka AI price forecast:\n• Tamatar: +4-6% (Maharashtra baarish → supply kam)\n• Pyaaz: stable ya +2%\n• Aam: -3% (Ratnagiri se extra stock aa raha)\n• Aalu: stable\n• Festival season → sugar, milk +10-15% ho sakta hai\nAbhi bulk khareedna samajhdari hai!",
          emoji: "🔮",
        },
        {
          text: "Is hafte ka trend:\n• Sabzian: 5-8% zyada costly (garmi ki wajah se)\n• Anaj: stable\n• Dahi/milk: slight demand pressure\n• Aam season end ho raha - last chance stock karne ka\n• Lychee season shuru ho rahi hai - acha deal milega!",
          emoji: "📊",
        },
        {
          text: "Festival season prediction:\n• Diwali ke pehle: sugar, dry fruits, ghee 20-30% mehenge honge\n• Holi: hara rang wali sabzian meheng\n• Ramzan: dates, dry fruits costly\nAgriGati par advance booking se FIXED price guarantee milti hai!",
          emoji: "🎉",
        },
      ],
    },
    {
      topic: "bulk_order",
      keywords: [
        "bulk",
        "order",
        "wholesale",
        "quantity",
        "zyada",
        "large",
        "500kg",
        "hotel",
        "restaurant",
        "kitchen",
        "cloud kitchen",
        "caterer",
        "sabse sasta",
      ],
      answers: [
        {
          text: "Bulk order ke fayde (500kg+):\n• 10-15% discount guaranteed\n• Dedicated farmer assigned\n• Weekly delivery schedule set kar sakte hain\n• Fixed price contract available\n• Hotel, restaurant, cloud kitchen owners ke liye B2B portal alag hai!",
          emoji: "📦",
        },
        {
          text: "Weekly standing order kaise setup karein:\n1. Browse → Product select karein\n2. 'Weekly Order' option choose karein\n3. Quantity aur delivery day set karein\n4. Done!\nGuaranteed fresh delivery + fixed price + kabhi stock khatam nahi. 80% buyers yahi karte hain!",
          emoji: "🔄",
        },
        {
          text: "Restaurant ke liye best deals aaj:\n• Tamatar 100kg: ₹3200 (₹32/kg)\n• Pyaaz 100kg: ₹2800\n• Mixed vegetables bundle 50kg: ₹1400\n• ₹5000+ ka order → free cold chain delivery!\nContact: buyers@agrigati.in for custom deals",
          emoji: "🍽️",
        },
      ],
    },
    {
      topic: "quality",
      keywords: [
        "quality",
        "fresh",
        "organic",
        "certified",
        "pure",
        "taaza",
        "good",
        "accha",
        "guarantee",
        "verified",
        "fresh hai kya",
        "kitna fresh",
        "kab ka",
      ],
      answers: [
        {
          text: "AgriGati quality guarantee:\n• Har batch ke saath QR code\n• Scan karke dekhen: farm location, harvest date, pesticide report\n• FSSAI compliant\n• Organic certified produce: Maharashtra, Karnataka, Uttarakhand se available\n• 98.7% orders problem-free!",
          emoji: "✅",
        },
        {
          text: "Quality issue par 100% refund policy:\n• Delivery ke 2 ghante ke andar app mein 'Quality Issue' report karein\n• Photo attach karein\n• 100% refund ya replacement - 24 ghante mein\n• Koi sawaal nahi poochha jaata\n• Customer satisfaction 99.2%!",
          emoji: "🛡️",
        },
      ],
    },
    {
      topic: "tracking",
      keywords: [
        "track",
        "kahan hai",
        "status",
        "delivery kab",
        "kab aayega",
        "location kya hai",
        "truck kahan",
        "live location",
        "map",
        "order status",
      ],
      answers: [
        {
          text: "Order track karna:\n1. Orders tab pe jayen\n2. Apna order select karein\n3. 'Track Order' dabayein\nReal-time map pe farm se aapke location tak truck ka exact position dikta hai, ETA ke saath. Bilkul Rapido jaisa experience!",
          emoji: "🚛",
        },
        {
          text: "Delivery status stages:\n1. Confirmed\n2. Packed (farm pe)\n3. In Transit (map par truck dikh raha hai)\n4. Arrived (hub)\n5. Out for Delivery\n6. Delivered\nHar step par SMS + app notification. Average: 8-16 ghante!",
          emoji: "📍",
        },
      ],
    },
    {
      topic: "payment",
      keywords: [
        "payment",
        "pay",
        "upi",
        "card",
        "cod",
        "cash",
        "paise",
        "refund",
        "bill",
        "invoice",
        "gst",
        "kaise bharen",
        "kaisa pay",
      ],
      answers: [
        {
          text: "Payment options AgriGati par:\n• UPI: PhonePe, GPay, Paytm\n• Credit/Debit card\n• Net banking\n• COD: upto ₹5000\n• B2B credit line: 15-30 day payment terms\n• GST invoice automatically generate hoti hai!",
          emoji: "💳",
        },
        {
          text: "Refund policy:\n• Quality issue → 100% refund in 24-48 ghante\n• Cancellation: delivery se 4 ghante pehle FREE\n• UPI refund: 2-4 ghante\n• Card refund: 5-7 days\n• AgriGati buyer satisfaction: 99.2%",
          emoji: "💰",
        },
      ],
    },
    {
      topic: "recipe_food",
      keywords: [
        "recipe",
        "kaise banate",
        "banana hai",
        "khana",
        "dish",
        "food",
        "cook",
        "pakana",
        "sabzi kaise",
        "dal kaise",
      ],
      answers: [
        {
          text: "Tamatar Paneer ki recipe:\n• Onion-garlic golden brown karein\n• Tamatar + masale (haldi, mirch, dhaniya) + salt\n• 10 min pakao\n• Paneer daalo + 5 min\n• AgriGati se fresh Nashik tamatar + Punjab paneer - best combo!\nOrder karo seedha farm se!",
          emoji: "🍳",
        },
        {
          text: "Bulk cooking tips for restaurants:\n• Fresh vegetables subah delivery → evening service perfect\n• AgriGati ka standing weekly order → kabhi stock nahi khatam\n• Cold chain delivery se shelf life 2x zyada\n• QR scan → ingredients ki full traceability menu mein dikhao - premium dikhta hai!",
          emoji: "🍽️",
        },
      ],
    },
    {
      topic: "delivery",
      keywords: [
        "delivery",
        "deliver",
        "kitne ghante",
        "kab tak pahuchega",
        "express",
        "fast delivery",
        "same day",
        "aaj hi chahiye",
        "urgent",
      ],
      answers: [
        {
          text: "Delivery timeline:\n• Metro cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad): 6-10 ghante\n• Tier 2 cities: 12-18 ghante\n• Remote areas: 24-36 ghante\nExpress delivery (4-6 ghante) premium charges ke saath available hai metro mein!",
          emoji: "🚛",
        },
        {
          text: "Aaj ki delivery ke liye:\n• Subah 9 baje tak order karein\n• Evening tak delivery\n• Same-day guarantee metro cities mein\n• Cold chain truck → freshness guaranteed\n• ₹5000+ order par delivery free!",
          emoji: "⚡",
        },
      ],
    },
    {
      topic: "general_fallback",
      keywords: [],
      answers: [
        {
          text: "Koi bhi sabzi, phal, ya anaaj ka naam batayein!\nJaise: 'tamatar ka bhaav kya hai', 'pyaaz kahan se milega', 'aam kal kitne ka hoga', 'bulk order kaise karein'\nMain turant sahi jawab dunga - nearest farmer aur best price ke saath!",
          emoji: "🛒",
        },
        {
          text: "AgriGati par aaj ke sabse fresh deals:\n• Tamatar ₹35/kg (Nashik)\n• Pyaaz ₹28/kg (Pune)\n• Aam ₹165/kg (Ratnagiri)\nBulk 500kg+ par 10-15% extra discount. Abhi order karein, 8-12 ghante mein delivery!",
          emoji: "💰",
        },
        {
          text: "AgriGati quality guarantee: har batch QR-coded. Scan karke farm, harvest date, pesticide report dekhen. Quality issue par 100% refund in 24 ghante - koi sawaal nahi! Kaunsa product chahiye aapko?",
          emoji: "✅",
        },
        {
          text: "Delivery tracker: Order tab pe jayen → order click karein → 'Track' dabayein → Real-time map par truck ka live location! ETA bhi milta hai. Koi delivery issue ho toh seedha app se report karein - 2 ghante mein resolve hota hai.",
          emoji: "🚛",
        },
      ],
    },
  ];

// ══════════════════════════════════════════════════════════════════════════════
// SMART RESPONSE ENGINE
// ══════════════════════════════════════════════════════════════════════════════

function findBestMatch(
  question: string,
  kb: { topic: string; keywords: string[]; answers: AIResponse[] }[],
): { topic: string; answers: AIResponse[] } | null {
  // Skip the fallback category in normal matching
  const searchableKb = kb.filter((c) => c.topic !== "general_fallback");
  let bestMatch: {
    topic: string;
    answers: AIResponse[];
    score: number;
  } | null = null;

  for (const category of searchableKb) {
    const score = scoreMatch(question, category.keywords);
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { topic: category.topic, answers: category.answers, score };
    }
  }

  return bestMatch;
}

// Rotate through fallbacks based on call count to avoid repetition
let farmerFallbackIdx = 0;
let buyerFallbackIdx = 0;

export function getAIFarmingResponse(question: string): AIResponse {
  const q = question.trim();

  // Short/empty input
  if (q.length < 2) {
    return {
      text: "Namaskar Kisaan Bhai! Main AgriGati ka AI assistant hoon. Sawaal bolein: fasal ka naam (jaise tamatar, gehun, dhan), mandi bhaav, mausam, keede, khad, ya bechne ke tips - main seedha sahi jawab dunga!",
      emoji: "🙏",
    };
  }

  // First: try fast fuzzy topic detection
  const topicHit = detectTopic(q);
  if (topicHit) {
    const cat = FARMER_KB.find((c) => c.topic === topicHit);
    if (cat) return pickAnswer(cat.answers, q);
  }

  // Second: score-based matching
  const match = findBestMatch(q, FARMER_KB);
  if (match) {
    return pickAnswer(match.answers, q);
  }

  // Rotate through fallbacks
  const fallbacks =
    FARMER_KB.find((c) => c.topic === "general_fallback")?.answers ?? [];
  if (fallbacks.length > 0) {
    const ans = fallbacks[farmerFallbackIdx % fallbacks.length];
    farmerFallbackIdx++;
    return ans;
  }

  return {
    text: "Kisan bhai, aapka sawaal samajh aaya! Fasal ka naam ya specific problem batayein - jaise 'tamatar mein keede', 'gehun ka bhaav', 'mausam alert' - main turant sahi jawab dunga!",
    emoji: "🌾",
  };
}

export function getAIBuyerResponse(question: string): AIResponse {
  const q = question.trim();

  // Short/empty input
  if (q.length < 2) {
    return {
      text: "Namaskar! Main AgriGati Buyer Assistant hoon. Poochein: kisi bhi sabzi/phal/anaaj ka bhaav, availability, delivery time, bulk deals, ya kal ka price forecast. Main seedha sahi jawab dunga!",
      emoji: "🙏",
    };
  }

  // First: fast fuzzy topic detection for buyer
  const topicHit = detectBuyerTopic(q);
  if (topicHit) {
    const cat = BUYER_KB.find((c) => c.topic === topicHit);
    if (cat) return pickAnswer(cat.answers, q);
  }

  // Second: score-based matching
  const match = findBestMatch(q, BUYER_KB);
  if (match) {
    return pickAnswer(match.answers, q);
  }

  // Rotate through fallbacks to avoid repetition
  const fallbacks =
    BUYER_KB.find((c) => c.topic === "general_fallback")?.answers ?? [];
  if (fallbacks.length > 0) {
    const ans = fallbacks[buyerFallbackIdx % fallbacks.length];
    buyerFallbackIdx++;
    return ans;
  }

  return {
    text: "AgriGati par 50,000+ farmers hain poore India mein. Koi bhi product ka naam batayein - tamatar, pyaaz, aam, gehun, makka - main nearest farmer aur best price seedha bata dunga!",
    emoji: "🛒",
  };
}
