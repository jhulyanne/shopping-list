import { db } from "@/db";
import { items } from "@/db/schema";
import { updateItemSchema } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string; itemId: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { itemId } = await params;
  const body = await request.json();
  const parsed = updateItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [updated] = await db
    .update(items)
    .set(parsed.data)
    .where(eq(items.id, Number(itemId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { itemId } = await params;

  const [deleted] = await db
    .delete(items)
    .where(eq(items.id, Number(itemId)))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
