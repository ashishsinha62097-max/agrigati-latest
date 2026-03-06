import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import { AppProvider, useApp } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";

// Pages
import LandingPageContent from "./LandingPageContent";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BuyerBrowse from "./pages/buyer/BuyerBrowse";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerLayout from "./pages/buyer/BuyerLayout";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import BuyerTrack from "./pages/buyer/BuyerTrack";
import BuyerTrackDefault from "./pages/buyer/BuyerTrackDefault";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerEarnings from "./pages/farmer/FarmerEarnings";
import FarmerLayout from "./pages/farmer/FarmerLayout";
import FarmerListings from "./pages/farmer/FarmerListings";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerProfile from "./pages/farmer/FarmerProfile";

// ─── Auth guard helper (reads localStorage directly) ─────────────────────────
function requireAuth(role: "farmer" | "buyer") {
  const raw = localStorage.getItem("ag_session");
  if (!raw) throw redirect({ to: "/login" });
  try {
    const user = JSON.parse(raw);
    if (user.role !== role) {
      if (user.role === "farmer") throw redirect({ to: "/farmer/dashboard" });
      throw redirect({ to: "/buyer/dashboard" });
    }
  } catch (e) {
    if (
      e instanceof Response ||
      (e && typeof e === "object" && "href" in (e as object))
    )
      throw e;
    throw redirect({ to: "/login" });
  }
}

// ─── Splash wrapper ───────────────────────────────────────────────────────────
function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashDone = () => {
    setShowSplash(false);
  };

  return (
    <AppProvider>
      <LanguageProvider>
        <Toaster position="top-right" richColors />
        {showSplash && <SplashScreen onDone={handleSplashDone} />}
        <Outlet />
      </LanguageProvider>
    </AppProvider>
  );
}

// ─── Root route ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: AppRoot,
});

// ─── Landing ──────────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPageContent,
});

// ─── Auth routes ──────────────────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

// ─── Farmer routes ────────────────────────────────────────────────────────────
const farmerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/farmer",
  component: FarmerLayout,
  beforeLoad: () => requireAuth("farmer"),
});

const farmerDashboardRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/dashboard",
  component: FarmerDashboard,
});

const farmerListingsRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/listings",
  component: FarmerListings,
});

const farmerOrdersRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/orders",
  component: FarmerOrders,
});

const farmerEarningsRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/earnings",
  component: FarmerEarnings,
});

const farmerProfileRoute = createRoute({
  getParentRoute: () => farmerLayoutRoute,
  path: "/profile",
  component: FarmerProfile,
});

// ─── Buyer routes ─────────────────────────────────────────────────────────────
const buyerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/buyer",
  component: BuyerLayout,
  beforeLoad: () => requireAuth("buyer"),
});

const buyerDashboardRoute = createRoute({
  getParentRoute: () => buyerLayoutRoute,
  path: "/dashboard",
  component: BuyerDashboard,
});

const buyerBrowseRoute = createRoute({
  getParentRoute: () => buyerLayoutRoute,
  path: "/browse",
  component: BuyerBrowse,
  validateSearch: (search: Record<string, unknown>): { category?: string } => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
});

const buyerOrdersRoute = createRoute({
  getParentRoute: () => buyerLayoutRoute,
  path: "/orders",
  component: BuyerOrders,
});

const buyerTrackRoute = createRoute({
  getParentRoute: () => buyerLayoutRoute,
  path: "/track",
  component: BuyerTrackDefault,
});

const buyerTrackOrderRoute = createRoute({
  getParentRoute: () => buyerLayoutRoute,
  path: "/track/$orderId",
  component: BuyerTrack,
});

const buyerProfileRoute = createRoute({
  getParentRoute: () => buyerLayoutRoute,
  path: "/profile",
  component: BuyerProfile,
});

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  farmerLayoutRoute.addChildren([
    farmerDashboardRoute,
    farmerListingsRoute,
    farmerOrdersRoute,
    farmerEarningsRoute,
    farmerProfileRoute,
  ]),
  buyerLayoutRoute.addChildren([
    buyerDashboardRoute,
    buyerBrowseRoute,
    buyerOrdersRoute,
    buyerTrackRoute,
    buyerTrackOrderRoute,
    buyerProfileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
