"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

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
      className={`bg-white/10 flex gap-2 mb-2 px-3 py-3 sm:px-4 sm:py-4 rounded-lg items-center transition-all
        ${isEditing ? "scale-[1.02]" : ""}`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={item.completed || false}
        onChange={(e) => onToggleComplete(item.id, e.target.checked)}
        className="w-4 h-4 sm:w-5 sm:h-5 mt-1 mr-2 accent-[#3F9AAE] cursor-pointer"
        disabled={isEditing}
      />

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            className="border px-2 py-1.5 sm:px-3 sm:py-2 rounded resize-none min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded text-sm sm:text-base cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-between items-center">
          <div
            className={`flex-1 whitespace-normal text-sm sm:text-base ${
              item.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {item.content}
          </div>

          <div className="flex gap-1 sm:gap-2 items-center">
            {!item.completed && (
              <>
                {/* Edit text دسکتاپ */}
                <button
                  onClick={() => onStartEdit(item.id)}
                  className="text-yellow-400 hover:text-yellow-600 px-1 sm:px-2 cursor-pointer hidden sm:inline text-sm"
                >
                  Edit
                </button>
                {/* Edit آیکون موبایل */}
                <button
                  onClick={() => onStartEdit(item.id)}
                  className="text-yellow-400 hover:text-yellow-600 px-1 cursor-pointer sm:hidden"
                >
                  <Edit size={16} />
                </button>
              </>
            )}

            {/* Delete دسکتاپ */}
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700 px-1 sm:px-2 cursor-pointer hidden sm:inline text-sm"
            >
              Delete
            </button>
            {/* Delete آیکون موبایل */}
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700 px-1 cursor-pointer sm:hidden"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}