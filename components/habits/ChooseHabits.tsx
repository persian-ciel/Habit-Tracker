// components/habits/ChooseHabits.tsx
"use client";

import React from "react";
import { Habit } from "@/lib/types";

interface Props {
  allHabits: Habit[];
  selectedIds: number[];
  toggleSelect: (habitId: number) => void;
}

export default function ChooseHabits({ allHabits, selectedIds, toggleSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {allHabits.map((habit) => {
        const isSelected = selectedIds.includes(habit.id);
        return (
          <button
            key={habit.id}
            className={`rounded-md px-4 py-2 mr-2 mb-2 transition-colors cursor-pointer ${
              isSelected
                ? "bg-[#F96E5B] text-white"
                : "border border-white text-white hover:opacity-90"
            }`}
            onClick={() => toggleSelect(habit.id)}
          >
            {habit.title}
          </button>
        );
      })}
    </div>
  );
}
