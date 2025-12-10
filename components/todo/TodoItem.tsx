"use client";

export interface TodoItemData {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "cancelled";
  dueDate?: string;
  completed: boolean;
}

export default function TodoItem({
  id,
  title,
  description,
  priority,
  status,
  dueDate
}: TodoItemData) {
  return (
    <div className="bg-black/20 p-4 rounded-lg shadow-md w-full block">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>

        {description && (
          <p className="text-gray-400 text-sm leading-5">{description}</p>
        )}

        <div className="flex flex-col gap-3 text-sm mt-2">
          <select
            className="bg-white/20 p-1 rounded"
            value={priority}
            onChange={() => {}}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="bg-white/20 p-1 rounded"
            value={status}
            onChange={() => {}}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            className="bg-white/20 p-1 rounded"
            value={dueDate ? dueDate.split("T")[0] : ""}
            onChange={() => {}}
          />
        </div>
      </div>

      <button className="text-red-400 hover:text-red-600 mt-3">
        Delete
      </button>
    </div>
  );
}
