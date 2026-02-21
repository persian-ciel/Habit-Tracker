"use client";

import { Funnel } from "lucide-react";
import React, { useState } from "react";
 // آیکون فیلتر

interface GoalFilterProps {
  value: "all" | "completed" | "incomplete";
  onChange: (value: "all" | "completed" | "incomplete") => void;
}

export default function GoalFilter({ value, onChange }: GoalFilterProps) {
  const [showMenu, setShowMenu] = useState(false);

  const options: { label: string; value: "all" | "completed" | "incomplete" }[] = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Incomplete", value: "incomplete" },
  ];

  return (
    <div className="relative flex items-center justify-center mb-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "all" | "completed" | "incomplete")}
        className="hidden sm:block bg-black/40 text-white px-3 py-1 rounded cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-black/80">
            {opt.label}
          </option>
        ))}
      </select>

      <div className="sm:hidden relative">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="p-2 bg-black/40 text-white rounded"
        >
          <Funnel size={17} />
        </button>

        {showMenu && (
          <div className="absolute left-0 mt-2 w-32 bg-black/80 text-white rounded shadow-lg z-10">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setShowMenu(false);
                }}
                className={`block w-full text-left px-3 py-2 hover:bg-black/60 ${
                  opt.value === value ? "font-bold" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}