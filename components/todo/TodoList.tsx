"use client";

import TodoItem, { TodoItemData } from "./TodoItem";

export default function TodoList() {
  const todoList: TodoItemData[] = [
    {
      id: "1",
      title: "Todo 1",
      description: "Description 1",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "2",
      title: "Todo 2",
      description: "Description 2",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "3",
      title: "Todo 3",
      description: "Description 3",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "4",
      title: "Todo 4",
      description: "Description 4",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "5",
      title: "Todo 5",
      description: "Description 5",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "6",
      title: "Todo 6",
      description: "Description 6",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "7",
      title: "Todo 7",
      description: "Description 7",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: "8",
      title: "Todo 8",
      description: "Description 8",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      completed: false
    },
  ];

  return (
    <div className="columns-3 gap-4 w-full">
      {todoList.map((todo) => (
        <div
          key={todo.id}
          className="break-inside-avoid inline-block w-full mb-4"
        >
          <TodoItem {...todo} />
        </div>
      ))}
    </div>
  );
}
