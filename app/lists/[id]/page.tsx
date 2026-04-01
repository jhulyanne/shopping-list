"use client";

import { BudgetAlert } from "@/components/budget-alert";
import { ItemForm } from "@/components/item-form";
import { ItemTable } from "@/components/item-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useList, useUpdateList } from "@/hooks/use-lists";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditListDialog({ listId, currentName, currentBudget, onClose }: {
  listId: string;
  currentName: string;
  currentBudget: number | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(currentName);
  const [budget, setBudget] = useState(currentBudget != null ? String(currentBudget) : "");
  const { mutateAsync, isPending } = useUpdateList(listId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutateAsync({
      name: name.trim() || currentName,
      budgetLimit: budget ? parseFloat(budget.replace(",", ".")) : null,
    });
    toast.success("Lista atualizada!");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label className="text-base">Nome da lista</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="text-base h-12" />
      </div>
      <div className="space-y-2">
        <Label className="text-base">Limite de orçamento (opcional)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="pl-10 text-base h-12"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 text-base">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1 h-12 text-base">
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

export default function ListPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;
  const { data: list, isLoading } = useList(listId);
  const [editOpen, setEditOpen] = useState(false);

  const total = list?.items.reduce((sum, i) => sum + i.quantity * i.price, 0) ?? 0;

  useEffect(() => {
    if (!isLoading && !list) router.push("/");
  }, [isLoading, list, router]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-36 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!list) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => router.push("/")} className="h-10 px-2 text-gray-600 no-print">
          ← Voltar
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate print-title">{list.name}</h1>
        </div>
        <Button variant="outline" size="sm" className="h-10 shrink-0 no-print" onClick={() => window.print()} title="Exportar como PDF">
          🖨️ PDF
        </Button>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" className="h-10 shrink-0 no-print" />}>
            ✏️ Editar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Editar lista</DialogTitle>
            </DialogHeader>
            <EditListDialog
              listId={listId}
              currentName={list.name}
              currentBudget={list.budgetLimit}
              onClose={() => setEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {list.budgetLimit != null && list.budgetLimit > 0 && (
        <BudgetAlert total={total} budgetLimit={list.budgetLimit} />
      )}

      <div className="no-print">
        <ItemForm listId={listId} />
      </div>
      <ItemTable listId={listId} items={list.items} />
    </div>
  );
}
