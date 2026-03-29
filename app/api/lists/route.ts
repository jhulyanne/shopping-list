import { db } from "@/db";
import { items, lists } from "@/db/schema";
import { createListSchema } from "@/lib/schemas";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db
    .select({
      id: lists.id,
      name: lists.name,
      budgetLimit: lists.budgetLimit,
      createdAt: lists.createdAt,
      total: sql<number>`COALESCE(SUM(${items.quantity} * ${items.price}), 0)`,
      itemCount: sql<number>`COUNT(${items.id})`,
    })
    .from(lists)
    .leftJoin(items, eq(items.listId, lists.id))
    .groupBy(lists.id)
    .orderBy(desc(lists.createdAt));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createListSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [list] = await db
    .insert(lists)
    .values({ name: parsed.data.name, budgetLimit: parsed.data.budgetLimit ?? null })
    .returning();

  return NextResponse.json(list, { status: 201 });
}
