"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";


export function Logout({ collapsed }: { collapsed: boolean }) {
const router = useRouter();


const handleLogout = async () => {
await authClient.signOut();
router.push("/login");
};


return (
<Button
variant="outline"
onClick={handleLogout}
className="flex items-center gap-2 w-full justify-start bg-[#212121] hover:bg-[#424242] hover:text-white"
>
<LogOut className="size-4" />
{!collapsed && <span>Logout</span>}
</Button>
);
}