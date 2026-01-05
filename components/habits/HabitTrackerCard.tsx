"use client";

import React from "react";
import { Habit } from "@/lib/types";

interface HabitTrackerCardProps {
  habit: Habit;
  onDeactivate: (id: number) => void;
}

export default function HabitTrackerCard({ habit, onDeactivate }: HabitTrackerCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{habit.title}</h3>
          <p className="text-sm text-gray-500 mt-1 capitalize">
            {habit.tracking_type} {habit.target_value ? `- هدف: ${habit.target_value}` : ""}
          </p>
        </div>
        <button
          onClick={() => onDeactivate(habit.id)}
          className="text-red-500 hover:text-red-700 font-medium text-sm"
        >
          غیرفعال کن
        </button>
      </div>

      <div className="mt-6">
        {/* اینجا بعداً tracker واقعی (دکمه چک، شمارنده و ...) اضافه می‌شه */}
        {habit.tracking_type === "daily" && (
          <button className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg">
            امروز انجام شد ✓
          </button>
        )}

        {habit.tracking_type === "count" && (
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl font-bold">0</span>
            <span className="text-2xl text-gray-400">/</span>
            <span className="text-4xl font-bold text-blue-600">{habit.target_value || 1}</span>
            <button className="ml-6 bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full text-2xl">
              +
            </button>
          </div>
        )}

        {habit.tracking_type === "hourly" && (
          <p className="text-center text-gray-600">به زودی پیاده‌سازی می‌شه ⏰</p>
        )}
      </div>
    </div>
  );
}