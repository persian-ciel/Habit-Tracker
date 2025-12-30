"use client";
type Period = "weekly" | "monthly" | "yearly";

interface Props {
  text: string;
  period: Period;
  onTextChange: (v: string) => void;
  onPeriodChange: (v: Period) => void;
  onAdd: () => void;
}

export default function GoalInput({ text, period, onTextChange, onPeriodChange, onAdd }: Props) {
  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter your goal"
        className="bg-black/20 border border-gray-300/50 px-4 py-4 flex-1 rounded-lg"
      />
      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value as Period)}
        className="px-3 p-2 bg-white/20 rounded-lg cursor-pointer"
      >
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <button onClick={onAdd} className="bg-[#FAC67A] text-black px-4 rounded-lg">Add</button>
    </div>
  );
}
