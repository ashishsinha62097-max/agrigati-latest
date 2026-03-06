import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type {
  CropCategory,
  Listing,
  PaymentMethod,
} from "../../types/marketplace";
import type { BuyerUser } from "../../types/marketplace";

const CATEGORIES: (CropCategory | "All")[] = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Corn",
  "Spices",
  "Pulses",
  "Cash Crops",
];

const categoryBg: Record<CropCategory, string> = {
  Vegetables: "bg-green-50",
  Fruits: "bg-orange-50",
  Grains: "bg-yellow-50",
  Corn: "bg-amber-50",
  Spices: "bg-red-50",
  Pulses: "bg-purple-50",
  "Cash Crops": "bg-blue-50",
};

const categoryActiveStyle: Record<CropCategory | "All", string> = {
  All: "bg-gradient-to-r from-green-700 to-teal-600 text-white shadow-sm",
  Vegetables:
    "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm",
  Fruits: "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-sm",
  Grains: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-sm",
  Corn: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm",
  Spices: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm",
  Pulses: "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-sm",
  "Cash Crops":
    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm",
};

function getCategoryPhoto(cat: CropCategory): string {
  const map: Record<CropCategory, string> = {
    Vegetables: "/assets/generated/crop-vegetables.dim_400x300.jpg",
    Fruits: "/assets/generated/crop-fruits.dim_400x300.jpg",
    Grains: "/assets/generated/crop-grains.dim_400x300.jpg",
    Corn: "/assets/generated/crop-corn.dim_400x300.jpg",
    Spices: "/assets/generated/crop-spices.dim_400x300.jpg",
    Pulses: "/assets/generated/crop-pulses.dim_400x300.jpg",
    "Cash Crops": "/assets/generated/crop-grains.dim_400x300.jpg",
  };
  return map[cat] ?? "/assets/generated/crop-vegetables.dim_400x300.jpg";
}

