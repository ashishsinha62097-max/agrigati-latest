import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

// ── AgriGati Futuristic Truck SVG Logo ───────────────────────────────────────
export function AgriGatiTruckLogo({
  size = 72,
  showText = false,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 160 80"
      fill="none"
      role="img"
      aria-label="AgriGati truck logo"
    >
      <defs>
        <linearGradient id="truckBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="truckCabin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* Truck cargo body */}
      <rect
        x="2"
        y="14"
        width="100"
        height="40"
        rx="3"
        fill="url(#truckBody)"
        filter="url(#glow)"
      />
      {/* Cargo body highlight */}
      <rect
        x="2"
        y="14"
        width="100"
        height="5"
        rx="3"
        fill="white"
        opacity="0.15"
      />
      {/* Cargo body bottom stripe */}
      <rect
        x="2"
        y="48"
        width="100"
        height="3"
        rx="1"
        fill="white"
        opacity="0.1"
      />

      {/* AgriGati text on cargo body */}
      {showText && (
        <text
          x="52"
          y="38"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1"
          filter="url(#glow)"
        >
          AgriGati
        </text>
      )}

      {/* Vertical lines on cargo body for detail */}
      {[20, 35, 50, 65, 80, 95].map((x) => (
        <line
          key={x}
          x1={x}
          y1="17"
          x2={x}
          y2="51"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.1"
        />
      ))}

      {/* Cabin */}
      <path
        d="M102 30 L102 54 L140 54 L140 34 L130 22 L112 22 L102 30 Z"
        fill="url(#truckCabin)"
        filter="url(#glow)"
      />
      {/* Cabin highlight */}
      <path
        d="M104 30 L112 24 L128 24 L136 34 L136 36"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />

      {/* Windshield */}
      <path
        d="M108 30 L116 23 L128 23 L136 31 L136 38 L108 38 Z"
        fill="#1e293b"
        opacity="0.8"
      />
      {/* Windshield glint */}
      <path
        d="M112 25 L120 24 L126 28 L124 30 L114 30 Z"
        fill="white"
        opacity="0.2"
      />

      {/* Headlight */}
      <rect
        x="136"
        y="36"
        width="6"
        height="8"
        rx="2"
        fill="#fbbf24"
        filter="url(#glow)"
      />
      <rect
        x="138"
        y="37"
        width="4"
        height="6"
        rx="1"
        fill="#fef3c7"
        opacity="0.9"
      />
      {/* Headlight beam */}
      <path d="M142 40 L155 36 L155 44 Z" fill="#fbbf24" opacity="0.15" />

      {/* Side mirror */}
      <rect
        x="139"
        y="28"
        width="5"
        height="4"
        rx="1"
        fill="#0ea5e9"
        opacity="0.8"
      />

      {/* Door line */}
      <line
        x1="118"
        y1="38"
        x2="118"
        y2="54"
        stroke="white"
        strokeWidth="0.7"
        opacity="0.3"
      />

      {/* Bumper */}
      <rect x="136" y="50" width="8" height="5" rx="2" fill="#374151" />

      {/* Exhaust pipe */}
      <rect x="130" y="18" width="3" height="8" rx="1" fill="#6b7280" />
      {/* Smoke */}
      <circle cx="131" cy="16" r="2" fill="#9ca3af" opacity="0.4" />
      <circle cx="133" cy="13" r="1.5" fill="#9ca3af" opacity="0.25" />
      <circle cx="130" cy="10" r="1" fill="#9ca3af" opacity="0.15" />

      {/* Wheels */}
      {/* Front wheel */}
      <circle cx="127" cy="58" r="10" fill="url(#wheelGrad)" />
      <circle cx="127" cy="58" r="7" fill="#1f2937" />
      <circle cx="127" cy="58" r="4" fill="#374151" />
      <circle cx="127" cy="58" r="1.5" fill="#6b7280" />
      {/* Wheel spokes */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={127 + 2 * Math.cos((deg * Math.PI) / 180)}
          y1={58 + 2 * Math.sin((deg * Math.PI) / 180)}
          x2={127 + 6 * Math.cos((deg * Math.PI) / 180)}
          y2={58 + 6 * Math.sin((deg * Math.PI) / 180)}
          stroke="#4b5563"
          strokeWidth="1.2"
        />
      ))}
      {/* Rear wheel */}
      <circle cx="32" cy="58" r="10" fill="url(#wheelGrad)" />
      <circle cx="32" cy="58" r="7" fill="#1f2937" />
      <circle cx="32" cy="58" r="4" fill="#374151" />
      <circle cx="32" cy="58" r="1.5" fill="#6b7280" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={32 + 2 * Math.cos((deg * Math.PI) / 180)}
          y1={58 + 2 * Math.sin((deg * Math.PI) / 180)}
          x2={32 + 6 * Math.cos((deg * Math.PI) / 180)}
          y2={58 + 6 * Math.sin((deg * Math.PI) / 180)}
          stroke="#4b5563"
          strokeWidth="1.2"
        />
      ))}
      {/* Mid wheel */}
      <circle cx="72" cy="58" r="10" fill="url(#wheelGrad)" />
      <circle cx="72" cy="58" r="7" fill="#1f2937" />
      <circle cx="72" cy="58" r="4" fill="#374151" />
      <circle cx="72" cy="58" r="1.5" fill="#6b7280" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={72 + 2 * Math.cos((deg * Math.PI) / 180)}
          y1={58 + 2 * Math.sin((deg * Math.PI) / 180)}
          x2={72 + 6 * Math.cos((deg * Math.PI) / 180)}
          y2={58 + 6 * Math.sin((deg * Math.PI) / 180)}
          stroke="#4b5563"
          strokeWidth="1.2"
        />
      ))}

      {/* Undercarriage */}
      <rect
        x="10"
        y="54"
        width="130"
        height="3"
        rx="1"
        fill="#1f2937"
        opacity="0.6"
      />

      {/* Speed lines (motion effect) */}
      <line
        x1="0"
        y1="32"
        x2="0"
        y2="32"
        stroke="#0ea5e9"
        strokeWidth="0"
        opacity="0"
      />
    </svg>
  );
}

