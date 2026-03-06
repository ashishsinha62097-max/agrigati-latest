import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";

export default function BuyerTrackDefault() {
  const { currentUser, orders } = useApp();
  const { t } = useLanguage();
  const myOrders = orders.filter(
    (o) =>
      o.buyerId === currentUser?.id &&
      !["Delivered", "Cancelled"].includes(o.status),
  );

  if (myOrders.length > 0) {
    return (
      <div className="px-4 py-4 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🚚</div>
          <h2 className="font-display font-black text-xl text-foreground mb-2">
            {t("trackYourOrders")}
          </h2>
          <p className="text-muted-foreground text-sm font-body mb-6">
            {myOrders.length} {t("activeOrders")}
          </p>
          <div className="space-y-3">
            {myOrders.map((order) => (
              <Link
                key={order.id}
                to="/buyer/track/$orderId"
                params={{ orderId: order.id }}
              >
                <div className="bg-white rounded-2xl border border-border p-4 text-left hover:border-amber-brand transition-colors shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-sm">
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        {order.items.map((i) => i.cropName).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-brand" />
                      <span className="text-xs font-body text-amber-dark font-semibold">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto text-center py-16">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="font-display font-black text-xl text-foreground mb-2">
        {t("noActiveDeliveries")}
      </h2>
      <p className="text-muted-foreground text-sm font-body mb-6">
        {t("placeOrderToTrack")}
      </p>
      <Link to="/buyer/browse">
        <Button className="bg-forest hover:bg-forest-dark text-white font-bold">
          {t("shopNow")}
        </Button>
      </Link>
    </div>
  );
}
