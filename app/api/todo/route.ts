import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";

// Get all todos for logged in user
export async function GET() {
  const session = await auth.api.getSession();
  if (!session) return Response.json([], { status: 401 });

  const items = await db.select().from(todo)
    .where(eq(todo.userId, session.user.id));

  return Response.json(items);
}

// Create new todo
export async function POST(req: Request) {
  const body = await req.json();
  const session = await auth.api.getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const newItem = {
    id: uuid(),
    userId: session.user.id,
    title: body.title,
    description: body.description ?? "",
    status: body.status ?? "pending",
    priority: body.priority ?? "medium",
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
    completed: body.completed ?? false,
  };

  await db.insert(todo).values(newItem);

  return Response.json(newItem);
}

// Update todo
export async function PUT(req: Request) {
  const body = await req.json();

  await db
    .update(todo)
    .set({
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      completed: body.completed,
    })
    .where(eq(todo.id, body.id));

  return Response.json({ success: true });
}

// Delete todo
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.delete(todo).where(eq(todo.id, id));

  return Response.json({ success: true });
}
