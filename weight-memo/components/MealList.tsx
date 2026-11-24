import { MEAL_KEYS, MEAL_LABELS, mealsOf } from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";

/** F-13 記録の食事を区分ごとに表示する（以前の1行メモは「メモ」として表示） */
export default function MealList({ record }: { record: WeightRecord }) {
  const meals = mealsOf(record);
  const rows = MEAL_KEYS.filter((k) => meals[k]).map((k) => ({ label: MEAL_LABELS[k], text: meals[k] }));
  if (record.meal) rows.push({ label: "メモ", text: record.meal });
  if (rows.length === 0) return null;

  return (
    <dl className="mt-1 space-y-0.5 text-sm text-neutral-600 dark:text-neutral-300">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-2">
          <dt className="w-8 shrink-0 text-xs leading-5 text-neutral-500">{row.label}</dt>
          <dd className="min-w-0 break-words">{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}
