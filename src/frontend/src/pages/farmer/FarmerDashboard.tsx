import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Apple,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Cpu,
  Flame,
  IndianRupee,
  Leaf,
  Mic,
  MicOff,
  Package,
  Send,
  Smartphone,
  Snowflake,
  Sprout,
  Sun,
  Thermometer,
  TrendingUp,
  Users,
  Volume2,
  VolumeX,
  Wheat,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { DEMAND_FORECASTS, WEATHER_ALERTS } from "../../data/seedData";
import type { DemandForecast, WeatherAlert } from "../../types/marketplace";
import type { FarmerUser } from "../../types/marketplace";
import { getAIFarmingResponse, selectBestVoice } from "../../utils/voiceAI";

// ── Hero Carousel ──────────────────────────────────────────────────────────────
const CAROUSEL_SLIDES = [
  {
    img: "/assets/generated/farmer-hero-1.dim_800x500.jpg",
    title: "Apni Fasal. Apna Bhaav.",
    sub: "Seedha kharidar tak pahunchayen apni mazboot fasal",
    badge: "AgriGati",
  },
  {
    img: "/assets/generated/farmer-hero-2.dim_800x500.jpg",
    title: "Seedha Kharidar Tak.",
    sub: "20%+ zyada kamayi, koi bhi middleman nahi",
    badge: "Direct Sell",
  },
  {
    img: "/assets/generated/farmer-hero-3.dim_800x500.jpg",
    title: "AgriGati ke Saath Barho!",
    sub: "AI ki madad se sahi samay pe sahi fasal lagayen",
    badge: "AI Powered",
  },
  {
    img: "/assets/generated/farmer-banner-agrigati.dim_800x400.jpg",
    title: "Kheto Mein AgriGati",
    sub: "Apne khet se seedha bazaar tak — digital bridge",
    badge: "Brand",
  },
  {
    img: "/assets/generated/farmer-admin-pointing.dim_800x400.jpg",
    title: "Expert Team Aapke Saath",
    sub: "AgriGati ke advisors aapko best price dilaayenge",
    badge: "Support",
  },
  {
    img: "/assets/generated/farmer-khet-agrigati.dim_800x400.jpg",
    title: "Hamare Kheton Ki Kahani",
    sub: "Har ek fasal ek nayi umeed — AgriGati ke saath",
    badge: "Inspire",
  },
];

function HeroCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIdx((p) => (p + 1) % CAROUSEL_SLIDES.length),
      3500,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = CAROUSEL_SLIDES[idx];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-card"
      style={{ aspectRatio: "16/7" }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={slide.img}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-[10px] font-bold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {slide.badge}
            </span>
            <h2 className="font-display font-black text-lg text-white mt-1 leading-tight">
              {slide.title}
            </h2>
            <p className="text-white/80 text-xs font-body mt-0.5">
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Arrow controls */}
      <button
        type="button"
        onClick={() =>
          setIdx(
            (p) => (p - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length,
          )
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        type="button"
        onClick={() => setIdx((p) => (p + 1) % CAROUSEL_SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {CAROUSEL_SLIDES.map((slide, i) => (
          <button
            type="button"
            key={slide.title}
            onClick={() => setIdx(i)}
            className={`transition-all duration-300 rounded-full ${
              i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Mandi Ticker ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🍅 Tamatar: ₹35/kg ▲",
  "🧅 Pyaaz: ₹28/kg →",
  "🥭 Aam: ₹180/kg ▲",
  "🌾 Gehun: ₹24/kg →",
  "🌶️ Mirch: ₹85/kg ▼",
  "🥔 Aalu: ₹22/kg ▲",
  "🍇 Angoor: ₹75/kg ▲",
  "🥦 Gobi: ₹30/kg ▼",
  "🍌 Kela: ₹42/kg →",
  "🫘 Chana: ₹55/kg ▲",
];

function MandiTicker() {
  const { t } = useLanguage();
  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-blue-700 rounded-xl overflow-hidden py-2 shadow-card">
      <div className="flex items-center gap-2 px-3 mb-1">
        <TrendingUp className="w-3 h-3 text-emerald-300 flex-shrink-0" />
        <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
          {t("mandiPrices")}
        </span>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-4 text-white text-xs font-body whitespace-nowrap"
          style={{ animation: "marquee 20s linear infinite" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={`ticker-${i}-${item}`} className="flex-shrink-0 px-1">
              {item}
              <span className="text-white/30 ml-3">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({
  value,
  prefix = "",
  duration = 1200,
}: { value: number; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === 0) return;
    startTime.current = null;
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString("en-IN")}
    </span>
  );
}

// ── Farmer Photos section ──────────────────────────────────────────────────────
const FARMER_PHOTOS = [
  {
    img: "/assets/generated/farmer-photo-1.dim_400x400.jpg",
    name: "Kamla Devi",
    state: "UP",
    crop: "🍅 Tamatar",
  },
  {
    img: "/assets/generated/farmer-photo-2.dim_400x400.jpg",
    name: "Gurpreet Singh",
    state: "Punjab",
    crop: "🌾 Gehun",
  },
  {
    img: "/assets/generated/farmer-photo-3.dim_400x400.jpg",
    name: "Rajesh Patil",
    state: "Maharashtra",
    crop: "🥭 Aam",
  },
];

function FarmerStories() {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="font-display font-bold text-sm text-white flex items-center gap-2 mb-3">
        <span className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
        {t("successfulFarmers")}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FARMER_PHOTOS.map((f) => (
          <motion.div
            key={f.name}
            whileHover={{ scale: 1.04 }}
            className="flex-shrink-0 w-28 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-card border border-white/20"
          >
            <img
              src={f.img}
              alt={f.name}
              className="w-full h-24 object-cover"
            />
            <div className="p-2">
              <p className="font-display font-bold text-xs text-white leading-tight">
                {f.name}
              </p>
              <p className="text-[10px] text-white/60">{f.state}</p>
              <p className="text-[10px] font-semibold text-emerald-300 mt-1">
                {f.crop}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Farming Tips ──────────────────────────────────────────────────────────────
const TIPS = [
  {
    Icon: Leaf,
    iconColor: "text-emerald-400",
    bgColor: "from-emerald-500/30 to-green-500/30",
    title: "Organic Certification",
    desc: "3 saal organic farming ke baad APEDA se certification paayen. Premium 30% zyada milega.",
  },
  {
    Icon: Smartphone,
    iconColor: "text-blue-400",
    bgColor: "from-blue-500/30 to-cyan-500/30",
    title: "Mandi se Seedha Contact",
    desc: "AgriGati par direct buyers se milein. Middleman hataayen, seedha faayda paayein.",
  },
  {
    Icon: CloudRain,
    iconColor: "text-sky-400",
    bgColor: "from-sky-500/30 to-blue-500/30",
    title: "Monsoon Preparation",
    desc: "Baarish se pehle naali saaf karein, fasal ka bima karaayen, storage ka intezaam karein.",
  },
  {
    Icon: Snowflake,
    iconColor: "text-cyan-400",
    bgColor: "from-cyan-500/30 to-slate-500/30",
    title: "Cold Storage Options",
    desc: "Government cold storage 50% subsidy par milta hai. FPO ke through apply karein.",
  },
  {
    Icon: Users,
    iconColor: "text-teal-400",
    bgColor: "from-teal-500/30 to-emerald-500/30",
    title: "FPO ke Fayde",
    desc: "Farmer Producer Organization se judein - bulk me bechein, bulk me khareedein, loan aasaan milega.",
  },
];

function TipsSection() {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="font-display font-bold text-sm text-white flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-amber-400" />
        {t("farmingTips")}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {TIPS.map((tip) => (
          <motion.div
            key={tip.title}
            whileHover={{ scale: 1.03, y: -2 }}
            className="flex-shrink-0 w-44 bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-card border border-white/15"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tip.bgColor} flex items-center justify-center mb-2`}
            >
              <tip.Icon className={`w-5 h-5 ${tip.iconColor}`} />
            </div>
            <p className="font-display font-bold text-xs text-white leading-snug">
              {tip.title}
            </p>
            <p className="text-[10px] text-white/60 mt-1 leading-relaxed line-clamp-3">
              {tip.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Weather Icon ──────────────────────────────────────────────────────────────
const weatherIcon = (type: string) => {
  if (type.toLowerCase().includes("rain"))
    return <CloudRain className="w-5 h-5" />;
  if (
    type.toLowerCase().includes("heat") ||
    type.toLowerCase().includes("cyclone")
  )
    return <Thermometer className="w-5 h-5" />;
  if (type.toLowerCase().includes("fog") || type.toLowerCase().includes("wind"))
    return <Wind className="w-5 h-5" />;
  if (type.toLowerCase().includes("frost"))
    return <Snowflake className="w-5 h-5" />;
  return <Sun className="w-5 h-5" />;
};

const severityStyle: Record<string, string> = {
  high: "from-red-100 to-red-50 border-red-200 text-red-700",
  medium: "from-orange-100 to-amber-50 border-orange-200 text-orange-700",
  low: "from-green-100 to-emerald-50 border-green-200 text-green-700",
};

function WeatherAlertCard({ alert }: { alert: WeatherAlert }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-2xl border bg-gradient-to-r p-4 ${severityStyle[alert.severity]} flex gap-3 items-start`}
    >
      <div className="mt-0.5 flex-shrink-0">{weatherIcon(alert.alertType)}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-black text-xs uppercase tracking-wide">
            {alert.alertType}
          </span>
          <Badge
            className="text-[10px] px-1.5 py-0 capitalize border"
            variant="outline"
          >
            {alert.severity}
          </Badge>
        </div>
        <p className="font-body text-xs font-bold mt-0.5">{alert.region}</p>
        <p className="font-body text-xs mt-0.5 opacity-80 leading-relaxed">
          {alert.message}
        </p>
      </div>
    </motion.div>
  );
}

// ── Demand Card ───────────────────────────────────────────────────────────────
const demandStyle: Record<string, string> = {
  HIGH: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
  MEDIUM: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  LOW: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
};

const trendIcon: Record<string, string> = {
  HIGH: "▲ Rising",
  MEDIUM: "→ Stable",
  LOW: "▼ Falling",
};

function DemandCard({ forecast }: { forecast: DemandForecast }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-3 shadow-card flex flex-col gap-2"
    >
      <div className="text-4xl text-center">{forecast.cropEmoji}</div>
      <p className="font-display font-black text-xs text-center text-white">
        {forecast.cropName}
      </p>
      <div
        className={`text-[10px] font-bold text-center px-2 py-1 rounded-xl mx-auto w-full ${demandStyle[forecast.demandLevel]}`}
      >
        {forecast.demandLevel}
      </div>
      <p
        className={`text-[10px] font-bold text-center ${
          forecast.demandLevel === "HIGH"
            ? "text-emerald-600"
            : forecast.demandLevel === "MEDIUM"
              ? "text-amber-600"
              : "text-slate-500"
        }`}
      >
        {trendIcon[forecast.demandLevel]}
      </p>
      <p className="text-[9px] text-white/60 text-center leading-relaxed line-clamp-2">
        {forecast.reason}
      </p>
      <p className="text-[9px] font-bold text-teal-300 text-center bg-teal-500/20 rounded-lg py-1">
        📅 {forecast.recommendedMonths}
      </p>
    </motion.div>
  );
}

// ── AI Voice Assistant ────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  type: "user" | "ai";
  text: string;
  emoji?: string;
}

function VoiceAssistant() {
  const { language, t } = useLanguage();
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      text: "Namaskar Kisaan Bhai! 🙏 Main aapka AI farming assistant hoon. Fasal, mausam, bhaav ya koi bhi sawaal poochein - microphone dabaakar bolo!",
      emoji: "🤖",
    },
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [textInput, setTextInput] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language.speechCode;
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    const trySpeak = () => {
      const bestVoice = selectBestVoice(language.speechCode);
      if (bestVoice) utterance.voice = bestVoice;
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", trySpeak, {
        once: true,
      });
    } else {
      trySpeak();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const aiRes = getAIFarmingResponse("demo question");
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        text: "Is browser mein voice recognition support nahi hai. Lekin aap neeche type kar ke sawaal pooch sakte hain!",
        emoji: "ℹ️",
      };
      setMessages((prev) => [...prev.slice(-8), aiMsg]);
      speakText(aiMsg.text);
      void aiRes;
      return;
    }

    stopSpeaking();
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language.speechCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setListening(false);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        text: spokenText,
      };
      setMessages((prev) => [...prev.slice(-8), userMsg]);

      // Get AI response
      const aiResponse = getAIFarmingResponse(spokenText);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        text: aiResponse.text,
        emoji: aiResponse.emoji,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev.slice(-8), aiMsg]);
        speakText(aiMsg.text);
      }, 400);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = textInput.trim();
    if (!q) return;
    setTextInput("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: q,
    };
    setMessages((prev) => [...prev.slice(-8), userMsg]);
    const aiResponse = getAIFarmingResponse(q);
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      type: "ai",
      text: aiResponse.text,
      emoji: aiResponse.emoji,
    };
    setTimeout(() => {
      setMessages((prev) => [...prev.slice(-8), aiMsg]);
      speakText(aiMsg.text);
    }, 400);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-24 right-4 flex flex-col items-end gap-2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          {/* Ripple rings when listening */}
          {listening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400/30"
                animate={{ scale: [1, 1.6, 1.8], opacity: [0.6, 0.2, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-teal-400/20"
                animate={{ scale: [1, 2, 2.4], opacity: [0.4, 0.1, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  delay: 0.3,
                }}
              />
            </>
          )}
          <motion.button
            type="button"
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600"
          >
            <Cpu className="w-6 h-6" />
          </motion.button>
        </motion.div>
        <span className="text-[10px] text-muted-foreground font-body bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
          {t("aiAssistant")}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-20 right-2 left-2 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-3xl shadow-card-hover border border-emerald-100 z-20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm">
              {t("aiAssistant")}
            </p>
            <p className="text-white/70 text-[9px]">
              {t("farmerAssistantSub")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors"
        >
          ×
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-52 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-emerald-50/30 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.type === "ai" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs mr-1 mt-1 flex-shrink-0">
                {msg.emoji ?? "🤖"}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs font-body leading-relaxed ${
                msg.type === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                  : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Listening indicator */}
      {listening && (
        <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full"
                  animate={{ height: [4, 12, 4, 16, 4] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.8,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-emerald-700 font-bold">
              {t("listening")}
            </span>
          </div>
        </div>
      )}

      {/* Transcript */}
      {transcript && !listening && (
        <div className="px-4 py-1.5 bg-blue-50 border-t border-blue-100">
          <p className="text-[10px] text-blue-600 font-body">
            Aapne kaha: "{transcript}"
          </p>
        </div>
      )}

      {/* Text Input */}
      <form
        onSubmit={handleTextSubmit}
        className="px-3 pb-2 pt-1 bg-white border-t border-border flex gap-2 items-center"
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={t("askQuestion")}
          className="flex-1 text-xs bg-emerald-50 border border-emerald-200 rounded-full px-3 py-2 outline-none focus:border-emerald-400 font-body text-gray-800 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!textInput.trim()}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Controls */}
      <div className="p-3 border-t border-border bg-white flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <motion.button
            type="button"
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            disabled={speaking}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
              listening
                ? "bg-red-500 shadow-red-200"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200"
            }`}
          >
            {listening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>
          {speaking && (
            <motion.button
              type="button"
              onClick={stopSpeaking}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-md"
            >
              <VolumeX className="w-4 h-4" />
            </motion.button>
          )}
          {!speaking && messages.length > 1 && (
            <button
              type="button"
              onClick={() => speakText(messages[messages.length - 1].text)}
              className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-right">
          {listening ? (
            <p className="text-xs font-bold text-emerald-600">
              🎤 Hold to speak...
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              Press & hold mic
            </p>
          )}
          <p className="text-[9px] text-muted-foreground">{language.name}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const { currentUser, listings, orders } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const farmer = currentUser as FarmerUser;

  const myListings = listings.filter((l) => l.farmerId === farmer?.id);
  const myOrders = orders.filter((o) => o.farmerId === farmer?.id);
  const totalEarnings = myOrders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 200 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-4 py-4 max-w-2xl mx-auto space-y-5 pb-28"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-emerald-700 via-teal-600 to-blue-600 rounded-2xl p-4 text-white shadow-card relative overflow-hidden"
      >
        <div>
          <p className="text-white/60 text-xs font-body flex items-center gap-1">
            🙏 {t("welcome")}
          </p>
          <h2 className="font-display font-black text-2xl mt-0.5">
            {farmer?.name ?? "Farmer"}
          </h2>
          <p className="text-white/60 text-xs font-body">
            📍 {farmer?.district ? `${farmer.district}, ` : ""}
            {farmer?.state ?? "India"}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: t("myCrops"), value: myListings.length, icon: Sprout },
              { label: t("orders"), value: myOrders.length, icon: Package },
              {
                label: t("earnings"),
                value: totalEarnings,
                icon: IndianRupee,
                isRupee: true,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-4 h-4 mx-auto text-emerald-300 mb-1" />
                <p className="font-display font-black text-base">
                  {stat.isRupee ? (
                    <AnimatedCounter value={stat.value as number} prefix="₹" />
                  ) : (
                    <AnimatedCounter value={stat.value as number} />
                  )}
                </p>
                <p className="text-white/50 text-[10px] font-body">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Hero Carousel */}
      <motion.div variants={itemVariants}>
        <HeroCarousel />
      </motion.div>

      {/* Mandi Ticker */}
      <motion.div variants={itemVariants}>
        <MandiTicker />
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div variants={itemVariants}>
        <h3 className="font-display font-bold text-sm text-white flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
          {t("quickAdd")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              Icon: Leaf,
              labelKey: "vegetableListing" as const,
              color: "from-emerald-500 to-green-600",
            },
            {
              Icon: Apple,
              labelKey: "fruitListing" as const,
              color: "from-orange-400 to-red-500",
            },
            {
              Icon: Wheat,
              labelKey: "cropListing" as const,
              color: "from-amber-500 to-yellow-600",
            },
            {
              Icon: Flame,
              labelKey: "spices" as const,
              color: "from-teal-500 to-cyan-600",
            },
          ].map((item) => (
            <motion.button
              key={item.labelKey}
              type="button"
              onClick={() => void navigate({ to: "/farmer/listings" })}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${item.color} text-white`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-sm">
                  {t(item.labelKey)}
                </p>
                <p className="text-white/70 text-[10px]">{t("addNow")}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Farmer Stories */}
      <motion.div variants={itemVariants}>
        <FarmerStories />
      </motion.div>

      {/* Weather Alerts */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-300" />
            {t("weatherAlert")}
          </h3>
          <span className="text-xs text-white/50 font-body">March 2026</span>
        </div>
        <div className="space-y-2">
          {WEATHER_ALERTS.map((alert) => (
            <WeatherAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </motion.div>

      {/* Demand Forecast */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            {t("demandForecast")}
          </h3>
          <span className="text-xs text-white/50 font-body">Next 4 months</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {DEMAND_FORECASTS.map((forecast) => (
            <DemandCard key={forecast.cropName} forecast={forecast} />
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants}>
        <TipsSection />
      </motion.div>

      {/* AI Voice Assistant FAB */}
      <VoiceAssistant />
    </motion.div>
  );
}
