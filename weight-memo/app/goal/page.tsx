"use client";

import Link from "next/link";
import { useState } from "react";
import BmiCard from "@/components/BmiCard";
import CalorieTargetCard from "@/components/CalorieTargetCard";
import DeadlineSection from "@/components/DeadlineSection";
import { todayString } from "@/lib/date";
import { showsDetail } from "@/lib/persona";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { MAX_WEIGHT, MIN_WEIGHT, formatKg, parseWeight } from "@/lib/weight";

export default function GoalPage() {
  const { data, setGoalWeight, setGoalDeadline } = useWeightMemo();
  // null = まだ触っていない（現在の目標を初期値として表示する）
  const [input, setInput] = useState<string | null>(null);
  const hasGoal = data?.goalWeight != null;
  const value = input ?? (hasGoal ? data.goalWeight!.toFixed(1) : "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const goal = parseWeight(value);
    if (goal === null) {
      setMessage({ ok: false, text: `${MIN_WEIGHT}〜${MAX_WEIGHT}kg の数字で入力してください` });
      return;
    }
    setGoalWeight(goal);
    setInput(null);
    setMessage({
      ok: true,
      text: hasGoal ? `目標体重を ${formatKg(goal)} に変更しました` : `目標体重を ${formatKg(goal)} に設定しました`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-sakura-700 dark:text-sakura-300">🎯 目標設定</h1>
        <Link href="/goal/achievements" className="rounded-full bg-lavender-100 px-3 py-1.5 text-sm font-bold text-lavender-800 hover:bg-lavender-200 dark:bg-[var(--tint-lavender)] dark:text-lavender-200">
          🏆 達成記録
        </Link>
      </div>

      {hasGoal && (
        <p className="card bg-gradient-to-br from-sakura-50 to-white font-bold dark:from-[var(--tint-sakura)] dark:to-[var(--card)]">
          <span aria-hidden>🌸 </span>現在の目標：<span className="text-2xl font-extrabold text-sakura-600 dark:text-sakura-300">{formatKg(data.goalWeight!)}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 card">
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
          value={value}
          onChange={(e) => setInput(e.target.value)}
          className="input-soft w-full text-lg font-bold"
        />
        <button
          type="submit"
          className="w-full btn-primary py-2"
        >
          {hasGoal ? "変更する" : "保存する"}
        </button>
        {message && (
          <p role="status" className={message.ok ? "text-sm font-bold text-mint-700 dark:text-mint-300" : "text-sm font-bold text-sakura-700 dark:text-sakura-300"}>
            {message.text}
          </p>
        )}
      </form>

      {/* 期限・BMI・目安カロリーは B しっかりモードだけ */}
      {data && showsDetail(data.persona) && (
        <>
          <DeadlineSection data={data} onSave={setGoalDeadline} />
          <BmiCard data={data} />
          <CalorieTargetCard data={data} today={todayString()} />
        </>
      )}
    </div>
  );
}
