// app/habit-tracker/page.tsx
"use client";

import React, { useEffect, useState } from "react";

import ChooseHabits from "@/components/habits/ChooseHabits";
import HabitHexTracker from "@/components/habits/HabitHexTracker";
import WaterTracker from "@/components/habits/WaterTracker";
import ExerciseTracker from "@/components/habits/ExerciseTracker";
import ReadingTracker from "@/components/habits/ReadingTracker";
import MeditationTracker from "@/components/habits/MeditationTracker";

import { Habit } from "@/lib/types";
import SleepTracker from "@/components/habits/SleepTracker";

export default function HabitTrackerPage() {
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setAllHabits([
      {
        id: 1,
        title: "Skin Care Routine",
        tracking_type: "daily",
        tracking_ui: "hex",
      },
      {
        id: 2,
        title: "Drink Water",
        tracking_type: "count",
        tracking_ui: "counter",
        target_value: 8,
      },
      {
        id: 3,
        title: "Exercise",
        tracking_type: "daily",
        tracking_ui: "grid",
      },
      {
        id: 4,
        title: "Read Books",
        tracking_type: "daily",
        tracking_ui: "reading",
      },
      {
        id: 5,
        title: "Meditation",
        tracking_type: "daily",
        tracking_ui: "meditation", // مهم: همین مقدار برای MeditationTracker
      },
      {
        id: 6,
        title: "Sleep Tracker", // SleepTracker جدید
        tracking_type: "daily",
        tracking_ui: "sleep", // مقدار دلخواه برای شناسایی SleepTracker
      },
    ]);
  }, []);

  const toggleSelect = (habitId: number) => {
    setSelectedIds((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  return (
    <div>
      {/* Choose Habits */}
      <section className="mb-8 rounded-xl shadow-md p-4">
        <h2 className="text-2xl font-light mb-6">
          Choose the habits you want to track
        </h2>

        <ChooseHabits
          allHabits={allHabits}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
        />
      </section>

      {/* Active Habits */}
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
                  key={habit.id}
                  className="w-full sm:w-full lg:w-[48%] xl:w-[32%]"
                >
                  {/* DAILY - HEX */}
                  {habit.tracking_type === "daily" && habit.tracking_ui === "hex" && (
                    <HabitHexTracker habitId={habit.id} year={2026} month={1} />
                  )}

                  {/* DAILY - GRID (Exercise) */}
                  {habit.tracking_type === "daily" && habit.tracking_ui === "grid" && (
                    <ExerciseTracker />
                  )}

                  {/* COUNT - COUNTER (Water) */}
                  {habit.tracking_type === "count" &&
                    habit.tracking_ui === "counter" && <WaterTracker />}

                  {/* DAILY - READING */}
                  {habit.tracking_type === "daily" &&
                    habit.tracking_ui === "reading" && <ReadingTracker />}

                  {/* DAILY - MEDITATION */}
                  {habit.tracking_type === "daily" &&
                    habit.tracking_ui === "meditation" && <MeditationTracker />}

                  {habit.tracking_type === "daily" &&
                  habit.tracking_ui === "sleep" && <SleepTracker />}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}