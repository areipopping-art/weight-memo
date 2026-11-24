import Link from "next/link";
import { DEFAULT_PER_WEEK_KG, calcCalorieTarget } from "@/lib/calorie";
import { formatKcal } from "@/lib/meals";
import type { Data } from "@/lib/storage";
import { goalPace, sortNewestFirst } from "@/lib/stats";

/** F-20 身長・体重・目標から1日の目安カロリーを表示する */
export default function CalorieTargetCard({ data, today }: { data: Data; today: string }) {
  const box = "rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800";
  const latest = sortNewestFirst(data.records)[0];
  const { height, age, sex, activity, goalWeight } = data;

  if (height === null || age === null || sex === null || activity === null) {
    return (
      <p className={`${box} text-sm`}>
        <Link href="/settings" className="font-bold text-emerald-700 underline dark:text-emerald-400">
          設定で身長・年齢・性別・活動量を登録
        </Link>
        すると、1日の目安カロリーが表示されます。
      </p>
    );
  }
  if (!latest) {
    return <p className={`${box} text-sm text-neutral-500`}>体重を記録すると、1日の目安カロリーが表示されます。</p>;
  }

  // 減らすペース：目標達成済み・目標なしなら 0（体重を保つ）、期限があればそのペース、なければ週 0.5kg
  let perWeekKg = 0;
  let paceNote = "体重を保つ目安";
  if (goalWeight !== null && latest.weight > goalWeight) {
    const pace = data.goalDeadline ? goalPace(latest.weight, goalWeight, data.goalDeadline, today) : null;
    if (pace?.kind === "pace") {
      perWeekKg = pace.perWeekKg;
      paceNote = `期限までのペース（週 ${perWeekKg.toFixed(2)}kg）`;
    } else {
      perWeekKg = DEFAULT_PER_WEEK_KG;
      paceNote = `無理のないペース（週 ${DEFAULT_PER_WEEK_KG}kg）`;
    }
  }

  const t = calcCalorieTarget({ weightKg: latest.weight, heightCm: height, age, sex, activity, perWeekKg });
  // 実際に減らす分（基礎代謝で止めたときは計算上の分より少ない）
  const cut = t.tdee - t.target;

  return (
    <div className={box}>
      <p>
        1日の目安{" "}
        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatKcal(t.target)}</span>
      </p>
      <p className="mt-1 text-xs text-neutral-500">{paceNote}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-neutral-200 pt-3 text-center text-xs dark:border-neutral-700">
        <div>
          <dt className="text-neutral-500">基礎代謝</dt>
          <dd className="font-bold">{formatKcal(t.bmr)}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">消費量の目安</dt>
          <dd className="font-bold">{formatKcal(t.tdee)}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">減らす分</dt>
          <dd className="font-bold">{cut > 0 ? `−${formatKcal(cut)}` : "なし"}</dd>
        </div>
      </dl>
      {t.cappedAtBmr && (
        <p className="mt-2 text-xs text-orange-700 dark:text-orange-400">
          基礎代謝より少なくなるため、基礎代謝の量にしています。期限を延ばすことも考えてみましょう。
        </p>
      )}
      <p className="mt-2 text-xs text-neutral-500">※ 計算による目安です。持病のある方は医師に相談してください。</p>
    </div>
  );
}
