import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Home,
  IndianRupee,
  LogOut,
  ShoppingCart,
  Sprout,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatedStarsBg } from "../../components/AnimatedStarsBg";
import { LanguageSelector } from "../../components/LanguageSelector";
import { NotificationBell } from "../../components/NotificationPanel";
import { AgriGatiTruckIcon } from "../../components/SplashScreen";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { FarmerUser } from "../../types/marketplace";

const NAV_PATHS = [
  { labelKey: "home" as const, icon: Home, path: "/farmer/dashboard" },
  { labelKey: "myCrops" as const, icon: Sprout, path: "/farmer/listings" },
  { labelKey: "orders" as const, icon: ShoppingCart, path: "/farmer/orders" },
  {
    labelKey: "earnings" as const,
    icon: IndianRupee,
    path: "/farmer/earnings",
  },
  { labelKey: "profile" as const, icon: User, path: "/farmer/profile" },
];

export default function FarmerLayout() {
  const { currentUser, logout } = useApp();
  const { t } = useLanguage();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;
  const farmer = currentUser as FarmerUser | null;

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
      <AnimatedStarsBg starCount={90} />
      {/* Top Header */}
      <header className="relative z-30 bg-white text-black px-4 py-3 flex items-center justify-between sticky top-0 shadow-lg border-b border-gray-200">
        <div className="flex items-center gap-2">
          <AgriGatiTruckIcon size={36} />
          <div>
            <span
              className="font-display font-black text-base leading-none"
              style={{
                background: "linear-gradient(135deg, #059669, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AgriGati
            </span>
            <p className="text-gray-500 text-[9px] font-body leading-none">
              {t("farmerPortal")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageSelector />
          <NotificationBell />
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-2 py-1.5 border border-gray-200">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow">
              <span className="text-white text-xs font-black">
                {farmer?.name?.charAt(0) ?? "F"}
              </span>
            </div>
            <span className="text-xs font-semibold text-black hidden sm:block truncate max-w-20">
              {farmer?.name ?? "Farmer"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors text-black"
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-around py-1 max-w-lg mx-auto">
          {NAV_PATHS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-emerald-700"
                    : "text-gray-500 hover:text-emerald-700"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? "bg-emerald-100" : ""
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-all ${
                      isActive
                        ? "stroke-[2.5px] text-emerald-700"
                        : "stroke-[1.5px]"
                    }`}
                  />
                </div>
                <span
                  className={`text-[9px] font-body ${
                    isActive
                      ? "font-bold text-emerald-700"
                      : "font-medium text-gray-500"
                  }`}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
