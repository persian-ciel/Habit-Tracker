// app/api/habits/count/route.ts
import { db } from "@/db/drizzle";
import { habit_logs } from "@/db/schema";

export async function POST(req: Request) {
  const { habitId, date, value } = await req.json();

  await db.insert(habit_logs).values({
    habit_id: habitId,
    log_date: date,
    value,
  });

  return Response.json({ success: true });
}
