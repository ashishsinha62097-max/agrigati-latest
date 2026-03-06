import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Lock, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedStarsBg } from "../components/AnimatedStarsBg";
import { AgriGatiTruckIcon } from "../components/SplashScreen";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const { login } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [farmerPhone, setFarmerPhone] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (role: "farmer" | "buyer") => {
    const phone = role === "farmer" ? farmerPhone : buyerPhone;
    if (!phone) {
      toast.error(t("phone"));
      return;
    }
    const user = login(phone, role);
    if (!user) {
      toast.error("No account found. Please sign up first.");
      return;
    }
    toast.success(`${t("welcomeBack")}, ${user.name}! 🌿`);
    if (role === "farmer") {
      void navigate({ to: "/farmer/dashboard" });
    } else {
      void navigate({ to: "/buyer/dashboard" });
    }
  };

  return (
    <div className="min-h-screen page-bg-stars flex flex-col">
      <AnimatedStarsBg starCount={60} />
      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-3">
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <AgriGatiTruckIcon size={36} />
          <span
            className="font-display font-black text-xl"
            style={{
              background: "linear-gradient(135deg, #34d399, #0ea5e9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AgriGati
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="font-display font-black text-3xl text-foreground mb-2">
                {t("welcomeBack")} 👋
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                {t("login")} — AgriGati
              </p>
            </div>

            <Tabs defaultValue="farmer">
              <TabsList className="grid grid-cols-2 w-full mb-6 bg-section-alt rounded-xl h-12">
                <TabsTrigger
                  value="farmer"
                  className="rounded-xl font-display font-semibold data-[state=active]:bg-forest data-[state=active]:text-white"
                  data-ocid="login.farmer.tab"
                >
                  👨‍🌾 {t("farmerRole")}
                </TabsTrigger>
                <TabsTrigger
                  value="buyer"
                  className="rounded-xl font-display font-semibold data-[state=active]:bg-amber-brand data-[state=active]:text-white"
                  data-ocid="login.buyer.tab"
                >
                  🏨 {t("buyerRole")}
                </TabsTrigger>
              </TabsList>

              {/* Farmer Login */}
              <TabsContent value="farmer" className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 font-body">
                  {t("demoFarmer")} <strong>9876543210</strong> (Ramu Kisan)
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-medium">
                    {t("phone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder={t("phone")}
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      className="pl-9"
                      autoComplete="tel"
                      data-ocid="login.farmer.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-medium">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder={t("password")}
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={() => handleLogin("farmer")}
                  className="w-full bg-forest hover:bg-forest-dark text-white font-bold h-12"
                  data-ocid="login.farmer.submit_button"
                >
                  {t("login")} — {t("farmerPortal")}
                </Button>
              </TabsContent>

              {/* Buyer Login */}
              <TabsContent value="buyer" className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-body">
                  {t("demoBuyer")} <strong>9123456789</strong> (Priya Hotels)
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-medium">
                    {t("phone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder={t("phone")}
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="pl-9"
                      autoComplete="tel"
                      data-ocid="login.buyer.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-medium">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder={t("password")}
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={() => handleLogin("buyer")}
                  className="w-full bg-amber-brand hover:bg-amber-dark text-white font-bold h-12"
                  data-ocid="login.buyer.submit_button"
                >
                  {t("login")} — {t("buyerPortal")}
                </Button>
              </TabsContent>
            </Tabs>

            <p className="text-center text-sm text-muted-foreground mt-6 font-body">
              {t("newUser")}{" "}
              <Link
                to="/signup"
                className="text-forest font-semibold hover:underline"
                data-ocid="login.signup.link"
              >
                {t("signup")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
