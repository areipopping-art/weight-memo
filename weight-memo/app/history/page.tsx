"use client";

import Link from "next/link";
import { useState } from "react";
import Mascot from "@/components/Mascot";
import MealList from "@/components/MealList";
import RecordPhotos from "@/components/RecordPhotos";
import { formatKcal, totalKcal } from "@/lib/meals";
import { showsDetail } from "@/lib/persona";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { formatShortDate } from "@/lib/date";
import { formatBodyFat, formatKg } from "@/lib/weight";

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
    return <h1 className="text-xl font-extrabold text-sakura-700 dark:text-sakura-300">📋 記録一覧</h1>;
  }

  const detail = showsDetail(data.persona); // B しっかりモードの項目を出すか
  // F-07 新しい順
  const records = [...data.records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-sakura-700 dark:text-sakura-300">
        📋 記録一覧 <span className="text-sm font-bold text-muted">{records.length}件</span>
      </h1>

      {records.length === 0 ? (
        <div className="card flex flex-col items-center py-8 text-center">
          <Mascot mood="sleepy" size={110} />
          <p className="mt-2 font-bold">まだ記録がないよ…</p>
          <p className="mt-1 text-sm text-muted">
            <Link href="/" className="font-bold text-sakura-700 underline dark:text-sakura-300">
              ホーム
            </Link>
            から今日の体重を記録しよう！
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.date} className="card flex animate-pop-in items-start gap-3">
              <div className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-sakura-100 py-1.5 text-sakura-800 dark:bg-[#4a3542] dark:text-sakura-100">
                <span className="text-sm font-extrabold">{formatShortDate(r.date)}</span>
                <span className="text-xs">{weekday(r.date)}曜</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-extrabold">
                  {formatKg(r.weight)}
                  {detail && r.bodyFat != null && (
                    <span className="ml-2 text-sm font-normal text-muted">体脂肪 {formatBodyFat(r.bodyFat)}</span>
                  )}
                  {detail && totalKcal(r) !== null && (
                    <span className="ml-2 rounded-full bg-lemon-100 px-2 py-0.5 text-xs font-bold text-lemon-800 dark:bg-[#33301f] dark:text-lemon-200">🔥 合計 {formatKcal(totalKcal(r)!)}</span>
                  )}
                </p>
                <MealList record={r} showKcal={detail} />
                <RecordPhotos date={r.date} />
              </div>
              {confirming === r.date ? (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    className="btn-soft px-3 py-1 text-xs"
                  >
                    やめる
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteRecord(r.date);
                      setConfirming(null);
                    }}
                    className="rounded-full bg-sakura-600 px-3 py-1 text-xs font-bold text-white hover:bg-sakura-700"
                  >
                    本当に削除
                  </button>
                </div>
              ) : (
                <div className="flex shrink-0 gap-1">
                  <Link
                    href={`/history/${r.date}`}
                    aria-label={`${formatShortDate(r.date)} の記録を編集`}
                    className="rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-800 hover:bg-mint-200 dark:bg-[#1f3330] dark:text-mint-200"
                  >
                    編集
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirming(r.date)}
                    aria-label={`${formatShortDate(r.date)} の記録を削除`}
                    className="rounded-full px-3 py-1 text-xs text-muted hover:bg-sakura-50 hover:text-sakura-700 dark:hover:bg-[#3a2f40]"
                  >
                    削除
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
