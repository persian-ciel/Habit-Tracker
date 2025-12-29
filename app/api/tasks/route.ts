import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// GET tasks با فیلتر
export async function GET(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({ headers: { cookie: cookiesList } });
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "8");
    const priority = url.searchParams.get("priority");
    const completed = url.searchParams.get("completed");

    let whereClause: any = eq(tasks.user_id, session.user.id);
    if (priority && priority !== "all") whereClause = and(whereClause, eq(tasks.priority, priority));
    if (completed && completed !== "all") whereClause = and(whereClause, eq(tasks.completed, completed === "true"));

    const data = await db.select().from(tasks).where(whereClause).offset(page * limit).limit(limit);

    // تبدیل snake_case به camelCase
    const mappedData = data.map((t: any) => ({
      ...t,
      dueDate: t.due_date ? new Date(t.due_date).toISOString() : undefined,
      status: t.completed ? "completed" : "pending", // اگر نیاز به status دارید
    }));

    return Response.json(mappedData);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({ headers: { cookie: cookiesList } });
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const data: {
      title: string;
      description?: string;
      dueDate?: string;
      completed?: boolean;
      priority?: string;
    } = await req.json();

    const due_date = data.dueDate ? new Date(data.dueDate) : null;

    const [inserted] = await db
      .insert(tasks)
      .values({
        user_id: session.user.id,
        title: data.title,
        description: data.description || "",
        due_date,
        completed: data.completed ?? false,
        priority: data.priority ?? "medium",
      })
      .returning();

    // تبدیل فیلد snake_case به camelCase قبل از بازگرداندن
    return Response.json({
      ...inserted,
      dueDate: inserted.due_date ? inserted.due_date.toISOString() : null,
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}


// PUT update task
export async function PUT(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({ headers: { cookie: cookiesList } });
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const data: {
      id: number;
      title?: string;
      description?: string;
      dueDate?: string;
      status?: string;
      priority?: string;
    } = await req.json();

    const updatedFields: any = { ...data };
    if (data.dueDate) updatedFields.due_date = new Date(data.dueDate);

    if (data.status === "completed") updatedFields.completed = true;
    else if (data.status === "pending" || data.status === "cancelled") updatedFields.completed = false;

    delete updatedFields.id;
    delete updatedFields.dueDate;

    await db.update(tasks).set(updatedFields).where(eq(tasks.id, data.id));

    return new Response("Updated", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}


// DELETE task
export async function DELETE(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({ headers: { cookie: cookiesList } });
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id") || "0");
    if (!id) return new Response("Invalid ID", { status: 400 });

    await db.delete(tasks).where(eq(tasks.id, id));
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
