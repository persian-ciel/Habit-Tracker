import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { plans } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await db
      .select({
        id: plans.id,
        content: plans.content,
        period: plans.period,
        completed: plans.completed,
      })
      .from(plans)
      .where(eq(plans.user_id, session.user.id));

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/plans error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, period } = await req.json();
    if (!content?.trim() || !["weekly","monthly","yearly"].includes(period))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    await db.insert(plans).values({
      content: content.trim(),
      period,
      user_id: session.user.id,
      completed: false,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/plans error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
