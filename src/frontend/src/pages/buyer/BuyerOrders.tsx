import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Box,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Order, OrderStatus } from "../../types/marketplace";

const statusColorIcon: Record<
  OrderStatus,
  { color: string; icon: React.ReactNode }
> = {
  Pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Accepted: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  Packed: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <Box className="w-3.5 h-3.5" />,
  },
  InTransit: {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  Delivered: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  Cancelled: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OrderCard({ order, i }: { order: Order; i: number }) {
  const { t } = useLanguage();
  const statusLabelMap: Record<OrderStatus, string> = {
    Pending: t("pending"),
    Accepted: t("accepted"),
    Packed: t("packed"),
    InTransit: t("inTransit"),
    Delivered: t("delivered"),
    Cancelled: t("cancelled"),
  };
  const cfg = {
    ...statusColorIcon[order.status],
    label: statusLabelMap[order.status],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      className="bg-white rounded-2xl border border-border p-4 shadow-xs"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-sm text-foreground">
              {order.id}
            </span>
            <Badge
              className={`text-xs px-2 py-0.5 flex items-center gap-1 border ${cfg.color}`}
              variant="outline"
            >
              {cfg.icon}
              {cfg.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display font-black text-lg text-forest">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground font-body">
            {order.paymentMethod}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-3 space-y-1">
        {order.items.map((item) => (
          <div key={item.listingId} className="flex items-center gap-2">
            <span className="text-lg">{item.cropEmoji}</span>
            <p className="text-xs font-body text-muted-foreground">
              {item.cropName} · {item.quantity}kg · ₹
              {item.total.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="text-xs font-body">{order.farmerLocation}</span>
        </div>
        <div className="flex gap-2">
          {order.status !== "Delivered" && order.status !== "Cancelled" && (
            <Link to="/buyer/track/$orderId" params={{ orderId: order.id }}>
              <Button
                size="sm"
                className="h-7 text-xs bg-amber-brand hover:bg-amber-dark text-white font-bold"
              >
                <Package className="w-3 h-3 mr-1" />
                Track
              </Button>
            </Link>
          )}
        </div>
      </div>

      {order.estimatedDelivery && order.status !== "Delivered" && (
        <p className="text-xs text-green-700 font-body mt-2 bg-green-50 rounded-lg px-2 py-1">
          📅 {t("estimatedDelivery")} {order.estimatedDelivery}
        </p>
      )}
    </motion.div>
  );
}

export default function BuyerOrders() {
  const { currentUser, orders } = useApp();
  const { t } = useLanguage();
  const myOrders = orders
    .filter((o) => o.buyerId === currentUser?.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="font-display font-black text-xl text-foreground">
          {t("myOrders")}
        </h2>
        <p className="text-xs text-muted-foreground font-body">
          {myOrders.length} {t("orders")}
        </p>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-16" data-ocid="orders.empty_state">
          <div className="text-6xl mb-4">📦</div>
          <p className="font-display font-bold text-lg text-foreground mb-2">
            {t("noOrders")}
          </p>
          <p className="text-muted-foreground text-sm font-body mb-6">
            Browse products and place your first order
          </p>
          <Link to="/buyer/browse">
            <Button
              className="bg-forest hover:bg-forest-dark text-white font-bold"
              data-ocid="orders.browse_button"
            >
              {t("browseProducts")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((order, i) => (
            <OrderCard key={order.id} order={order} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
