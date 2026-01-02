import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { plans } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

interface Params { params: { id: string }; }

export async function DELETE(req: Request, { params }: { params?: { id: string } }) {
  let planId: number | null = null;

  
  if (params?.id) {
    planId = Number(params.id);
  } else {
    const url = new URL(req.url);
    const parts = url.pathname.split("/"); // /api/plans/4
    planId = Number(parts[parts.length - 1]);
  }

  if (!planId || isNaN(planId)) {
    return NextResponse.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(plans).where(
    and(eq(plans.id, planId), eq(plans.user_id, session.user.id))
  );

  return NextResponse.json({ success: true });
}


export async function PUT(
  req: Request,
  { params }: { params?: { id: string } }
) {
  let planId: number | null = null;

  // fallback از URL در صورتی که params وجود نداشته باشد
  if (params?.id) {
    planId = Number(params.id);
  } else {
    const url = new URL(req.url);
    const parts = url.pathname.split("/"); // /api/plans/4
    planId = Number(parts[parts.length - 1]);
  }

  if (!planId || isNaN(planId)) {
    return NextResponse.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, completed } = await req.json();
  if (content === undefined && completed === undefined)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updateData: Partial<{ content: string; completed: boolean }> = {};
  if (content !== undefined) updateData.content = content;
  if (completed !== undefined) updateData.completed = completed;

  await db.update(plans).set(updateData)
    .where(and(eq(plans.id, planId), eq(plans.user_id, session.user.id)));

  return NextResponse.json({ success: true });
}

