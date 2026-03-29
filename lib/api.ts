import type { CreateItemInput, CreateListInput, UpdateItemInput, UpdateListInput } from "./schemas";

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export type ListSummary = {
  id: number;
  name: string;
  budgetLimit: number | null;
  createdAt: string;
  total: number;
  itemCount: number;
};

export type ItemRow = {
  id: number;
  listId: number;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
};

export type ListDetail = {
  id: number;
  name: string;
  budgetLimit: number | null;
  createdAt: string;
  items: ItemRow[];
};

export const api = {
  lists: {
    getAll: () => apiFetch<ListSummary[]>("/api/lists"),
    getOne: (id: number) => apiFetch<ListDetail>(`/api/lists/${id}`),
    create: (data: CreateListInput) =>
      apiFetch<ListSummary>("/api/lists", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: UpdateListInput) =>
      apiFetch<ListSummary>(`/api/lists/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      apiFetch<{ success: boolean }>(`/api/lists/${id}`, { method: "DELETE" }),
  },
  items: {
    create: (listId: number, data: CreateItemInput) =>
      apiFetch<ItemRow>(`/api/lists/${listId}/items`, { method: "POST", body: JSON.stringify(data) }),
    update: (listId: number, itemId: number, data: UpdateItemInput) =>
      apiFetch<ItemRow>(`/api/lists/${listId}/items/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (listId: number, itemId: number) =>
      apiFetch<{ success: boolean }>(`/api/lists/${listId}/items/${itemId}`, { method: "DELETE" }),
  },
};
