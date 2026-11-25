import Link from "next/link";
import type { Data } from "@/lib/storage";
import { sortNewestFirst } from "@/lib/stats";
import { formatKg } from "@/lib/weight";

/** F-06 最新の体重と目標体重の差を表示する（スタートからの進み具合のバーつき） */
export default function GoalProgress({ data }: { data: Data }) {
  if (data.goalWeight === null) {
    return (
      <p className="card text-sm">
        <span aria-hidden>🎯 </span>
        <Link href="/goal" className="font-bold text-sakura-700 underline dark:text-sakura-300">
          目標体重を設定
        </Link>
        すると、目標までの残りが表示されます。
      </p>
    );
  }

  const records = sortNewestFirst(data.records);
  const latest = records[0];
  if (!latest) {
    return (
      <p className="card text-sm text-muted">
        <span aria-hidden>🎯 </span>体重を記録すると、目標まであと何kgかが表示されます。
      </p>
    );
  }

  const remaining = Math.round((latest.weight - data.goalWeight) * 10) / 10;
  // スタート：目標を決めたときの体重（無ければいちばん古い記録）
  const start = data.goalStartWeight ?? records[records.length - 1].weight;
  const total = start - data.goalWeight;
  const progress = remaining <= 0 ? 1 : total > 0 ? Math.min(1, Math.max(0, (start - latest.weight) / total)) : 0;

  return (
    <div className="card bg-gradient-to-br from-sakura-50 to-white dark:from-[#3a2733] dark:to-[var(--card)]">
      {remaining > 0 ? (
        <p className="font-bold">
          <span aria-hidden>🎯 </span>目標まであと{" "}
          <span className="text-3xl font-extrabold text-sakura-600 dark:text-sakura-300">{formatKg(remaining)}</span>
        </p>
      ) : (
        <p className="text-xl font-extrabold text-sakura-600 dark:text-sakura-300">目標達成！🎉</p>
      )}

      {/* 進み具合のバー */}
      <div
        role="progressbar"
        aria-label="目標までの進み具合"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-3 h-3 overflow-hidden rounded-full bg-sakura-100 dark:bg-[#4a3542]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sakura-300 to-sakura-500 transition-[width] duration-700"
          style={{ width: `${Math.max(progress * 100, 4)}%` }}
        />
      </div>
      <p className="mt-1.5 flex justify-between text-xs text-muted">
        <span>スタート {formatKg(start)}</span>
        <span>
          いま {formatKg(latest.weight)} ／ 目標 {formatKg(data.goalWeight)}
        </span>
      </p>
    </div>
  );
}
