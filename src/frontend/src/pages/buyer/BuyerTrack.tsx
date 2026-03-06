import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { OrderStatus } from "../../types/marketplace";

const STATUS_ORDER: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Packed",
  "InTransit",
  "Delivered",
];

function getStepIndex(status: OrderStatus): number {
  return STATUS_ORDER.indexOf(status);
}

// ── Animated CSS Tracking Map (no external deps) ──────────────────────────────
function TrackingMap({
  fromLocation,
  toLocation,
  progress,
}: {
  fromLocation: string;
  toLocation: string;
  progress: number;
}) {
  const { t } = useLanguage();
  const [animatedProgress, setAnimatedProgress] = useState(progress);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress((p) => Math.min(p + 0.5, 100));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const remainingPct = Math.max(0, 100 - animatedProgress);
  const totalHours = 6;
  const remainingHours = (remainingPct / 100) * totalHours;
  const etaHours = Math.floor(remainingHours);
  const etaMins = Math.floor((remainingHours - etaHours) * 60);
  const distanceKm = Math.round((remainingPct / 100) * 350);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 rounded-2xl border border-white/10 p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-display font-bold text-sm text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          {t("liveTracking")}
        </p>
        <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          LIVE
        </span>
      </div>

      {/* ETA + Distance */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-white font-black text-base font-display">
            {animatedProgress >= 95
              ? "Pahuch Gaya!"
              : `${etaHours}h ${etaMins}m`}
          </p>
          <p className="text-white/50 text-[10px]">ETA</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <Truck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-white font-black text-base font-display">
            {animatedProgress >= 95 ? "0 km" : `${distanceKm} km`}
          </p>
          <p className="text-white/50 text-[10px]">{t("remaining")}</p>
        </div>
      </div>

      {/* Animated Route Map */}
      <div
        className="rounded-xl overflow-hidden border border-white/10 relative bg-slate-800"
        style={{ height: "200px" }}
      >
        {/* OSM tile background (decorative) */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(https://tile.openstreetmap.org/5/24/13.png)",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-slate-900/40 to-blue-950/60" />

        {/* Route line */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
          role="img"
          aria-label="Live delivery route map"
        >
          {/* Full dashed route */}
          <line
            x1="30"
            y1="160"
            x2="270"
            y2="40"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="8 5"
            opacity="0.4"
          />
          {/* Completed route (green) */}
          <line
            x1="30"
            y1="160"
            x2={30 + (240 * animatedProgress) / 100}
            y2={160 - (120 * animatedProgress) / 100}
            stroke="#22c55e"
            strokeWidth="3"
            opacity="0.9"
          />
        </svg>

        {/* Farm origin pin */}
        <div className="absolute bottom-6 left-5 text-xl" title={fromLocation}>
          🚜
        </div>

        {/* Destination pin (pulsing) */}
        <div
          className="absolute top-6 right-6 text-xl animate-pulse"
          title={toLocation}
        >
          📍
        </div>

        {/* Animated truck */}
        <motion.div
          className="absolute text-2xl"
          style={{
            bottom: `${20 + (120 * animatedProgress) / 100}px`,
            left: `${16 + (220 * animatedProgress) / 100}px`,
          }}
        >
          🚚
        </motion.div>
      </div>

      {/* Location labels */}
      <div className="flex items-center justify-between text-xs mt-3">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 rounded-lg px-2 py-1">
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-emerald-300 font-body truncate max-w-28">
            {fromLocation}
          </span>
        </div>
        <div className="flex-1 mx-2 border-t border-dashed border-white/20" />
        <div className="flex items-center gap-1.5 bg-red-500/10 rounded-lg px-2 py-1">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-red-300 font-body truncate max-w-28">
            {toLocation}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BuyerTrack() {
  const { t } = useLanguage();
  const params = useParams({ strict: false }) as { orderId?: string };
  const { orders } = useApp();

  const orderId = params.orderId;
  const order = orders.find((o) => o.id === orderId);

  const STEPS: {
    status: OrderStatus;
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      status: "Pending",
      label: t("orderPlaced"),
      icon: <Package className="w-4 h-4" />,
      desc: t("yourOrderReceived"),
    },
    {
      status: "Accepted",
      label: t("farmerAccepted"),
      icon: <CheckCircle className="w-4 h-4" />,
      desc: t("farmerConfirmed"),
    },
    {
      status: "Packed",
      label: t("packed"),
      icon: <Box className="w-4 h-4" />,
      desc: t("producePacked"),
    },
    {
      status: "InTransit",
      label: t("inTransit"),
      icon: <Truck className="w-4 h-4" />,
      desc: t("onTheWay"),
    },
    {
      status: "Delivered",
      label: t("delivered"),
      icon: <CheckCircle className="w-4 h-4" />,
      desc: t("successfullyDelivered"),
    },
  ];

  if (!order) {
    return (
      <div className="px-4 py-4 max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <p className="font-display font-bold text-lg text-foreground mb-2">
          {t("orderNotFound")}
        </p>
        <Link to="/buyer/orders">
          <Button className="bg-forest text-white font-bold">
            {t("backToOrders")}
          </Button>
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/buyer/orders">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="font-display font-black text-xl text-foreground">
            {t("liveTracking")}
          </h2>
          <p className="text-xs text-muted-foreground font-body">
            {t("orderIdLabel")} {order.id}
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
        <h3 className="font-display font-bold text-sm text-foreground mb-4">
          {t("orderProgress")}
        </h3>

        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isFuture = idx > currentStep;

            return (
              <div key={step.status} className="flex items-start gap-3">
                {/* Step circle + line */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={
                      isCurrent
                        ? { repeat: Number.POSITIVE_INFINITY, duration: 1.5 }
                        : {}
                    }
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isCurrent
                          ? "bg-amber-brand border-amber-brand text-white shadow-amber"
                          : "bg-white border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-8 mt-1 rounded-full transition-colors ${
                        isCompleted ? "bg-green-400" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className={`pb-4 ${isFuture ? "opacity-40" : ""}`}>
                  <p
                    className={`font-display font-bold text-sm ${isCurrent ? "text-amber-dark" : "text-foreground"}`}
                  >
                    {step.label}
                    {isCurrent && (
                      <Badge className="ml-2 text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border border-amber-200">
                        {t("currentStep")}
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaflet Map */}
      <TrackingMap
        fromLocation={order.farmerLocation}
        toLocation={order.buyerLocation}
        progress={progressPct}
      />

      {/* Order Details */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3">
        <h3 className="font-display font-bold text-sm text-foreground">
          {t("orderDetails")}
        </h3>

        {order.items.map((item) => (
          <div
            key={item.listingId}
            className="flex items-center gap-3 bg-section-alt rounded-xl p-2.5"
          >
            <span className="text-3xl">{item.cropEmoji}</span>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm">
                {item.cropName}
              </p>
              <p className="text-xs text-muted-foreground font-body">
                {item.farmerName} · {item.farmerLocation}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-sm text-forest">
                ₹{item.total.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground font-body">
                {item.quantity}kg
              </p>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground font-body">
              {t("payment")}
            </p>
            <p className="font-display font-semibold text-sm">
              {order.paymentMethod} · {order.paymentStatus}
            </p>
          </div>
          {order.estimatedDelivery && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-body">
                {t("estimatedDelivery")}
              </p>
              <p className="font-display font-semibold text-sm text-green-700">
                {order.estimatedDelivery}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-base">
            {t("totalAmount")}
          </span>
          <span className="font-display font-black text-xl text-forest">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Delivery info card */}
      <div className="bg-green-50 rounded-2xl border border-green-200 p-4 flex gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="font-display font-bold text-sm text-green-800">
            {t("estimatedDelivery")}
          </p>
          <p className="text-xs text-green-700 font-body mt-0.5">
            {t("yourOrderReceived")}.{" "}
            <strong>{order.estimatedDelivery ?? "soon"}</strong>.{" "}
            {order.items[0]?.farmerName}
          </p>
        </div>
      </div>
    </div>
  );
}
