"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import TodoItem, { TodoItemData } from "./TodoItem";
import TodoFilter from "./TodoFilter";

interface TodoListProps {
  todos: TodoItemData[];
  onUpdate: (id: number, fields: Partial<TodoItemData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onFilterChange: Dispatch<SetStateAction<{ priority: string; completed: string }>>;
}

export default function TodoList({ todos, onUpdate, onDelete, onFilterChange }: TodoListProps) {
  const [filters, setFilters] = useState({ priority: "all", completed: "all" });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <TodoFilter onChange={setFilters} />

      <div className="columns-3 gap-4 w-full h-full">
        {todos.length === 0 && <p className="text-gray-400 mt-4 col-span-full">No tasks match the filter.</p>}

        {todos.map((todo) => (
          <div key={todo.id} className="break-inside-avoid inline-block w-full mb-4">
            <TodoItem {...todo} onUpdate={onUpdate} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}
