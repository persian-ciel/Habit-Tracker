// app/api/habits/route.ts
import { db } from "@/db/drizzle";
import { habits } from "@/db/schema";

export async function GET() {
  const data = await db.select().from(habits);
  return Response.json(data);
}
export async function POST(req: Request) {
  const body = await req.json();

  const [habit] = await db
    .insert(habits)
    .values({
      user_id: body.user_id,
      title: body.title,
      description: body.description,
      tracking_type: body.tracking_type,
      target_value: body.target_value,
    })
    .returning();

  return Response.json(habit);
}