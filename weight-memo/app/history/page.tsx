"use client";

import Link from "next/link";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { formatShortDate } from "@/lib/date";
import { formatKg } from "@/lib/weight";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function weekday(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export default function HistoryPage() {
  const { data } = useWeightMemo();

  if (data === null) {
    return <h1 className="text-xl font-bold">記録一覧</h1>;
  }

  // F-07 新しい順
  const records = [...data.records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">
        記録一覧 <span className="text-sm font-normal text-neutral-500">{records.length}件</span>
      </h1>

      {records.length === 0 ? (
        <p className="rounded-lg bg-white p-4 text-sm text-neutral-500 shadow-sm dark:bg-neutral-800">
          まだ記録がありません。
          <Link href="/" className="font-bold text-emerald-700 underline dark:text-emerald-400">
            ホーム
          </Link>
          から今日の体重を記録しましょう。
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-lg bg-white shadow-sm dark:divide-neutral-700 dark:bg-neutral-800">
          {records.map((r) => (
            <li key={r.date} className="flex items-start gap-4 p-4">
              <div className="w-14 shrink-0 text-sm text-neutral-500">
                {formatShortDate(r.date)}
                <span className="ml-0.5 text-xs">({weekday(r.date)})</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold">{formatKg(r.weight)}</p>
                {r.meal && <p className="mt-0.5 break-words text-sm text-neutral-600 dark:text-neutral-300">{r.meal}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
