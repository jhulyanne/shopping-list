"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDeleteList } from "@/hooks/use-lists";
import type { ListSummary } from "@/lib/storage";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ListCardProps {
  list: ListSummary;
}

export function ListCard({ list }: ListCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: deleteList, isPending } = useDeleteList();

  const pct = list.budgetLimit ? (list.total / list.budgetLimit) * 100 : 0;
  const budgetStatus =
    list.budgetLimit && list.total > list.budgetLimit
      ? "over"
      : list.budgetLimit && pct >= 80
        ? "warning"
        : "ok";

  async function handleDelete() {
    await deleteList(list.id);
    toast.success("Lista apagada");
    setConfirmOpen(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/lists/${list.id}`} className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
            {list.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {list.itemCount} {list.itemCount === 1 ? "item" : "itens"}
          </p>
        </Link>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger render={<Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600 shrink-0" />}>
            🗑️
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Apagar lista?</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">
              A lista <strong>"{list.name}"</strong> e todos os seus itens serão apagados permanentemente.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)} className="flex-1 h-12 text-base">
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="flex-1 h-12 text-base">
                {isPending ? "Apagando..." : "Apagar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">R$ {list.total.toFixed(2)}</span>
        {list.budgetLimit && (
          <Badge
            variant="outline"
            className={
              budgetStatus === "over"
                ? "border-red-400 text-red-700 bg-red-50"
                : budgetStatus === "warning"
                  ? "border-yellow-400 text-yellow-700 bg-yellow-50"
                  : "border-green-400 text-green-700 bg-green-50"
            }
          >
            {budgetStatus === "over" ? "⚠️ Limite ultrapassado" : budgetStatus === "warning" ? "⚠️ Próximo do limite" : `Limite: R$ ${list.budgetLimit.toFixed(2)}`}
          </Badge>
        )}
      </div>

      <Link href={`/lists/${list.id}`}>
        <Button variant="outline" className="w-full h-12 text-base">
          Ver lista →
        </Button>
      </Link>
    </div>
  );
}
