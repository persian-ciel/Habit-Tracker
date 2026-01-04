"use client";

import { NotebookTabs, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

export interface TodoItemData {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "cancelled";
  dueDate?: string;
  completed: boolean;
}

interface Props extends TodoItemData {
  onUpdate: (id: number, fields: Partial<TodoItemData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isFocused: boolean;
  onFocus: () => void;
  onUnfocus: () => void;
}

export default function TodoItem({
  id,
  title,
  description,
  priority,
  status,
  dueDate,
  completed,
  onUpdate,
  onDelete,
  isFocused,
  onFocus,
  onUnfocus,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TodoItemData>({
    id,
    title,
    description,
    priority,
    status,
    dueDate,
    completed,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(id, formData);
      onUnfocus();
    } catch {
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id,
      title,
      description,
      priority,
      status,
      dueDate,
      completed,
    });
    onUnfocus();
  };

  const dateForInput = formData.dueDate
    ? formData.dueDate.split("T")[0]
    : "";

  const toggleComplete = async () => {
    if (completed) return;

    await onUpdate(id, {
      completed: true,
      status: "completed",
    });
  };

  return (
    <div
      className={`bg-black/20 rounded-lg shadow-md transition-all duration-300
        ${isFocused ? "w-full p-8 max-w-none" : "px-6 py-4 w-full"}
      `}
    >
      {isFocused ? (
        <>
          {/* ===== حالت Edit (فقط وقتی complete نیست) ===== */}
          <input
            className="w-full text-xl font-semibold bg-white/20 rounded px-3 py-2"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            className="w-full bg-white/20 rounded px-3 py-2 min-h-[120px] max-h-60 mt-4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <select
              className="bg-white/20 py-2 rounded px-4"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as any })
              }
            >
              <option value="low" className="bg-black/80">Low</option>
              <option value="medium" className="bg-black/80">Medium</option>
              <option value="high" className="bg-black/80">High</option>
            </select>

            <select
              className="bg-white/20 py-2 rounded px-4"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as any,
                  completed: e.target.value === "completed",
                })
              }
            >
              <option value="pending" className="bg-black/80">Pending</option>
              <option value="completed" className="bg-black/80">Completed</option>
              <option value="cancelled" className="bg-black/80">Cancelled</option>
            </select>

            <input
              type="date"
              className="bg-white/20 py-2 rounded px-4"
              value={dateForInput}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-[#DA498D] px-6 py-2 rounded"
              disabled={loading}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="border border-yellow-400 px-6 py-2 rounded text-yellow-400"
            >
              Cancel
            </button>
            {error && <p className="text-red-400">{error}</p>}
          </div>
        </>
      ) : (
        <>
          {/* ===== حالت لیست ===== */}
          <div className="flex justify-between items-center gap-4">
            {/* ستون محتوا */}
            <div className="flex flex-col gap-1">
              <h3
                className={`text-lg font-semibold ${
                  completed ? "line-through text-gray-500" : ""
                }`}
              >
                {title}
              </h3>

              {description && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  {description}
                </p>
              )}

              {dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Calendar size={14} />
                  <span>{new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {/* ✅ Complete */}
              <label
                className={`flex items-center gap-2 mt-2 text-sm ${
                  completed
                    ? "cursor-not-allowed text-gray-500"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  disabled={completed}
                  onChange={toggleComplete}
                  className="accent-[#DA498D] w-4 h-4"
                />
                <span className={completed ? "text-green-400" : ""}>
                  Completed
                </span>
              </label>
            </div>

            
            <div className="flex flex-row justify-center  gap-2">
              <button
                onClick={() => onDelete(id)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 />
              </button>

              {!completed && (
                <button
                  onClick={onFocus}
                  className="text-yellow-400 hover:text-yellow-600"
                >
                  <NotebookTabs />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
