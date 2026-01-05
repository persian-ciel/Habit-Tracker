// app/habit-tracker/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import ChooseHabits from "@/components/habits/ChooseHabits";
import HabitHexTracker from "@/components/habits/HabitHexTracker";
import WaterTracker from "@/components/habits/WaterTracker";

import { Habit } from "@/lib/types";

export default function HabitTrackerPage() {
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    // داده‌های نمونه
    setAllHabits([
      { id: 1, title: "Skin Care Routine", tracking_type: "daily", description: "Morning & Night" },
      { id: 2, title: "Drink Water", tracking_type: "count", target_value: 8 },
      { id: 3, title: "Exercise", tracking_type: "daily" },
      { id: 4, title: "Read Books", tracking_type: "daily" },
      { id: 5, title: "Meditation ", tracking_type: "daily" },
    ]);
  }, []);

  const toggleSelect = (habitId: number) => {
    if (selectedIds.includes(habitId)) {
      setSelectedIds(selectedIds.filter((id) => id !== habitId));
    } else {
      setSelectedIds([...selectedIds, habitId]);
    }
  };

  return (
    <div className= "">
      <section className="mb-8 rounded-xl shadow-md p-2">
        <h2 className="text-2xl font-light mb-6">Choose the habits you want to track</h2>
        <ChooseHabits
          allHabits={allHabits}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
        />
      </section>

      <section className="px-4">
  <h2 className="text-2xl font-semibold mb-6">Active Habits</h2>

  {selectedIds.length === 0 ? (
    <p className="text-center text-gray-400 py-5 flex justify-center items-center h-[50vh]">
      No habits selected yet.
    </p>
  ) : (
    <div className="flex flex-wrap gap-6">
      {selectedIds.map((id) => {
        const habit = allHabits.find((h) => h.id === id);
        if (!habit) return null;

        return (
          <div
            key={id}
            className="w-full sm:w-[48%] lg:w-[30%] "
          >
            {/* DAILY HABIT */}
            {habit.tracking_type === "daily" && (
              <HabitHexTracker
                habitId={habit.id}
                year={2026}
                month={1}
              />
            )}

            {/* COUNT HABIT (Water) */}
            {habit.tracking_type === "count" && (
              <WaterTracker />
            )}
          </div>
        );
      })}
    </div>
  )}
</section>

    </div>
  );
}
