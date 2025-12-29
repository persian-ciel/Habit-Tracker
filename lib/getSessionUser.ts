import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: { cookie: cookies().toString() },
  });

  if (!session?.user) return null;

  return session.user;
}
