"use client";
import React, { useState } from "react";

const HOURS = [0, 1, 2, 3, 4];

export default function ReadingTracker() {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const [days, setDays] = useState<Record<number, number>>({});
  const [pickerDay, setPickerDay] = useState<number | null>(null);

  const setHour = (day: number, hour: number) => {
    setDays((prev) => ({ ...prev, [day]: hour }));
    setPickerDay(null);
  };

  const monthName = today.toLocaleString("default", {
    month: "long",
  });

  return (
    <div
      className="
        relative 
        w-full
        mx-auto 
        h-[420px]
        rounded-2xl 
        p-8
        flex
        flex-col 
        justify-start
      "
      style={{
        backgroundImage: "url('/2147923475.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <h3 className="text-base font-semibold text-center text-black">
        Reading Tracker
      </h3>


      <h4 className="text-center text-black font-medium text-sm">
        {monthName} {year}
      </h4>


      <div className="grid grid-cols-7 gap-4 text-center text-xs text-black font-semibold mt-10 mx-auto">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <div className="grid grid-cols-7 sm:gap-2 gap-5 ">

          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={"empty-" + i} className="w-9 h-9" />
          ))}


          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hour = days[day] ?? 0;

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
                className="
                  w-9 h-9
                  rounded-md
                  border border-white/20
                  flex items-center justify-center
                  text-white
                  text-xs
                  font-bold
                  hover:scale-105
                  transition
                "
                style={{ backgroundColor: bgColor }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3 text-xs text-black/70 mt-10">
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
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              {h}h
            </div>
          );
        })}
      </div>

      {/* Picker */}
      {pickerDay && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-4 space-y-3 w-[90%] max-w-xs">
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
                    className="w-8 h-8 rounded-md border border-white/20 hover:scale-105 transition"
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </div>

            <button
              onClick={() => setPickerDay(null)}
              className="text-xs text-white/60 block mx-auto mt-2 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}