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


  const updateTodo = (id: string, updatedFields: Partial<TodoItemData>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="text-white w-full h-10/12 p-4 flex flex-row gap-4 overflow-hidden">
      

      <div className="flex flex-col w-1/3 h-full p-4 rounded-lg ">
        <h2 className="text-2xl font-bold mb-3">To-Do List</h2>
        <TodoForm onAdd={addTodo} />
      </div>
      

      <div className="flex-1 h-full overflow-y-auto p-4 rounded-lg">
        <TodoList  />
      </div>
      
    </div>
  );
}
