"use client";

import { useState } from "react";
import { MAX_KCAL_TARGET, MIN_KCAL_TARGET, calorieTargetFor, parseKcalTarget } from "@/lib/calorie";
import { formatKcal } from "@/lib/meals";
import type { Data } from "@/lib/storage";

/** F-31 1日の目標カロリーを自分で決める（計算した目安をそのまま使うこともできる） */
export default function KcalTargetSection({
  data,
  today,
  onSave,
}: {
  data: Data;
  today: string;
  onSave: (kcalTarget: number | null) => void;
}) {
  // null = まだ触っていない（保存済みの目標を初期値として表示する）
  const [input, setInput] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const value = input ?? (data.kcalTarget !== null ? String(data.kcalTarget) : "");
  const calculated = calorieTargetFor(data, today);

  function save(kcal: number) {
    onSave(kcal);
    setInput(null);
    setMessage({ ok: true, text: `1日の目標を ${formatKcal(kcal)} にしました` });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const kcal = parseKcalTarget(value);
    if (kcal === null) {
      setMessage({ ok: false, text: `${MIN_KCAL_TARGET}〜${MAX_KCAL_TARGET}kcal の数字で入力してください` });
      return;
    }
    save(kcal);
  }

  function handleClear() {
    onSave(null);
    setInput(null);
    setMessage({ ok: true, text: "1日の目標カロリーを解除しました" });
  }

  return (
    <section className="card space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="kcal-target" className="block text-sm font-medium">
          🎯 1日の目標カロリー <span className="font-normal text-muted">（任意）</span>
        </label>
        {data.kcalTarget !== null && (
          <p className="font-bold">
            今の目標：<span className="text-2xl font-extrabold text-sakura-600 dark:text-sakura-300">{formatKcal(data.kcalTarget)}</span>
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            id="kcal-target"
            type="number"
            inputMode="numeric"
            min={MIN_KCAL_TARGET}
            max={MAX_KCAL_TARGET}
            step={10}
            placeholder="例：1800"
            value={value}
            onChange={(e) => setInput(e.target.value)}
            className="input-soft min-w-0 flex-1 text-lg font-bold"
          />
          <span className="text-sm">kcal</span>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1 py-2">
            {data.kcalTarget !== null ? "変更する" : "保存する"}
          </button>
          {data.kcalTarget !== null && (
            <button type="button" onClick={handleClear} className="btn-soft px-4 py-2 text-sm">
              解除
            </button>
          )}
        </div>
        {calculated.kind === "ok" && calculated.target.target !== data.kcalTarget && (
          <button
            type="button"
            onClick={() => save(calculated.target.target)}
            className="btn-soft w-full py-2 text-sm font-bold"
          >
            🧮 計算した目安（{formatKcal(calculated.target.target)}）を使う
          </button>
        )}
        {message && (
          <p
            role="status"
            className={message.ok ? "text-sm font-bold text-mint-700 dark:text-mint-300" : "text-sm font-bold text-sakura-700 dark:text-sakura-300"}
          >
            {message.text}
          </p>
        )}
        <p className="text-xs text-muted">ホームに、今日食べたカロリーと目標の差が表示されます。</p>
      </form>
    </section>
  );
}
