"use client";

import { useState, useRef, useEffect } from "react";

type Period = "weekly" | "monthly" | "yearly";

interface Item {
  id: number;
  content: string;
  period: Period;
  completed?: boolean;
}

interface EditableRowProps {
  item: Item;
  isEditing: boolean;
  onStartEdit: (id: number) => void;
  onEndEdit: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

export default function EditableRow({
  item,
  isEditing,
  onStartEdit,
  onEndEdit,
  onDelete,
  onUpdate,
  onToggleComplete,
}: EditableRowProps) {
  const [value, setValue] = useState(item.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(item.content);
  }, [item.content]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(value.length, value.length);
    }
  }, [isEditing, value.length]);

  const handleSave = () => {
    if (value.trim() && value !== item.content) {
      onUpdate(item.id, value);
    }
    onEndEdit();
  };

  const handleCancel = () => {
    setValue(item.content);
    onEndEdit();
  };

  return (
    <div
      className={`bg-white/10 flex gap-2 mb-2 px-4 py-4 rounded-lg items-center transition-all
        ${isEditing ? "scale-[1.02]" : ""}`}
    >
      <input
        type="checkbox"
        checked={item.completed || false}
        onChange={(e) => onToggleComplete(item.id, e.target.checked)}
        className="w-5 h-5 mt-1 mr-2 accent-[#3F9AAE] cursor-pointer "
        disabled={isEditing}
      />

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            className="border px-3 py-2 rounded resize-none min-h-[150px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-1.5 rounded cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-1.5 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-between items-center">
          <div
            className={`flex-1 whitespace-normal ${
              item.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {item.content}
          </div>

          <div className="flex gap-2">
            {!item.completed && (
              <button
                onClick={() => onStartEdit(item.id)}
                className="text-yellow-400 hover:text-yellow-600 px-2 cursor-pointer"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700 px-2 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
