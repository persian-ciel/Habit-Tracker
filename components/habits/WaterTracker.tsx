"use client";
import React, { useState } from "react";

const TOTAL_GLASSES = 15;
const GLASS_ML = 250;

const WaterTracker = () => {
  const [filledCount, setFilledCount] = useState(0);

  const toggleGlass = (index: number) => {

    if (filledCount === index + 1) {
      setFilledCount(index);
    } else {
      setFilledCount(index + 1);
    }
  };

  const totalMl = filledCount * GLASS_ML;

  return (
  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 h-[420px] flex flex-col">
    
    {/* Header */}
    <div className="text-center text-white shrink-0">
      <h3 className="text-lg font-semibold">Water Tracker</h3>
      <p className="text-sm text-white/70">
        {totalMl} ml / {TOTAL_GLASSES * GLASS_ML} ml
      </p>
    </div>

    {/* Body */}
    <div className="flex-1 flex items-center justify-center">
      <div className="grid grid-cols-5 gap-x-6 gap-y-2">
        {Array.from({ length: TOTAL_GLASSES }).map((_, index) => {
          const isFilled = index < filledCount;

          return (
            <button
              key={index}
              onClick={() => toggleGlass(index)}
              className="relative h-20 w-full flex justify-center items-end"
            >
              <div className="relative w-10 h-16 border-2 border-white/40 rounded-b-lg rounded-t-sm overflow-hidden">
                <div
                  className={`
                    absolute bottom-0 left-0 w-full transition-all duration-300
                    ${isFilled ? "h-full" : "h-0"}
                    bg-blue-500/80
                  `}
                />
                <div className="absolute left-1 top-1 w-1 h-full bg-white/20 rounded-full" />
              </div>
            </button>
          );
        })}
      </div>
    </div>

    {/* Footer */}
    <div className="text-center text-xs text-white/60 shrink-0">
      Each glass = {GLASS_ML}ml
    </div>
  </div>
);

};

export default WaterTracker;
