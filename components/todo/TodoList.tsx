"use client";

import TodoItem, { TodoItemData } from "./TodoItem";

interface TodoListProps {
  todos: TodoItemData[];
  onUpdate: (id: string, field: keyof TodoItemData, value: any) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  if (!todos.length) return <p>No tasks yet!</p>;

  return (
    <div className="space-y-3">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
