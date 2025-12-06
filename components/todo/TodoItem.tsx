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


interface TodoItemProps {
  todo: TodoItemData;
  onUpdate: (id: string, field: keyof TodoItemData, value: any) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  return (
    <div className="bg-gray-800 p-4 rounded flex justify-between items-start">
      <div className="space-y-1">
        <h3
          className={`text-lg ${
            todo.status === "completed" ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </h3>

        {todo.description && <p className="text-gray-400 text-sm">{todo.description}</p>}

        <div className="flex gap-3 text-sm">
          <select
            className="bg-gray-700 p-1 rounded"
            value={todo.priority}
            onChange={(e) => onUpdate(todo.id, "priority", e.target.value as TodoItemData["priority"])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="bg-gray-700 p-1 rounded"
            value={todo.status}
            onChange={(e) => onUpdate(todo.id, "status", e.target.value as TodoItemData["status"])}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            className="bg-gray-700 p-1 rounded"
            value={todo.dueDate ? todo.dueDate.split("T")[0] : ""}
            onChange={(e) => onUpdate(todo.id, "dueDate", e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-400 hover:text-red-600 px-2"
      >
        Delete
      </button>
    </div>
  );
}
