// F-20 目標カロリーの自動計算

import type { Data } from "./storage";
import { goalPace, sortNewestFirst } from "./stats";

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

/** 最新の体重・目標・期限から減らすペースを決めて、1日の目安を計算する */
export type CalorieTargetResult =
  | { kind: "missingProfile" } // 身長・年齢・性別・活動量のどれかがない
  | { kind: "missingWeight" } // 体重の記録がない
  | { kind: "ok"; target: CalorieTarget; paceNote: string };

export function calorieTargetFor(data: Data, today: string): CalorieTargetResult {
  const { height, age, sex, activity, goalWeight } = data;
  if (height === null || age === null || sex === null || activity === null) return { kind: "missingProfile" };
  const latest = sortNewestFirst(data.records)[0];
  if (!latest) return { kind: "missingWeight" };

  // 減らすペース：目標達成済み・目標なしなら 0（体重を保つ）、期限があればそのペース、なければ週 0.5kg
  let perWeekKg = 0;
  let paceNote = "体重を保つ目安";
  if (goalWeight !== null && latest.weight > goalWeight) {
    const pace = data.goalDeadline ? goalPace(latest.weight, goalWeight, data.goalDeadline, today) : null;
    if (pace?.kind === "pace") {
      perWeekKg = pace.perWeekKg;
      paceNote = `期限までのペース（週 ${perWeekKg.toFixed(2)}kg）`;
    } else {
      perWeekKg = DEFAULT_PER_WEEK_KG;
      paceNote = `無理のないペース（週 ${DEFAULT_PER_WEEK_KG}kg）`;
    }
  }
  const target = calcCalorieTarget({ weightKg: latest.weight, heightCm: height, age, sex, activity, perWeekKg });
  return { kind: "ok", target, paceNote };
}

// F-31 自分で決める1日の目標カロリー

export const MIN_KCAL_TARGET = 800;
export const MAX_KCAL_TARGET = 5000;

/** 目標カロリーの入力を整数に変換。範囲外・数字でなければ null */
export function parseKcalTarget(input: string): number | null {
  const s = input.trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < MIN_KCAL_TARGET || n > MAX_KCAL_TARGET) return null;
  return Math.round(n);
}
