import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEMO_BUYER,
  DEMO_FARMER,
  SAMPLE_LISTINGS,
  SAMPLE_ORDERS,
  generateBuyerNotifications,
  generateFarmerNotifications,
} from "../data/seedData";
import type {
  CartItem,
  Listing,
  Notification,
  Order,
  User,
} from "../types/marketplace";

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  USERS: "ag_users",
  SESSION: "ag_session",
  LISTINGS: "ag_listings",
  ORDERS: "ag_orders",
  NOTIFICATIONS: "ag_notifications",
  SEEDED: "ag_seeded",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadJSON<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedIfNeeded() {
  if (loadJSON(KEYS.SEEDED)) return;
  const users: User[] = [DEMO_FARMER, DEMO_BUYER];
  saveJSON(KEYS.USERS, users);
  saveJSON(KEYS.LISTINGS, SAMPLE_LISTINGS);
  saveJSON(KEYS.ORDERS, SAMPLE_ORDERS);
  saveJSON(KEYS.NOTIFICATIONS, {
    [DEMO_FARMER.id]: generateFarmerNotifications(),
    [DEMO_BUYER.id]: generateBuyerNotifications(),
  });
  saveJSON(KEYS.SEEDED, true);
}

// ─── Context Types ────────────────────────────────────────────────────────────
interface AppContextValue {
  // Auth
  currentUser: User | null;
  login: (phone: string, role: "farmer" | "buyer") => User | null;
  logout: () => void;
  register: (userData: Omit<User, "id" | "createdAt">) => User;

  // Listings
  listings: Listing[];
  addListing: (l: Omit<Listing, "id" | "createdAt" | "rating">) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;

  // Cart
  cart: CartItem[];
  addToCart: (listing: Listing, qty?: number) => void;
  removeFromCart: (listingId: string) => void;
  updateCartQty: (listingId: string, qty: number) => void;
  clearCart: () => void;

  // Cart drawer state (for hiding bottom nav)
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (v: boolean) => void;

  // Notifications
  notifications: Notification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt">) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  // Seed data once
  useEffect(() => {
    seedIfNeeded();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadJSON<User>(KEYS.SESSION);
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    return loadJSON<Listing[]>(KEYS.LISTINGS) ?? SAMPLE_LISTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return loadJSON<Order[]>(KEYS.ORDERS) ?? SAMPLE_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (!loadJSON<User>(KEYS.SESSION)) return [];
    const user = loadJSON<User>(KEYS.SESSION);
    if (!user) return [];
    const allNotifs =
      loadJSON<Record<string, Notification[]>>(KEYS.NOTIFICATIONS) ?? {};
    return allNotifs[user.id] ?? [];
  });

  // Persist listings
  useEffect(() => {
    saveJSON(KEYS.LISTINGS, listings);
  }, [listings]);

  // Persist orders
  useEffect(() => {
    saveJSON(KEYS.ORDERS, orders);
  }, [orders]);

  // Persist notifications
  useEffect(() => {
    if (!currentUser) return;
    const allNotifs =
      loadJSON<Record<string, Notification[]>>(KEYS.NOTIFICATIONS) ?? {};
    allNotifs[currentUser.id] = notifications;
    saveJSON(KEYS.NOTIFICATIONS, allNotifs);
  }, [notifications, currentUser]);

  // ─── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    (phone: string, role: "farmer" | "buyer"): User | null => {
      const users = loadJSON<User[]>(KEYS.USERS) ?? [];
      const user = users.find((u) => u.phone === phone && u.role === role);
      if (!user) return null;
      setCurrentUser(user);
      saveJSON(KEYS.SESSION, user);
      // Load this user's notifications
      const allNotifs =
        loadJSON<Record<string, Notification[]>>(KEYS.NOTIFICATIONS) ?? {};
      if (!allNotifs[user.id]) {
        allNotifs[user.id] =
          role === "farmer"
            ? generateFarmerNotifications()
            : generateBuyerNotifications();
        saveJSON(KEYS.NOTIFICATIONS, allNotifs);
      }
      setNotifications(allNotifs[user.id] ?? []);
      return user;
    },
    [],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
    setNotifications([]);
    localStorage.removeItem(KEYS.SESSION);
  }, []);

  const register = useCallback(
    (userData: Omit<User, "id" | "createdAt">): User => {
      const users = loadJSON<User[]>(KEYS.USERS) ?? [];
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as User;
      users.push(newUser);
      saveJSON(KEYS.USERS, users);

      // Seed notifications
      const allNotifs =
        loadJSON<Record<string, Notification[]>>(KEYS.NOTIFICATIONS) ?? {};
      allNotifs[newUser.id] =
        userData.role === "farmer"
          ? generateFarmerNotifications()
          : generateBuyerNotifications();
      saveJSON(KEYS.NOTIFICATIONS, allNotifs);

      setCurrentUser(newUser);
      saveJSON(KEYS.SESSION, newUser);
      setNotifications(allNotifs[newUser.id]);
      return newUser;
    },
    [],
  );

  // ─── Listings ──────────────────────────────────────────────────────────────
  const addListing = useCallback(
    (l: Omit<Listing, "id" | "createdAt" | "rating">) => {
      const newListing: Listing = {
        ...l,
        id: `lst-${Date.now()}`,
        rating: 4.0,
        createdAt: new Date().toISOString(),
      };
      setListings((prev) => [newListing, ...prev]);
    },
    [],
  );

  const updateListing = useCallback((id: string, updates: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ─── Orders ────────────────────────────────────────────────────────────────
  const placeOrder = useCallback(
    (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order => {
      const now = new Date().toISOString();
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    [],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o,
        ),
      );
    },
    [],
  );

  // ─── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((listing: Listing, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.listing.id === listing.id);
      if (existing) {
        return prev.map((i) =>
          i.listing.id === listing.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...prev, { listing, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((listingId: string) => {
    setCart((prev) => prev.filter((i) => i.listing.id !== listingId));
  }, []);

  const updateCartQty = useCallback((listingId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.listing.id !== listingId));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.listing.id === listingId ? { ...i, quantity: qty } : i,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ─── Notifications ─────────────────────────────────────────────────────────
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "createdAt">) => {
      const newNotif: Notification = {
        ...n,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    [],
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        listings,
        addListing,
        updateListing,
        deleteListing,
        orders,
        placeOrder,
        updateOrderStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        notifications,
        markAllRead,
        markRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
