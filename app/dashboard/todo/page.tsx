"use client";

import { useEffect, useState } from "react";
import TodoForm, { TodoFormData } from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { TodoItemData } from "@/components/todo/TodoItem";

export default function TodoPage() {
  // state تسک‌ها
  const [todos, setTodos] = useState<TodoItemData[]>([]);

  // لود اولیه تسک‌ها
  useEffect(() => {
    fetch("/api/todo")
      .then((res) => res.json())
      .then((data: TodoItemData[]) => setTodos(data));
  }, []);

  // اضافه کردن تسک جدید
  const addTodo = async (newTodo: TodoFormData) => {
    // تبدیل فرم به TodoItemData با id و completed
    const todoToSave: TodoItemData = {
      ...newTodo,
      id: crypto.randomUUID(), // یا از uuid استفاده کن
      completed: newTodo.status === "completed",
    };

    const res = await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify(todoToSave),
    });

    const saved: TodoItemData = await res.json();
    setTodos([...todos, saved]);
  };

  // آپدیت یک تسک
  const updateTodo = async (
    id: string,
    field: keyof TodoItemData,
    value: string | boolean
  ) => {
    const todoToUpdate = todos.find((t) => t.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, [field]: value };

    await fetch("/api/todo", {
      method: "PUT",
      body: JSON.stringify(updatedTodo),
    });

    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
  };

  // حذف یک تسک
  const deleteTodo = async (id: string) => {
    await fetch("/api/todo", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="text-white w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">To-Do List</h2>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onUpdate={updateTodo} onDelete={deleteTodo} />
    </div>
  );
}
