"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateList } from "@/hooks/use-lists";
import { useState } from "react";
import { toast } from "sonner";

export function CreateListDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const { mutateAsync, isPending } = useCreateList();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({
      name: name.trim(),
      budgetLimit: budget ? parseFloat(budget.replace(",", ".")) : null,
    });
    toast.success("Lista criada!");
    setName("");
    setBudget("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="w-full text-base py-6" />}>
        + Nova Lista
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Nova Lista de Compras</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Nome da lista
            </Label>
            <Input
              id="name"
              placeholder="Ex: Compras da semana"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base h-12"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-base">
              Limite de orçamento (opcional)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <Input
                id="budget"
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
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 h-12 text-base">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()} className="flex-1 h-12 text-base">
              {isPending ? "Criando..." : "Criar Lista"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
