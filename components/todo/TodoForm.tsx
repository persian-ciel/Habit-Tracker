"use client";

import { useState } from "react";

export interface TodoFormData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "cancelled";
  dueDate?: string;
}



interface TodoFormProps {
  onAdd: (data: TodoFormData) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [form, setForm] = useState<TodoFormData>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await onAdd(form);

    setForm({
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3">
      <input
        className="w-full p-2 bg-gray-700 rounded"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full p-2 bg-gray-700 rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex gap-3">
        <select
          className="p-2 bg-gray-700 rounded"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value as TodoFormData["priority"] })}
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <select
          className="p-2 bg-gray-700 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as TodoFormData["status"] })}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          className="p-2 bg-gray-700 rounded"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Add Task
      </button>
    </div>
  );
}
