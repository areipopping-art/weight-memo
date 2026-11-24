// F-20 目標カロリーの自動計算

export type Sex = "male" | "female";
export type Activity = "low" | "normal" | "high";

export type Profile = {
  age: number | null;
  sex: Sex | null;
  activity: Activity | null;
};

export const MIN_AGE = 15;
export const MAX_AGE = 100;

export const SEX_LABELS: Record<Sex, string> = { male: "男性", female: "女性" };

/** 活動量と係数（厚生労働省「日本人の食事摂取基準」の身体活動レベル I・II・III） */
export const ACTIVITIES: { key: Activity; label: string; hint: string; factor: number }[] = [
  { key: "low", label: "低い", hint: "座っていることが多い", factor: 1.5 },
  { key: "normal", label: "ふつう", hint: "立ち仕事・通勤や家事で歩く", factor: 1.75 },
  { key: "high", label: "高い", hint: "体を動かす仕事・運動の習慣がある", factor: 2.0 },
];

/** 体脂肪 1kg を減らすのに必要なカロリーの目安 */
export const KCAL_PER_KG = 7200;
/** 期限が決まっていないときの減量ペース（1週間あたり） */
export const DEFAULT_PER_WEEK_KG = 0.5;

/** 年齢を整数に変換。不正なら null */
export function parseAge(input: string): number | null {
  const n = Number(input);
  if (input.trim() === "" || !Number.isInteger(n) || n < MIN_AGE || n > MAX_AGE) return null;
  return n;
}

/** 基礎代謝（Mifflin-St Jeor 式） */
export function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

export type CalorieTarget = {
  bmr: number; // 基礎代謝
  tdee: number; // 1日の消費量の目安
  perWeekKg: number; // 減らすペース（達成済みなら 0）
  deficit: number; // 1日に減らす分
  target: number; // 1日の目安
  cappedAtBmr: boolean; // 基礎代謝を下回るため基礎代謝で止めた
};

/** 10kcal 単位に丸める */
const round10 = (n: number) => Math.round(n / 10) * 10;

/**
 * 1日の目安カロリー = 消費量 −（1週間に減らす kg × 7200 ÷ 7）。基礎代謝より下にはしない。
 * perWeekKg は 0 なら体重を保つ目安になる。
 */
export function calcCalorieTarget(input: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activity: Activity;
  perWeekKg: number;
}): CalorieTarget {
  const bmr = calcBmr(input.weightKg, input.heightCm, input.age, input.sex);
  const factor = ACTIVITIES.find((a) => a.key === input.activity)!.factor;
  const tdee = bmr * factor;
  const deficit = (input.perWeekKg * KCAL_PER_KG) / 7;
  const raw = tdee - deficit;
  return {
    bmr: round10(bmr),
    tdee: round10(tdee),
    perWeekKg: input.perWeekKg,
    deficit: round10(deficit),
    target: round10(Math.max(raw, bmr)),
    cappedAtBmr: raw < bmr,
  };
}
