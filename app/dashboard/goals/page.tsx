"use client";
import { useEffect, useState } from "react";
import GoalInput from "@/components/goals/goalsInput";
import GoalsSection from "@/components/goals/GoalsSection";
import { Loader2 } from "lucide-react";

type Period = "weekly" | "monthly" | "yearly";

interface Item {
  id: number;
  content: string;
  period: Period;
  completed?: boolean;
}

export default function GoalsPage() {
  const [text, setText] = useState("");
  const [period, setPeriod] = useState<Period>("weekly");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/plans");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!text.trim()) return;
    await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, period }),
    });
    setText("");
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", res.status, text || "{}");
      }
    } catch (err) {
      console.error("Delete network error:", err);
    }
    fetchItems();
  };

  const updateItem = async (id: number, content: string) => {
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Update failed:", res.status, text || "{}");
      }
    } catch (err) {
      console.error("Update network error:", err);
    }
    fetchItems();
  };

  // 🟢 تغییر مهم: toggleComplete + move به آخر
  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      await fetch(`/api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      // به‌روزرسانی محلی برای نمایش سریع
      setItems((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, completed } : item
        );

        if (completed) {
          // آیتم را به آخر منتقل کن
          const moved = updated.find((item) => item.id === id)!;
          const others = updated.filter((item) => item.id !== id);
          return [...others, moved];
        }

        return updated;
      });
    } catch (err) {
      console.error("Toggle complete error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex h-11/12 mx-auto items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );

  return (
    <div className="w-full h-10/12 mx-auto p-6 space-y-6">
      <GoalInput
        text={text}
        period={period}
        onTextChange={setText}
        onPeriodChange={setPeriod}
        onAdd={addItem}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
          <GoalsSection
            key={p}
            title={p.charAt(0).toUpperCase() + p.slice(1)}
            period={p}
            items={items}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onToggleComplete={toggleComplete}
          />
        ))}
      </div>
    </div>
  );
}
