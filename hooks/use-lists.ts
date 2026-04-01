"use client";

import * as storage from "@/lib/storage";
import type { CreateItemInput, CreateListInput, UpdateItemInput, UpdateListInput } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLists() {
  return useQuery({ queryKey: ["lists"], queryFn: storage.getLists, staleTime: Infinity });
}

export function useList(id: string) {
  return useQuery({ queryKey: ["lists", id], queryFn: () => storage.getList(id), staleTime: Infinity });
}

export function useCreateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListInput) => Promise.resolve(storage.createList(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists"] }),
  });
}

export function useUpdateList(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateListInput) => Promise.resolve(storage.updateList(id, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists"] }),
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      storage.deleteList(id);
      return Promise.resolve();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists"] }),
  });
}

export function useCreateItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => Promise.resolve(storage.createItem(listId, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists", listId] }),
  });
}

export function useUpdateItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateItemInput }) =>
      Promise.resolve(storage.updateItem(listId, itemId, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists", listId] }),
  });
}

export function useDeleteItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => {
      storage.deleteItem(listId, itemId);
      return Promise.resolve();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists", listId] }),
  });
}
