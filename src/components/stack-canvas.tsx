import { useId } from "react";
import { charms } from "@/lib/catalog";
import type { Base, Metal } from "@/lib/stack-store";
type Props = { base: Base; metal: Metal; charmIds: string[] };
export function StackCanvas({ base, metal, charmIds }: Props) {
  const id = useId().replace(/:/g, "");
  const selected = charmIds
    .map((key) => charms.find((c) => c.id === key))
    .filter((c) => c !== undefined);
  const gold = metal === "gold";
  return (
    <div className="stack-canvas">
      <svg
        viewBox="0 0 480 480"
        role="img"
        aria-label={`Illustrative ${metal} ${base} with ${selected.length} charms: ${selected.map((c) => c.name).join(", ")}`}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={gold ? "#806238" : "#7b7b79"} />
            <stop offset=".28" stopColor={gold ? "#ecdbab" : "#f1eee8"} />
            <stop offset=".55" stopColor={gold ? "#ad8651" : "#a6a5a1"} />
            <stop offset=".8" stopColor={gold ? "#e2c888" : "#deddd9"} />
            <stop offset="1" stopColor={gold ? "#8a683a" : "#777772"} />
          </linearGradient>
        </defs>
        <ellipse cx="240" cy="340" rx="115" ry="15" fill="#554636" opacity=".07" />
        {base === "hoop" ? (
          <circle cx="240" cy="210" r="120" fill="none" stroke={`url(#${id})`} strokeWidth="12" />
        ) : (
          <ellipse
            cx="240"
            cy="240"
            rx="155"
            ry="75"
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth="13"
          />
        )}
        {selected.map((charm, i) => {
          const angle = Math.PI * (0.16 + ((i + 0.5) / Math.max(selected.length, 1)) * 0.68);
          const x = 240 + Math.cos(angle) * (base === "hoop" ? 120 : 155);
          const y = (base === "hoop" ? 210 : 240) + Math.sin(angle) * (base === "hoop" ? 120 : 75);
          return (
            <g key={charm.id} transform={`translate(${x},${y})`}>
              <g className="charm-swing" style={{ animationDelay: `${i * 35}ms` }}>
                <ellipse cy="8" rx="6" ry="11" fill="none" stroke={`url(#${id})`} strokeWidth="3" />
                <path
                  d={
                    charm.kind === "stone"
                      ? "M0 18 15 35 0 53 -15 35Z"
                      : charm.id === "hearts"
                        ? "M0 52C-35 30 -10 10 0 25C10 10 35 30 0 52Z"
                        : "M-16 20Q0 14 16 20L16 45Q0 57 -16 45Z"
                  }
                  fill={`url(#${id})`}
                  stroke={gold ? "#8a683a" : "#777772"}
                  strokeWidth=".7"
                />
                {charm.id !== "hearts" && (
                  <text
                    textAnchor="middle"
                    y="41"
                    fontSize="17"
                    fill="#493a28"
                    fontFamily="Georgia, serif"
                  >
                    {charm.glyph}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
      <div className="stack-canvas-label">
        <span>ORA / YOUR COMPOSITION</span>
        <span>{selected.length ? "A story, taking shape." : "Start with a little instinct."}</span>
      </div>
    </div>
  );
}
