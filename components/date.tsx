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
    <span className="text-md font-medium text-[#79C9C5] drop-shadow-2xl">
      {formatted}
    </span>
  );
}
