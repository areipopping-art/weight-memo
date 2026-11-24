import type { WeightRecord } from "@/lib/storage";
import { recordStreak } from "@/lib/stats";

/** F-11 何日連続で記録しているかを表示する */
export default function Streak({ records, today }: { records: WeightRecord[]; today: string }) {
  const streak = recordStreak(records, today);
  const recordedToday = records.some((r) => r.date === today);

  return (
    <p className="rounded-lg bg-white p-4 text-sm shadow-sm dark:bg-neutral-800">
      {streak === 0 ? (
        "今日記録すると 1日目 です"
      ) : (
        <>
          <span aria-hidden>🔥 </span>
          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{streak}日</span> 連続で記録中
          {!recordedToday && <span className="ml-1 text-neutral-500">（今日記録すると {streak + 1}日）</span>}
        </>
      )}
    </p>
  );
}
