// components/SortableTodo.tsx  (or keep it in TodoList file)

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoItem, { TodoItemData } from "./todo/TodoItem";

interface SortableTodoProps {
  todo: TodoItemData;
  onUpdate: (id: number, fields: Partial<TodoItemData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function SortableTodo({ todo, onUpdate, onDelete }: SortableTodoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef, // optional: separate drag handle
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 0.2s ease",
    opacity: isDragging ? 0.5 : 1,
    // Important for smooth dragging in CSS columns
    breakInside: "avoid" as const,
    marginBottom: "1rem",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      // Apply listeners to the whole card OR just a handle (recommended)
      {...listeners}
      className={`
        w-full inline-block
        cursor-grab active:cursor-grabbing
        ${isDragging ? "z-50 rotate-3 scale-105" : "rotate-0 scale-100"}
      `}
    >
      <TodoItem
        {...todo}
        onUpdate={onUpdate}
        onDelete={onDelete}
        // Optional: disable interactions while dragging
        // disabled={isDragging}
      />
    </div>
  );
}