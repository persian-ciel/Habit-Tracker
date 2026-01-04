"use client";

import { useRef, useState, useLayoutEffect } from "react";
import EditableRow from "./EditableRow";
import GoalFilter from "./GoalFilter";

type Period = "weekly" | "monthly" | "yearly";

interface Item {
  id: number;
  content: string;
  period: Period;
  completed?: boolean;
}

interface Props {
  title: string;
  period: Period;
  items: Item[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

export default function GoalsSection({
  title,
  period,
  items,
  onDelete,
  onUpdate,
  onToggleComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<Item[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 🟢 state فیلتر
  const [completedFilter, setCompletedFilter] = useState<
    "all" | "completed" | "incomplete"
  >("all");

  // فیلتر کردن آیتم‌ها بر اساس period و completed
  const filteredItems = items
    .filter((i) => i.period === period)
    .filter((i) => {
      if (completedFilter === "completed") return i.completed;
      if (completedFilter === "incomplete") return !i.completed;
      return true;
    });

  useLayoutEffect(() => {
  if (!containerRef.current) return;

  // از items داخل effect استفاده می‌کنیم
  const filtered = items
    .filter((i) => i.period === period)
    .filter((i) => {
      if (completedFilter === "completed") return i.completed;
      if (completedFilter === "incomplete") return !i.completed;
      return true;
    });

  const containerHeight = containerRef.current.clientHeight;
  const tempPages: Item[][] = [];
  let current: Item[] = [];
  let currentHeight = 0;

  filtered.forEach((item) => {
    const estimatedHeight = 60 + (item.content.length / 30) * 20;
    if (currentHeight + estimatedHeight > containerHeight) {
      tempPages.push(current);
      current = [item];
      currentHeight = estimatedHeight;
    } else {
      current.push(item);
      currentHeight += estimatedHeight;
    }
  });

  if (current.length) tempPages.push(current);

  setPages(tempPages);
  setCurrentPage(0);

}, [period, completedFilter, items.length]); // ✅ فقط primitive ها


  const paginatedItems = pages[currentPage] || [];

  return (
    <div className="bg-black/20 rounded-lg p-4 h-[70vh] flex flex-col">
      <div className="relative flex items-center mb-2">
        <div className="absolute left-0">
          <GoalFilter value={completedFilter} onChange={setCompletedFilter} />
          </div>

        <h2 className=" mx-auto font-medium text-2xl mb-2 text-center">{title}</h2>
        
      </div>
      

      <div ref={containerRef} className="flex-1 overflow-hidden">
        {paginatedItems.map((item) => {
          if (editingId && editingId !== item.id) return null;

          return (
            <EditableRow
              key={`${item.id}-${item.content}`}
              item={item}
              isEditing={editingId === item.id}
              onStartEdit={(id) => setEditingId(id)}
              onEndEdit={() => setEditingId(null)}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onToggleComplete={onToggleComplete}
            />
          );
        })}
      </div>

      {!editingId && pages.length > 1 && (
        <div className="flex justify-center mt-2 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-[#c49c62] text-white disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-white">
            Page {currentPage + 1}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, pages.length - 1))
            }
            disabled={currentPage === pages.length - 1}
            className="px-3 py-1 rounded bg-[#c49c62] text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
