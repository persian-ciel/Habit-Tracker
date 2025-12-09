"use client";

import { useState } from "react";
import TodoForm, { TodoFormData } from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { TodoItemData } from "@/components/todo/TodoItem";

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItemData[]>([]);

  // اضافه کردن todo جدید
  const addTodo = (data: TodoFormData) => {
    const newTodo: TodoItemData = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "pending",
      dueDate: data.dueDate,
      completed: false
    };

    setTodos((prev) => [...prev, newTodo]);
  };

  // ویرایش todo
  const updateTodo = (id: string, updatedFields: Partial<TodoItemData>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="text-white w-full p-4 flex flex-row gap-4">
      

      <div className="flex flex-col w-1/3">
        <h2 className="text-2xl font-bold mb-6">To-Do List</h2>
        <TodoForm onAdd={addTodo} />
      </div>
      

      <div>
        <TodoList  />
      </div>
      
    </div>
  );
}
