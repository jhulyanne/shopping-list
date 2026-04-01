const STORAGE_KEY = "shopping-list-data";

export type ItemRow = {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
};

export type ListSummary = {
  id: string;
  name: string;
  budgetLimit: number | null;
  createdAt: string;
  total: number;
  itemCount: number;
};

export type ListDetail = {
  id: string;
  name: string;
  budgetLimit: number | null;
  createdAt: string;
  items: ItemRow[];
};

type StoredList = {
  id: string;
  name: string;
  budgetLimit: number | null;
  createdAt: string;
  items: ItemRow[];
};

type StorageRoot = {
  lists: StoredList[];
};

function read(): StorageRoot {
  if (typeof window === "undefined") return { lists: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lists: [] };
    return JSON.parse(raw) as StorageRoot;
  } catch {
    return { lists: [] };
  }
}

function write(data: StorageRoot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLists(): ListSummary[] {
  const { lists } = read();
  return lists.map((list) => ({
    id: list.id,
    name: list.name,
    budgetLimit: list.budgetLimit,
    createdAt: list.createdAt,
    total: list.items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    itemCount: list.items.length,
  }));
}

export function getList(id: string): ListDetail | null {
  const { lists } = read();
  const list = lists.find((l) => l.id === id);
  if (!list) return null;
  return {
    id: list.id,
    name: list.name,
    budgetLimit: list.budgetLimit,
    createdAt: list.createdAt,
    items: [...list.items].reverse(),
  };
}

export function createList(data: { name: string; budgetLimit?: number | null }): ListSummary {
  const root = read();
  const newList: StoredList = {
    id: crypto.randomUUID(),
    name: data.name,
    budgetLimit: data.budgetLimit ?? null,
    createdAt: new Date().toISOString(),
    items: [],
  };
  root.lists.unshift(newList);
  write(root);
  return { ...newList, total: 0, itemCount: 0 };
}

export function updateList(id: string, data: { name?: string; budgetLimit?: number | null }): ListSummary {
  const root = read();
  const idx = root.lists.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lista não encontrada");
  const list = root.lists[idx];
  if (data.name !== undefined) list.name = data.name;
  if ("budgetLimit" in data) list.budgetLimit = data.budgetLimit ?? null;
  write(root);
  return {
    id: list.id,
    name: list.name,
    budgetLimit: list.budgetLimit,
    createdAt: list.createdAt,
    total: list.items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    itemCount: list.items.length,
  };
}

export function deleteList(id: string): void {
  const root = read();
  root.lists = root.lists.filter((l) => l.id !== id);
  write(root);
}

export function createItem(
  listId: string,
  data: { name: string; quantity: number; price: number },
): ItemRow {
  const root = read();
  const list = root.lists.find((l) => l.id === listId);
  if (!list) throw new Error("Lista não encontrada");
  const newItem: ItemRow = {
    id: crypto.randomUUID(),
    listId,
    name: data.name,
    quantity: data.quantity,
    price: data.price,
    createdAt: new Date().toISOString(),
  };
  list.items.push(newItem);
  write(root);
  return newItem;
}

export function updateItem(
  listId: string,
  itemId: string,
  data: { name?: string; quantity?: number; price?: number },
): ItemRow {
  const root = read();
  const list = root.lists.find((l) => l.id === listId);
  if (!list) throw new Error("Lista não encontrada");
  const item = list.items.find((i) => i.id === itemId);
  if (!item) throw new Error("Item não encontrado");
  if (data.name !== undefined) item.name = data.name;
  if (data.quantity !== undefined) item.quantity = data.quantity;
  if (data.price !== undefined) item.price = data.price;
  write(root);
  return { ...item };
}

export function deleteItem(listId: string, itemId: string): void {
  const root = read();
  const list = root.lists.find((l) => l.id === listId);
  if (!list) throw new Error("Lista não encontrada");
  list.items = list.items.filter((i) => i.id !== itemId);
  write(root);
}
