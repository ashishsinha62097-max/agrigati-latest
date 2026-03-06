import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Cloud, IndianRupee, Package, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { NotificationType } from "../types/marketplace";

const typeIcon: Record<NotificationType, React.ReactNode> = {
  order: <Package className="w-4 h-4" />,
  weather: <Cloud className="w-4 h-4" />,
  payment: <IndianRupee className="w-4 h-4" />,
  demand: <TrendingUp className="w-4 h-4" />,
};

const typeColor: Record<NotificationType, string> = {
  order: "bg-blue-100 text-blue-600",
  weather: "bg-orange-100 text-orange-600",
  payment: "bg-green-100 text-green-600",
  demand: "bg-purple-100 text-purple-600",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const { notifications, markAllRead, markRead } = useApp();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              role="button"
              tabIndex={-1}
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-border z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-section-alt">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-forest" />
                  <span className="font-display font-bold text-sm text-foreground">
                    Notifications
                  </span>
                  {unread > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                      {unread}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs text-forest font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      type="button"
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-section-alt transition-colors flex gap-3 ${
                        !n.read ? "bg-green-50/50" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${typeColor[n.type]}`}
                      >
                        {typeIcon[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold text-xs text-foreground truncate">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
