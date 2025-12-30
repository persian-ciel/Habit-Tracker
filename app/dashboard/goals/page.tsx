"use client";
import { useEffect, useState } from "react";
import GoalInput from "@/components/goals/goalsInput";
import GoalsSection from "@/components/goals/GoalsSection";

type Period = "weekly" | "monthly" | "yearly";
interface Item { id:number; content:string; period:Period; completed?:boolean; }

export default function GoalsPage() {
  const [text,setText]=useState("");
  const [period,setPeriod]=useState<Period>("weekly");
  const [items,setItems]=useState<Item[]>([]);
  const [loading,setLoading]=useState(true);

  const fetchItems = async ()=>{
    try{
      const res = await fetch("/api/plans");
      if(!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    }catch(err){ console.error(err); setItems([]); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ fetchItems(); },[]);

  const addItem = async ()=>{
    if(!text.trim()) return;
    await fetch("/api/plans",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({content:text,period}) });
    setText(""); fetchItems();
  };

  const deleteItem = async (id: number) => {
  console.log("Deleting id:", id);
  if (!id) return;

  const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    console.error("Delete failed:", res.status, text || "{}");
  }
  fetchItems();
};


  const updateItem = async (id:number,content:string)=>{
    await fetch(`/api/plans/${id}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({content}) });
    fetchItems();
  };

  const toggleComplete = async (id:number,completed:boolean)=>{
    await fetch(`/api/plans/${id}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({completed}) });
    fetchItems();
  };

  if(loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <GoalInput text={text} period={period} onTextChange={setText} onPeriodChange={setPeriod} onAdd={addItem}/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["weekly","monthly","yearly"] as Period[]).map(p=>(
          <GoalsSection key={p} title={p.charAt(0).toUpperCase()+p.slice(1)} period={p} items={items} onDelete={deleteItem} onUpdate={updateItem} onToggleComplete={toggleComplete}/>
        ))}
      </div>
    </div>
  );
}
