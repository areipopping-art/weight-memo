"use client";

import { useState } from "react";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { MAX_WEIGHT, MIN_WEIGHT, formatKg, parseWeight } from "@/lib/weight";

export default function GoalPage() {
  const { data, setGoalWeight } = useWeightMemo();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const goal = parseWeight(input);
    if (goal === null) {
      setMessage({ ok: false, text: `${MIN_WEIGHT}〜${MAX_WEIGHT}kg の数字で入力してください` });
      return;
    }
    setGoalWeight(goal);
    setInput("");
    setMessage({ ok: true, text: `目標体重を ${formatKg(goal)} に設定しました` });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">目標設定</h1>

      {data?.goalWeight != null && (
        <p className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
          現在の目標：<span className="text-2xl font-bold">{formatKg(data.goalWeight)}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
        <label htmlFor="goal" className="block text-sm font-medium">
          目標体重（kg）
        </label>
        <input
          id="goal"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={MIN_WEIGHT}
          max={MAX_WEIGHT}
          placeholder="例：60.0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-lg dark:border-neutral-600 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700"
        >
          保存する
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
