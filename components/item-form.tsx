"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateItem } from "@/hooks/use-lists";
import { useSpeech } from "@/hooks/use-speech";
import { parsePriceFromSpeech } from "@/lib/parse-price";
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

  const handleNameSpeech = useCallback((text: string) => {
    setName(text);
    toast.info(`Produto: "${text}"`);
  }, []);

  const handlePriceSpeech = useCallback((text: string) => {
    const parsed = parsePriceFromSpeech(text);
    if (parsed !== null) {
      setPrice(parsed.toFixed(2));
      toast.success(`Preço: R$ ${parsed.toFixed(2)}`);
    } else {
      toast.error(`Não entendi "${text}". Tente: "dois reais e cinquenta"`);
    }
  }, []);

  const { listening: listeningName, supported, toggle: toggleName } = useSpeech(handleNameSpeech);
  const { listening: listeningPrice, toggle: togglePrice } = useSpeech(handlePriceSpeech);

  async function handleSubmit(e: React.SyntheticEvent) {
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

      {/* Produto */}
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
              variant={listeningName ? "destructive" : "outline"}
              onClick={toggleName}
              className="h-12 px-4 shrink-0"
              title={listeningName ? "Parar gravação" : "Falar nome do produto"}
            >
              {listeningName ? "⏹ Parar" : "🎤 Falar"}
            </Button>
          )}
        </div>
      </div>

      {/* Quantidade e Preço */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="item-qty" className="text-base">
            Quantidade
          </Label>
          <Input
            id="item-qty"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="text-base h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-price" className="text-base">
            Preço (R$)
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                R$
              </span>
              <Input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-9 text-base h-12"
              />
            </div>
            {supported && (
              <Button
                type="button"
                variant={listeningPrice ? "destructive" : "outline"}
                onClick={togglePrice}
                className="h-12 px-3 shrink-0"
                title={listeningPrice ? "Parar gravação" : "Falar o preço"}
              >
                {listeningPrice ? "⏹" : "🎤"}
              </Button>
            )}
          </div>
          {supported && (
            <p className="text-xs text-gray-400 leading-snug">
              Diga: <span className="italic">"três vírgula cinquenta"</span>
            </p>
          )}
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
