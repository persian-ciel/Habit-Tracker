"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // ← اگر مسیر authت فرق داره (مثل @/server/auth)، تغییر بده
import { db } from "@/db/drizzle"; // ← مسیر db رو چک کن (اگر @/db/index یا چیز دیگه، تغییر بده)
import { user_habits, habits } from "@/db/schema"; // ← اگر schema در جای دیگه‌ای هست، درست کن
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    console.log("[API] GET /api/user_habits called");

    const session = await auth.api.getSession({
      headers: { cookie: req.headers.get("cookie") || "" },
    });

    if (!session?.user) {
      console.log("[API] Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[API] User ID:", session.user.id);

    const hardcodedHabits = [
    { id: 1, title: "Skin Care Routine", tracking_type: "daily", description: "Morning & Night" },
    { id: 2, title: "Drink 8 Glasses of Water", tracking_type: "count", target_value: 8 },
    { id: 3, title: "Exercise 30 Minutes", tracking_type: "daily" },
    { id: 4, title: "Read Books", tracking_type: "daily" },
    { id: 5, title: "Meditation 10 Minutes", tracking_type: "daily" },
  ];
    const activeIds = await db
    .select({ habit_id: user_habits.habit_id })
    .from(user_habits)
    .where(and(eq(user_habits.user_id, session.user.id), eq(user_habits.active, true)));

  const activeHabitIds = activeIds.map(row => row.habit_id);

  const activeHabits = hardcodedHabits.filter(h => activeHabitIds.includes(h.id));

  return NextResponse.json(activeHabits);
  } catch (err) {
    console.error("[API] GET /api/user_habits error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("[API] POST /api/user_habits called");

    const session = await auth.api.getSession({
      headers: { cookie: req.headers.get("cookie") || "" },
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { habitId, selected = true } = await req.json();

    console.log("[API] Toggle habit:", habitId, "selected:", selected);

    const existing = await db
      .select()
      .from(user_habits)
      .where(and(eq(user_habits.user_id, userId), eq(user_habits.habit_id, habitId)))
      .limit(1);

    if (selected) {
      if (existing.length === 0) {
        await db.insert(user_habits).values({ user_id: userId, habit_id: habitId, active: true });
      } else {
        await db.update(user_habits).set({ active: true }).where(and(eq(user_habits.user_id, userId), eq(user_habits.habit_id, habitId)));
      }
    } else {
      if (existing.length > 0) {
        await db.update(user_habits).set({ active: false }).where(and(eq(user_habits.user_id, userId), eq(user_habits.habit_id, habitId)));
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API ERROR] POST user_habits:", err);
    return NextResponse.json({ error: "Failed to update habits" }, { status: 500 });
  }
}