// ── Small icon version for header ─────────────────────────────────────────────
export function AgriGatiTruckIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="AgriGati"
    >
      <defs>
        <linearGradient id="iconBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      {/* Cargo */}
      <rect x="1" y="6" width="20" height="14" rx="2" fill="url(#iconBody)" />
      {/* Cabin */}
      <path d="M21 10 L21 20 L30 20 L30 13 L27 8 L22 8 Z" fill="#0ea5e9" />
      {/* Windshield */}
      <path
        d="M23 10 L26 8.5 L29 12 L29 14 L23 14 Z"
        fill="#1e293b"
        opacity="0.8"
      />
      {/* Headlight */}
      <rect x="29" y="14" width="2" height="4" rx="1" fill="#fbbf24" />
      {/* Wheels */}
      <circle cx="8" cy="22" r="4" fill="#1f2937" />
      <circle cx="8" cy="22" r="2" fill="#374151" />
      <circle cx="24" cy="22" r="4" fill="#1f2937" />
      <circle cx="24" cy="22" r="2" fill="#374151" />
    </svg>
  );
}

// ── Main Splash Screen (Truck Animation) ──────────────────────────────────────
export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<"enter" | "show" | "reveal" | "fade">(
    "enter",
  );

  useEffect(() => {
    // Phase 1: Truck enters from left (0–1.2s)
    // Phase 2: Truck in center, AgriGati visible on truck (1.2–2.2s)
    // Phase 3: Big name reveal (2.2–3.8s)
    // Phase 4: Fade out (3.8–4.4s)
    const t1 = setTimeout(() => setPhase("show"), 1200);
    const t2 = setTimeout(() => setPhase("reveal"), 2200);
    const t3 = setTimeout(() => setPhase("fade"), 3800);
    const t4 = setTimeout(() => onDone(), 4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "fade" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #020c18 0%, #031a10 40%, #040d22 100%)",
          }}
        >
          {/* Animated grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Glow orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #059669 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #6366f1 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Road line */}
          <motion.div
            className="absolute"
            style={{
              bottom: "calc(50% - 60px)",
              left: 0,
              right: 0,
              height: "2px",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "enter" ? 1 : phase === "show" ? 1 : 0.3,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, #0ea5e9 20%, #059669 50%, #6366f1 80%, transparent 100%)",
              }}
            />
          </motion.div>

          {/* Dashed road lines */}
          <motion.div
            className="absolute flex gap-4"
            style={{ bottom: "calc(50% - 68px)", left: 0, right: 0 }}
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {[
              "r1",
              "r2",
              "r3",
              "r4",
              "r5",
              "r6",
              "r7",
              "r8",
              "r9",
              "r10",
              "r11",
              "r12",
              "r13",
              "r14",
              "r15",
              "r16",
              "r17",
              "r18",
              "r19",
              "r20",
            ].map((id) => (
              <div
                key={id}
                className="w-12 h-1 bg-white/20 rounded-full flex-shrink-0"
              />
            ))}
          </motion.div>

          {/* TRUCK - enters from right, moves to center */}
          <motion.div
            className="absolute"
            style={{ bottom: "calc(50% - 48px)" }}
            initial={{ x: "110vw" }}
            animate={
              phase === "enter"
                ? { x: "5vw" }
                : phase === "show"
                  ? { x: "-5vw" }
                  : phase === "reveal"
                    ? { x: "-110vw" }
                    : { x: "-110vw" }
            }
            transition={
              phase === "enter"
                ? { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }
                : phase === "show"
                  ? { duration: 0.4, ease: "easeInOut" }
                  : phase === "reveal"
                    ? { duration: 0.8, ease: [0.55, 0, 1, 0.45] }
                    : { duration: 0.5 }
            }
          >
            {/* Speed lines behind truck (enter phase) */}
            {phase === "enter" && (
              <div className="absolute right-full top-1/2 -translate-y-1/2 flex gap-1 pr-2">
                {(
                  [
                    { w: 40, c: "#0ea5e9" },
                    { w: 28, c: "#059669" },
                    { w: 18, c: "#0ea5e9" },
                    { w: 10, c: "#059669" },
                  ] as { w: number; c: string }[]
                ).map(({ w, c }) => (
                  <div
                    key={w}
                    className="h-0.5 rounded-full opacity-60"
                    style={{
                      width: `${w}px`,
                      background: `linear-gradient(90deg, transparent, ${c})`,
                    }}
                  />
                ))}
              </div>
            )}

            <AgriGatiTruckLogo size={280} showText={true} />
          </motion.div>

          {/* Big AgriGati name reveal */}
          <AnimatePresence>
            {phase === "reveal" && (
              <motion.div
                key="name"
                className="relative flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.3, 0.64, 1] }}
              >
                {/* Glow behind text */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(5,150,105,0.3) 0%, transparent 70%)",
                    filter: "blur(20px)",
                    transform: "scale(2)",
                  }}
                />

                <motion.h1
                  className="relative font-black select-none text-center leading-none"
                  style={{
                    fontSize: "clamp(3rem, 14vw, 5.5rem)",
                    letterSpacing: "-0.02em",
                    background:
                      "linear-gradient(135deg, #34d399 0%, #0ea5e9 40%, #a78bfa 70%, #f43f5e 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(6,182,212,0.5))",
                  }}
                >
                  AgriGati
                </motion.h1>

                <motion.p
                  className="text-white/70 font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Moving India's Agriculture Forward
                </motion.p>

                {/* Loading dots */}
                <motion.div
                  className="flex gap-2 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          i === 0 ? "#34d399" : i === 1 ? "#0ea5e9" : "#a78bfa",
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.3, 0.8],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.9,
                        delay: i * 0.22,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
