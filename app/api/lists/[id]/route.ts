import { db } from "@/db";
import { items, lists } from "@/db/schema";
import { updateListSchema } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const listId = Number(id);

  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
    with: { items: { orderBy: (i, { desc }) => [desc(i.createdAt)] } },
  });

  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(list);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const listId = Number(id);
  const body = await request.json();
  const parsed = updateListSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [updated] = await db
    .update(lists)
    .set(parsed.data)
    .where(eq(lists.id, listId))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const listId = Number(id);

  await db.delete(items).where(eq(items.listId, listId));
  const [deleted] = await db.delete(lists).where(eq(lists.id, listId)).returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
