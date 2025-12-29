import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { habit_logs, habits } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * helper: گرفتن user از session
 */
async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: { cookie: cookies().toString() },
  });

  return session?.user ?? null;
}

/**
 * GET /api/habit-logs?habitId=1
 * گرفتن همه لاگ‌های یک habit (فقط اگر متعلق به user باشد)
 */
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");

  if (!habitId) {
    return NextResponse.json(
      { error: "habitId required" },
      { status: 400 }
    );
  }

  // چک مالکیت habit
  const [habit] = await db
    .select({ id: habits.id })
    .from(habits)
    .where(
      and(
        eq(habits.id, Number(habitId)),
        eq(habits.user_id, user.id)
      )
    )
    .limit(1);

  if (!habit) {
    return NextResponse.json(null, { status: 403 });
  }

  const logs = await db
    .select()
    .from(habit_logs)
    .where(eq(habit_logs.habit_id, Number(habitId)));

  return NextResponse.json(logs);
}

/**
 * POST /api/habit-logs
 * body: { habit_id, log_date, completed }
 * ایجاد یا آپدیت لاگ یک روز
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { habit_id, log_date, completed } = await req.json();

  if (!habit_id || !log_date) {
    return NextResponse.json(
      { error: "habit_id and log_date required" },
      { status: 400 }
    );
  }

  // چک مالکیت habit
  const [habit] = await db
    .select({ id: habits.id })
    .from(habits)
    .where(
      and(
        eq(habits.id, Number(habit_id)),
        eq(habits.user_id, user.id)
      )
    )
    .limit(1);

  if (!habit) {
    return NextResponse.json(null, { status: 403 });
  }

  // اگر برای اون روز لاگ وجود داشت → update
  const existing = await db
    .select()
    .from(habit_logs)
    .where(
      and(
        eq(habit_logs.habit_id, Number(habit_id)),
        eq(habit_logs.log_date, log_date)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(habit_logs)
      .set({ completed })
      .where(eq(habit_logs.id, existing[0].id))
      .returning();

    return NextResponse.json(updated);
  }

  // در غیر این صورت → create
  const [created] = await db
    .insert(habit_logs)
    .values({
      habit_id: Number(habit_id),
      log_date,
      completed: !!completed,
    })
    .returning();

  return NextResponse.json(created);
}

/**
 * DELETE /api/habit-logs?id=123
 * حذف یک لاگ (فقط اگر متعلق به habit کاربر باشد)
 */
export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id required" },
      { status: 400 }
    );
  }

  // پیدا کردن لاگ + habit مربوطه
  const [log] = await db
    .select({
      logId: habit_logs.id,
      habitId: habit_logs.habit_id,
      userId: habits.user_id,
    })
    .from(habit_logs)
    .innerJoin(habits, eq(habits.id, habit_logs.habit_id))
    .where(eq(habit_logs.id, Number(id)))
    .limit(1);

  if (!log || log.userId !== user.id) {
    return NextResponse.json(null, { status: 403 });
  }

  await db
    .delete(habit_logs)
    .where(eq(habit_logs.id, Number(id)));

  return NextResponse.json({ success: true });
}
