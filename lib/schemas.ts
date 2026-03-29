import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
  budgetLimit: z.number().positive().nullable().optional(),
});

export const updateListSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  budgetLimit: z.number().positive().nullable().optional(),
});

export const createItemSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
  quantity: z.number().positive().default(1),
  price: z.number().min(0).default(0),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  quantity: z.number().positive().optional(),
  price: z.number().min(0).optional(),
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
