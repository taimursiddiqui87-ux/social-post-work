/**
 * Full-viewport SVG backdrop with three layered AI-themed visuals:
 *   1. Neural-network nodes + animated edges (across the whole viewport)
 *   2. Workflow pipelines in the left + right side gutters
 *      (where the centered content card leaves empty space)
 *   3. Rotating circuit accents in opposite corners
 *
 * Pure SVG + CSS animations. Pointer-events: none. Honors prefers-reduced-motion.
 */

const NODES: Array<{ x: number; y: number; r?: number; pulseDelay?: number; brand?: number }> = [
  { x: 80,   y: 140, r: 5, brand: 0, pulseDelay: 0    },
  { x: 240,  y: 90,  r: 4, brand: 1, pulseDelay: 0.3  },
  { x: 480,  y: 170, r: 6, brand: 0, pulseDelay: 0.7  },
  { x: 720,  y: 110, r: 4, brand: 3, pulseDelay: 1.1  },
  { x: 940,  y: 200, r: 5, brand: 2, pulseDelay: 0.5  },
  { x: 1160, y: 130, r: 4, brand: 1, pulseDelay: 1.4  },
  { x: 1380, y: 220, r: 6, brand: 0, pulseDelay: 0.9  },
  { x: 1560, y: 100, r: 4, brand: 3, pulseDelay: 0.2  },
  { x: 1720, y: 180, r: 5, brand: 4, pulseDelay: 0.6  },

  { x: 50,   y: 380, r: 4, brand: 1, pulseDelay: 1.0  },
  { x: 220,  y: 320, r: 5, brand: 4, pulseDelay: 0.4  },
  { x: 440,  y: 410, r: 4, brand: 2, pulseDelay: 1.2  },
  { x: 680,  y: 350, r: 6, brand: 0, pulseDelay: 0.6  },
  { x: 880,  y: 440, r: 4, brand: 1, pulseDelay: 1.5  },
  { x: 1100, y: 380, r: 5, brand: 3, pulseDelay: 0.8  },
  { x: 1340, y: 460, r: 4, brand: 0, pulseDelay: 0.1  },
  { x: 1500, y: 360, r: 6, brand: 2, pulseDelay: 1.3  },
  { x: 1700, y: 420, r: 4, brand: 1, pulseDelay: 0.7  },

  { x: 110,  y: 620, r: 5, brand: 0, pulseDelay: 0.7  },
  { x: 330,  y: 580, r: 4, brand: 2, pulseDelay: 1.1  },
  { x: 540,  y: 660, r: 6, brand: 1, pulseDelay: 0.3  },
  { x: 780,  y: 600, r: 4, brand: 3, pulseDelay: 1.4  },
  { x: 1000, y: 680, r: 5, brand: 0, pulseDelay: 0.5  },
  { x: 1220, y: 620, r: 4, brand: 4, pulseDelay: 1.0  },
  { x: 1460, y: 700, r: 6, brand: 2, pulseDelay: 0.6  },
  { x: 1660, y: 620, r: 5, brand: 0, pulseDelay: 1.2  },

  { x: 60,   y: 850, r: 4, brand: 3, pulseDelay: 0.2  },
  { x: 200,  y: 870, r: 4, brand: 3, pulseDelay: 1.2  },
  { x: 420,  y: 800, r: 6, brand: 0, pulseDelay: 0.4  },
  { x: 640,  y: 880, r: 4, brand: 1, pulseDelay: 0.9  },
  { x: 860,  y: 820, r: 5, brand: 2, pulseDelay: 1.5  },
  { x: 1080, y: 900, r: 4, brand: 0, pulseDelay: 0.2  },
  { x: 1300, y: 840, r: 6, brand: 3, pulseDelay: 1.1  },
  { x: 1520, y: 880, r: 4, brand: 1, pulseDelay: 0.8  },
  { x: 1700, y: 860, r: 5, brand: 4, pulseDelay: 0.5  },
];

const EDGES: Array<[number, number, number?]> = [
  [0, 1], [1, 2, 0.4], [2, 3], [3, 4, 0.8], [4, 5], [5, 6, 1.2], [6, 7], [7, 8, 0.5],
  [0, 9], [1, 10, 0.5], [2, 11], [3, 12], [4, 13, 0.3], [5, 14], [6, 15], [7, 16, 0.6], [8, 17],
  [9, 10], [10, 11], [11, 12, 0.7], [12, 13], [13, 14, 0.9], [14, 15], [15, 16, 0.4], [16, 17],
  [9, 18, 1.1], [11, 20], [13, 22, 0.2], [15, 24, 0.6], [17, 25],
  [18, 19], [19, 20, 0.5], [20, 21], [21, 22, 0.8], [22, 23], [23, 24, 1.0], [24, 25],
  [18, 26, 0.4], [20, 28], [22, 30, 0.7], [24, 32, 0.5], [25, 34],
  [26, 27], [27, 28], [28, 29, 0.6], [29, 30, 1.0], [30, 31], [31, 32, 0.3], [32, 33], [33, 34, 0.8],
];

