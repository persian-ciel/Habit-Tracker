"use client";

import { useState } from "react";
type Period = "weekly" | "monthly" | "yearly";

interface Item {
  id: number;
  content: string;
  period: Period;
  completed?: boolean;
}

interface Props {
  title: string;
  period: Period;
  items: Item[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}
export default function EditableRow({
  item,
  onDelete,
  onUpdate,
  onToggleComplete,
}: {
  item: Item;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);

  const handleSave = () => {
    if (value.trim() && value !== item.content) {
      onUpdate(item.id, value);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(item.content);
    setEditing(false);
  };

  return (
    <div className="bg-white/10 flex gap-2 mb-2 px-4 py-4 rounded-lg items-center" >
      <input
        type="checkbox"
        checked={item.completed || false}
        onChange={e => onToggleComplete(item.id, e.target.checked)}
        className="w-5 h-5 cursor-pointer mt-1"
      />

      {editing ? (
        <>
          <textarea
            value={value}
            onChange={e => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            autoFocus
            disabled={item.completed}
            className={`border px-2 flex-1 rounded resize-none min-h-6 ${
              item.completed ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
            }`}
            rows={1}
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <div
            className={`flex-1 cursor-pointer whitespace-normal px-4 ${
              item.completed ? "text-gray-400 line-through" : ""
            }`}
            onClick={() => !item.completed && setEditing(true)}
          >
            {item.content}
          </div>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 text-sm cursor-pointer"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
