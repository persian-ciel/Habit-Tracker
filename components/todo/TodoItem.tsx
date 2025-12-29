"use client";

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
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // state محلی برای ویرایش
  const [formData, setFormData] = useState<TodoItemData>({
    id,
    title,
    description,
    priority,
    status,
    dueDate,
    completed: completed ?? false,
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onUpdate(id, formData);
      setEditing(false);
    } catch {
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onDelete(id);
    } catch {
      setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const getShortDescription = (text?: string) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.slice(0, 4).join(" ") + (words.length > 4 ? " ..." : "");
  };

  return (
    <div className={`bg-black/20 px-6 py-4 rounded-lg shadow-md w-full ${loading ? "opacity-60" : ""}`}>
      <div className="flex justify-between items-center">
        {editing ? (
          <input
            type="text"
            className="text-lg font-semibold w-full bg-white/20 rounded px-2 py-1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        ) : (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}

        <button
          onClick={() => {
            if (editing) {
              // Cancel: بازگرداندن داده اولیه
              setFormData({ id, title, description, priority, status, dueDate, completed });
            }
            setEditing(!editing);
          }}
          className="text-yellow-400 hover:text-yellow-600 text-sm px-2 py-1 rounded border border-yellow-400 ml-2"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="mt-1">
        {editing ? (
          <textarea
            className="w-full bg-white/20 rounded px-2 py-1 mt-2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        ) : (
          description && <p className="text-gray-400 text-sm overflow-hidden">{getShortDescription(description)}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-3 text-sm">
        <select
          className="bg-white/20 py-2 rounded px-4 appearance-none"
          value={formData.priority}
          disabled={!editing || loading}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as TodoItemData["priority"] })}
        >
          <option value="low" className="bg-black/80">Low</option>
          <option value="medium" className="bg-black/80">Medium</option>
          <option value="high" className="bg-black/80">High</option>
        </select>

        <select
          className="bg-white/20 py-2 rounded px-4 appearance-none"
          value={formData.status}
          disabled={!editing || loading}
          onChange={(e) => {
            const newStatus = e.target.value as TodoItemData["status"];
            setFormData({
              ...formData,
              status: newStatus,
              completed: newStatus === "completed",
            });
          }}
        >
          <option value="pending" className="bg-black/80">Pending</option>
          <option value="completed" className="bg-black/80">Completed</option>
          <option value="cancelled" className="bg-black/80">Cancelled</option>
        </select>

        <input
          type="date"
          className="bg-white/20 py-2 rounded px-4"
          value={formData.dueDate?.split("T")[0] ?? ""}
          disabled={!editing || loading}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <div className="flex gap-4 mt-3 items-center">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-400 hover:text-red-600"
        >
          Delete
        </button>

        {editing && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#DA498D] hover:bg-[#ad376e] text-white px-3 py-1 rounded"
          >
            Save
          </button>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
