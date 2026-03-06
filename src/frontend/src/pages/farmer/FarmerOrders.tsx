import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
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

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Accepted",
  Accepted: "Packed",
  Packed: "InTransit",
  InTransit: "Delivered",
};

type NextLabelKey =
  | "acceptOrder"
  | "markPacked"
  | "markInTransit"
  | "markDelivered";

const nextLabelKey: Partial<Record<OrderStatus, NextLabelKey>> = {
  Pending: "acceptOrder",
  Accepted: "markPacked",
  Packed: "markInTransit",
  InTransit: "markDelivered",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderCard({ order }: { order: Order }) {
  const { updateOrderStatus, addNotification } = useApp();
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
  const next = nextStatus[order.status];
  const nextLblKey = nextLabelKey[order.status];
  const nextLbl = nextLblKey ? t(nextLblKey) : undefined;

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    if (newStatus === "Delivered") {
      addNotification({
        type: "payment",
        title: "Order Delivered ✅",
        message: `Order ${order.id} delivered. Payment of ₹${order.totalAmount.toLocaleString("en-IN")} will be credited shortly.`,
        read: false,
      });
    }
    toast.success(`Order ${order.id} → ${statusLabelMap[newStatus]}`);
  };

  const handleReject = () => {
    updateOrderStatus(order.id, "Cancelled");
    toast.error("Order rejected");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border p-4 shadow-xs"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-sm text-foreground">
              #{order.id}
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
      <div className="mt-3 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.listingId}
            className="flex items-center gap-2 bg-section-alt rounded-xl p-2"
          >
            <span className="text-2xl">{item.cropEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-foreground">
                {item.cropName}
              </p>
              <p className="text-xs text-muted-foreground font-body">
                {item.quantity}kg × ₹{item.pricePerKg} = ₹
                {item.total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-body">
            {order.buyerName}
          </span>
        </div>
        <div className="flex gap-2">
          {order.status === "Pending" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50"
              onClick={handleReject}
            >
              {t("reject")}
            </Button>
          )}
          {next && (
            <Button
              size="sm"
              className="h-7 text-xs bg-forest hover:bg-forest-dark text-white"
              onClick={() => handleStatusUpdate(next)}
            >
              {nextLbl}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FarmerOrders() {
  const { currentUser, orders } = useApp();
  const { t } = useLanguage();
  const myOrders = orders.filter((o) => o.farmerId === currentUser?.id);
  const sorted = [...myOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="font-display font-black text-xl text-foreground">
          {t("orders")}
        </h2>
        <p className="text-xs text-muted-foreground font-body">
          {sorted.length} {t("orders")}
        </p>
      </div>

      {sorted.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="farmer-orders.empty_state"
        >
          <div className="text-6xl mb-4">📦</div>
          <p className="font-display font-bold text-lg text-foreground mb-2">
            {t("noOrders")}
          </p>
          <p className="text-muted-foreground text-sm font-body">
            {t("ordersWillAppear")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
