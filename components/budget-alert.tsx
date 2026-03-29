"use client";

import { Progress } from "@/components/ui/progress";

interface BudgetAlertProps {
  total: number;
  budgetLimit: number;
}

export function BudgetAlert({ total, budgetLimit }: BudgetAlertProps) {
  const pct = Math.min((total / budgetLimit) * 100, 100);
  const over = total > budgetLimit;
  const warning = pct >= 80;

  const color = over
    ? "text-red-700 bg-red-50 border-red-200"
    : warning
      ? "text-yellow-700 bg-yellow-50 border-yellow-200"
      : "text-green-700 bg-green-50 border-green-200";

  const progressColor = over ? "bg-red-500" : warning ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className={`rounded-lg border p-4 mb-4 ${color}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">
          {over ? "⚠️ Limite ultrapassado!" : warning ? "⚠️ Próximo do limite" : "✅ Dentro do orçamento"}
        </span>
        <span className="font-bold">
          R$ {total.toFixed(2)} / R$ {budgetLimit.toFixed(2)}
        </span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${progressColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm mt-1">{pct.toFixed(0)}% do limite utilizado</p>
    </div>
  );
}
