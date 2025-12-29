"use client";

import { useEffect, useState } from "react";
import TodoForm, { TodoFormData } from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { TodoItemData } from "@/components/todo/TodoItem";
import { Loader2 } from "lucide-react";

const PAGE_LIMIT = 6;

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItemData[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ priority: "all", completed: "all" });

  const fetchTodos = async (pageNum: number, filtersObj = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: PAGE_LIMIT.toString(),
        ...filtersObj,
      }).toString();

      const res = await fetch(`/api/tasks?${params}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data: TodoItemData[] = await res.json();
      setTodos(data);
      // اگر تعداد داده کمتر از limit بود یعنی صفحه بعدی نیست
      setHasMore(data.length === PAGE_LIMIT);
    } catch {
      setGlobalError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // وقتی صفحه تغییر می‌کند
  useEffect(() => {
    fetchTodos(page);
  }, [page]);

  // وقتی فیلتر تغییر می‌کند، صفحه را ریست کن و fetch جدید بزن
  useEffect(() => {
    setPage(0);
    fetchTodos(0, filters);
  }, [filters]);

  const addTodo = async (form: TodoFormData) => {
    const tempId = Math.floor(Math.random() * 1000000);
    const optimisticTodo: TodoItemData = { id: tempId, completed: false, ...form };
    setTodos((prev) => [optimisticTodo, ...prev]);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const saved: TodoItemData = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === tempId ? saved : t)));
    } catch {
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      setGlobalError("Failed to add task");
    }
  };

  const updateTodo = async (id: number, fields: Partial<TodoItemData>) => {
    const prev = [...todos];
    setTodos((prevTodos) => prevTodos.map((t) => (t.id === id ? { ...t, ...fields } : t)));

    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      fetchTodos(page);
    } catch {
      setTodos(prev);
      setGlobalError("Failed to update task");
    }
  };

  const deleteTodo = async (id: number) => {
    const prev = [...todos];
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));

    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      fetchTodos(page);
    } catch {
      setTodos(prev);
      setGlobalError("Failed to delete task");
    }
  };

  return (
    <div className="text-white w-full h-10/12 p-4 flex gap-4 overflow-hidden">
      <div className="w-1/4 p-4">
        <h2 className="text-2xl font-bold mb-3">To-Do List</h2>
        <TodoForm onAdd={addTodo} />
        {globalError && <p className="text-red-400 mt-2">{globalError}</p>}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <TodoList
          todos={todos}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onFilterChange={setFilters}
        />

        

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0 || loading}
            className="px-3 py-1 bg-[#c49c62] rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
            className="px-3 py-1 bg-[#c49c62] rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