function ProductCard({ listing }: { listing: Listing }) {
  const { addToCart, cart } = useApp();
  const { t } = useLanguage();
  const cartItem = cart.find((i) => i.listing.id === listing.id);
  const { updateCartQty, removeFromCart } = useApp();

  const handleAdd = () => {
    addToCart(listing, 1);
    toast.success(`${listing.cropName} added to cart 🛒`);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden"
    >
      {/* Header with real photo */}
      <div
        className={`${categoryBg[listing.category]} relative overflow-hidden`}
        style={{ height: "120px" }}
      >
        <img
          src={listing.photoUrl ?? getCategoryPhoto(listing.category)}
          alt={listing.cropName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute bottom-1 right-2 text-2xl">
          {listing.cropEmoji}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-1">
        <p className="font-display font-bold text-sm text-foreground truncate">
          {listing.cropName}
        </p>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <p className="text-[10px] font-body truncate">
            {listing.farmerName} • {listing.farmerLocation}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${s <= Math.floor(listing.rating) ? "text-amber-brand fill-amber-brand" : "text-gray-300"}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-0.5">
            {listing.rating}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-display font-black text-lg text-forest">
              ₹{listing.pricePerKg}
            </span>
            <span className="text-[10px] text-muted-foreground font-body">
              /kg
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-body">
            {listing.quantity}kg avail.
          </span>
        </div>

        {/* Add to cart */}
        {!cartItem ? (
          <Button
            size="sm"
            className="w-full h-8 text-xs bg-forest hover:bg-forest-dark text-white font-bold gap-1"
            onClick={handleAdd}
          >
            <Plus className="w-3.5 h-3.5" />
            {t("addToCart")}
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-forest/10 rounded-xl p-1">
            <button
              type="button"
              className="w-7 h-7 bg-forest text-white rounded-lg flex items-center justify-center hover:bg-forest-dark transition-colors"
              onClick={() => {
                if (cartItem.quantity <= 1) removeFromCart(listing.id);
                else updateCartQty(listing.id, cartItem.quantity - 1);
              }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-display font-bold text-sm text-forest">
              {cartItem.quantity} kg
            </span>
            <button
              type="button"
              className="w-7 h-7 bg-forest text-white rounded-lg flex items-center justify-center hover:bg-forest-dark transition-colors"
              onClick={() => updateCartQty(listing.id, cartItem.quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    currentUser,
    placeOrder,
    addNotification,
  } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [placed, setPlaced] = useState(false);
  const buyer = currentUser as BuyerUser;

  const total = cart.reduce((s, i) => s + i.listing.pricePerKg * i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Group by farmer
    const byFarmer = new Map<string, typeof cart>();
    for (const item of cart) {
      const key = item.listing.farmerId;
      if (!byFarmer.has(key)) byFarmer.set(key, []);
      byFarmer.get(key)!.push(item);
    }

    for (const [farmerId, items] of byFarmer) {
      const orderTotal = items.reduce(
        (s, i) => s + i.listing.pricePerKg * i.quantity,
        0,
      );
      const order = placeOrder({
        buyerId: buyer.id,
        buyerName: buyer.businessName ?? buyer.name,
        farmerId,
        items: items.map((i) => ({
          listingId: i.listing.id,
          cropName: i.listing.cropName,
          cropEmoji: i.listing.cropEmoji,
          farmerName: i.listing.farmerName,
          farmerLocation: i.listing.farmerLocation,
          quantity: i.quantity,
          pricePerKg: i.listing.pricePerKg,
          total: i.listing.pricePerKg * i.quantity,
        })),
        totalAmount: orderTotal,
        status: "Pending",
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
        estimatedDelivery: deliveryDate,
        farmerLocation: items[0].listing.farmerLocation,
        buyerLocation: buyer.city ?? "India",
      });

      addNotification({
        type: "order",
        title: "Order Placed! 🎉",
        message: `Order ${order.id} placed for ₹${orderTotal.toLocaleString("en-IN")}. Waiting for farmer to accept.`,
        read: false,
      });
    }

    clearCart();
    setPlaced(true);
    setTimeout(() => {
      setPlaced(false);
      onClose();
      void navigate({ to: "/buyer/orders" });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            role="button"
            tabIndex={-1}
            aria-label="Close cart"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-forest text-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-display font-bold">
                  {t("cartItemsHeader")} ({cart.length} {t("itemsLabel")})
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            {placed ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <p className="font-display font-bold text-xl text-foreground">
                  {t("orderPlacedTitle")}
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  {t("redirectingToOrders")}
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {cart.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-body text-sm">{t("cartEmpty")}</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.listing.id}
                        className="flex items-center gap-3 p-3"
                      >
                        <span className="text-3xl">
                          {item.listing.cropEmoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-sm truncate">
                            {item.listing.cropName}
                          </p>
                          <p className="text-xs text-muted-foreground font-body">
                            ₹{item.listing.pricePerKg}/kg
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-section-alt rounded-lg p-1">
                            <button
                              type="button"
                              className="w-5 h-5 flex items-center justify-center"
                              onClick={() => {
                                if (item.quantity <= 1)
                                  removeFromCart(item.listing.id);
                                else
                                  updateCartQty(
                                    item.listing.id,
                                    item.quantity - 1,
                                  );
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="w-5 h-5 flex items-center justify-center"
                              onClick={() =>
                                updateCartQty(
                                  item.listing.id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-display font-bold text-sm text-forest w-16 text-right">
                            ₹
                            {(
                              item.listing.pricePerKg * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.listing.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-base">
                        {t("total")}
                      </span>
                      <span className="font-display font-black text-xl text-forest">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Payment method */}
                    <Select
                      value={paymentMethod}
                      onValueChange={(v) =>
                        setPaymentMethod(v as PaymentMethod)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">📱 UPI</SelectItem>
                        <SelectItem value="Card">
                          💳 Credit/Debit Card
                        </SelectItem>
                        <SelectItem value="COD">💵 Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full bg-forest hover:bg-forest-dark text-white font-bold h-12 gap-2"
                      onClick={handleCheckout}
                    >
                      {t("placeOrder")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function BuyerBrowse() {
  const { listings, cart, setCartDrawerOpen } = useApp();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const searchParams = useSearch({ strict: false }) as { category?: string };
  const initialCategory =
    searchParams?.category &&
    (["Vegetables", "Fruits", "Grains", "Corn"] as string[]).includes(
      searchParams.category,
    )
      ? (searchParams.category as CropCategory)
      : "All";
  const [category, setCategory] = useState<CropCategory | "All">(
    initialCategory,
  );
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => {
    setCartOpen(true);
    setCartDrawerOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
    setCartDrawerOpen(false);
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const filtered = listings.filter((l) => {
    if (!l.available) return false;
    const matchCat = category === "All" || l.category === category;
    const matchSearch =
      !search ||
      l.cropName.toLowerCase().includes(search.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      l.farmerLocation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Category shortcut banner */}
      <div className="px-4 pt-4 pb-2 flex gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCategory("All")}
          className="flex-1 bg-gradient-to-r from-green-700 to-teal-600 text-white font-display font-bold text-xs py-2.5 px-2 rounded-xl shadow-md flex items-center justify-center gap-1"
        >
          🌱 {t("allCrops")}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCategory("Vegetables")}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-display font-bold text-xs py-2.5 px-2 rounded-xl shadow-md flex items-center justify-center gap-1"
        >
          🥦 {t("vegetables")}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCategory("Fruits")}
          className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white font-display font-bold text-xs py-2.5 px-2 rounded-xl shadow-md flex items-center justify-center gap-1"
        >
          🍎 {t("fruits")}
        </motion.button>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`${t("search")}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all ${
                category === cat
                  ? categoryActiveStyle[cat]
                  : "bg-section-alt text-muted-foreground hover:bg-green-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-body">
            {filtered.length} {t("products")}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-display font-bold text-lg text-foreground mb-2">
              {t("noProducts")}
            </p>
            <p className="text-muted-foreground text-sm font-body">
              {t("tryDifferentSearch")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((listing: Listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-20"
        >
          <Button
            onClick={openCart}
            className="w-full bg-forest hover:bg-forest-dark text-white font-bold h-12 shadow-xl gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>
              {cartCount} {t("itemsInCart")}
            </span>
            <span className="ml-auto font-black">
              ₹
              {cart
                .reduce((s, i) => s + i.listing.pricePerKg * i.quantity, 0)
                .toLocaleString("en-IN")}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
}
