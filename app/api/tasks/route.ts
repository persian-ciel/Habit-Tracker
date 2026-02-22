import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, inArray } from "drizzle-orm";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({
      headers: { cookie: cookiesList },
    });

    if (!session?.user?.id)
      return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "8");
    const priority = url.searchParams.get("priority");
    const completed = url.searchParams.get("completed");

    let whereClause: any = eq(tasks.user_id, session.user.id);

    if (priority && priority !== "all") {
      whereClause = and(whereClause, eq(tasks.priority, priority));
    }

    if (completed && completed !== "all") {
      whereClause = and(
        whereClause,
        eq(tasks.completed, completed === "true")
      );
    }

    const data = await db
      .select()
      .from(tasks)
      .where(whereClause)
      .orderBy(tasks.sort_order)
      .offset(page * limit)
      .limit(limit);

    const mappedData = data.map((t: any) => ({
      ...t,
      dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
      sort_order: t.sort_order,
    }));

    return Response.json(mappedData);
  } catch (err) {
    console.error("GET /api/tasks ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({
      headers: { cookie: cookiesList },
    });

    if (!session?.user?.id)
      return new Response("Unauthorized", { status: 401 });

    const data = await req.json();
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
        priority_status: "normal",
        status: data.status ?? "pending",
        sort_order: data.sort_order ?? 0,
      })
      .returning();

    return Response.json({
      ...inserted,
      dueDate: inserted.due_date
        ? inserted.due_date.toISOString()
        : null,
    });
  } catch (err) {
    console.error("POST /api/tasks ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ================= PUT (Update + Reorder) =================
export async function PUT(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({
      headers: { cookie: cookiesList },
    });

    if (!session?.user?.id)
      return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    // ================= BULK REORDER =================
    if (Array.isArray(body)) {
      const ids = body.map((item) => item.id);

      await db.transaction(async (tx) => {
        for (const item of body) {
          await tx
            .update(tasks)
            .set({ sort_order: item.sort_order })
            .where(
              and(
                eq(tasks.id, item.id),
                eq(tasks.user_id, session.user.id)
              )
            );
        }
      });

      return new Response("Reordered", { status: 200 });
    }

    // ================= SINGLE UPDATE =================
    const data: {
      id: number;
      title?: string;
      description?: string;
      dueDate?: string;
      status?: string;
      priority?: string;
      sort_order?: number;
    } = body;

    const updatedFields: any = {};

    if (data.title !== undefined) updatedFields.title = data.title;
    if (data.description !== undefined)
      updatedFields.description = data.description;
    if (data.priority !== undefined)
      updatedFields.priority = data.priority;
    if (data.status !== undefined)
      updatedFields.status = data.status;

    if (data.dueDate)
      updatedFields.due_date = new Date(data.dueDate);

    if (typeof data.sort_order === "number")
      updatedFields.sort_order = data.sort_order;

    if (data.status === "completed") {
      updatedFields.completed = true;
    } else if (data.status === "pending" || data.status === "cancelled") {
      updatedFields.completed = false;
    }

    await db
      .update(tasks)
      .set(updatedFields)
      .where(
        and(
          eq(tasks.id, data.id),
          eq(tasks.user_id, session.user.id)
        )
      );

    return new Response("Updated", { status: 200 });
  } catch (err) {
    console.error("PUT /api/tasks ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const cookiesList = req.headers.get("cookie") ?? "";
    const session = await auth.api.getSession({
      headers: { cookie: cookiesList },
    });

    if (!session?.user?.id)
      return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id") || "0");

    if (!id)
      return new Response("Invalid ID", { status: 400 });

    await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, id),
          eq(tasks.user_id, session.user.id)
        )
      );

    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error("DELETE /api/tasks ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}