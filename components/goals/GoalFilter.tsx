"use client";

import React from "react";

interface GoalFilterProps {
  value: "all" | "completed" | "incomplete";
  onChange: (value: "all" | "completed" | "incomplete") => void;
}

export default function GoalFilter({ value, onChange }: GoalFilterProps) {
  return (
    <div className="flex justify-center mb-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "all" | "completed" | "incomplete")}
        className="bg-black/40 text-white px-3 py-1 rounded cursor-pointer"
      >
        <option value="all" className="bg-black/80">All</option>
        <option value="completed" className="bg-black/80">Completed</option>
        <option value="incomplete" className="bg-black/80">Incomplete</option>
      </select>
    </div>
  );
}
