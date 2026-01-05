"use client";

import React, { useEffect, useState } from "react";
import { Habit } from "@/lib/types";

export default function ChooseHabits() {
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // همه عادت‌های موجود (اینجا فعلاً hardcode – بعداً API جدا بساز)
  useEffect(() => {
  // عادت‌های پیش‌فرض (همیشه ثابت)
  setAllHabits([
    { id: 1, title: "Skin Care Routine", tracking_type: "daily", description: "Morning & Night" },
    { id: 2, title: "Drink 8 Glasses of Water", tracking_type: "count", target_value: 8 },
    { id: 3, title: "Exercise 30 Minutes", tracking_type: "daily" },
    { id: 4, title: "Read Books", tracking_type: "daily" },
    { id: 5, title: "Meditation 10 Minutes", tracking_type: "daily" },
  ] as Habit[]);

  // گرفتن عادت‌های فعال کاربر
  fetch("/api/user_habits", {
    credentials: "include", // مهم برای cookie/session
  })
    .then((res) => {
      if (!res.ok) {
        console.warn("Failed to fetch active habits:", res.status);
        return []; // اگر ارور بود، آرایه خالی برگردون
      }
      return res.json();
    })
    .then((data) => {
      // دفاع کامل: مطمئن شو data آرایه باشه
      if (Array.isArray(data)) {
        setSelectedIds(data.map((h: Habit) => h.id));
      } else {
        console.warn("Unexpected data format from API:", data);
        setSelectedIds([]);
      }
    })
    .catch((err) => {
      console.error("Fetch error in ChooseHabits:", err);
      setSelectedIds([]);
    });
}, []);

  const toggleSelect = async (habitId: number) => {
    const isSelected = selectedIds.includes(habitId);
    const newSelected = !isSelected;

    await fetch("/api/user_habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, selected: newSelected }),
    });

    if (newSelected) {
      setSelectedIds([...selectedIds, habitId]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== habitId));
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {allHabits.map((habit) => (
        <button
          key={habit.id}
          onClick={() => toggleSelect(habit.id)}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            selectedIds.includes(habit.id)
              ? "bg-green-500 text-white"
              : "bg-[#DA498D] text-white hover:bg-[#c13a7a]"
          }`}
        >
          {habit.title}
        </button>
      ))}
    </div>
  );
}