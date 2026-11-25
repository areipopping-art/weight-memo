"use client";

import { useState } from "react";
import Mascot from "@/components/Mascot";
import MealWeightChart from "@/components/MealWeightChart";
import MealWeightTable from "@/components/MealWeightTable";
import WeightChart from "@/components/WeightChart";
import { todayString } from "@/lib/date";
import { showsDetail } from "@/lib/persona";
import { recordsInLastDays } from "@/lib/stats";
import { useWeightMemo } from "@/lib/useWeightMemo";

const RANGES = [
  { key: "week", label: "週", days: 7 },
  { key: "month", label: "月", days: 30 },
] as const;

/** F-17 体重グラフ（目標ライン付き、週・月の切り替え）、F-24 食事と体重の振り返り */
export default function StatsPage() {
  const { data, setPersona } = useWeightMemo();
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("week");

  const title = <h1 className="text-xl font-extrabold text-sakura-700 dark:text-sakura-300">📊 グラフ</h1>;
  if (data === null) return title;

  // グラフは B しっかりモードの機能
  if (!showsDetail(data.persona)) {
    return (
      <div className="space-y-6">
        {title}
        <div className="card flex flex-col items-center py-8 text-center">
          <Mascot mood="cheer" size={110} />
          <p className="mt-2 font-bold">グラフは「📊 B しっかりモード」の機能だよ</p>
          <p className="mt-1 text-sm text-muted">体重の変化や、食事と体重の振り返りが見られます。</p>
          <button type="button" onClick={() => setPersona("B")} className="btn-primary mt-4 px-6 py-2">
            しっかりモードにする
          </button>
        </div>
      </div>
    );
  }

  const current = RANGES.find((r) => r.key === range)!;
  const records = recordsInLastDays(data.records, todayString(), current.days);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {title}
        <div role="group" aria-label="表示する期間" className="flex rounded-full border-2 border-[var(--input-border)] bg-[var(--card)] p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={range === r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full px-4 py-1 text-sm transition-colors ${
                range === r.key ? "bg-sakura-500 font-bold text-white" : "text-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* PC は2つのグラフを横に並べる */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        <section className="card">
          <p className="mb-3 text-sm font-bold text-muted">📈 直近{current.days}日間の体重</p>
          {records.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Mascot mood="sleepy" size={96} />
              <p className="mt-2 text-sm font-bold text-muted">この期間の記録はまだないよ…</p>
            </div>
          ) : (
            <WeightChart records={records} goalWeight={data.goalWeight} />
          )}
        </section>

        {/* F-24 食事と体重の振り返り */}
        {records.length > 0 && (
          <section className="card">
            <h2 className="font-extrabold">🍽️ 食事と体重の振り返り</h2>
            <p className="mb-3 text-xs text-muted">食べた量（合計カロリー）と体重の動きを見比べられます。</p>
            <MealWeightChart records={records} />
            <div className="mt-4">
              <MealWeightTable records={records} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
