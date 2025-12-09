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




export default function TodoItem({ id,title, description, priority, status, dueDate, completed }: TodoItemData) {
  return (
    <div className="bg-gray-800 p-4 rounded flex justify-between items-start">
      <div className="space-y-1">
        <h3
          className={`text-lg `}
        >
          {title}
        </h3>

        {description && <p className="text-gray-400 text-sm">{description}</p>}

        <div className="flex gap-3 text-sm">
          <select
            className="bg-gray-700 p-1 rounded"
            value={priority}
            onChange={() => {}}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="bg-gray-700 p-1 rounded"
            value={status}
            onChange={() => {}}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            className="bg-gray-700 p-1 rounded"
            value={dueDate ? dueDate.split("T")[0] : ""}
            onChange={() => {}}
          />
        </div>
      </div>

      <button
        
        className="text-red-400 hover:text-red-600 px-2"
      >
        Delete
      </button>
    </div>
  );
}
