"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "info",
  visible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const colors = {
    success: "bg-gray-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`text-white px-4 py-3 rounded-xl shadow-lg ${colors[type]}`}
      >
        {message}
      </div>
    </div>
  );
}
