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
  }
];


  return (
  <div className="space-y-3">
    {todoList.map((todo) => (
      <TodoItem key={todo.id} {...todo} />
    ))}
  </div>
);


}
