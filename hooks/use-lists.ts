"use client";

import { api } from "@/lib/api";
import type { CreateItemInput, CreateListInput, UpdateItemInput, UpdateListInput } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLists() {
  return useQuery({ queryKey: ["lists"], queryFn: api.lists.getAll });
}

export function useList(id: number) {
  return useQuery({ queryKey: ["lists", id], queryFn: () => api.lists.getOne(id) });
}

export function useCreateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListInput) => api.lists.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists"] }),
  });
}

export function useUpdateList(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateListInput) => api.lists.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists"] }),
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.lists.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists"] }),
  });
}

export function useCreateItem(listId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => api.items.create(listId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists", listId] }),
  });
}

export function useUpdateItem(listId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: UpdateItemInput }) =>
      api.items.update(listId, itemId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists", listId] }),
  });
}

export function useDeleteItem(listId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => api.items.delete(listId, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lists", listId] }),
  });
}
