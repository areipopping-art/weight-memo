"use client";

import Link from "next/link";
import { useState } from "react";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { formatShortDate } from "@/lib/date";
import { formatKg } from "@/lib/weight";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function weekday(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export default function HistoryPage() {
  const { data, deleteRecord } = useWeightMemo();
  // 「本当に削除？」を表示している記録の日付
  const [confirming, setConfirming] = useState<string | null>(null);

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
              {confirming === r.date ? (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-600"
                  >
                    やめる
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteRecord(r.date);
                      setConfirming(null);
                    }}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white hover:bg-red-700"
                  >
                    本当に削除
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(r.date)}
                  aria-label={`${formatShortDate(r.date)} の記録を削除`}
                  className="shrink-0 rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-700"
                >
                  削除
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
