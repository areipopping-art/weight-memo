import { MAX_KCAL, MEAL_KEYS, MEAL_LABELS, type KcalInput, type MealKey, type Meals } from "@/lib/meals";

const PLACEHOLDERS: Record<MealKey, string> = {
  breakfast: "例：パン、ヨーグルト",
  lunch: "例：そば",
  dinner: "例：鍋",
  snack: "例：チョコ2つ",
};

/** F-13 朝・昼・夜・間食の入力欄、F-14 区分ごとのカロリー欄 */
export default function MealFields({
  idPrefix,
  value,
  onChange,
  kcal,
  onKcalChange,
}: {
  idPrefix: string;
  value: Meals;
  onChange: (meals: Meals) => void;
  kcal: KcalInput;
  onKcalChange: (kcal: KcalInput) => void;
}) {
  const input = "rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900";

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-sm font-medium">
        食事メモ・カロリー <span className="font-normal text-neutral-500">（どちらも任意）</span>
      </legend>
      {MEAL_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-2">
          <label htmlFor={`${idPrefix}-${key}`} className="w-10 shrink-0 text-sm text-neutral-600 dark:text-neutral-300">
            {MEAL_LABELS[key]}
          </label>
          <input
            id={`${idPrefix}-${key}`}
            type="text"
            maxLength={100}
            placeholder={PLACEHOLDERS[key]}
            value={value[key]}
            onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            className={`${input} min-w-0 flex-1`}
          />
          <input
            id={`${idPrefix}-${key}-kcal`}
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_KCAL}
            step={1}
            placeholder="kcal"
            aria-label={`${MEAL_LABELS[key]}のカロリー（kcal）`}
            value={kcal[key]}
            onChange={(e) => onKcalChange({ ...kcal, [key]: e.target.value })}
            className={`${input} w-20 shrink-0 text-right`}
          />
        </div>
      ))}
    </fieldset>
  );
}
