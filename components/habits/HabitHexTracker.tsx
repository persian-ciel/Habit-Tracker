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
const VERTICAL_SPACING = HEX_HEIGHT * 1; // دقیقاً (3/4) ارتفاع برای honeycomb فشرده

// تولید موقعیت هگزها دقیقاً مثل تصویر مرجع
const generateHexes = (daysInMonth: number) => {
  const hexes = [];
  let day = 1;
  let row = 0;

  const rowCounts = [5, 4, 5, 5, 5, 5,2 ];

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

// نقاط شش‌ضلعی pointy-top
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

  // محاسبه ابعاد SVG با حاشیه کافی در همه جهت‌ها (به خصوص بالا)
  const maxX = Math.max(...HEXES.map((h) => h.x), 0);
  const maxY = Math.max(...HEXES.map((h) => h.y), 0);

  const padding = SIDE; // حاشیه یکسان در همه طرف‌ها

  const width = maxX + SIDE * 2 + padding * 2;
  const height = maxY + HEX_HEIGHT + padding * 2; // حاشیه بالا و پایین کافی

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
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto block"
    >
      {/* گروه اصلی با جابجایی به مرکز با حاشیه */}
      <g transform={`translate(${padding}, ${padding + HEX_HEIGHT / 2})`}>
        {HEXES.map(({ day, x, y }) => (
          <g
            key={day}
            onClick={() => toggle(day)}
            className="cursor-pointer transition-transform "
          >
            <polygon
              points={getHexPoints(x + SIDE, y, SIDE)}
              fill={days[day] ? "#22c55e" : "#1e293b"}
              stroke="#fbbf24"
              strokeWidth="3"
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
  );
}