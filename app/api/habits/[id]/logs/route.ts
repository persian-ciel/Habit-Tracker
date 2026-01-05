// app/api/habits/[id]/logs/route.ts
import { db } from "@/db/drizzle";
import { habit_logs } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const habitId = Number(params.id);
  const { searchParams } = new URL(req.url);

  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));
  const daysInMonth = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2,"0")}-${daysInMonth}`;


  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  

  const logs = await db
    .select()
    .from(habit_logs)
    .where(
      and(
        eq(habit_logs.habit_id, habitId),
        gte(habit_logs.log_date, start),
        lte(habit_logs.log_date, end)
      )
    );

  return Response.json(logs);
}
