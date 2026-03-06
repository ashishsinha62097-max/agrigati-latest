import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Cpu,
  Leaf,
  Mic,
  MicOff,
  Package,
  Send,
  ShoppingCart,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { BuyerUser, CropCategory } from "../../types/marketplace";
import { getAIBuyerResponse, selectBestVoice } from "../../utils/voiceAI";

// ── Buyer Hero Carousel ──────────────────────────────────────────────────────
const BUYER_CAROUSEL_SLIDES = [
  {
    img: "/assets/generated/buyer-hero-1.dim_800x400.jpg",
    title: "Fresh. Direct. Affordable.",
    sub: "India ke best farmers se seedha aapki kitchen tak",
    badge: "AgriGati Buyer",
  },
  {
    img: "/assets/generated/buyer-hero-2.dim_800x400.jpg",
    title: "Quality Guaranteed",
    sub: "Every batch traceable — farm, harvest date, quality report",
    badge: "Certified Fresh",
  },
  {
    img: "/assets/generated/buyer-hero-3.dim_800x400.jpg",
    title: "Bulk Orders. Best Price.",
    sub: "Hotels, restaurants, cloud kitchens — order in bulk & save",
    badge: "B2B Platform",
  },
];

function BuyerHeroCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIdx((p) => (p + 1) % BUYER_CAROUSEL_SLIDES.length),
      3800,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = BUYER_CAROUSEL_SLIDES[idx];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
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
            <span className="text-[10px] font-bold text-cyan-300 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
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
            (p) =>
              (p - 1 + BUYER_CAROUSEL_SLIDES.length) %
              BUYER_CAROUSEL_SLIDES.length,
          )
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        type="button"
        onClick={() => setIdx((p) => (p + 1) % BUYER_CAROUSEL_SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BUYER_CAROUSEL_SLIDES.map((s, i) => (
          <button
            type="button"
            key={s.title}
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

// ── Buyer Voice Assistant ────────────────────────────────────────────────────
interface BuyerChatMessage {
  id: string;
  type: "user" | "ai";
  text: string;
  emoji?: string;
}

function BuyerVoiceAssistant() {
  const { t, language } = useLanguage();
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<BuyerChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      text: "Namaskar! Main AgriGati Buyer Assistant hoon. Aapke aaspaas ki availability, aaj ke bhaav, kal ka forecast — sab kuch bolke poochh sakte hain. Mic dabaaiye!",
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
      const aiMsg: BuyerChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        text: "Is browser mein voice recognition support nahi hai. Lekin aap neeche type kar ke sawaal pooch sakte hain!",
        emoji: "ℹ️",
      };
      setMessages((prev) => [...prev.slice(-8), aiMsg]);
      speakText(aiMsg.text);
      return;
    }

    stopSpeaking();
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language.speechCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: {
      results: { [key: number]: { [key: number]: { transcript: string } } };
    }) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setListening(false);

      const userMsg: BuyerChatMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        text: spokenText,
      };
      setMessages((prev) => [...prev.slice(-8), userMsg]);

      const aiResponse = getAIBuyerResponse(spokenText);
      const aiMsg: BuyerChatMessage = {
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

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
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
    const userMsg: BuyerChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: q,
    };
    setMessages((prev) => [...prev.slice(-8), userMsg]);
    const aiResponse = getAIBuyerResponse(q);
    const aiMsg: BuyerChatMessage = {
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
          {listening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400/30"
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
            className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600"
          >
            <Cpu className="w-6 h-6" />
          </motion.button>
        </motion.div>
        <span className="text-[10px] text-muted-foreground font-body bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
          {t("aiBuyerAssistant")}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-20 right-2 left-2 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-3xl shadow-card-hover border border-cyan-100 z-20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm">
              {t("aiBuyerAssistant")}
            </p>
            <p className="text-white/70 text-[9px]">{t("buyerAssistantSub")}</p>
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
      <div className="h-52 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-cyan-50/30 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.type === "ai" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs mr-1 mt-1 flex-shrink-0">
                {msg.emoji ?? "🤖"}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs font-body leading-relaxed ${
                msg.type === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                  : "bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-bl-sm"
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
        <div className="px-4 py-2 bg-cyan-50 border-t border-cyan-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-cyan-500 rounded-full"
                  animate={{ height: [4, 12, 4, 16, 4] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.8,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-cyan-700 font-bold">
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
          className="flex-1 text-xs bg-cyan-50 border border-cyan-200 rounded-full px-3 py-2 outline-none focus:border-cyan-400 font-body text-gray-800 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!textInput.trim()}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white disabled:opacity-40"
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
                : "bg-gradient-to-br from-cyan-500 to-teal-600 shadow-cyan-200"
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
              className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-right">
          {listening ? (
            <p className="text-xs font-bold text-cyan-600">Hold to speak...</p>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              Press & hold mic
            </p>
          )}
          <p className="text-[9px] text-muted-foreground">Hindi / English</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Categories & Deals data ──────────────────────────────────────────────────
const CATEGORIES: {
  label: CropCategory;
  translationKey: "vegetables" | "fruits" | "grains" | "corn";
  Icon: React.ElementType;
  gradient: string;
}[] = [
  {
    label: "Vegetables",
    translationKey: "vegetables",
    Icon: Leaf,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    label: "Fruits",
    translationKey: "fruits",
    Icon: Package,
    gradient: "from-orange-400 to-red-500",
  },
  {
    label: "Grains",
    translationKey: "grains",
    Icon: TrendingUp,
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    label: "Corn",
    translationKey: "corn",
    Icon: ShoppingCart,
    gradient: "from-teal-500 to-cyan-600",
  },
];

const DEALS = [
  {
    name: "Tomato",
    farmer: "Ramu Kisan",
    location: "Nashik",
    price: 35,
    original: 45,
    badge: "20% OFF",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "Alphonso Mango",
    farmer: "Vijay Sawant",
    location: "Ratnagiri",
    price: 160,
    original: 180,
    badge: "Season Fresh",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Corn / Maize",
    farmer: "Baldev Kumar",
    location: "Bihar",
    price: 15,
    original: 18,
    badge: "Bulk Deal",
    color: "from-yellow-400 to-amber-500",
  },
  {
    name: "Onion",
    farmer: "Suresh Patil",
    location: "Pune",
    price: 25,
    original: 28,
    badge: "New Stock",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Grape",
    farmer: "Ganesh More",
    location: "Sangli",
    price: 65,
    original: 75,
    badge: "Export Quality",
    color: "from-violet-500 to-purple-600",
  },
];

export default function BuyerDashboard() {
  const { currentUser, orders } = useApp();
  const { t } = useLanguage();
  const [weatherBannerVisible, setWeatherBannerVisible] = useState(true);
  const buyer = currentUser as BuyerUser;
  const navigate = useNavigate();

  const myOrders = orders.filter((o) => o.buyerId === currentUser?.id);
  const activeOrders = myOrders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status),
  );

  return (
    <div className="max-w-2xl mx-auto text-white">
      {/* Weather Alert Banner */}
      {weatherBannerVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-orange-900/40 backdrop-blur-sm border-b border-orange-400/20 px-4 py-2.5 flex items-center gap-3"
        >
          <CloudRain className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <p className="text-xs text-orange-200 font-body flex-1">
            <strong>{t("weatherAlert")}:</strong> Heavy rain in Maharashtra —
            Onion prices may rise 15-20%. Lock in bulk orders now!
          </p>
          <button
            type="button"
            onClick={() => setWeatherBannerVisible(false)}
            className="text-orange-400 hover:text-orange-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      <div className="px-4 py-4 space-y-5">
        {/* Hero Banner with AgriGati logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-teal-800 via-cyan-700 to-blue-700 rounded-2xl p-5 text-white overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 opacity-10 text-8xl flex items-center pr-4">
            🌿
          </div>
          <div className="relative">
            <p className="text-white/70 text-xs font-body">
              {t("welcome")}, {buyer?.businessName ?? buyer?.name}!
            </p>
            <h2 className="font-display font-black text-lg mt-1 leading-tight">
              {t("freshFromFarm")}
            </h2>
            <p className="text-white/70 text-xs font-body mt-1">
              {t("orderInMinutes")}
            </p>
            <Link to="/buyer/browse">
              <Button
                size="sm"
                className="mt-3 bg-amber-brand hover:bg-amber-dark text-forest-dark font-bold h-8 text-xs gap-1"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {t("browseProducts")}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Buyer Hero Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BuyerHeroCarousel />
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: t("orders"),
              value: myOrders.length,
              icon: Package,
              color: "text-blue-300 bg-blue-500/20 border-blue-400/20",
            },
            {
              label: t("active"),
              value: activeOrders.length,
              icon: TrendingUp,
              color: "text-emerald-300 bg-emerald-500/20 border-emerald-400/20",
            },
            {
              label: t("spent"),
              value: `₹${myOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString("en-IN")}`,
              icon: Leaf,
              color: "text-amber-300 bg-amber-500/20 border-amber-400/20",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl p-3 text-center backdrop-blur-sm ${s.color} border`}
            >
              <s.icon className="w-4 h-4 mx-auto mb-1" />
              <p className="font-display font-black text-base text-white">
                {s.value}
              </p>
              <p className="text-[10px] font-body opacity-70 text-white">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick listing shortcut buttons */}
        <div className="flex gap-2 flex-wrap">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              void navigate({
                to: "/buyer/browse",
                search: { category: "Vegetables" },
              })
            }
            className="flex-1 min-w-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-display font-bold text-xs px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5"
          >
            {t("vegetableListing")}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              void navigate({
                to: "/buyer/browse",
                search: { category: "Fruits" },
              })
            }
            className="flex-1 min-w-0 bg-gradient-to-r from-orange-400 to-red-500 text-white font-display font-bold text-xs px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5"
          >
            {t("fruitListing")}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              void navigate({
                to: "/buyer/browse",
                search: { category: "Grains" },
              })
            }
            className="flex-1 min-w-0 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-display font-bold text-xs px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5"
          >
            {t("cropListing")}
          </motion.button>
        </div>

        {/* Category quick-select */}
        <div>
          <h3 className="font-display font-bold text-base text-white mb-3">
            {t("shopByCategory")}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                type="button"
                key={cat.label}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  void navigate({
                    to: "/buyer/browse",
                    search: { category: cat.label },
                  })
                }
                className={`bg-gradient-to-br ${cat.gradient} text-white rounded-2xl p-3 text-center cursor-pointer transition-all w-full`}
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                  <cat.Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-display font-bold">
                  {t(cat.translationKey)}
                </p>
                <p className="text-[10px] text-white/70 font-body">
                  {t("browse")}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Today's Best Deals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-base text-white">
              {t("todaysBestDeals")}
            </h3>
            <Link
              to="/buyer/browse"
              className="text-xs text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
            >
              {t("seeAll")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {DEALS.map((deal) => (
              <motion.div
                key={deal.name}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 w-36 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-3"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${deal.color} flex items-center justify-center text-white font-black text-lg mx-auto mb-2`}
                >
                  {deal.name[0]}
                </div>
                <p className="font-display font-bold text-sm text-white truncate text-center">
                  {deal.name}
                </p>
                <p className="text-[10px] text-white/60 font-body text-center">
                  {deal.farmer} • {deal.location}
                </p>
                <div className="mt-2 flex items-center gap-1 justify-center">
                  <span className="font-display font-black text-base text-emerald-300">
                    ₹{deal.price}
                  </span>
                  <span className="text-[10px] text-white/40 line-through">
                    ₹{deal.original}
                  </span>
                </div>
                <span className="inline-block mt-1 text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                  {deal.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Buyer Voice Assistant FAB */}
      <BuyerVoiceAssistant />
    </div>
  );
}
