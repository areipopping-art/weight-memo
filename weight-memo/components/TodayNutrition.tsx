import Link from "next/link";
import { NUTRIENT_LABELS } from "@/lib/foods";
import { formatKcal, totalKcal, totalNutrients } from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";

/** F-31 今日食べたカロリーと1日の目標、F-30 今日のたんぱく質・脂質・糖質の合計 */
export default function TodayNutrition({
  record,
  kcalTarget,
}: {
  record: WeightRecord | undefined;
  kcalTarget: number | null;
}) {
  const eaten = record ? (totalKcal(record) ?? 0) : 0;
  const nutrients = record ? totalNutrients(record) : null;

  return (
    <section className="card space-y-3" aria-label="今日の食事">
      <h2 className="text-sm font-extrabold text-sakura-700 dark:text-sakura-300">🍽️ 今日の食事</h2>

      {kcalTarget !== null ? (
        <KcalProgress eaten={eaten} target={kcalTarget} />
      ) : (
        <p className="text-sm">
          今日 <span className="text-xl font-extrabold">{formatKcal(eaten)}</span>
          <Link href="/goal" className="ml-2 text-xs font-bold text-sakura-700 underline dark:text-sakura-300">
            1日の目標カロリーを決める
          </Link>
        </p>
      )}

      {nutrients ? (
        <dl className="grid grid-cols-3 gap-2 border-t border-sakura-100 pt-3 text-center dark:border-sakura-900">
          {NUTRIENT_LABELS.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="font-extrabold">
                {nutrients[key].toFixed(1)}
                <span className="ml-0.5 text-xs font-normal">g</span>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-xs text-muted">🔍「食品から計算」で記録すると、たんぱく質・脂質・糖質の合計が出ます</p>
      )}
    </section>
  );
}

function KcalProgress({ eaten, target }: { eaten: number; target: number }) {
  const rest = target - eaten;
  const over = rest < 0;
  const percent = Math.min(100, Math.round((eaten / target) * 100));

  return (
    <div className="space-y-1.5">
      <p className="flex items-baseline justify-between gap-2">
        <span>
          <span className="text-2xl font-extrabold">{eaten.toLocaleString("ja-JP")}</span>
          <span className="text-sm text-muted"> / {formatKcal(target)}</span>
        </span>
        <span className={`text-sm font-bold ${over ? "text-lemon-800 dark:text-lemon-200" : "text-mint-700 dark:text-mint-300"}`}>
          {over ? `目標を ${formatKcal(-rest)} オーバー` : `あと ${formatKcal(rest)}`}
        </span>
      </p>
      <div
        className="h-3 overflow-hidden rounded-full bg-sakura-100 dark:bg-[var(--tint-sakura-strong)]"
        role="progressbar"
        aria-label="今日のカロリー"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={eaten}
      >
        <div className={`h-full rounded-full ${over ? "bg-lemon-500" : "bg-sakura-400"}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
