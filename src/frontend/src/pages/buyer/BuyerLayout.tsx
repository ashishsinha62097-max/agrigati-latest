import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Home,
  LogOut,
  MapPin,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AnimatedStarsBg } from "../../components/AnimatedStarsBg";
import { LanguageSelector } from "../../components/LanguageSelector";
import { NotificationBell } from "../../components/NotificationPanel";
import { AgriGatiTruckIcon } from "../../components/SplashScreen";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { BuyerUser } from "../../types/marketplace";

export default function BuyerLayout() {
  const { currentUser, logout, cart, cartDrawerOpen } = useApp();
  const { t } = useLanguage();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;
  const buyer = currentUser as BuyerUser | null;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const NAV_ITEMS = [
    { label: t("home"), icon: Home, path: "/buyer/dashboard" },
    { label: t("browse"), icon: Search, path: "/buyer/browse" },
    { label: t("orders"), icon: ShoppingBag, path: "/buyer/orders" },
    { label: t("track"), icon: MapPin, path: "/buyer/track" },
    { label: t("profile"), icon: User, path: "/buyer/profile" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    void navigate({ to: "/" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)",
      }}
    >
      <AnimatedStarsBg starCount={75} />
      {/* Top Header */}
      <header className="relative z-30 bg-white text-black px-4 py-3 flex items-center justify-between sticky top-0 shadow-lg border-b border-gray-200">
        <div className="flex items-center gap-2">
          <AgriGatiTruckIcon size={32} />
          <div>
            <span
              className="font-display font-black text-base leading-none block"
              style={{
                background: "linear-gradient(135deg, #059669, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AgriGati
            </span>
            <span className="text-gray-500 text-[9px] font-body leading-none hidden sm:block">
              {t("buyerPortal")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <NotificationBell />
          {/* Cart */}
          <Link to="/buyer/browse" className="relative">
            <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1.5">
            <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {buyer?.name?.charAt(0) ?? "B"}
              </span>
            </div>
            <span className="text-xs font-medium text-black hidden sm:block truncate max-w-24">
              {buyer?.businessName ?? buyer?.name ?? "Buyer"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-black"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pb-20 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <motion.div
        animate={{
          y: cartDrawerOpen ? 80 : 0,
          opacity: cartDrawerOpen ? 0 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-30"
      >
        <nav className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.10)]">
          <div className="flex items-center justify-around py-1 max-w-lg mx-auto">
            {NAV_ITEMS.map((item) => {
              const isActive =
                currentPath === item.path ||
                currentPath.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-teal-700"
                      : "text-gray-500 hover:text-teal-700"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl transition-all ${
                      isActive ? "bg-teal-100" : ""
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all ${
                        isActive
                          ? "stroke-[2.5px] text-teal-700"
                          : "stroke-[1.5px]"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-body ${
                      isActive
                        ? "font-bold text-teal-700"
                        : "font-medium text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.div>
    </div>
  );
}
