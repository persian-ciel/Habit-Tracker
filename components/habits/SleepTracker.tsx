"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = 8;

export default function SleepTracker() {
  const [sleepData, setSleepData] = useState<number[]>(Array(DAYS.length).fill(0));

  const handleClick = (dayIndex: number, hourIndex: number) => {
    const newData = [...sleepData];
    newData[dayIndex] = hourIndex + 1;
    setSleepData(newData);
  };

  return (
    <div className="bg-black/20 rounded-lg p-4 w-full max-w-3xl mx-auto">
      <h2 className="text-center text-xl sm:text-2xl font-medium mb-6">
        Sleep Tracker
      </h2>

      <div className="flex flex-col gap-5">
        {DAYS.map((day, dayIdx) => {
          const filledHours = sleepData[dayIdx];

          return (
            <div key={day} className="flex items-center gap-3 relative">
              {/* Day label */}
              <div className="w-14 text-right font-medium">{day}</div>

              {/* Progress bar container */}
              <div className="relative flex-1  ">
                {/* Background bar */}
                <div className="absolute top-1/2  -translate-y-1/2 h-3 w-full bg-gray-400/20 rounded-full" />

                {/* Filled bar */}
                <div
                  className="absolute  py-2 top-1/2 -translate-y-1/2 h-3 bg-[#3F9AAE] rounded-full transition-all duration-300"
                  style={{ width: `${(filledHours / HOURS) * 100}%` }}
                />

                {/* Dots */}
                <div className="relative flex gap-10 cursor-pointer px-4 py-2">
                  {[...Array(HOURS)].map((_, hourIdx) => (
                    <div
                      key={hourIdx}
                      onClick={() => handleClick(dayIdx, hourIdx)}
                      className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-white border border-gray-500 shadow-sm transition hover:scale-110"
                    />
                  ))}
                </div>
              </div>

              {/* Hour count */}
              <div className="w-8 text-sm text-center font-medium">{filledHours}h</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
