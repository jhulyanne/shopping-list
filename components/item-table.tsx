"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteItem, useUpdateItem } from "@/hooks/use-lists";
import type { ItemRow } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface ItemTableProps {
  listId: number;
  items: ItemRow[];
}

function EditItemDialog({ listId, item, onClose }: { listId: number; item: ItemRow; onClose: () => void }) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [price, setPrice] = useState(String(item.price));
  const { mutateAsync, isPending } = useUpdateItem(listId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutateAsync({
      itemId: item.id,
      data: {
        name: name.trim(),
        quantity: parseFloat(quantity),
        price: parseFloat(price.replace(",", ".")),
      },
    });
    toast.success("Item atualizado!");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label className="text-base">Produto</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="text-base h-12" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-base">Quantidade</Label>
          <Input type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="text-base h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-base">Preço (R$)</Label>
          <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="text-base h-12" />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 text-base">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1 h-12 text-base">
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

function ItemRow({ listId, item }: { listId: number; item: ItemRow }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: deleteItem, isPending: deleting } = useDeleteItem(listId);

  const subtotal = item.quantity * item.price;
  const date = item.createdAt.split("T")[0].split(" ")[0];
  const [year, month, day] = date.split("-");
  const dateLabel = `${day}/${month}`;

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-3">
        <span className="font-medium text-gray-900">{item.name}</span>
        <span className="block text-xs text-gray-400 mt-0.5">{dateLabel}</span>
      </td>
      <td className="py-3 px-3 text-center text-gray-700">{item.quantity}</td>
      <td className="py-3 px-3 text-right text-gray-700">R$ {item.price.toFixed(2)}</td>
      <td className="py-3 px-3 text-right font-semibold text-gray-900">R$ {subtotal.toFixed(2)}</td>
      <td className="py-3 px-3 text-right">
        <div className="flex gap-1 justify-end">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger render={<Button variant="ghost" size="sm" className="h-9 px-2 text-gray-500 hover:text-blue-600" />}>
              ✏️
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">Editar item</DialogTitle>
              </DialogHeader>
              <EditItemDialog listId={listId} item={item} onClose={() => setEditOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger render={<Button variant="ghost" size="sm" className="h-9 px-2 text-gray-500 hover:text-red-600" />}>
              🗑
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">Apagar item?</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                O item <strong>"{item.name}"</strong> será apagado permanentemente.
              </p>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setDeleteOpen(false)} className="flex-1 h-12 text-base">
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deleteItem(item.id);
                    toast.success("Item apagado");
                    setDeleteOpen(false);
                  }}
                  disabled={deleting}
                  className="flex-1 h-12 text-base"
                >
                  {deleting ? "Apagando..." : "Apagar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}

export function ItemTable({ listId, items }: ItemTableProps) {
  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-3">📦</p>
        <p className="text-lg font-medium text-gray-700">Nenhum item ainda</p>
        <p className="mt-1">Adicione o primeiro produto acima.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-3 text-left text-sm font-semibold text-gray-600">Produto</th>
              <th className="py-3 px-3 text-center text-sm font-semibold text-gray-600">Qtd</th>
              <th className="py-3 px-3 text-right text-sm font-semibold text-gray-600">Preço</th>
              <th className="py-3 px-3 text-right text-sm font-semibold text-gray-600">Subtotal</th>
              <th className="py-3 px-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow key={item.id} listId={listId} item={item} />
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td colSpan={3} className="py-4 px-3 text-right font-bold text-gray-700">
                Valor Total
              </td>
              <td className="py-4 px-3 text-right text-xl font-bold text-gray-900">
                R$ {total.toFixed(2)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
