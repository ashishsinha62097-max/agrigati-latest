import { Badge } from "@/components/ui/badge";
import { CheckCircle, IndianRupee, Package, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Order } from "../../types/marketplace";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const monthlyData = [
  { month: "Oct", amount: 12500 },
  { month: "Nov", amount: 18200 },
  { month: "Dec", amount: 24800 },
  { month: "Jan", amount: 19600 },
  { month: "Feb", amount: 31200 },
  { month: "Mar", amount: 8150 },
];

const maxVal = Math.max(...monthlyData.map((d) => d.amount));

function MiniBarChart() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
      <h4 className="font-display font-bold text-sm text-foreground mb-3">
        {t("monthlyEarnings")}
      </h4>
      <div className="flex items-end gap-2 h-24">
        {monthlyData.map((d) => {
          const heightPct = (d.amount / maxVal) * 100;
          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-[9px] text-muted-foreground font-body">
                ₹{(d.amount / 1000).toFixed(0)}k
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full rounded-t-md bg-forest"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[9px] text-muted-foreground font-body">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentRow({ order }: { order: Order }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-section-alt transition-colors">
      <td className="py-2.5 px-3 text-xs font-display font-semibold text-foreground">
        #{order.id}
      </td>
      <td className="py-2.5 px-3 text-xs text-muted-foreground font-body">
        <div className="flex items-center gap-1">
          <span>{order.items[0]?.cropEmoji}</span>
          <span className="truncate max-w-20">{order.items[0]?.cropName}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-xs text-muted-foreground font-body truncate max-w-24">
        {order.buyerName}
      </td>
      <td className="py-2.5 px-3 text-xs font-display font-bold text-forest">
        ₹{order.totalAmount.toLocaleString("en-IN")}
      </td>
      <td className="py-2.5 px-3 text-xs text-muted-foreground font-body">
        {order.paymentMethod}
      </td>
      <td className="py-2.5 px-3">
        <Badge
          className={`text-[10px] px-1.5 py-0 border ${
            order.paymentStatus === "Paid"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-yellow-100 text-yellow-700 border-yellow-200"
          }`}
          variant="outline"
        >
          {order.paymentStatus}
        </Badge>
      </td>
      <td className="py-2.5 px-3 text-[10px] text-muted-foreground font-body">
        {formatDate(order.createdAt)}
      </td>
    </tr>
  );
}

export default function FarmerEarnings() {
  const { currentUser, orders } = useApp();
  const { t } = useLanguage();
  const myOrders = orders.filter((o) => o.farmerId === currentUser?.id);

  const totalEarned = myOrders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + o.totalAmount, 0);

  const totalPending = myOrders
    .filter((o) => o.status !== "Delivered" && o.status !== "Cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  const thisMonth = monthlyData[monthlyData.length - 1].amount;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
      <h2 className="font-display font-black text-xl text-foreground">
        {t("earnings")}
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: t("totalEarned"),
            value: `₹${totalEarned.toLocaleString("en-IN")}`,
            icon: <IndianRupee className="w-4 h-4" />,
            color: "bg-green-50 text-green-700",
          },
          {
            label: t("pendingPayment"),
            value: `₹${totalPending.toLocaleString("en-IN")}`,
            icon: <Package className="w-4 h-4" />,
            color: "bg-yellow-50 text-yellow-700",
          },
          {
            label: t("thisMonth"),
            value: `₹${thisMonth.toLocaleString("en-IN")}`,
            icon: <TrendingUp className="w-4 h-4" />,
            color: "bg-blue-50 text-blue-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-3 text-center ${stat.color} border border-current/20`}
          >
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <p className="font-display font-black text-base">{stat.value}</p>
            <p className="text-[10px] font-body mt-0.5 opacity-70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <MiniBarChart />

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-section-alt">
          <CheckCircle className="w-4 h-4 text-forest" />
          <h4 className="font-display font-bold text-sm text-foreground">
            {t("paymentHistory")}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-section-alt/50 text-left">
                {[
                  t("orderIdLabel"),
                  t("cropLabel"),
                  t("buyerLabel"),
                  t("amountLabel"),
                  t("methodLabel"),
                  t("statusLabel"),
                  t("dateLabel"),
                ].map((h) => (
                  <th
                    key={h}
                    className="py-2 px-3 text-[10px] font-display font-bold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    {t("noPaymentHistory")}
                  </td>
                </tr>
              ) : (
                myOrders.map((o) => <PaymentRow key={o.id} order={o} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
