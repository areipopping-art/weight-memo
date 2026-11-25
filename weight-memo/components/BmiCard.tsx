import Link from "next/link";
import type { Data } from "@/lib/storage";
import { bmiCategory, calcBmi, sortNewestFirst } from "@/lib/stats";

/** F-15 身長と最新の体重から BMI を表示する */
export default function BmiCard({ data }: { data: Data }) {
  const box = "card";

  if (data.height === null) {
    return (
      <p className={`${box} text-sm`}>
        <Link href="/settings" className="font-bold text-sakura-700 underline dark:text-sakura-300">
          設定で身長を登録
        </Link>
        すると、BMI が表示されます。
      </p>
    );
  }

  const latest = sortNewestFirst(data.records)[0];
  if (!latest) {
    return <p className={`${box} text-sm text-muted`}>体重を記録すると、BMI が表示されます。</p>;
  }

  const bmi = calcBmi(latest.weight, data.height);
  const goalBmi = data.goalWeight !== null ? calcBmi(data.goalWeight, data.height) : null;

  return (
    <div className={`${box} bg-mint-50 dark:bg-[#1f3330]`}>
      <p>
        <span aria-hidden>💪 </span>現在の BMI <span className="text-2xl font-extrabold text-mint-700 dark:text-mint-300">{bmi.toFixed(1)}</span>
        <span className="ml-2 text-sm text-muted">（{bmiCategory(bmi)}）</span>
      </p>
      {goalBmi !== null && (
        <p className="mt-1 text-xs text-muted">
          目標体重での BMI {goalBmi.toFixed(1)}（{bmiCategory(goalBmi)}）
        </p>
      )}
    </div>
  );
}
