"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateItem } from "@/hooks/use-lists";
import { useSpeech } from "@/hooks/use-speech";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ItemFormProps {
  listId: number;
}

export function ItemForm({ listId }: ItemFormProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const { mutateAsync, isPending } = useCreateItem(listId);

  const handleSpeechResult = useCallback((text: string) => {
    setName(text);
    toast.info(`Ouvido: "${text}"`);
  }, []);

  const { listening, supported, toggle } = useSpeech(handleSpeechResult);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      price: parseFloat(price.replace(",", ".")) || 0,
    });
    toast.success("Item adicionado!");
    setName("");
    setQuantity("1");
    setPrice("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">Adicionar item</h3>
      <div className="space-y-2">
        <Label htmlFor="item-name" className="text-base">
          Produto
        </Label>
        <div className="flex gap-2">
          <Input
            id="item-name"
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-base h-12"
          />
          {supported && (
            <Button
              type="button"
              variant={listening ? "destructive" : "outline"}
              onClick={toggle}
              className="h-12 px-4 shrink-0"
              title={listening ? "Parar gravação" : "Falar nome do produto"}
            >
              {listening ? "⏹ Parar" : "🎤 Falar"}
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="item-qty" className="text-base">
            Quantidade
          </Label>
          <Input
            id="item-qty"
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="text-base h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-price" className="text-base">
            Preço (R$)
          </Label>
          <Input
            id="item-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-base h-12"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isPending || !name.trim()}
        className="w-full h-12 text-base"
      >
        {isPending ? "Adicionando..." : "+ Adicionar"}
      </Button>
    </form>
  );
}
