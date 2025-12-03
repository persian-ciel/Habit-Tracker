'use client'

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export  function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
    }

    return (
        <Button variant="outline" onClick={handleLogout} className="">
            Logout <LogOut className="size-4"/>
        </Button>
    )
}