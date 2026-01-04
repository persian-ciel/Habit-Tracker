"use client";

import { Calendar } from "lucide-react";
import { useRef, useState } from "react";

export interface TodoFormData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  status?: "pending"; // خودکار pending
}

interface TodoFormProps {
  onAdd: (data: TodoFormData) => Promise<void>; 
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [form, setForm] = useState<TodoFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "pending", // خودکار pending
  });

  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.showPicker();

  const handleSubmit = async () => {
    setError(null);

    // اعتبارسنجی title و description
    if (!form.title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    if (!form.description?.trim()) {
      setError("Description cannot be empty");
      return;
    }

    // اعتبارسنجی تاریخ
    if (!form.dueDate?.trim()) {
      setError("Date cannot be empty");
      return;
    }
    if (form.dueDate) {
      const selectedDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // فقط تاریخ بدون ساعت
      if (selectedDate < today) {
        setError("Due date cannot be in the past");
        return;
      }
    }

    setLoading(true);
    try {
      await onAdd(form);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: "pending",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-black/20 p-4 rounded-lg mb-6 space-y-3">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <input
        className="w-full p-2 bg-white/20 rounded"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        rows={20} 
        className="w-full p-2 bg-white/20 rounded max-h-80"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex flex-col gap-4">
        <select
          className="p-2 bg-white/20 rounded"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value as TodoFormData["priority"] })
          }
        >
          <option value="low" className="bg-black/80">Low priority</option>
          <option value="medium" className="bg-black/80">Medium priority</option>
          <option value="high" className="bg-black/80">High priority</option>
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
        disabled={loading}
        className="bg-[#DA498D] hover:bg-[#69247C] px-4 py-2 rounded mt-5"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
}
