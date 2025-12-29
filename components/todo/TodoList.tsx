"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import TodoItem, { TodoItemData } from "./TodoItem";
import TodoFilter from "./TodoFilter";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTodo({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: TodoItemData;
  onUpdate: any;
  onDelete: any;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="break-inside-avoid inline-block w-full mb-4 cursor-grab active:cursor-grabbing"
    >
      <TodoItem {...todo} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}

interface Props {
  todos: TodoItemData[];
  onUpdate: (id: number, fields: Partial<TodoItemData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onFilterChange: Dispatch<SetStateAction<{ priority: string; completed: string }>>;
}

export default function TodoList({ todos, onUpdate, onDelete, onFilterChange }: Props) {
  const [filters, setFilters] = useState({ priority: "all", completed: "all" });
  const [orderedIds, setOrderedIds] = useState<number[]>([]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  // وقتی دیتا از سرور عوض شد → ترتیب ریست شود
  useEffect(() => {
    setOrderedIds(todos.map((t) => t.id));
  }, [todos]);

  const orderedTodos = orderedIds
    .map((id) => todos.find((t) => t.id === id))
    .filter(Boolean) as TodoItemData[];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedIds((ids) => {
      const oldIndex = ids.indexOf(active.id as number);
      const newIndex = ids.indexOf(over.id as number);
      return arrayMove(ids, oldIndex, newIndex);
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <TodoFilter onChange={setFilters} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedIds}>
          <div className="columns-3 gap-4 w-full">
            {orderedTodos.length === 0 && (
              <p className="text-gray-400 mt-4">No tasks match the filter.</p>
            )}

            {orderedTodos.map((todo) => (
              <SortableTodo
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
