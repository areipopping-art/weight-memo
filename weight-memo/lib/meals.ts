// F-13 食事の区分（朝・昼・夜・間食）

import { ZERO_NUTRIENTS, addNutrients, type Nutrients } from "./foods";

export const MEAL_KEYS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealKey = (typeof MEAL_KEYS)[number];
export type Meals = Record<MealKey, string>;

export const MEAL_LABELS: Record<MealKey, string> = {
  breakfast: "朝",
  lunch: "昼",
  dinner: "夜",
  snack: "間食",
};

/** 画面に出す絵文字 */
export const MEAL_EMOJI: Record<MealKey, string> = {
  breakfast: "🍞",
  lunch: "🍙",
  dinner: "🍲",
  snack: "🍪",
};

export const EMPTY_MEALS: Meals = { breakfast: "", lunch: "", dinner: "", snack: "" };

/** 区分ごとの食事（古い記録には meals がないので空にする） */
export function mealsOf(record: { meals?: Partial<Meals> }): Meals {
  return { ...EMPTY_MEALS, ...record.meals };
}

/** 前後の空白を取り除く */
export function trimMeals(meals: Meals): Meals {
  return {
    breakfast: meals.breakfast.trim(),
    lunch: meals.lunch.trim(),
    dinner: meals.dinner.trim(),
    snack: meals.snack.trim(),
  };
}

// F-14 カロリー（区分ごと、任意）

export type Kcal = Record<MealKey, number | null>;
/** 入力欄の文字列 */
export type KcalInput = Record<MealKey, string>;

export const MAX_KCAL = 5000;
export const EMPTY_KCAL_INPUT: KcalInput = { breakfast: "", lunch: "", dinner: "", snack: "" };

/** 入力欄の文字列をカロリーに変換。空欄は null、不正な値があれば全体が null */
export function parseKcal(input: KcalInput): Kcal | null {
  const result = {} as Kcal;
  for (const key of MEAL_KEYS) {
    const s = input[key].trim();
    if (s === "") {
      result[key] = null;
      continue;
    }
    const n = Number(s);
    if (!Number.isFinite(n) || n < 0 || n > MAX_KCAL) return null;
    result[key] = Math.round(n);
  }
  return result;
}

/** 保存済みの記録から入力欄の初期値を作る */
export function kcalInputOf(record: { kcal?: Partial<Kcal> }): KcalInput {
  const input = { ...EMPTY_KCAL_INPUT };
  for (const key of MEAL_KEYS) {
    const v = record.kcal?.[key];
    if (typeof v === "number") input[key] = String(v);
  }
  return input;
}

/** 1日の合計（どの区分も未入力なら null） */
export function totalKcal(record: { kcal?: Partial<Kcal> }): number | null {
  const values = MEAL_KEYS.map((k) => record.kcal?.[k]).filter((v): v is number => typeof v === "number");
  return values.length === 0 ? null : values.reduce((a, b) => a + b, 0);
}

export function formatKcal(n: number): string {
  return `${n.toLocaleString("ja-JP")}kcal`;
}

// F-30 区分ごとのたんぱく質・脂質・糖質（「食品から計算」した分だけ。未計算は null）

export type MealNutrients = Record<MealKey, Nutrients | null>;
export const EMPTY_MEAL_NUTRIENTS: MealNutrients = { breakfast: null, lunch: null, dinner: null, snack: null };

/** 保存済みの記録の区分ごとの栄養素（古い記録にはないので空にする） */
export function mealNutrientsOf(record: { nutrients?: Partial<MealNutrients> }): MealNutrients {
  return { ...EMPTY_MEAL_NUTRIENTS, ...record.nutrients };
}

/** 1日の栄養素の合計（どの区分も未計算なら null） */
export function totalNutrients(record: { nutrients?: Partial<MealNutrients> }): Nutrients | null {
  const values = MEAL_KEYS.map((k) => record.nutrients?.[k]).filter((v): v is Nutrients => v != null);
  return values.length === 0 ? null : values.reduce(addNutrients, ZERO_NUTRIENTS);
}

// F-22 よく食べるもの

export type FrequentMeal = { text: string; count: number; kcal: number | null };

/**
 * 区分ごとに、過去に入力した食事を回数の多い順に返す（同じ回数なら最近食べた順）。
 * kcal は同じ食事を最後に記録したときのカロリー。
 */
export function frequentMeals(
  records: { date: string; meals?: Partial<Meals>; kcal?: Partial<Kcal> }[],
  key: MealKey,
  limit: number,
): FrequentMeal[] {
  const map = new Map<string, FrequentMeal & { lastDate: string }>();
  for (const r of records) {
    const text = r.meals?.[key]?.trim();
    if (!text) continue;
    const kcal = r.kcal?.[key] ?? null;
    const item = map.get(text);
    if (!item) {
      map.set(text, { text, count: 1, kcal, lastDate: r.date });
      continue;
    }
    item.count++;
    if (r.date > item.lastDate) {
      item.lastDate = r.date;
      item.kcal = kcal;
    }
  }
  return [...map.values()]
    .sort((a, b) => b.count - a.count || b.lastDate.localeCompare(a.lastDate))
    .slice(0, limit)
    .map(({ text, count, kcal }) => ({ text, count, kcal }));
}

/** A モードのひとことメモ（F-04）を、書いた回数の多い順に返す（同じ回数なら最近の順） */
export function frequentMemos(records: { date: string; meal: string }[], limit: number): string[] {
  const map = new Map<string, { count: number; lastDate: string }>();
  for (const r of records) {
    const text = r.meal.trim();
    if (!text) continue;
    const item = map.get(text);
    if (!item) map.set(text, { count: 1, lastDate: r.date });
    else {
      item.count++;
      if (r.date > item.lastDate) item.lastDate = r.date;
    }
  }
  return [...map.entries()]
    .sort(([, a], [, b]) => b.count - a.count || b.lastDate.localeCompare(a.lastDate))
    .slice(0, limit)
    .map(([text]) => text);
}
