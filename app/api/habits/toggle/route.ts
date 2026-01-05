// app/api/habits/toggle/route.ts
import { db } from "@/db/drizzle";
import { habit_logs } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function PUT(req: Request) {
  const { habitId, date, hour } = await req.json();

  const where = hour !== undefined
    ? and(
        eq(habit_logs.habit_id, habitId),
        eq(habit_logs.log_date, date),
        eq(habit_logs.log_hour, hour)
      )
    : and(
        eq(habit_logs.habit_id, habitId),
        eq(habit_logs.log_date, date)
      );

  const [existing] = await db
    .select()
    .from(habit_logs)
    .where(where);

  if (existing) {
  const completedValue = existing.completed ?? false;
  await db
    .update(habit_logs)
    .set({ completed: !completedValue })
    .where(eq(habit_logs.id, existing.id));
} else {
  await db.insert(habit_logs).values({
    habit_id: habitId,
    log_date: date,
    log_hour: hour ?? null,
    completed: true,
  });
}


  return Response.json({ success: true });
}
