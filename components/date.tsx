"use client";

export default function TodayDate() {
  const today = new Date();

  const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <span className="text-md font-medium text-[#DA498D] drop-shadow-2xl">
      {formatted}
    </span>
  );
}
