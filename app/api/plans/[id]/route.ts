import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { plans } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

interface Params { params: { id: string }; }

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!params?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const planId = Number(params.id.trim());
    if (isNaN(planId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const deleted = await db.delete(plans).where(
      and(eq(plans.id, planId), eq(plans.user_id, session.user.id))
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/plans/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!params?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const planId = Number(params.id.trim());
    if (isNaN(planId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const { content, completed } = await req.json();
    if (content === undefined && completed === undefined)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const updateData: Partial<{ content: string; completed: boolean }> = {};
    if (content !== undefined) updateData.content = content;
    if (completed !== undefined) updateData.completed = completed;

    await db.update(plans).set(updateData)
      .where(and(eq(plans.id, planId), eq(plans.user_id, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/plans/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
