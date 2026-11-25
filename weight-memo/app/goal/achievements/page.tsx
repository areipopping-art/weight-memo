"use client";

import Link from "next/link";
import { useState } from "react";
import Mascot from "@/components/Mascot";
import { PROPOSAL_WEEKS, achievedPerWeek, proposeNextGoal } from "@/lib/achievements";
import { daysBetween, formatShortDate, todayString } from "@/lib/date";
import { sortNewestFirst } from "@/lib/stats";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { formatKg } from "@/lib/weight";

/** "2026-11-24" → "2026/11/24" */
function formatFullDate(date: string): string {
  return date.replaceAll("-", "/");
}

/** F-26 達成記録と、次の目標の提案 */
export default function AchievementsPage() {
  const { data, setGoalWeight } = useWeightMemo();
  const [message, setMessage] = useState<string | null>(null);

  const title = <h1 className="text-xl font-extrabold text-sakura-700 dark:text-sakura-300">🏆 達成記録</h1>;
  if (data === null) return title;

  const today = todayString();
  const achievements = [...data.achievements].reverse(); // 新しい順
  const latest = sortNewestFirst(data.records)[0];
  const box = "card";

  // 次の目標の提案：今の目標を達成している（または目標が無い）ときだけ
  const reached = latest && (data.goalWeight === null || latest.weight <= data.goalWeight);
  const proposal = reached ? proposeNextGoal(latest.weight, achievements[0], data.height, today) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {title}
        <Link href="/goal" className="text-sm text-sakura-700 underline dark:text-sakura-300">
          目標設定に戻る
        </Link>
      </div>

      <section className={`${box} bg-lavender-50 dark:bg-[#2f2845]`}>
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lavender-800 dark:text-lavender-200">✨ 次の目標の提案</h2>
          <Mascot mood={proposal?.kind === "goal" ? "cheer" : "happy"} size={56} className="-my-2" />
        </div>
        {!latest ? (
          <p className="mt-2 text-sm text-muted">体重を記録すると、次の目標を提案します。</p>
        ) : !proposal ? (
          <p className="mt-2 text-sm text-muted">
            今の目標（{formatKg(data.goalWeight!)}）を達成すると、次の目標を提案します。あと{" "}
            {formatKg(Math.round((latest.weight - data.goalWeight!) * 10) / 10)}！
          </p>
        ) : proposal.kind === "keep" ? (
          <p className="mt-2 text-sm">
            これ以上減らすと低体重（BMI 18.5 未満）になるため、今の体重 {formatKg(latest.weight)} を保つのがおすすめです。
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            <p>
              <span className="text-2xl font-extrabold text-lavender-700 dark:text-lavender-200">
                {formatKg(proposal.goalWeight)}
              </span>
              <span className="ml-2 text-sm">（{PROPOSAL_WEEKS}週間後の {formatShortDate(proposal.deadline)} まで）</span>
            </p>
            <p className="text-xs text-muted">
              {achievements[0] && achievedPerWeek(achievements[0]) !== null
                ? `前回の達成ペース（週 ${proposal.perWeekKg.toFixed(2)}kg）をもとにしています。`
                : `無理のないペース（週 ${proposal.perWeekKg}kg）をもとにしています。`}
              今の体重 {formatKg(latest.weight)} から {formatKg(Math.round((latest.weight - proposal.goalWeight) * 10) / 10)} 減らします。
            </p>
            <button
              type="button"
              onClick={() => {
                setGoalWeight(proposal.goalWeight, proposal.deadline);
                setMessage(`目標を ${formatKg(proposal.goalWeight)}（期限 ${formatShortDate(proposal.deadline)}）にしました`);
              }}
              className="w-full btn-primary py-2"
            >
              この目標にする
            </button>
          </div>
        )}
        {message && (
          <p role="status" className="mt-2 text-sm text-mint-700 dark:text-mint-300">
            {message}
          </p>
        )}
      </section>

      <section className={box}>
        <h2 className="font-extrabold">
          🎖️ これまでの達成 <span className="text-sm font-normal text-muted">{achievements.length}回</span>
        </h2>
        {achievements.length === 0 ? (
          <p className="mt-2 text-sm text-muted">目標を達成すると、ここに記録されます。</p>
        ) : (
          <ul className="mt-2 divide-y divide-[var(--card-border)]">
            {achievements.map((a) => {
              const pace = achievedPerWeek(a);
              const days = daysBetween(a.startDate, a.achievedDate);
              return (
                <li key={`${a.startDate}-${a.goalWeight}-${a.achievedDate}`} className="py-3">
                  <p>
                    <span aria-hidden>🏆 </span>
                    <span className="font-bold">{formatKg(a.goalWeight)}</span> を達成
                    <span className="ml-2 text-sm text-muted">{formatFullDate(a.achievedDate)}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatKg(a.startWeight)} → {formatKg(a.achievedWeight)}（{days}日間
                    {pace !== null && `・週 ${pace.toFixed(2)}kg ペース`}）
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted">※ この機能を追加する前の達成は記録されていません。</p>
      </section>
    </div>
  );
}
