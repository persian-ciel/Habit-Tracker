"use client";

import React, { useEffect, useState } from "react";
import ChooseHabits from "@/components/habits/ChooseHabits";
import HabitTrackerCard from "@/components/habits/HabitTrackerCard";
import { Habit } from "@/lib/types";

export default function HabitTrackerPage() {
  const [activeHabits, setActiveHabits] = useState<Habit[]>([]);

  const fetchActiveHabits = async () => {
  try {
    const res = await fetch("/api/user_habits", {
      credentials: "include", // مهم: برای فرستادن cookie
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Status:", res.status);
      console.error("API Error Body:", errorText);
      return;
    }

    const data = await res.json();
    console.log("Habits loaded:", data); // برای دیباگ
    setActiveHabits(data);
  } catch (err) {
    console.error("Fetch failed completely:", err);
  }
};

  useEffect(() => {
    fetchActiveHabits();
  }, []);

  const handleDeactivate = async (habitId: number) => {
    await fetch("/api/user_habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, selected: false }),
    });
    fetchActiveHabits(); // refresh
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          ردیاب عادت‌های من
        </h1>

        <section className="mb-12 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">عادت‌های خود را انتخاب کنید</h2>
          <ChooseHabits />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">عادت‌های فعال شما</h2>
          {activeHabits.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              هنوز عادتی انتخاب نکرده‌اید. از بالا شروع کنید!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeHabits.map((habit) => (
                <HabitTrackerCard
                  key={habit.id}
                  habit={habit}
                  onDeactivate={handleDeactivate}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}