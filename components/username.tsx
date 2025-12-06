"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function UserName() {
  const { data, isPending } = authClient.useSession();

  if (isPending) return <span><Loader2 className="size-4 animate-spin"/></span>;

  if (!data?.session) return <span>Not logged in</span>;

  return <span className="text-3xl font-bold"> {data.user.name} </span>;
}
