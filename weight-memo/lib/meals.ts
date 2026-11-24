// F-13 食事の区分（朝・昼・夜・間食）

export const MEAL_KEYS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealKey = (typeof MEAL_KEYS)[number];
export type Meals = Record<MealKey, string>;

export const MEAL_LABELS: Record<MealKey, string> = {
  breakfast: "朝",
  lunch: "昼",
  dinner: "夜",
  snack: "間食",
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
