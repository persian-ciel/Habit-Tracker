"use client";
import React, { useState } from "react";

interface Props {
  year: number;
  month: number; // 1-12
}

// می‌خوای 0 تا 4 ساعت
const HOURS = [0, 1, 2, 3, 4];

export default function ReadingTracker({ year, month }: Props) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const [days, setDays] = useState<Record<number, number>>({});
  const [pickerDay, setPickerDay] = useState<number | null>(null);

  const setHour = (day: number, hour: number) => {
    setDays((prev) => ({ ...prev, [day]: hour }));
    setPickerDay(null);
  };

  return (
    <div className=" rounded-2xl p-4 h-[420px] flex flex-col overflow-hidden" style={{ backgroundImage: "url('/15364620_5597956.jpg')", backgroundSize: "cover", backgroundPosition: "center center" }}>
      
      {/* Header */}
      <h3 className="text-lg font-semibold text-center text-black mt-5">
        Reading Tracker
      </h3>

      {/* Grid of days */}
      <div className="flex-1 flex items-center justify-center mt-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hour = days[day] ?? 0;

            // رنگ روزها بر اساس ساعت
            const bgColor =
              hour === 0
                ? "#1e293b"
                : hour === 1
                ? "#3b82f6"
                : hour === 2
                ? "#2563eb"
                : hour === 3
                ? "#1e40af"
                : "#7c3aed";

            return (
              <button
                key={day}
                onClick={() => setPickerDay(day)}
                className="relative w-10 h-10 rounded-md border border-white/20 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
                style={{ backgroundColor: bgColor }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 text-xs text-black/70 mt-2">
        {HOURS.map((h) => {
          const color =
            h === 0
              ? "#1e293b"
              : h === 1
              ? "#3b82f6"
              : h === 2
              ? "#2563eb"
              : h === 3
              ? "#1e40af"
              : "#7c3aed";
          return (
            <div key={h} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              {h}h
            </div>
          );
        })}
      </div>

      {/* Hour Picker Overlay */}
      {pickerDay && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-4 space-y-3">
            <p className="text-white text-sm text-center">
              Day {pickerDay} – How many hours read?
            </p>

            <div className="flex gap-2 justify-center">
              {HOURS.map((h) => {
                const color =
                  h === 0
                    ? "#1e293b"
                    : h === 1
                    ? "#3b82f6"
                    : h === 2
                    ? "#2563eb"
                    : h === 3
                    ? "#1e40af"
                    : "#7c3aed";
                return (
                  <button
                    key={h}
                    onClick={() => setHour(pickerDay, h)}
                    className="w-8 h-8 rounded-md border border-white/20 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                );
              })}
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
