"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user_habits, habits } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: { cookie: req.headers.get("cookie") || "" },
    });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const activeHabits = await db
      .select({
        id: habits.id,
        title: habits.title,
        description: habits.description,
        tracking_type: habits.tracking_type,
        target_value: habits.target_value,
      })
      .from(user_habits)
      .innerJoin(habits, eq(user_habits.habit_id, habits.id))
      .where(and(eq(user_habits.user_id, userId), eq(user_habits.active, true)));

    return NextResponse.json(activeHabits);
  } catch (err) {
    console.error("GET user-habits error:", err);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: { cookie: req.headers.get("cookie") || "" },
    });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { habitId, selected = true } = await req.json();

    const existing = await db
      .select()
      .from(user_habits)
      .where(and(eq(user_habits.user_id, userId), eq(user_habits.habit_id, habitId)))
      .limit(1);

    if (selected) {
      if (existing.length === 0) {
        await db.insert(user_habits).values({
          user_id: userId,
          habit_id: habitId,
          active: true,
        });
      } else {
        await db
          .update(user_habits)
          .set({ active: true })
          .where(and(eq(user_habits.user_id, userId), eq(user_habits.habit_id, habitId)));
      }
    } else {
      if (existing.length > 0) {
        await db
          .update(user_habits)
          .set({ active: false })
          .where(and(eq(user_habits.user_id, userId), eq(user_habits.habit_id, habitId)));
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST user-habits error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}