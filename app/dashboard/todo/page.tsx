"use client";

import { useEffect, useState } from "react";
import TodoForm, { TodoFormData } from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { TodoItemData } from "@/components/todo/TodoItem";
import Toast, { ToastType } from "@/components/ui/Toast";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

  const [toast, setToast] = useState({
    message: "",
    type: "info" as ToastType,
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
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data: TodoItemData[] = await res.json();

      // Sort by sort_order for consistent DnD
      const sorted = data.sort((a, b) => a.sort_order - b.sort_order);
      setTodos(sorted);
      setHasMore(data.length === PAGE_LIMIT);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch tasks", "error");
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

  const updateTodo = async (id: number, fields: Partial<TodoItemData>) => {
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
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      showToast("Task deleted successfully", "success");
      fetchTodos(page);
    } catch {
      showToast("Failed to delete task", "error");
    }
  };

  // ================= DnD =================
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);

    const newOrder = arrayMove(todos, oldIndex, newIndex);
    setTodos(newOrder);

    // Send bulk update to server
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          newOrder.map((item, index) => ({ id: item.id, sort_order: index }))
        ),
      });
    } catch {
      showToast("Failed to reorder tasks", "error");
    }
  };

  return (
    <>
      <div className="text-white w-full p-4 flex gap-4 overflow-hidden">
        {!isFocused && (
          <div className="w-1/4 p-4 shrink-0">
            <h2 className="text-2xl font-bold mb-3">To-Do List</h2>
            <TodoForm onAdd={addTodo} />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
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
            </SortableContext>
          </DndContext>

          {!isFocused && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0 || loading}
                className="px-4 py-1 rounded bg-[#c49c62] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-3 py-1 select-none">Page {page + 1}</span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore || loading}
                className="px-4 py-1 rounded bg-[#c49c62] disabled:opacity-40 disabled:cursor-not-allowed"
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
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}