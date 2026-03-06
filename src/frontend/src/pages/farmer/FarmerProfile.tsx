import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Globe, LogOut, MapPin, Phone, Sprout, User } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { FarmerUser } from "../../types/marketplace";

export default function FarmerProfile() {
  const { currentUser, logout, listings, orders } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const farmer = currentUser as FarmerUser;

  const myListings = listings.filter((l) => l.farmerId === farmer?.id);
  const myOrders = orders.filter((o) => o.farmerId === farmer?.id);
  const totalEarned = myOrders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + o.totalAmount, 0);

  const handleLogout = () => {
    logout();
    toast.success(t("loggedOut"));
    void navigate({ to: "/" });
  };

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
      <h2 className="font-display font-black text-xl text-white">
        {t("profile")}
      </h2>

      {/* Profile card — red futuristic */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #b91c1c 0%, #dc2626 40%, #e11d48 80%, #9f1239 100%)",
          boxShadow: "0 8px 32px rgba(185,28,28,0.4)",
        }}
      >
        {/* Glow overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, #fca5a5 0%, transparent 60%)",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex items-center gap-4">
          <div
            className="w-18 h-18 w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/40"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <span className="font-display font-black text-2xl text-white">
              {farmer?.name?.charAt(0) ?? "F"}
            </span>
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white">
              {farmer?.name}
            </h3>
            <Badge className="bg-white/20 text-white border-white/30 text-xs mt-1 font-bold">
              {t("farmer")}
            </Badge>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3 mt-4">
          {[
            { label: t("listings"), value: myListings.length },
            { label: t("orders"), value: myOrders.length },
            {
              label: t("earned"),
              value: `₹${(totalEarned / 1000).toFixed(0)}k`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-2 text-center border border-white/20"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <p className="font-display font-black text-lg text-white">
                {s.value}
              </p>
              <p className="text-white/70 text-[10px] font-body font-bold">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 shadow-lg space-y-3 border border-white/10"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <h4 className="font-display font-bold text-sm text-white">
          {t("details")}
        </h4>
        {[
          { icon: User, label: t("fullName"), value: farmer?.name },
          { icon: Phone, label: t("phone"), value: farmer?.phone },
          {
            icon: MapPin,
            label: t("location"),
            value: `${farmer?.district ?? ""}, ${farmer?.state ?? ""}`,
          },
          {
            icon: Sprout,
            label: t("farmSize"),
            value: farmer?.farmSize || "-",
          },
          {
            icon: Globe,
            label: t("languages"),
            value: farmer?.languages || "-",
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(220,38,38,0.3)" }}
            >
              <item.icon className="w-3.5 h-3.5 text-red-300" />
            </div>
            <div>
              <p className="text-[10px] text-white/50 font-body uppercase tracking-wide font-bold">
                {item.label}
              </p>
              <p className="text-sm font-display font-bold text-white">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <Button
        onClick={handleLogout}
        className="w-full font-black text-white border-none h-12"
        style={{
          background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
        }}
        data-ocid="farmer.profile.logout.button"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {t("logout")}
      </Button>
    </div>
  );
}
