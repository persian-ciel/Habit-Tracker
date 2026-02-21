"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logout } from "@/components/logout";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Timer,
  Menu,
  ChevronLeft,
  Goal,
  X,
} from "lucide-react";
import UserName from "@/components/username";
import TodayDate from "@/components/date";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { title: "To Do", path: "/dashboard/todo", icon: <ListTodo size={20} /> },
    { title: "Goals", path: "/dashboard/goals", icon: <Goal size={20} /> },
    { title: "Tracker", path: "/dashboard/tracker", icon: <Timer size={20} /> },
    { title: "Setting", path: "/dashboard/setting", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#313131] text-white relative overflow-hidden">

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:relative z-50
          bg-[#212121] shadow-xl p-4 flex flex-col
          duration-300 ease-in-out
          h-full
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block self-end mb-4 p-2 hover:bg-[#424242] rounded-md"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>

        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden self-end mb-4 p-2 hover:bg-[#424242] rounded-md"
        >
          <X size={20} />
        </button>

        {!collapsed && (
          <h2 className="text-2xl font-bold mb-4 text-[#FFE2AF]">
            Ciel Mind
          </h2>
        )}

        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#424242] transition
                ${pathname === item.path ? "bg-[#424242] font-bold" : ""}
                ${collapsed ? "md:justify-center" : ""}
              `}
            >
              <span className="text-[#F96E5B]">{item.icon}</span>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}

          <div className="mt-4">
            <Logout collapsed={collapsed} />
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6 overflow-auto h-screen w-full">

        <header className="mb-4 flex items-center justify-between rounded-full py-4 px-6 md:px-8 bg-black/15">

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 hover:bg-[#424242] rounded-md"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 flex items-center justify-between ml-2">
            <UserName />
            <TodayDate />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}