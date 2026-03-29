import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const lists = sqliteTable("lists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  budgetLimit: real("budget_limit"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  listId: integer("list_id")
    .notNull()
    .references(() => lists.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: real("quantity").notNull().default(1),
  price: real("price").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
});

export const listsRelations = relations(lists, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  list: one(lists, { fields: [items.listId], references: [lists.id] }),
}));

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
