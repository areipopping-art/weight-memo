import Link from "next/link";
import type { Data } from "@/lib/storage";
import { formatKg } from "@/lib/weight";

/** F-06 最新の体重と目標体重の差を表示する */
export default function GoalProgress({ data }: { data: Data }) {
  const box = "rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800";

  if (data.goalWeight === null) {
    return (
      <p className={`${box} text-sm`}>
        <Link href="/goal" className="font-bold text-emerald-700 underline dark:text-emerald-400">
          目標体重を設定
        </Link>
        すると、目標までの残りが表示されます。
      </p>
    );
  }

  const latest = [...data.records].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) {
    return <p className={`${box} text-sm text-neutral-500`}>体重を記録すると、目標まであと何kgかが表示されます。</p>;
  }

  const remaining = Math.round((latest.weight - data.goalWeight) * 10) / 10;

  return (
    <div className={box}>
      {remaining > 0 ? (
        <p>
          目標まであと <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{formatKg(remaining)}</span>
        </p>
      ) : (
        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">目標達成！🎉</p>
      )}
      <p className="mt-1 text-xs text-neutral-500">
        最新 {formatKg(latest.weight)} ／ 目標 {formatKg(data.goalWeight)}
      </p>
    </div>
  );
}
