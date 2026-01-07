"use client";
import React, { useState } from "react";

const COLORS = [
  { label: "0h", value: "#111111" },
  { label: "1h", value: "#ED985F" },
  { label: "2h", value: "#F96E5B" },
  { label: "3h", value: "#79C9C5" },
  { label: "4h+", value: "#3F9AAE" },
];

interface Props {
  year: number;
  month: number; // 1-12
}

export default function ExerciseTracker({ year, month }: Props) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const [days, setDays] = useState<Record<number, string>>({});
  const [pickerDay, setPickerDay] = useState<number | null>(null);

  const setColor = (day: number, color: string) => {
    setDays((prev) => ({ ...prev, [day]: color }));
    setPickerDay(null);
  };

  return (
    <div className=" rounded-2xl p-4 h-[420px] shadow-xl flex flex-col overflow-hidden" style={{ backgroundImage: "url('/14546395_rm183-wan-11.jpg')", backgroundSize: "cover", backgroundPosition: "center center" }}>
      
      {/* Header */}
      <h3 className="text-lg font-semibold text-center mt-5 text-white">
        Exercise Tracker
      </h3>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center ">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const color = days[day] ?? "#111111";

            return (
              <button
                key={day}
                onClick={() => setPickerDay(day)}
                className="relative w-10 h-10 rounded-md border border-white/20 text-xs text-white flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: color }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 text-xs text-white/70 mt-2">
        {COLORS.map((c) => (
          <div key={c.label} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: c.value }}
            />
            {c.label}
          </div>
        ))}
      </div>

      {/* Color Picker */}
      {pickerDay && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-4 space-y-3">
            <p className="text-white text-sm text-center">
              Day {pickerDay} – how many hours?
            </p>

            <div className="flex gap-2 justify-center">
              {COLORS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setColor(pickerDay, c.value)}
                  className="w-8 h-8 rounded-md border border-white/20 cursor-pointer"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>

            <button
              onClick={() => setPickerDay(null)}
              className="text-xs text-white/60 block mx-auto mt-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
