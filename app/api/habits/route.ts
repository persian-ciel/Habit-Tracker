import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { habits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const data = await db.select().from(habits).where(eq(habits.user_id, user.id));
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { title, description, frequency } = await request.json();

  const [habit] = await db
    .insert(habits)
    .values({
      user_id: user.id,
      title,
      description,
      frequency,
    })
    .returning();

  return NextResponse.json(habit);
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { id, title, description, frequency } = await request.json();

  const [updated] = await db
    .update(habits)
    .set({ title, description, frequency })
    .where(eq(habits.id, Number(id)))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db.delete(habits).where(eq(habits.id, Number(id)));
  return NextResponse.json({ success: true });
}