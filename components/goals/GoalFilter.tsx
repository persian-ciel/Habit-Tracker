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
        className="bg-black/40 text-white px-3 py-1 rounded"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </div>
  );
}
