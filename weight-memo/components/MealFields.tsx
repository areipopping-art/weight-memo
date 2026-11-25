"use client";

import { Fragment, useState } from "react";
import FoodCalculator from "@/components/FoodCalculator";
import {
  MAX_KCAL,
  MEAL_KEYS,
  MEAL_EMOJI,
  MEAL_LABELS,
  frequentMeals,
  type KcalInput,
  type MealKey,
  type Meals,
} from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";

const PLACEHOLDERS: Record<MealKey, string> = {
  breakfast: "例：パン、ヨーグルト",
  lunch: "例：そば",
  dinner: "例：鍋",
  snack: "例：チョコ2つ",
};

/** F-22 候補として出す数 */
const SUGGESTION_LIMIT = 5;
/** 食事メモの最大文字数 */
const MAX_MEAL_LENGTH = 100;

/**
 * F-13 朝・昼・夜・間食の入力欄、F-14 区分ごとのカロリー欄、
 * F-22 入力中の区分でよく食べるものを候補として表示、
 * F-29 食品を選んでカロリーを自動計算
 */
export default function MealFields({
  idPrefix,
  value,
  onChange,
  kcal,
  onKcalChange,
  records,
}: {
  idPrefix: string;
  value: Meals;
  onChange: (meals: Meals) => void;
  kcal: KcalInput;
  onKcalChange: (kcal: KcalInput) => void;
  records: WeightRecord[];
}) {
  // 候補を表示している区分（その行の入力欄にフォーカスがある間）
  const [active, setActive] = useState<MealKey | null>(null);
  // 食品からの計算パネルを開いている区分
  const [calculating, setCalculating] = useState<MealKey | null>(null);
  const input = "input-soft";

  /** 計算した食品をメモの末尾に足し、カロリーを今の値に足す。入れられなければエラーの文を返す */
  function applyFoods(key: MealKey, text: string, addKcal: number): string | null {
    const current = value[key].trim();
    const nextText = current === "" ? text : `${current}、${text}`;
    if (nextText.length > MAX_MEAL_LENGTH) return `食事メモが${MAX_MEAL_LENGTH}文字を超えるので入れられません`;
    const currentKcal = kcal[key].trim();
    const base = currentKcal === "" ? 0 : Number(currentKcal);
    if (!Number.isFinite(base) || base < 0) return "カロリー欄の数字を確かめてください";
    const nextKcal = Math.round(base + addKcal);
    if (nextKcal > MAX_KCAL) return `カロリーが ${MAX_KCAL}kcal を超えるので入れられません`;
    onChange({ ...value, [key]: nextText });
    onKcalChange({ ...kcal, [key]: String(nextKcal) });
    setCalculating(null);
    return null;
  }

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-sm font-medium">
        食事メモ・カロリー <span className="font-normal text-muted">（どちらも任意）</span>
      </legend>
      {MEAL_KEYS.map((key) => {
        const frequent = active === key ? frequentMeals(records, key, SUGGESTION_LIMIT + 1) : [];
        const current = frequent.find((s) => s.text === value[key].trim());
        const suggestions = frequent.filter((s) => s !== current).slice(0, SUGGESTION_LIMIT);
        // カロリー欄が空か、候補から入れたままの値なら、候補を選び直したときに差し替える
        const kcalReplaceable =
          kcal[key].trim() === "" || (current !== undefined && current.kcal !== null && kcal[key] === String(current.kcal));

        return (
          <Fragment key={key}>
            <div
              onFocus={() => setActive(key)}
              onBlur={(e) => {
                // 同じ行の中（候補のボタンなど）にフォーカスが移ったときは閉じない
                if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
              }}
            >
              <div className="flex items-center gap-2">
                <label
                  htmlFor={`${idPrefix}-${key}`}
                  className="w-14 shrink-0 text-sm font-bold"
                >
                  <span aria-hidden>{MEAL_EMOJI[key]} </span>
                  {MEAL_LABELS[key]}
                </label>
                <input
                  id={`${idPrefix}-${key}`}
                  type="text"
                  maxLength={MAX_MEAL_LENGTH}
                  placeholder={PLACEHOLDERS[key]}
                  autoComplete="off"
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

              {suggestions.length > 0 && (
                <div className="mt-1.5 ml-16 flex flex-wrap gap-1.5" aria-label={`${MEAL_LABELS[key]}のよく食べるもの`}>
                  {suggestions.map((s) => (
                    <button
                      key={s.text}
                      type="button"
                      // クリックで入力欄のフォーカスが外れて候補が消えないようにする
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onChange({ ...value, [key]: s.text });
                        // 前回のカロリーも入れる（自分で入力したカロリーは消さない）
                        if (kcalReplaceable) {
                          onKcalChange({ ...kcal, [key]: s.kcal !== null ? String(s.kcal) : "" });
                        }
                      }}
                      className="animate-pop-in rounded-full border border-sakura-200 bg-sakura-50 px-3 py-1 text-xs font-bold text-sakura-800 hover:bg-sakura-100 dark:border-sakura-800 dark:bg-[var(--tint-sakura)] dark:text-sakura-200"
                    >
                      {s.text}
                      {s.kcal !== null && <span className="ml-1 font-normal text-sakura-600 dark:text-sakura-300">{s.kcal}kcal</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {calculating === key ? (
              <FoodCalculator
                idPrefix={`${idPrefix}-${key}-food`}
                mealLabel={MEAL_LABELS[key]}
                onApply={(text, total) => applyFoods(key, text, total)}
                onClose={() => setCalculating(null)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setCalculating(key)}
                className="-mt-1 ml-16 text-xs font-bold text-sakura-600 hover:underline dark:text-sakura-300"
              >
                🔍 食品から計算
              </button>
            )}
          </Fragment>
        );
      })}
    </fieldset>
  );
}
