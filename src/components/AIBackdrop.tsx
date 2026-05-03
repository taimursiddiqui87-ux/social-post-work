/**
 * Full-viewport SVG backdrop: neural-network-style nodes + animated edges.
 * Sits behind content (z-index: -1) and responds to nothing — pointer-events: none.
 *
 * Pure SVG + CSS animations — no JS, no canvas, no extra deps.
 */

const NODES: Array<{ x: number; y: number; r?: number; pulseDelay?: number; brand?: number }> = [
  // Hand-placed for visual rhythm. Brand 0..4 maps to --c1..--c5.
  { x: 120,  y: 140, r: 5, brand: 0, pulseDelay: 0    },
  { x: 320,  y: 90,  r: 4, brand: 1, pulseDelay: 0.3  },
  { x: 540,  y: 170, r: 6, brand: 0, pulseDelay: 0.7  },
  { x: 760,  y: 110, r: 4, brand: 3, pulseDelay: 1.1  },
  { x: 980,  y: 200, r: 5, brand: 2, pulseDelay: 0.5  },
  { x: 1180, y: 130, r: 4, brand: 1, pulseDelay: 1.4  },
  { x: 1380, y: 220, r: 6, brand: 0, pulseDelay: 0.9  },
  { x: 1540, y: 100, r: 4, brand: 3, pulseDelay: 0.2  },

  { x: 80,   y: 380, r: 4, brand: 1, pulseDelay: 1.0  },
  { x: 280,  y: 320, r: 5, brand: 4, pulseDelay: 0.4  },
  { x: 480,  y: 410, r: 4, brand: 2, pulseDelay: 1.2  },
  { x: 680,  y: 350, r: 6, brand: 0, pulseDelay: 0.6  },
  { x: 900,  y: 440, r: 4, brand: 1, pulseDelay: 1.5  },
  { x: 1120, y: 380, r: 5, brand: 3, pulseDelay: 0.8  },
  { x: 1320, y: 460, r: 4, brand: 0, pulseDelay: 0.1  },
  { x: 1500, y: 360, r: 6, brand: 2, pulseDelay: 1.3  },

  { x: 150,  y: 620, r: 5, brand: 0, pulseDelay: 0.7  },
  { x: 360,  y: 580, r: 4, brand: 2, pulseDelay: 1.1  },
  { x: 580,  y: 660, r: 6, brand: 1, pulseDelay: 0.3  },
  { x: 800,  y: 600, r: 4, brand: 3, pulseDelay: 1.4  },
  { x: 1020, y: 680, r: 5, brand: 0, pulseDelay: 0.5  },
  { x: 1240, y: 620, r: 4, brand: 4, pulseDelay: 1.0  },
  { x: 1460, y: 700, r: 6, brand: 2, pulseDelay: 0.6  },

  { x: 220,  y: 860, r: 4, brand: 3, pulseDelay: 1.2  },
  { x: 440,  y: 800, r: 6, brand: 0, pulseDelay: 0.4  },
  { x: 660,  y: 880, r: 4, brand: 1, pulseDelay: 0.9  },
  { x: 880,  y: 820, r: 5, brand: 2, pulseDelay: 1.5  },
  { x: 1100, y: 900, r: 4, brand: 0, pulseDelay: 0.2  },
  { x: 1320, y: 840, r: 6, brand: 3, pulseDelay: 1.1  },
];

const EDGES: Array<[number, number, number?]> = [
  // [from-node-index, to-node-index, optional-flow-delay-seconds]
  [0, 1],   [1, 2, 0.4],   [2, 3], [3, 4, 0.8], [4, 5], [5, 6, 1.2], [6, 7],
  [0, 8],   [1, 9, 0.5],   [2, 10], [3, 11], [4, 12, 0.3], [5, 13], [6, 14], [7, 15, 0.6],
  [8, 9],   [9, 10],        [10, 11, 0.7], [11, 12], [12, 13, 0.9], [13, 14], [14, 15, 0.4],
  [8, 16, 1.1],  [10, 18], [12, 20, 0.2], [14, 22, 0.6],
  [16, 17], [17, 18, 0.5], [18, 19], [19, 20, 0.8], [20, 21], [21, 22, 1.0],
  [17, 23], [19, 24, 0.4], [21, 25], [22, 27, 0.7],
  [23, 24], [24, 25, 0.6], [25, 26, 1.0], [26, 27], [27, 28, 0.3],
];

const BRAND_VARS = ["--c1", "--c2", "--c3", "--c4", "--c5"] as const;

export function AIBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      <svg
        viewBox="0 0 1620 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-[0.55]"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        <g stroke="rgb(99 102 241 / 0.18)" strokeWidth="1" fill="none">
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

        {/* Flowing data packets along selected edges */}
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

        {/* Nodes — pulsing dots */}
        <g>
          {NODES.map((n, i) => {
            const color = `rgb(var(${BRAND_VARS[(n.brand ?? 0) % 5]}))`;
            return (
              <g key={i} style={{ color }}>
                {/* Glow halo */}
                <circle
                  cx={n.x} cy={n.y} r={(n.r ?? 4) * 4}
                  fill="url(#nodeGlow)"
                  style={{
                    animation: `nodePulse 4s ease-in-out infinite`,
                    animationDelay: `${n.pulseDelay ?? 0}s`,
                    transformOrigin: `${n.x}px ${n.y}px`,
                  }}
                />
                {/* Core */}
                <circle cx={n.x} cy={n.y} r={n.r ?? 4} fill={color} fillOpacity="0.7" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Vignette to fade edges into the gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(247,247,250,0.55)_75%,rgba(247,247,250,0.85)_100%)]" />

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
      `}</style>
    </div>
  );
}
