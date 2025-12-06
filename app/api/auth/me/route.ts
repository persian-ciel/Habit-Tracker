// app/api/me/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const GET = async () => {
  const session = await auth.api.getSession({
    headers: { cookie: cookies().toString() },
  });

  if (!session?.user) return new Response(null, { status: 401 });

  const [u] = await db
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!u) return new Response(null, { status: 404 });

  return Response.json(u);
};