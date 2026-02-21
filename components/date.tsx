"use client";

export default function TodayDate() {
  const today = new Date();

  const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const Mobileformatted = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <>
    <span className="hidden sm:flex sm:text-md text-sm  font-light text-[#79C9C5] drop-shadow-2xl">
      {formatted}
    </span>

    <span className="sm:text-md sm:hidden text-sm font-light text-[#79C9C5] drop-shadow-2xl">
      {Mobileformatted}
    </span>
    </>
  );
}
