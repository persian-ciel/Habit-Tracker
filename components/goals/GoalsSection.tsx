"use client";
import { useState } from "react";
import EditableRow from "./EditableRow";

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
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = items.filter(i => i.period === period);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-black/20 rounded-lg p-4 h-[70vh] flex flex-col">
      <h2 className="font-medium text-2xl mb-3 text-center">{title}</h2>

      <div className="flex-1 overflow-auto">
        {paginatedItems.map(item => (
          <EditableRow
            key={item.id}
            item={item}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>


      {totalPages > 1 && (
        <div className="flex justify-center mt-2 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded w-9 ${
                page === currentPage
                  ? "bg-[#DA498D] text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

