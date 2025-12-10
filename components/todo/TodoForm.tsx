"use client";

import { Calendar } from "lucide-react";
import { useRef, useState } from "react";

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

  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.showPicker()   // ← باز کردن date picker
    }
  }
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
    <div className="h-full bg-black/20 p-4 rounded-lg mb-6 space-y-3">
      <input
        className="w-full p-2 bg-white/20 rounded"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full p-2 bg-white/20 rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex flex-col gap-4">
        <select
          className="p-2 bg-white/20 rounded"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value as TodoFormData["priority"] })}
        >
          <option value="low" className="bg-black/80">Low priority</option>
          <option value="medium" className="bg-black/80">Medium priority</option>
          <option value="high" className="bg-black/80">High priority</option>
        </select>
        <select
          className="p-2 bg-white/20 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as TodoFormData["status"] })}
        >
          <option value="pending" className="bg-black/80 ">Pending</option>
          <option value="completed" className="bg-black/80">Completed</option>
          <option value="cancelled" className="bg-black/80">Cancelled</option>
        </select>
        <div className="relative w-full">
      <input
        ref={inputRef}
        type="date"
        className="p-2 bg-white/20 rounded w-full pr-10"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />

      <Calendar
        onClick={openPicker}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAC67A] cursor-pointer"
      />
    </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-[#DA498D] hover:bg-[#69247C] px-4 py-2 rounded mt-5"
      >
        Add Task
      </button>
    </div>
  );
}
