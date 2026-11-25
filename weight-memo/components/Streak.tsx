import type { WeightRecord } from "@/lib/storage";
import { recordStreak } from "@/lib/stats";

/** F-11 何日連続で記録しているかを表示する */
export default function Streak({ records, today }: { records: WeightRecord[]; today: string }) {
  const streak = recordStreak(records, today);
  const recordedToday = records.some((r) => r.date === today);

  return (
    <div className="card bg-lemon-50 text-sm dark:bg-[var(--tint-lemon)]">
      <p className="text-xs font-bold text-muted">
        <span aria-hidden>🔥 </span>連続記録
      </p>
      {streak === 0 ? (
        <p className="mt-1 font-bold text-lemon-800 dark:text-lemon-200">今日記録すると 1日目！</p>
      ) : (
        <>
          <p className="mt-1 text-2xl font-extrabold text-lemon-800 dark:text-lemon-200">{streak}日</p>
          {!recordedToday && <p className="text-xs text-muted">今日記録すると {streak + 1}日</p>}
        </>
      )}
    </div>
  );
}
