// ─── User Types ───────────────────────────────────────────────────────────────
export type UserRole = "farmer" | "buyer";

export interface FarmerUser {
  id: string;
  role: "farmer";
  name: string;
  phone: string;
  state: string;
  district: string;
  farmSize: string;
  languages: string;
  createdAt: string;
}

export interface BuyerUser {
  id: string;
  role: "buyer";
  name: string;
  phone: string;
  businessName: string;
  businessType: string;
  city: string;
  createdAt: string;
}

export type User = FarmerUser | BuyerUser;

// ─── Listing Types ────────────────────────────────────────────────────────────
export type CropCategory =
  | "Vegetables"
  | "Fruits"
  | "Grains"
  | "Corn"
  | "Spices"
  | "Pulses"
  | "Cash Crops";

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  cropName: string;
  cropEmoji: string;
  category: CropCategory;
  quantity: number; // kg
  pricePerKg: number; // ₹
  description: string;
  photoUrl?: string;
  available: boolean;
  rating: number;
  createdAt: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Packed"
  | "InTransit"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "UPI" | "Card" | "COD";

export interface OrderItem {
  listingId: string;
  cropName: string;
  cropEmoji: string;
  farmerName: string;
  farmerLocation: string;
  quantity: number;
  pricePerKg: number;
  total: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "Paid" | "Pending";
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  farmerLocation: string;
  buyerLocation: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────
export interface CartItem {
  listing: Listing;
  quantity: number;
}

// ─── Notification Types ───────────────────────────────────────────────────────
export type NotificationType = "order" | "weather" | "payment" | "demand";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─── Weather Alert Types ──────────────────────────────────────────────────────
export type WeatherSeverity = "high" | "medium" | "low";

export interface WeatherAlert {
  id: string;
  region: string;
  alertType: string;
  message: string;
  severity: WeatherSeverity;
  date: string;
}

// ─── Demand Forecast Types ────────────────────────────────────────────────────
export type DemandLevel = "HIGH" | "MEDIUM" | "LOW";

export interface DemandForecast {
  cropName: string;
  cropEmoji: string;
  category: CropCategory;
  demandLevel: DemandLevel;
  season: string;
  reason: string;
  recommendedMonths: string;
}
