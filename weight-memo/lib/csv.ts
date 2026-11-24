// F-25 CSV 書き出し

import { MEAL_KEYS, MEAL_LABELS, mealsOf, totalKcal } from "./meals";
import type { WeightRecord } from "./storage";

/** CSV の1マス。カンマ・改行・" を含むときは " で囲み、" は "" にする */
function cell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** 全記録を CSV の文字列にする（古い順、改行は CRLF） */
export function recordsToCsv(records: WeightRecord[]): string {
  const header = [
    "日付",
    "体重(kg)",
    ...MEAL_KEYS.flatMap((k) => [MEAL_LABELS[k], `${MEAL_LABELS[k]}(kcal)`]),
    "合計(kcal)",
    "メモ",
  ];

  const rows = [...records]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => {
      const meals = mealsOf(r);
      return [
        r.date,
        r.weight.toFixed(1),
        ...MEAL_KEYS.flatMap((k) => [meals[k], r.kcal?.[k] ?? null]),
        totalKcal(r),
        r.meal,
      ];
    });

  return [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n";
}

/** Excel で文字化けしないよう、先頭に BOM を付けてダウンロードさせる */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  // すぐに解放すると Safari でダウンロードが始まらないことがあるため少し待つ
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
