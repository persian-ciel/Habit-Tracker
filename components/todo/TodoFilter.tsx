"use client";

import { useState } from "react";

interface TodoFilterProps {
  onChange: (filters: { priority: string; completed: string }) => void;
}

export default function TodoFilter({ onChange }: TodoFilterProps) {
  const [priority, setPriority] = useState("all");
  const [completed, setCompleted] = useState("all");

  const handleChange = (newValues: Partial<{ priority: string; completed: string }>) => {
    const updated = { priority, completed, ...newValues };
    if (newValues.priority !== undefined) setPriority(newValues.priority);
    if (newValues.completed !== undefined) setCompleted(newValues.completed);
    onChange(updated);
  };

  return (
    <div className="flex gap-4 mb-4">

      <select
        className="p-2 bg-white/20 rounded cursor-pointer"
        value={priority}
        onChange={(e) => handleChange({ priority: e.target.value })}
      >
        <option value="all" className="bg-black/80">All Priorities</option>
        <option value="low" className="bg-black/80">Low</option>
        <option value="medium" className="bg-black/80">Medium</option>
        <option value="high" className="bg-black/80">High</option>
      </select>


      <select
        className="p-2 bg-white/20 rounded cursor-pointer"
        value={completed}
        onChange={(e) => handleChange({ completed: e.target.value })}
      >
        <option value="all" className="bg-black/80">All</option>
        <option value="true" className="bg-black/80">Completed</option>
        <option value="false" className="bg-black/80">Pending</option>
      </select>
    </div>
  );
}
