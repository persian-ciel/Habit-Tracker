"use client";

import { useEffect, useState } from "react";

interface Props {
  habitId: number;
  year: number;
  month: number; // 1-12
}

const SIDE = 24;
const HEX_HEIGHT = Math.sqrt(3) * SIDE;
const HORIZONTAL_SPACING = SIDE * 2;
const VERTICAL_SPACING = HEX_HEIGHT;

const generateHexes = (daysInMonth: number) => {
  const hexes = [];
  let day = 1;
  let row = 0;

  const rowCounts = [5, 4, 5, 5, 5, 5, 2];

  while (day <= daysInMonth && row < rowCounts.length) {
    const cols = rowCounts[row];
    const actualCols = Math.min(cols, daysInMonth - day + 1);

    const isOddRow = row % 2 === 1;
    const offsetX = isOddRow ? HORIZONTAL_SPACING / 2 : 0;

    for (let col = 0; col < actualCols; col++) {
      const x = offsetX + col * HORIZONTAL_SPACING;
      const y = row * VERTICAL_SPACING;
      hexes.push({ day, x, y });
      day++;
    }

    row++;
  }

  return hexes;
};

const getHexPoints = (cx: number, cy: number, side: number) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const x = cx + side * Math.cos(angle);
    const y = cy + side * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
};

export default function HabitHexTracker({ habitId, year, month }: Props) {
  const [days, setDays] = useState<Record<number, boolean>>({});

  const daysInMonth = new Date(year, month, 0).getDate();
  const HEXES = generateHexes(daysInMonth);

  const maxX = Math.max(...HEXES.map((h) => h.x), 0);
  const maxY = Math.max(...HEXES.map((h) => h.y), 0);

  const padding = SIDE;
  const viewWidth = maxX + SIDE * 2 + padding * 2;
  const viewHeight = maxY + HEX_HEIGHT + padding * 2;

  useEffect(() => {
    fetch(`/api/habits/${habitId}/logs?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((logs) => {
        const map: Record<number, boolean> = {};
        logs.forEach((l: any) => {
          const d = new Date(l.log_date).getDate();
          map[d] = !!l.completed;
        });
        setDays(map);
      });
  }, [habitId, year, month]);

  const toggle = async (day: number) => {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setDays((s) => ({ ...s, [day]: !s[day] }));

    await fetch("/api/habits/toggle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, date }),
    });
  };

  return (
  <div className="bg-black/40 rounded-2xl p-4 h-[420px] flex flex-col overflow-hidden">
    
    {/* Header */}
    <h3 className="text-2xl my-2 text-center text-white shrink-0">
      Skin Care Routine
    </h3>

    {/* SVG Container */}
    <div className="flex-1 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-h-[320px]">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-auto max-h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${padding}, ${padding + HEX_HEIGHT / 2})`}>
            {HEXES.map(({ day, x, y }) => (
              <g
                key={day}
                onClick={() => toggle(day)}
                className="cursor-pointer"
              >
                <polygon
                  points={getHexPoints(x + SIDE, y, SIDE)}
                  fill={days[day] ? "#DA498D" : "#1e293b"}
                  stroke="#FAC67A"
                  strokeWidth="1"
                />
                <text
                  x={x + SIDE}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fill="white"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {day}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  </div>
);


}
