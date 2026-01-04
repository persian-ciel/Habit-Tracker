"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import TodoItem, { TodoItemData } from "./TodoItem";
import TodoFilter from "./TodoFilter";

interface Props {
  todos: TodoItemData[];
  onUpdate: (id: number, fields: Partial<TodoItemData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onFilterChange: Dispatch<
    SetStateAction<{ priority: string; completed: string }>
  >;
  onFocusChange: (focused: boolean) => void;
}

export default function TodoList({
  todos,
  onUpdate,
  onDelete,
  onFilterChange,
  onFocusChange,
}: Props) {
  const [filters, setFilters] = useState({
    priority: "all",
    completed: "all",
  });

  const [focusedTodoId, setFocusedTodoId] = useState<number | null>(null);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  useEffect(() => {
    onFocusChange(focusedTodoId !== null);
  }, [focusedTodoId]);

  const visibleTodos =
    focusedTodoId === null
      ? todos
      : todos.filter((t) => t.id === focusedTodoId);

  return (
    <div className="w-full">

      {focusedTodoId === null && <TodoFilter onChange={setFilters} />}


      <div
        className={
          focusedTodoId === null
            ? "columns-3 gap-4 mt-6"
            : "flex justify-center mt-6"
        }
      >
        {visibleTodos.map((todo) => (
          <div
            key={todo.id}
            className={
              focusedTodoId === null
                ? "break-inside-avoid mb-4"
                : "w-full"
            }
          >
            <TodoItem
              {...todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isFocused={focusedTodoId === todo.id}
              onFocus={() => setFocusedTodoId(todo.id)}
              onUnfocus={() => setFocusedTodoId(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
