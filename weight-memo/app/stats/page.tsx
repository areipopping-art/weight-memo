"use client";

import { useState } from "react";
import WeightChart from "@/components/WeightChart";
import { todayString } from "@/lib/date";
import { recordsInLastDays } from "@/lib/stats";
import { useWeightMemo } from "@/lib/useWeightMemo";

const RANGES = [
  { key: "week", label: "週", days: 7 },
  { key: "month", label: "月", days: 30 },
] as const;

/** F-17 体重グラフ（目標ライン付き、週・月の切り替え） */
export default function StatsPage() {
  const { data } = useWeightMemo();
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("week");

  const title = <h1 className="text-xl font-bold">グラフ</h1>;
  if (data === null) return title;

  const current = RANGES.find((r) => r.key === range)!;
  const records = recordsInLastDays(data.records, todayString(), current.days);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {title}
        <div role="group" aria-label="表示する期間" className="flex rounded-md border border-neutral-300 p-0.5 dark:border-neutral-600">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={range === r.key}
              onClick={() => setRange(r.key)}
              className={`rounded px-4 py-1 text-sm ${
                range === r.key ? "bg-emerald-600 font-bold text-white" : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
        <p className="mb-3 text-sm text-neutral-500">直近{current.days}日間の体重</p>
        {records.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-500">この期間の記録はまだありません。</p>
        ) : (
          <WeightChart records={records} goalWeight={data.goalWeight} />
        )}
      </section>
    </div>
  );
}
