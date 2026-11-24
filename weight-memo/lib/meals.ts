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
