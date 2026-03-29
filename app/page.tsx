"use client";

import { CreateListDialog } from "@/components/create-list-dialog";
import { ListCard } from "@/components/list-card";
import { useLists } from "@/hooks/use-lists";
import type { ListSummary } from "@/lib/api";

function groupByDate(lists: ListSummary[]): Record<string, ListSummary[]> {
  return lists.reduce<Record<string, ListSummary[]>>((acc, list) => {
    const dateStr = list.createdAt.split("T")[0].split(" ")[0];
    const [year, month, day] = dateStr.split("-");
    const label = `${day}/${month}/${year}`;
    if (!acc[label]) acc[label] = [];
    acc[label].push(list);
    return acc;
  }, {});
}

export default function Home() {
  const { data: lists, isLoading } = useLists();
  const grouped = lists ? groupByDate(lists) : {};

  return (
    <div className="space-y-6">
      <CreateListDialog />

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-36 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && lists?.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-xl font-medium text-gray-700">Nenhuma lista ainda</p>
          <p className="mt-1">Crie sua primeira lista de compras acima.</p>
        </div>
      )}

      {Object.entries(grouped).map(([date, dateLists]) => (
        <section key={date}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{date}</h2>
          <div className="space-y-3">
            {dateLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
