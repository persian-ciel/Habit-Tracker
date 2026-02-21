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
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Input */}
      <input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter your goal"
        className="bg-black/20 border border-gray-300/50 px-3 py-2 sm:px-4 sm:py-4 flex-1 rounded-lg text-sm sm:text-base"
      />

      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value as Period)}
        className="px-4 py-2 sm:px-3 sm:py-2 bg-white/20 rounded-lg cursor-pointer text-sm sm:text-base"
      >
        <option value="weekly" className="bg-black/80">Weekly</option>
        <option value="monthly" className="bg-black/80">Monthly</option>
        <option value="yearly" className="bg-black/80">Yearly</option>
      </select>

      <button
        onClick={onAdd}
        className="bg-[#FFE2AF] text-black px-4 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base cursor-pointer"
      >
        Add
      </button>
    </div>
  );
}