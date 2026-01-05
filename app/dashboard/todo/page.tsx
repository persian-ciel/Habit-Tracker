"use client";

import { useEffect, useState } from "react";
import TodoForm, { TodoFormData } from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { TodoItemData } from "@/components/todo/TodoItem";
import Toast, { ToastType } from "@/components/ui/Toast";

const PAGE_LIMIT = 9;

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItemData[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    priority: "all",
    completed: "all",
  });
  const [isFocused, setIsFocused] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  };

  const fetchTodos = async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: PAGE_LIMIT.toString(),
        ...filters,
      }).toString();

      const res = await fetch(`/api/tasks?${params}`);
      const data: TodoItemData[] = await res.json();

      setTodos(data);
      setHasMore(data.length === PAGE_LIMIT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(page);
  }, [page]);

  useEffect(() => {
    setPage(0);
    fetchTodos(0);
  }, [filters]);

  const addTodo = async (form: TodoFormData) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showToast("Task created successfully", "success");
      setPage(0);
      fetchTodos(0);
    } catch {
      showToast("Failed to create task", "error");
    }
  };

  const updateTodo = async (
    id: number,
    fields: Partial<TodoItemData>
  ) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });

      if (!res.ok) throw new Error();

      showToast("Task updated successfully", "success");
      fetchTodos(page);
    } catch {
      showToast("Failed to update task", "error");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      showToast("Task deleted successfully", "success");
      fetchTodos(page);
    } catch {
      showToast("Failed to delete task", "error");
    }
  };

  return (
    <>
      <div className="text-white w-full p-4 flex gap-4 overflow-hidden">
        {!isFocused && (
          <div className="w-1/4 p-4 shrink-0">
            <h2 className="text-2xl font-bold mb-3">
              To-Do List
            </h2>
            <TodoForm onAdd={addTodo} />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <TodoList
              todos={todos}
              loading={loading}   
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onFilterChange={setFilters}
              onFocusChange={setIsFocused}
            />
          </div>

          {!isFocused && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0 || loading}
                className="px-4 py-1 rounded bg-[#c49c62]
                          disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-3 py-1 select-none">
                Page {page + 1}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore || loading}
                className="px-4 py-1 rounded bg-[#c49c62]
                          disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() =>
          setToast((t) => ({ ...t, visible: false }))
        }
      />
    </>
  );
}
