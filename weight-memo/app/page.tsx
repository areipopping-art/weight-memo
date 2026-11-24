"use client";

import { useState } from "react";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { formatShortDate, todayString } from "@/lib/date";
import { MAX_WEIGHT, MIN_WEIGHT, formatKg, parseWeight } from "@/lib/weight";

export default function Home() {
  const { data, saveRecord } = useWeightMemo();
  const [date, setDate] = useState<string | null>(null); // null = 今日
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // data が null の間はサーバー側の表示（まだ localStorage を読んでいない）
  if (data === null) {
    return <h1 className="text-xl font-bold">今日の記録</h1>;
  }

  const today = todayString();
  const dateValue = date ?? today;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const w = parseWeight(weight);
    if (w === null) {
      setMessage({ ok: false, text: `体重は ${MIN_WEIGHT}〜${MAX_WEIGHT}kg の数字で入力してください` });
      return;
    }
    saveRecord({ date: dateValue, weight: w, meal: "" });
    setWeight("");
    setMessage({ ok: true, text: `${formatShortDate(dateValue)} の体重 ${formatKg(w)} を保存しました` });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">今日の記録</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
        <div className="space-y-1">
          <label htmlFor="date" className="block text-sm font-medium">
            日付
          </label>
          <input
            id="date"
            type="date"
            max={today}
            value={dateValue}
            onChange={(e) => setDate(e.target.value || null)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="weight" className="block text-sm font-medium">
            体重（kg）
          </label>
          <input
            id="weight"
            type="number"
            inputMode="decimal"
            step="0.1"
            min={MIN_WEIGHT}
            max={MAX_WEIGHT}
            placeholder="例：62.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-2xl dark:border-neutral-600 dark:bg-neutral-900"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 py-3 text-lg font-bold text-white hover:bg-emerald-700"
        >
          記録する
        </button>

        {message && (
          <p role="status" className={message.ok ? "text-sm text-emerald-700" : "text-sm text-red-600"}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
