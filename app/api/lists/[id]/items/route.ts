import { db } from "@/db";
import { items } from "@/db/schema";
import { createItemSchema } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const listId = Number(id);
  const body = await request.json();
  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [item] = await db
    .insert(items)
    .values({ ...parsed.data, listId })
    .returning();

  return NextResponse.json(item, { status: 201 });
}
