import Link from "next/link";
import { DEFAULT_PER_WEEK_KG, calcCalorieTarget } from "@/lib/calorie";
import { formatKcal } from "@/lib/meals";
import type { Data } from "@/lib/storage";
import { goalPace, sortNewestFirst } from "@/lib/stats";

/** F-20 身長・体重・目標から1日の目安カロリーを表示する */
export default function CalorieTargetCard({ data, today }: { data: Data; today: string }) {
  const box = "card";
  const latest = sortNewestFirst(data.records)[0];
  const { height, age, sex, activity, goalWeight } = data;

  if (height === null || age === null || sex === null || activity === null) {
    return (
      <p className={`${box} text-sm`}>
        <Link href="/settings" className="font-bold text-sakura-700 underline dark:text-sakura-300">
          設定で身長・年齢・性別・活動量を登録
        </Link>
        すると、1日の目安カロリーが表示されます。
      </p>
    );
  }
  if (!latest) {
    return <p className={`${box} text-sm text-muted`}>体重を記録すると、1日の目安カロリーが表示されます。</p>;
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
    <div className={`${box} bg-lemon-50 dark:bg-[var(--tint-lemon)]`}>
      <p>
        <span aria-hidden>🍽️ </span>1日の目安{" "}
        <span className="text-2xl font-extrabold text-lemon-800 dark:text-lemon-200">{formatKcal(t.target)}</span>
      </p>
      <p className="mt-1 text-xs text-muted">{paceNote}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-lemon-200 pt-3 dark:border-[var(--tint-lemon-line)] text-center text-xs ">
        <div>
          <dt className="text-muted">基礎代謝</dt>
          <dd className="font-bold">{formatKcal(t.bmr)}</dd>
        </div>
        <div>
          <dt className="text-muted">消費量の目安</dt>
          <dd className="font-bold">{formatKcal(t.tdee)}</dd>
        </div>
        <div>
          <dt className="text-muted">減らす分</dt>
          <dd className="font-bold">{cut > 0 ? `−${formatKcal(cut)}` : "なし"}</dd>
        </div>
      </dl>
      {t.cappedAtBmr && (
        <p className="mt-2 text-xs text-lemon-800 dark:text-lemon-200">
          基礎代謝より少なくなるため、基礎代謝の量にしています。期限を延ばすことも考えてみましょう。
        </p>
      )}
      <p className="mt-2 text-xs text-muted">※ 計算による目安です。持病のある方は医師に相談してください。</p>
    </div>
  );
}