const BRAND_VARS = ["--c1", "--c2", "--c3", "--c4", "--c5"] as const;

/* Workflow pipeline boxes (4 per side, vertical). Each is a rounded rect
   linked to the next with a curved edge that has a flowing data packet. */
const PIPELINE_LEFT: Array<{ y: number; brand: number; pulseDelay: number }> = [
  { y: 130, brand: 0, pulseDelay: 0    },
  { y: 320, brand: 1, pulseDelay: 0.6  },
  { y: 510, brand: 3, pulseDelay: 1.2  },
  { y: 700, brand: 2, pulseDelay: 1.8  },
];
const PIPELINE_RIGHT: Array<{ y: number; brand: number; pulseDelay: number }> = [
  { y: 180, brand: 4, pulseDelay: 0.3  },
  { y: 370, brand: 0, pulseDelay: 0.9  },
  { y: 560, brand: 2, pulseDelay: 1.5  },
  { y: 750, brand: 1, pulseDelay: 2.1  },
];

const PIPE_LEFT_X  = 130;   // svg x-coord of the left pipeline column
const PIPE_RIGHT_X = 1670;  // svg x-coord of the right pipeline column
const BOX_W = 110;
const BOX_H = 56;

export function AIBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      <svg
        viewBox="0 0 1800 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-[0.7]"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="boxStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgb(99 102 241)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0.55" />
          </linearGradient>

          <pattern id="micro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(99 102 241 / 0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Faint grid wash */}
        <rect width="1800" height="1000" fill="url(#micro-grid)" />

        {/* ── Background neural network ── */}
        <g stroke="rgb(99 102 241 / 0.22)" strokeWidth="1" fill="none">
          {EDGES.map(([a, b], i) => {
            const A = NODES[a], B = NODES[b];
            return (
              <line
                key={i}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                style={{
                  animation: `edgeBreath 6s ease-in-out infinite`,
                  animationDelay: `${(i * 0.13) % 4}s`,
                }}
              />
            );
          })}
        </g>

        <g>
          {EDGES.map(([a, b, delay], i) => {
            if (delay === undefined) return null;
            const A = NODES[a], B = NODES[b];
            const dx = B.x - A.x, dy = B.y - A.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            return (
              <circle
                key={`p-${i}`}
                r="2.5"
                fill={`rgb(var(${BRAND_VARS[i % 5]}))`}
                style={{
                  offsetPath: `path('M ${A.x} ${A.y} L ${B.x} ${B.y}')`,
                  animation: `flowPath ${Math.max(3, len / 200)}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </g>

        <g>
          {NODES.map((n, i) => {
            const color = `rgb(var(${BRAND_VARS[(n.brand ?? 0) % 5]}))`;
            return (
              <g key={i} style={{ color }}>
                <circle
                  cx={n.x} cy={n.y} r={(n.r ?? 4) * 4}
                  fill="url(#nodeGlow)"
                  style={{
                    animation: `nodePulse 4s ease-in-out infinite`,
                    animationDelay: `${n.pulseDelay ?? 0}s`,
                    transformOrigin: `${n.x}px ${n.y}px`,
                  }}
                />
                <circle cx={n.x} cy={n.y} r={n.r ?? 4} fill={color} fillOpacity="0.7" />
              </g>
            );
          })}
        </g>

        {/* ── Left pipeline ── */}
        <PipelineColumn boxes={PIPELINE_LEFT} cx={PIPE_LEFT_X} />

        {/* ── Right pipeline ── */}
        <PipelineColumn boxes={PIPELINE_RIGHT} cx={PIPE_RIGHT_X} />

        {/* ── Rotating circuit accents in corners ── */}
        <CircuitGear cx={1740} cy={60}  size={90}  speed={45} />
        <CircuitGear cx={60}   cy={940} size={110} speed={60} reverse />
      </svg>

      {/* Local keyframes */}
      <style>{`
        @keyframes nodePulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50%      { opacity: 0.6;  transform: scale(1.1);  }
        }
        @keyframes edgeBreath {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.85; }
        }
        @keyframes flowPath {
          0%   { offset-distance: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes boxBreath {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }
        @keyframes bracketPulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.9; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinSlowReverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

/* ── Side workflow pipeline column ── */
function PipelineColumn({
  boxes, cx,
}: { boxes: typeof PIPELINE_LEFT; cx: number }) {
  return (
    <g>
      {/* Connecting line between boxes (drawn behind boxes) */}
      <g stroke="url(#boxStroke)" strokeWidth="1.5" fill="none">
        {boxes.slice(0, -1).map((b, i) => {
          const next = boxes[i + 1];
          const y1 = b.y + BOX_H / 2;
          const y2 = next.y - BOX_H / 2;
          return (
            <line
              key={`pl-${cx}-${i}`}
              x1={cx} y1={y1} x2={cx} y2={y2}
              strokeDasharray="6 4"
              style={{
                animation: `bracketPulse 4s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          );
        })}
      </g>

      {/* Flowing data packet between boxes */}
      <g>
        {boxes.slice(0, -1).map((b, i) => {
          const next = boxes[i + 1];
          const y1 = b.y + BOX_H / 2;
          const y2 = next.y - BOX_H / 2;
          return (
            <circle
              key={`pkt-${cx}-${i}`}
              r="3"
              fill={`rgb(var(${BRAND_VARS[(b.brand) % 5]}))`}
              style={{
                offsetPath: `path('M ${cx} ${y1} L ${cx} ${y2}')`,
                animation: `flowPath 3.5s linear infinite`,
                animationDelay: `${i * 0.9 + (cx > 1000 ? 1.5 : 0)}s`,
              }}
            />
          );
        })}
      </g>

      {/* Pipeline boxes */}
      {boxes.map((b, i) => {
        const color = `rgb(var(${BRAND_VARS[b.brand % 5]}))`;
        return (
          <g key={`box-${cx}-${i}`} style={{ color }}>
            {/* Glow */}
            <rect
              x={cx - BOX_W / 2 - 6} y={b.y - BOX_H / 2 - 6}
              width={BOX_W + 12} height={BOX_H + 12}
              rx={14}
              fill="currentColor"
              fillOpacity="0.06"
              style={{
                animation: `boxBreath 4s ease-in-out infinite`,
                animationDelay: `${b.pulseDelay}s`,
              }}
            />
            {/* Box */}
            <rect
              x={cx - BOX_W / 2} y={b.y - BOX_H / 2}
              width={BOX_W} height={BOX_H}
              rx={10}
              fill="rgba(255,255,255,0.4)"
              stroke="url(#boxStroke)"
              strokeWidth="1.2"
            />
            {/* "Content" lines inside the box */}
            <rect x={cx - BOX_W / 2 + 12} y={b.y - 12} width={BOX_W - 24} height="3" rx="1.5" fill={color} fillOpacity="0.45" />
            <rect x={cx - BOX_W / 2 + 12} y={b.y - 4}  width={BOX_W - 38} height="2" rx="1"   fill={color} fillOpacity="0.30" />
            <rect x={cx - BOX_W / 2 + 12} y={b.y + 3}  width={BOX_W - 30} height="2" rx="1"   fill={color} fillOpacity="0.30" />
            {/* Status dot */}
            <circle cx={cx + BOX_W / 2 - 12} cy={b.y - BOX_H / 2 + 12} r="2.5" fill={color} fillOpacity="0.85"
              style={{
                animation: `boxBreath 1.6s ease-in-out infinite`,
                animationDelay: `${b.pulseDelay + i * 0.2}s`,
              }}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ── Decorative rotating "gear / circuit" element ── */
function CircuitGear({
  cx, cy, size, speed, reverse,
}: { cx: number; cy: number; size: number; speed: number; reverse?: boolean }) {
  const r = size;
  const tickCount = 12;
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `${reverse ? "spinSlowReverse" : "spinSlow"} ${speed}s linear infinite`,
      }}
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r}     fill="none" stroke="rgb(99 102 241 / 0.18)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke="rgb(16 185 129 / 0.18)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke="rgb(236 72 153 / 0.16)" strokeWidth="1" />
      {/* Tick marks */}
      {Array.from({ length: tickCount }).map((_, i) => {
        const angle = (i / tickCount) * Math.PI * 2;
        const x1 = cx + Math.cos(angle) * (r - 4);
        const y1 = cy + Math.sin(angle) * (r - 4);
        const x2 = cx + Math.cos(angle) * (r - 12);
        const y2 = cy + Math.sin(angle) * (r - 12);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(99 102 241 / 0.30)" strokeWidth="1.5" />;
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3" fill="rgb(16 185 129 / 0.6)" />
    </g>
  );
}
