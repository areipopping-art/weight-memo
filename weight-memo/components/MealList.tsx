import { formatNutrients } from "@/lib/foods";
import { MEAL_EMOJI, MEAL_KEYS, MEAL_LABELS, formatKcal, mealsOf, totalNutrients } from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";

/**
 * F-13 記録の食事を区分ごとに表示する（以前の1行メモは「メモ」として表示）。F-14 区分ごとのカロリーも出す。
 * F-30 1日のたんぱく質・脂質・糖質の合計も出す
 */
export default function MealList({ record, showKcal = true }: { record: WeightRecord; showKcal?: boolean }) {
  const meals = mealsOf(record);
  const rows = MEAL_KEYS.filter((k) => meals[k] || record.kcal?.[k] != null).map((k) => ({
    label: `${MEAL_EMOJI[k]} ${MEAL_LABELS[k]}`,
    text: meals[k],
    kcal: record.kcal?.[k] ?? null,
  }));
  if (record.meal) rows.push({ label: "📝 メモ", text: record.meal, kcal: null });
  const nutrients = showKcal ? totalNutrients(record) : null;
  if (rows.length === 0) return null;

  return (
    <dl className="mt-1 space-y-0.5 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-2">
          <dt className="w-14 shrink-0 text-xs leading-5 text-muted">{row.label}</dt>
          <dd className="min-w-0 flex-1 break-words">{row.text}</dd>
          {showKcal && row.kcal !== null && <dd className="shrink-0 text-xs leading-5 text-muted">{formatKcal(row.kcal)}</dd>}
        </div>
      ))}
      {nutrients && (
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 text-xs leading-5 text-muted">🥩 栄養</dt>
          <dd className="min-w-0 flex-1 text-xs leading-5 text-muted">{formatNutrients(nutrients)}</dd>
        </div>
      )}
    </dl>
  );
}
