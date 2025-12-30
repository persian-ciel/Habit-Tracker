"use client";
import { useState } from "react";

type Period = "weekly" | "monthly" | "yearly";

interface Item { id: number; content: string; period: Period; completed?: boolean; }

interface Props {
  title: string;
  period: Period;
  items: Item[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

export default function GoalsSection({ title, period, items, onDelete, onUpdate, onToggleComplete }: Props) {
  return (
    <div className="bg-black/20 rounded-lg p-4">
      <h2 className="font-medium text-2xl mb-3 text-center">{title}</h2>
      {items.filter(i => i.period === period).map(item => (
        <EditableRow
          key={item.id}
          item={item}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

function EditableRow({ item, onDelete, onUpdate, onToggleComplete }: { item: Item; onDelete: (id: number)=>void; onUpdate: (id:number,text:string)=>void; onToggleComplete:(id:number,completed:boolean)=>void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);

  return (
    <div className="bg-white/20 flex gap-2 mb-2 px-4 py-4 rounded-lg items-center text-left">
      <input type="checkbox" checked={item.completed || false} onChange={e=>onToggleComplete(item.id,e.target.checked)} className="w-5 h-5 cursor-pointer"/>
      {editing ? (
        <input value={value} onChange={e=>setValue(e.target.value)} onBlur={()=>{ onUpdate(item.id,value); setEditing(false); }} autoFocus disabled={item.completed} className={`border px-2 flex-1 rounded ${item.completed ? "bg-gray-100 text-gray-400 cursor-not-allowed":""}`}/>
      ) : (
        <span className={`flex-1 cursor-pointer ${item.completed?"text-gray-400 line-through":""}`} onClick={()=>!item.completed && setEditing(true)}>{item.content}</span>
      )}
      <button onClick={()=>onDelete(item.id)} className="text-red-500 text-sm cursor-pointer">Delete</button>
    </div>
  );
}
