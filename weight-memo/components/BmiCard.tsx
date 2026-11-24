import Link from "next/link";
import type { Data } from "@/lib/storage";
import { bmiCategory, calcBmi, sortNewestFirst } from "@/lib/stats";

/** F-15 身長と最新の体重から BMI を表示する */
export default function BmiCard({ data }: { data: Data }) {
  const box = "rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800";

  if (data.height === null) {
    return (
      <p className={`${box} text-sm`}>
        <Link href="/settings" className="font-bold text-emerald-700 underline dark:text-emerald-400">
          設定で身長を登録
        </Link>
        すると、BMI が表示されます。
      </p>
    );
  }

  const latest = sortNewestFirst(data.records)[0];
  if (!latest) {
    return <p className={`${box} text-sm text-neutral-500`}>体重を記録すると、BMI が表示されます。</p>;
  }

  const bmi = calcBmi(latest.weight, data.height);
  const goalBmi = data.goalWeight !== null ? calcBmi(data.goalWeight, data.height) : null;

  return (
    <div className={box}>
      <p>
        現在の BMI <span className="text-2xl font-bold">{bmi.toFixed(1)}</span>
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-300">（{bmiCategory(bmi)}）</span>
      </p>
      {goalBmi !== null && (
        <p className="mt-1 text-xs text-neutral-500">
          目標体重での BMI {goalBmi.toFixed(1)}（{bmiCategory(goalBmi)}）
        </p>
      )}
    </div>
  );
}
