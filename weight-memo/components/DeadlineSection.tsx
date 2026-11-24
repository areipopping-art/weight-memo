"use client";

import { useState } from "react";
import { addDays, formatShortDate, todayString } from "@/lib/date";
import type { Data } from "@/lib/storage";
import { goalPace, sortNewestFirst } from "@/lib/stats";
import { formatKg } from "@/lib/weight";

/** 無理のない減量ペースの目安（1週間あたり） */
const SAFE_PER_WEEK_KG = 1;

/** F-16 目標の期限の入力と、1週間あたりの目安の表示 */
export default function DeadlineSection({
  data,
  onSave,
}: {
  data: Data;
  onSave: (deadline: string | null) => void;
}) {
  // null = まだ触っていない（保存済みの期限を初期値として表示する）
  const [input, setInput] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const today = todayString();
  const value = input ?? data.goalDeadline ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value) return;
    onSave(value);
    setInput(null);
    setMessage(`期限を ${formatShortDate(value)} にしました`);
  }

  function handleClear() {
    onSave(null);
    setInput(null);
    setMessage("期限を解除しました");
  }

  return (
    <section className="space-y-3 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="deadline" className="block text-sm font-medium">
          目標の期限 <span className="font-normal text-neutral-500">（任意）</span>
        </label>
        <input
          id="deadline"
          type="date"
          min={addDays(today, 1)}
          value={value}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!value}
            className="flex-1 rounded-md bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            期限を保存
          </button>
          {data.goalDeadline && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-600"
            >
              解除
            </button>
          )}
        </div>
        {message && (
          <p role="status" className="text-sm text-emerald-700">
            {message}
          </p>
        )}
      </form>

      <PaceText data={data} today={today} />
    </section>
  );
}

function PaceText({ data, today }: { data: Data; today: string }) {
  const latest = sortNewestFirst(data.records)[0];
  const hint = "text-sm text-neutral-500";

  if (!data.goalDeadline) return <p className={hint}>期限を入れると「1週間あたり何kg」の目安が出ます。</p>;
  if (data.goalWeight === null) return <p className={hint}>目標体重を設定すると、目安が表示されます。</p>;
  if (!latest) return <p className={hint}>体重を記録すると、目安が表示されます。</p>;

  const pace = goalPace(latest.weight, data.goalWeight, data.goalDeadline, today);

  if (pace.kind === "achieved") {
    return <p className="font-bold text-emerald-700 dark:text-emerald-400">目標を達成しています 🎉</p>;
  }
  if (pace.kind === "overdue") {
    return (
      <p className="text-sm text-red-600">
        期限（{formatShortDate(data.goalDeadline)}）を過ぎました。目標まであと {formatKg(pace.remainingKg)}。新しい期限を決めましょう。
      </p>
    );
  }
  return (
    <div className="border-t border-neutral-200 pt-3 dark:border-neutral-700">
      <p>
        1週間あたり{" "}
        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{pace.perWeekKg.toFixed(2)}kg</span>{" "}
        のペース
      </p>
      <p className="mt-1 text-xs text-neutral-500">
        期限まであと {pace.daysLeft}日 ／ 目標まであと {formatKg(pace.remainingKg)}
      </p>
      {pace.perWeekKg > SAFE_PER_WEEK_KG && (
        <p className="mt-2 text-xs text-orange-700 dark:text-orange-400">
          無理のないペースは1週間に {SAFE_PER_WEEK_KG}kg までが目安です。期限を延ばすことも考えてみましょう。
        </p>
      )}
    </div>
  );
}
