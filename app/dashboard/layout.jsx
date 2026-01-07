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
} from "lucide-react";
import UserName from "@/components/username";
import TodayDate from "@/components/date";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    
    { title: "To Do", path: "/dashboard/todo", icon: <ListTodo size={20} /> },
    {
      title: "Goals",
      path: "/dashboard/goals",
      icon: <Goal size={20} />,
    },
    { title: "Tracker", path: "/dashboard/tracker", icon: <Timer size={20} /> },
    {
      title: "Setting",
      path: "/dashboard/setting",
      icon: <Settings size={20} />,
    },
    
  ];

  return (
    <div className="flex h-screen bg-[#313131] text-white">
      <aside
        className={`bg-[#212121] shadow-xl p-4 flex flex-col duration-300  ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="self-end mb-4 p-2 hover:bg-[#424242]  rounded-md"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>

        {!collapsed && (
          <h2 className="text-2xl font-bold mb-4 transition-opacity text-[#FFE2AF]">
            Ciel Mind
          </h2>
        )}

        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#424242] transition ${
                pathname === item.path ? "bg-[#424242] font-bold" : ""
              }`}
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

      <main className="flex-1 p-6 overflow-auto h-screen">
        <header className="mb-4 flex items-center justify-between   rounded-full py-4 px-8  bg-black/15">
          <div>
            <UserName />
          </div>
          <div>
            <TodayDate />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
