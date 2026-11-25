import { formatShortDate } from "@/lib/date";
import { MEAL_KEYS, MEAL_LABELS, formatKcal, mealsOf, totalKcal } from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";
import { formatKg } from "@/lib/weight";

/** F-24 日ごとの体重の変化と食事を並べた一覧（新しい順） */
export default function MealWeightTable({ records }: { records: WeightRecord[] }) {
  // records は古い順。前の記録との差を出してから新しい順に並べ替える
  const rows = records
    .map((r, i) => {
      const prev = records[i - 1];
      const diff = prev ? Math.round((r.weight - prev.weight) * 10) / 10 : null;
      const meals = mealsOf(r);
      const mealText = [
        ...MEAL_KEYS.filter((k) => meals[k]).map((k) => `${MEAL_LABELS[k]}：${meals[k]}`),
        ...(r.meal ? [r.meal] : []),
      ].join("　");
      return { record: r, diff, kcal: totalKcal(r), mealText };
    })
    .reverse();

  return (
    <ul className="divide-y divide-[var(--card-border)]">
      {rows.map(({ record, diff, kcal, mealText }) => (
        <li key={record.date} className="py-3 text-sm">
          <div className="flex items-baseline gap-3">
            <span className="w-12 shrink-0 text-muted">{formatShortDate(record.date)}</span>
            <span className="font-bold">{formatKg(record.weight)}</span>
            {diff !== null && (
              <span
                className={
                  diff > 0
                    ? "font-bold text-sakura-700 dark:text-sakura-300"
                    : diff < 0
                      ? "font-bold text-mint-700 dark:text-mint-300"
                      : "text-muted"
                }
              >
                {diff > 0 ? `+${diff.toFixed(1)}` : diff < 0 ? `−${(-diff).toFixed(1)}` : "±0.0"}
              </span>
            )}
            {kcal !== null && <span className="ml-auto rounded-full bg-mint-100 px-2 py-0.5 text-xs font-bold text-mint-800 dark:bg-[#1f3330] dark:text-mint-200">{formatKcal(kcal)}</span>}
          </div>
          {mealText && <p className="mt-1 ml-15 break-words text-xs text-muted">{mealText}</p>}
        </li>
      ))}
    </ul>
  );
}
