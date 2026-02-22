"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = 8;

export default function SleepTracker() {
  const [sleepData, setSleepData] = useState<number[]>(
    Array(DAYS.length).fill(0)
  );

  const today = new Date();
  const weekNumber = Math.ceil(today.getDate() / 7);

  const handleClick = (dayIndex: number, hourIndex: number) => {
    const newData = [...sleepData];
    newData[dayIndex] = hourIndex + 1;
    setSleepData(newData);
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto backdrop-blur-md rounded-2xl sm:p-8
        p-5 h-[420px] shadow-xl text-black"
      style={{
        backgroundImage:
          "url('/40510883_5_sunset_cloudy_sky_watercolor_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >

      <h3 className="text-base font-bold text-center ">
        Sleep Tracker
      </h3>

      

      <h4 className="text-center text-sm font-medium mb-6">
        Week {weekNumber} of this month
      </h4>

      <div className="flex flex-col gap-5 mt-5">
        {DAYS.map((day, dayIdx) => {
          const filledHours = sleepData[dayIdx];

          return (
            <div key={day} className="flex items-center gap-3 relative">
              <div className="w-14 text-right font-medium">{day}</div>

              <div className="relative flex-1">
                <div className="absolute top-1/2 -translate-y-1/2 h-3 w-full bg-black/15 rounded-full" />

                <div
                  className="absolute top-1/2 -translate-y-1/2 h-3 bg-[#F96E5B] rounded-full transition-all duration-300"
                  style={{ width: `${(filledHours / HOURS) * 100}%` }}
                />

                <div className="relative grid grid-cols-8 w-full cursor-pointer">
                  {[...Array(HOURS)].map((_, hourIdx) => (
                    <div
                      key={hourIdx}
                      onClick={() => handleClick(dayIdx, hourIdx)}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black border border-gray-500 shadow-sm transition hover:scale-110 mx-auto"
                    />
                  ))}
                </div>

              </div>

              <div className="w-8 text-sm text-center font-medium">
                {filledHours}h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}