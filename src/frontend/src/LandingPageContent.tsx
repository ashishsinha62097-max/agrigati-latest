import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Cpu,
  Globe,
  Leaf,
  Loader2,
  LogIn,
  Mail,
  MapPin,
  Menu,
  Phone,
  Recycle,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { OrganizationType } from "./backend";
import { AnimatedStarsBg } from "./components/AnimatedStarsBg";
import { AgriGatiTruckIcon } from "./components/SplashScreen";
import { useActor } from "./hooks/useActor";
import { useIncrementVisitCount, useSubmitContact } from "./hooks/useQueries";

/* ─── smooth scroll helper ──────────────────────────── */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ─── fade-in variants ───────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Nav links ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Problem", id: "problem" },
  { label: "Solution", id: "solution" },
  { label: "Ecosystem", id: "ecosystem" },
  { label: "Why Us", id: "why-us" },
  { label: "Roadmap", id: "roadmap" },
  { label: "Contact", id: "contact" },
];

/* ═══════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-sm border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 focus:outline-none group"
        >
          <AgriGatiTruckIcon size={36} />
          <span
            className="font-display font-black text-xl tracking-tight transition-colors"
            style={{
              background: "linear-gradient(135deg, #34d399, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AgriGati
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`font-body text-sm font-medium transition-colors hover:text-amber-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand rounded ${
                scrolled ? "text-white/85" : "text-white/85"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <Link to="/login">
              <Button
                size="sm"
                variant="outline"
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="bg-amber-brand hover:bg-amber-dark text-foreground font-semibold shadow-amber gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg transition-colors text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-md border-b border-white/10 overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => {
                    scrollTo(link.id);
                    setMobileOpen(false);
                  }}
                  className="text-left py-3 px-3 rounded-lg text-white/80 font-medium hover:bg-white/10 hover:text-amber-brand transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-amber-brand hover:bg-amber-dark text-foreground font-semibold gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    Sign Up
                  </Button>
                </Link>
              </div>
              <Button
                className="mt-2 bg-forest hover:bg-forest-dark text-white font-semibold"
                onClick={() => {
                  scrollTo("contact");
                  setMobileOpen(false);
                }}
              >
                Join the Revolution
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/generated/hero-farm-to-city.dim_1600x700.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/80" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest/30 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-amber-brand/20 border border-amber-brand/40 text-amber-brand text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Leaf className="w-3 h-3" />
              B2B Agri-Logistics Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display font-black text-6xl sm:text-7xl lg:text-8xl xl:text-9xl tracking-tight leading-none mb-4"
          >
            Agri
            <span className="text-amber-brand">Gati</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-display font-semibold text-xl sm:text-2xl lg:text-3xl text-white/90 mb-3 tracking-wide"
          >
            Moving India's Agriculture Forward
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="font-body italic text-base sm:text-lg text-white/70 mb-10 max-w-2xl"
          >
            "We don't just move food; we move it intelligently."
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-amber-brand hover:bg-amber-dark text-foreground font-bold text-base px-8 py-6 shadow-glow transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("problem")}
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold text-base px-8 py-6"
            >
              Learn More
              <ChevronDown className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float"
        >
          <button
            type="button"
            onClick={() => scrollTo("problem")}
            className="text-white/50 hover:text-white/80 transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-7 h-7" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 1: THE URGENCY
═══════════════════════════════════════════════════════ */
function UrgencySection() {
  const problems = [
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "The Waste Crisis",
      stat: "30-40%",
      desc: "of produce lost post-harvest across India. Billions in value — gone.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "The Middleman Maze",
      stat: "<40%",
      desc: "of final price reaches farmers. Opaque intermediaries pocket the rest.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "The Information Gap",
      stat: "Zero",
      desc: "Farmers plant blind. Buyers buy blind. No traceability. No data.",
    },
  ];

  return (
    <section id="problem" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-crimson/20 border border-crimson/40 text-red-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            🇮🇳 Why We're Solving This NOW
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
            The Indian Context:
            <br />
            <span className="text-red-400">A Broken Chain</span>
          </h2>
          <p className="font-body text-lg text-white/60 max-w-2xl">
            India's agriculture produces enough to feed the world. Yet we lose
            staggering value at every step.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {problems.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeIn}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-crimson/20 hover:border-crimson/50 hover:bg-white/8 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-crimson/5 rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 bg-crimson/20 rounded-xl flex items-center justify-center text-red-300 mb-5 group-hover:bg-crimson group-hover:text-white transition-colors duration-300">
                  {p.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  {p.title}
                </h3>
                <p className="font-display font-black text-5xl text-red-400 mb-3">
                  {p.stat}
                </p>
                <p className="font-body text-white/60 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 2: THE SOLUTION
═══════════════════════════════════════════════════════ */
function SolutionSection() {
  const features = [
    {
      icon: <Wheat className="w-5 h-5" />,
      title: "Universal Catalog",
      desc: "From Bihar's Litchis to Andhra's Chillies. Every crop. Every region.",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Higher Income",
      desc: "Direct access increases farmer earnings by 20%+.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Ultra-Fresh & Bulk",
      desc: "Perishables delivered in <12 hours. Staples with certified quality.",
    },
  ];

  return (
    <section id="solution" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3 h-3" />
            The Solution
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5">
            The Digital
            <span className="text-green-400"> Bridge</span>
          </h2>
          <p className="font-body text-lg text-white/60 max-w-3xl">
            AgriGati is the national B2B marketplace connecting Farm Gate
            directly to Urban Businesses — eliminating middlemen and restoring
            fair value.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-16"
        >
          <div className="flex flex-col items-center gap-3 bg-white/8 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/15 min-w-36">
            <span className="text-4xl">👨‍🌾</span>
            <span className="font-display font-bold text-sm text-white uppercase tracking-wide">
              Farmer
            </span>
            <span className="text-xs text-white/50">Farm Gate</span>
          </div>
          <div className="hidden sm:flex items-center gap-0 flex-1 max-w-24">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-green-500 to-amber-brand" />
            <ArrowRight className="w-5 h-5 text-amber-brand -ml-1 flex-shrink-0" />
          </div>
          <div className="sm:hidden text-amber-brand">
            <ChevronDown className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-center gap-3 bg-forest rounded-2xl px-8 py-6 border border-green-500/40 min-w-44 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-blue-900/80" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-amber-brand rounded-xl flex items-center justify-center shadow-amber animate-pulse-gentle">
                <Cpu className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-display font-bold text-sm text-white uppercase tracking-wide">
                AgriGati AI
              </span>
              <span className="text-xs text-white/70">Platform</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-0 flex-1 max-w-24">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-brand to-blue-400" />
            <ArrowRight className="w-5 h-5 text-blue-400 -ml-1 flex-shrink-0" />
          </div>
          <div className="sm:hidden text-amber-brand">
            <ChevronDown className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-center gap-3 bg-white/8 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/15 min-w-36">
            <span className="text-4xl">🏨</span>
            <span className="font-display font-bold text-sm text-white uppercase tracking-wide">
              Buyer
            </span>
            <span className="text-xs text-white/50">Urban Business</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeIn}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/40 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-300 flex-shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white mb-1">
                    ✅ {f.title}
                  </h3>
                  <p className="font-body text-sm text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 3: THE ECOSYSTEM
═══════════════════════════════════════════════════════ */
function EcosystemSection() {
  const interfaces = [
    {
      emoji: "👨‍🌾",
      label: "For Farmers",
      subtitle: "The Supply",
      image: "/assets/generated/farmer-app.dim_600x500.jpg",
      points: [
        {
          icon: <Globe className="w-4 h-4" />,
          title: "Vernacular First",
          desc: "App in all major Indian languages with Voice-to-List features",
        },
        {
          icon: <Wheat className="w-4 h-4" />,
          title: "Multi-Crop Support",
          desc: "Fruits/Veg (Speed-based) + Grains (Volume-based) flows",
        },
        {
          icon: <Zap className="w-4 h-4" />,
          title: "Instant Settlements",
          desc: "Digital payment triggered the moment buyer accepts the crate",
        },
      ],
    },
    {
      emoji: "🏨",
      label: "For Buyers",
      subtitle: "The Demand",
      image: "/assets/generated/produce-market.dim_600x500.jpg",
      points: [
        {
          icon: <ShoppingBag className="w-4 h-4" />,
          title: "One-Stop Shop",
          desc: "Hotels, Cloud Kitchens, Retail Chains, Food Processors",
        },
        {
          icon: <MapPin className="w-4 h-4" />,
          title: "Full Traceability",
          desc: "QR Code per batch — farm location, harvest date, pesticide report",
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: "Live Bidding",
          desc: "Real-time market prices to ensure fair deals",
        },
      ],
    },
    {
      emoji: "🧠",
      label: "The Brain",
      subtitle: "AI Core",
      image: "/assets/generated/ai-brain.dim_600x500.jpg",
      points: [
        {
          icon: <Cpu className="w-4 h-4" />,
          title: "Smart Freight",
          desc: '"Carpooling for Crops" — AI fills trucks from neighboring farms',
        },
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: "Predictive Planting",
          desc: "Tells farmers what India needs 4 months ahead based on trends",
        },
      ],
    },
  ];

  return (
    <section id="ecosystem" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-amber-brand/20 border border-amber-brand/30 text-amber-brand text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Cpu className="w-3 h-3" /> The Ecosystem
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Three Interfaces.{" "}
            <span className="text-amber-brand">One National Network.</span>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {interfaces.map((iface) => (
            <motion.div
              key={iface.label}
              variants={fadeIn}
              className="group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-amber-brand/30 hover:bg-white/8 transition-all duration-400"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={iface.image}
                  alt={iface.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-display font-black text-white text-xl">
                    {iface.emoji} {iface.label}
                  </span>
                  <p className="text-white/70 text-xs font-body uppercase tracking-wider">
                    {iface.subtitle}
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {iface.points.map((pt) => (
                  <div key={pt.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-300 flex-shrink-0 mt-0.5">
                      {pt.icon}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-white">
                        {pt.title}
                      </p>
                      <p className="font-body text-xs text-white/55 leading-relaxed mt-0.5">
                        {pt.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 4: WHY AGRIGATI WINS
═══════════════════════════════════════════════════════ */
function DifferentiatorSection() {
  return (
    <section id="why-us" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-content">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-brand/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-forest/30 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16 relative"
        >
          <span className="inline-flex items-center gap-2 bg-amber-brand/20 border border-amber-brand/40 text-amber-brand text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3 h-3" /> The Edge
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Why AgriGati<span className="text-amber-brand"> Wins</span>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 relative"
        >
          <motion.div
            variants={fadeIn}
            className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-amber-brand/40 transition-all duration-300 hover:bg-white/8"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-amber-brand/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Recycle className="w-7 h-7 text-amber-brand" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white mb-3">
                  ♻️ Waste-to-Wealth Engine
                </h3>
                <p className="font-body text-white/70 leading-relaxed text-base">
                  We monetize "Imperfect Produce." Misshapen veggies or slightly
                  overripe fruits are automatically routed to Juice Factories,
                  Dehydration Units, or NGOs.{" "}
                  <span className="text-amber-brand font-semibold">
                    Nothing goes to the landfill.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-amber-brand/40 transition-all duration-300 hover:bg-white/8"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-amber-brand/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-amber-brand" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white mb-3">
                  🔮 Price Stabilization
                </h3>
                <p className="font-body text-white/70 leading-relaxed text-base">
                  By predicting festivals and wedding seasons across India, we
                  prevent sudden{" "}
                  <span className="text-amber-brand font-semibold">
                    price spikes for consumers
                  </span>{" "}
                  and{" "}
                  <span className="text-amber-brand font-semibold">
                    crashes for farmers
                  </span>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 5: GO-TO-MARKET
═══════════════════════════════════════════════════════ */
function RoadmapSection() {
  const phases = [
    {
      phase: "Phase 1",
      timeline: "0–6 Months",
      title: "The High-Value Corridors",
      emoji: "📍",
      color: "amber",
      points: [
        "Focus on 5 major Metro Hubs: Delhi, Mumbai, Bangalore, Chennai, Hyderabad",
        "Partner with FPOs to aggregate volume quickly",
        "Pilot with fresh produce — fruits, vegetables, perishables",
      ],
    },
    {
      phase: "Phase 2",
      timeline: "6–12 Months",
      title: "National Integration",
      emoji: "🚀",
      color: "forest",
      points: [
        "Full Beta App launch across India",
        'Expand to Staples using "Warehouse-on-Wheels" model',
        "Corn, Wheat, Pulses — volume logistics integration",
      ],
    },
    {
      phase: "Phase 3",
      timeline: "Year 2+",
      title: "The Agri-Grid",
      emoji: "🇮🇳",
      color: "amber",
      points: [
        "Inter-state corridors: Himachal Apples to Chennai; Kerala Spices to Punjab",
        "Fintech integration: Crop insurance and credit based on sales data",
        "Full platform maturity — data, logistics, finance, intelligence",
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <MapPin className="w-3 h-3" /> Go-to-Market
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Scale <span className="text-green-400">Strategy</span>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="relative"
        >
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-brand via-green-500 to-blue-400" />
          <div className="space-y-12">
            {phases.map((p, i) => (
              <motion.div
                key={p.phase}
                variants={fadeIn}
                className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className="flex-1">
                  <div
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl p-7 border-2 ${p.color === "amber" ? "border-amber-brand/30 hover:border-amber-brand/70" : "border-green-500/30 hover:border-green-500/70"} transition-all duration-300 hover:bg-white/8`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{p.emoji}</span>
                      <div>
                        <span
                          className={`font-display font-bold text-xs uppercase tracking-widest ${p.color === "amber" ? "text-amber-brand" : "text-green-400"}`}
                        >
                          {p.phase} · {p.timeline}
                        </span>
                        <h3 className="font-display font-black text-xl text-white">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {p.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${p.color === "amber" ? "bg-amber-brand" : "bg-green-400"}`}
                          />
                          <span className="font-body text-sm text-white/60 leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={`hidden md:flex w-12 h-12 rounded-full border-4 border-white/20 items-center justify-center text-white flex-shrink-0 z-10 ${p.color === "amber" ? "bg-amber-brand" : "bg-green-600"}`}
                >
                  <span className="text-base">{p.emoji}</span>
                </div>
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 6: BUSINESS MODEL
═══════════════════════════════════════════════════════ */
function BusinessModelSection() {
  const streams = [
    {
      emoji: "💰",
      title: "Commission",
      highlight: "5–12% Take Rate",
      desc: "On Gross Merchandise Value (GMV). Scales directly with platform growth.",
    },
    {
      emoji: "🚚",
      title: "Logistics Optimization",
      highlight: "Efficiency Margin",
      desc: "We charge for transport; AI lowers our actual cost — we keep the margin.",
    },
    {
      emoji: "📊",
      title: "Data as a Service",
      highlight: "B2B Intelligence",
      desc: "Seasonal trend reports sold to food processors and FMCG companies.",
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-amber-brand/20 border border-amber-brand/30 text-amber-brand text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <TrendingUp className="w-3 h-3" /> Business Model
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Revenue <span className="text-amber-brand">Streams</span>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {streams.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeIn}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-amber-brand/40 hover:bg-white/8 transition-all duration-300 text-center"
            >
              <div className="text-5xl mb-5">{s.emoji}</div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {s.title}
              </h3>
              <p className="font-display font-black text-lg text-amber-brand mb-3">
                {s.highlight}
              </p>
              <p className="font-body text-sm text-white/60 leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 7: THE IMPACT
═══════════════════════════════════════════════════════ */
function ImpactSection() {
  const pillars = [
    {
      emoji: "🌍",
      title: "Planet",
      color: "forest",
      stat: "Zero Waste",
      desc: "Drastic reduction in carbon footprint through optimized routing and elimination of food waste.",
    },
    {
      emoji: "👨‍👩‍👧‍👦",
      title: "People",
      color: "amber",
      stat: "Price Makers",
      desc: "Moving Indian farmers from Price Takers to Price Makers. Dignity, income, independence.",
    },
    {
      emoji: "📈",
      title: "Profit",
      color: "forest",
      stat: "Asset-Light",
      desc: "Building a tech-first unicorn that owns the data and the intelligence — not the trucks.",
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Leaf className="w-3 h-3" /> The Impact
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Designed <span className="text-green-400">for All</span>
          </h2>
          <p className="font-body text-lg text-white/60 max-w-2xl mt-4">
            Triple bottom line — Planet, People, and Profit — built into the
            platform's DNA.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeIn}
              className={`group relative rounded-3xl p-8 text-center overflow-hidden ${p.color === "forest" ? "bg-forest text-white hover:bg-forest-dark" : "bg-amber-brand text-foreground hover:bg-amber-dark"} shadow-card hover:shadow-card-hover transition-all duration-300`}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative">
                <div className="text-5xl mb-4">{p.emoji}</div>
                <h3 className="font-display font-black text-2xl mb-2">
                  {p.title}
                </h3>
                <p
                  className={`font-display font-bold text-lg mb-3 ${p.color === "forest" ? "text-amber-brand" : "text-forest-dark"}`}
                >
                  {p.stat}
                </p>
                <p
                  className={`font-body text-sm leading-relaxed ${p.color === "forest" ? "text-white/75" : "text-foreground/75"}`}
                >
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 8: CONTACT / THE ASK
═══════════════════════════════════════════════════════ */
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    orgType: "" as OrganizationType | "",
    email: "",
    phone: "",
    message: "",
  });

  const submitContact = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orgType) {
      toast.error("Please select your organization type.");
      return;
    }
    try {
      await submitContact.mutateAsync({
        name: formData.name,
        orgType: formData.orgType as OrganizationType,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      toast.success("Message sent! We'll be in touch soon. 🌱");
      setFormData({ name: "", orgType: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-content">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-brand/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-forest/40 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center mb-16 relative"
        >
          <span className="inline-flex items-center gap-2 bg-amber-brand/20 border border-amber-brand/40 text-amber-brand text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3 h-3" /> The Ask
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5">
            Join the <span className="text-amber-brand">Revolution</span>
          </h2>
          <p className="font-body text-lg text-white/70 max-w-3xl">
            We are raising capital to build the AI Brain and onboard our first{" "}
            <span className="text-amber-brand font-semibold">
              100 FPOs across India
            </span>
            . Whether you're a farmer, buyer, investor, or partner — there's a
            place for you here.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeIn}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 space-y-5"
            >
              <h3 className="font-display font-bold text-xl text-white mb-6">
                Get in Touch
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-white/80 text-sm font-body"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Rajesh Kumar"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-amber-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="orgType"
                    className="text-white/80 text-sm font-body"
                  >
                    Organization Type *
                  </Label>
                  <Select
                    value={formData.orgType}
                    onValueChange={(v) =>
                      setFormData((p) => ({
                        ...p,
                        orgType: v as OrganizationType,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="orgType"
                      className="bg-white/10 border-white/20 text-white focus:border-amber-brand [&>span]:text-white/70"
                    >
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrganizationType.farmer}>
                        👨‍🌾 Farmer
                      </SelectItem>
                      <SelectItem value={OrganizationType.buyer}>
                        🏨 Buyer
                      </SelectItem>
                      <SelectItem value={OrganizationType.investor}>
                        💼 Investor
                      </SelectItem>
                      <SelectItem value={OrganizationType.FPO}>
                        🌾 FPO
                      </SelectItem>
                      <SelectItem value={OrganizationType.other}>
                        🤝 Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-white/80 text-sm font-body"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="rajesh@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-amber-brand"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-white/80 text-sm font-body"
                  >
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+91 98765 43210"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-amber-brand"
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="message"
                  className="text-white/80 text-sm font-body"
                >
                  Message *
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Tell us how you'd like to partner with AgriGati..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-amber-brand resize-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={submitContact.isPending}
                className="w-full bg-amber-brand hover:bg-amber-dark text-foreground font-bold text-base shadow-amber transition-all duration-300 hover:scale-[1.02]"
              >
                {submitContact.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="space-y-8 pt-4"
          >
            <div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">
                Let's Build This Together
              </h3>
              <p className="font-body text-white/60 leading-relaxed">
                Reach out directly to the founding team. We respond to every
                message.
              </p>
            </div>
            <div className="space-y-4">
              <a
                href="mailto:founders@agrigati.in"
                className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-amber-brand/20 rounded-xl flex items-center justify-center group-hover:bg-amber-brand/30 transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-brand" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">Email</p>
                  <p className="font-body text-white/60 text-sm">
                    founders@agrigati.in
                  </p>
                </div>
              </a>
              <a
                href="tel:+916209741762"
                className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-amber-brand/20 rounded-xl flex items-center justify-center group-hover:bg-amber-brand/30 transition-colors flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-brand" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">Phone</p>
                  <p className="font-body text-white/60 text-sm">
                    +91 6209741762
                  </p>
                </div>
              </a>
              <a
                href="https://www.agrigati.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-amber-brand/20 rounded-xl flex items-center justify-center group-hover:bg-amber-brand/30 transition-colors flex-shrink-0">
                  <Globe className="w-5 h-5 text-amber-brand" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">
                    Website
                  </p>
                  <p className="font-body text-white/60 text-sm">
                    www.agrigati.in
                  </p>
                </div>
              </a>
            </div>
            <div className="bg-amber-brand/10 border border-amber-brand/30 rounded-2xl p-6">
              <p className="font-display font-bold text-amber-brand text-lg mb-2">
                🌾 Investing in AgriGati
              </p>
              <p className="font-body text-white/65 text-sm leading-relaxed">
                Means investing in the future of food security for 1.4 billion
                Indians — and the livelihoods of 120 million farming families.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="relative z-10 bg-black/40 backdrop-blur-sm text-white/60 py-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AgriGatiTruckIcon size={22} />
          <span
            className="font-display font-black text-sm"
            style={{
              background: "linear-gradient(135deg, #34d399, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AgriGati
          </span>
          <span className="text-white/30 text-sm">
            · Moving India's Agriculture Forward
          </span>
        </div>
        <p className="text-xs text-white/40 text-center">
          © {year}. Built with <span className="text-red-400">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white underline underline-offset-2 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   VISIT COUNTER (effect)
═══════════════════════════════════════════════════════ */
function VisitCounter() {
  const { actor } = useActor();
  const incrementVisit = useIncrementVisitCount();
  const hasIncremented = useRef(false);
  const mutate = incrementVisit.mutate;

  useEffect(() => {
    if (actor && !hasIncremented.current) {
      hasIncremented.current = true;
      mutate();
    }
  }, [actor, mutate]);

  return null;
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE ROOT
═══════════════════════════════════════════════════════ */
export default function LandingPageContent() {
  return (
    <div
      className="relative min-h-screen font-body overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #061510 0%, #0a1f14 20%, #081828 50%, #061a2a 75%, #041210 100%)",
      }}
    >
      {/* Animated stars canvas — fixed behind all content */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedStarsBg starCount={120} />
      </div>

      <VisitCounter />
      <Navbar />
      <main>
        <Hero />
        <UrgencySection />
        <SolutionSection />
        <EcosystemSection />
        <DifferentiatorSection />
        <RoadmapSection />
        <BusinessModelSection />
        <ImpactSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
