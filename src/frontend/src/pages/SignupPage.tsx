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
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Store, Tractor } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedStarsBg } from "../components/AnimatedStarsBg";
import { AgriGatiTruckIcon } from "../components/SplashScreen";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import type { BuyerUser, FarmerUser } from "../types/marketplace";

type Step = "role" | "form";

export default function SignupPage() {
  const { register } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<"farmer" | "buyer" | null>(null);

  // Farmer form
  const [farmerForm, setFarmerForm] = useState({
    name: "",
    phone: "",
    state: "",
    district: "",
    farmSize: "",
    languages: "",
  });

  // Buyer form
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    businessType: "",
    city: "",
  });

  const handleRoleSelect = (r: "farmer" | "buyer") => {
    setRole(r);
    setStep("form");
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerForm.name || !farmerForm.phone || !farmerForm.state) {
      toast.error("Please fill all required fields");
      return;
    }
    const userData: Omit<FarmerUser, "id" | "createdAt"> = {
      role: "farmer",
      ...farmerForm,
    };
    register(userData);
    toast.success("Account created! Welcome to AgriGati 🌿");
    void navigate({ to: "/farmer/dashboard" });
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerForm.name || !buyerForm.phone || !buyerForm.businessName) {
      toast.error("Please fill all required fields");
      return;
    }
    const userData: Omit<BuyerUser, "id" | "createdAt"> = {
      role: "buyer",
      ...buyerForm,
    };
    register(userData);
    toast.success("Account created! Welcome to AgriGati 🛒");
    void navigate({ to: "/buyer/dashboard" });
  };

  return (
    <div className="min-h-screen page-bg-stars flex flex-col">
      <AnimatedStarsBg starCount={60} />
      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => {
            if (step === "form") setStep("role");
            else void navigate({ to: "/login" });
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
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

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === "role" ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <h1 className="font-display font-black text-3xl text-foreground mb-2">
                    {t("createAccount")} 🌾
                  </h1>
                  <p className="text-muted-foreground font-body text-sm">
                    {t("role")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("farmer")}
                    data-ocid="signup.farmer.button"
                    className="group relative overflow-hidden rounded-2xl border-2 border-forest/20 hover:border-forest p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors">
                        <Tractor className="w-8 h-8 text-forest group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground mb-1">
                        {t("farmerRole")}
                      </h3>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed">
                        {t("farmerPortal")}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect("buyer")}
                    data-ocid="signup.buyer.button"
                    className="group relative overflow-hidden rounded-2xl border-2 border-amber-brand/20 hover:border-amber-brand p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:bg-amber-brand group-hover:text-white transition-colors">
                        <Store className="w-8 h-8 text-amber-dark group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground mb-1">
                        {t("buyerRole")}
                      </h3>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed">
                        {t("buyerPortal")}
                      </p>
                    </div>
                  </button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6 font-body">
                  {t("alreadyHaveAccount")}{" "}
                  <Link
                    to="/login"
                    className="text-forest font-semibold hover:underline"
                    data-ocid="signup.login.link"
                  >
                    {t("login")}
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${role === "farmer" ? "bg-forest" : "bg-amber-brand"}`}
                  >
                    {role === "farmer" ? (
                      <Tractor className="w-6 h-6 text-white" />
                    ) : (
                      <Store className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <h1 className="font-display font-black text-2xl text-foreground mb-1">
                    {role === "farmer"
                      ? `${t("farmerPortal")} — ${t("signup")}`
                      : `${t("buyerPortal")} — ${t("signup")}`}
                  </h1>
                  <p className="text-muted-foreground font-body text-xs">
                    {t("fillDetails")}
                  </p>
                </div>

                {role === "farmer" ? (
                  <form onSubmit={handleFarmerSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("fullName")} *
                        </Label>
                        <Input
                          placeholder="Ramesh Kumar"
                          value={farmerForm.name}
                          onChange={(e) =>
                            setFarmerForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          required
                          data-ocid="signup.farmer.name.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("phone")} *
                        </Label>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={farmerForm.phone}
                          onChange={(e) =>
                            setFarmerForm((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          required
                          data-ocid="signup.farmer.phone.input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("state")} *
                        </Label>
                        <Select
                          onValueChange={(v) =>
                            setFarmerForm((p) => ({ ...p, state: v }))
                          }
                        >
                          <SelectTrigger data-ocid="signup.farmer.state.select">
                            <SelectValue placeholder={t("selectState")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Maharashtra",
                              "Punjab",
                              "Uttar Pradesh",
                              "Bihar",
                              "Andhra Pradesh",
                              "Tamil Nadu",
                              "Karnataka",
                              "Haryana",
                              "Rajasthan",
                              "Gujarat",
                              "Madhya Pradesh",
                              "Himachal Pradesh",
                            ].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("district")}
                        </Label>
                        <Input
                          placeholder="Nashik"
                          value={farmerForm.district}
                          onChange={(e) =>
                            setFarmerForm((p) => ({
                              ...p,
                              district: e.target.value,
                            }))
                          }
                          data-ocid="signup.farmer.district.input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("farmSize")}
                        </Label>
                        <Select
                          onValueChange={(v) =>
                            setFarmerForm((p) => ({ ...p, farmSize: v }))
                          }
                        >
                          <SelectTrigger data-ocid="signup.farmer.farmsize.select">
                            <SelectValue placeholder={t("selectSize")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "<1 acre",
                              "1-2 acres",
                              "2-5 acres",
                              "5-10 acres",
                              "10-25 acres",
                              "25+ acres",
                            ].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("languages")}
                        </Label>
                        <Input
                          placeholder="Hindi, Marathi"
                          value={farmerForm.languages}
                          onChange={(e) =>
                            setFarmerForm((p) => ({
                              ...p,
                              languages: e.target.value,
                            }))
                          }
                          data-ocid="signup.farmer.languages.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-forest hover:bg-forest-dark text-white font-bold h-12"
                      data-ocid="signup.farmer.submit_button"
                    >
                      {t("createAccount")} — {t("farmerRole")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleBuyerSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("fullName")} *
                        </Label>
                        <Input
                          placeholder="Priya Sharma"
                          value={buyerForm.name}
                          onChange={(e) =>
                            setBuyerForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          required
                          data-ocid="signup.buyer.name.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("phone")} *
                        </Label>
                        <Input
                          type="tel"
                          placeholder="9123456789"
                          value={buyerForm.phone}
                          onChange={(e) =>
                            setBuyerForm((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          required
                          data-ocid="signup.buyer.phone.input"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        {t("businessName")} *
                      </Label>
                      <Input
                        placeholder="Priya Grand Hotel"
                        value={buyerForm.businessName}
                        onChange={(e) =>
                          setBuyerForm((p) => ({
                            ...p,
                            businessName: e.target.value,
                          }))
                        }
                        required
                        data-ocid="signup.buyer.businessname.input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("businessType")} *
                        </Label>
                        <Select
                          onValueChange={(v) =>
                            setBuyerForm((p) => ({ ...p, businessType: v }))
                          }
                        >
                          <SelectTrigger data-ocid="signup.buyer.businesstype.select">
                            <SelectValue placeholder={t("selectType")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Hotel",
                              "Cloud Kitchen",
                              "Retail Chain",
                              "Food Processor",
                              "Restaurant",
                              "NGO",
                              "Other",
                            ].map((bt) => (
                              <SelectItem key={bt} value={bt}>
                                {bt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          {t("city")} *
                        </Label>
                        <Input
                          placeholder="Mumbai"
                          value={buyerForm.city}
                          onChange={(e) =>
                            setBuyerForm((p) => ({
                              ...p,
                              city: e.target.value,
                            }))
                          }
                          required
                          data-ocid="signup.buyer.city.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-amber-brand hover:bg-amber-dark text-white font-bold h-12"
                      data-ocid="signup.buyer.submit_button"
                    >
                      {t("createAccount")} — {t("buyerRole")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}

                <p className="text-center text-sm text-muted-foreground mt-4 font-body">
                  {t("alreadyHaveAccount")}{" "}
                  <Link
                    to="/login"
                    className="text-forest font-semibold hover:underline"
                    data-ocid="signup.login.link"
                  >
                    {t("login")}
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
