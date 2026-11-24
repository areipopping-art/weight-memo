// F-26 達成記録・次の目標の提案

import { addDays, daysBetween } from "./date";
import type { WeightRecord } from "./storage";

export type Achievement = {
  goalWeight: number; // 達成した目標
  startDate: string; // 目標を決めた日
  startWeight: number; // 目標を決めたときの体重
  achievedDate: string; // 達成した日（記録の日付）
  achievedWeight: number; // 達成したときの体重
};

/** 提案に使う期間 */
export const PROPOSAL_WEEKS = 4;
/** 1週間に減らす量の上限（無理のないペース） */
const MAX_PER_WEEK_KG = 1;
/** 提案が無いときのペース */
const DEFAULT_PER_WEEK_KG = 0.5;
/** 一度に減らす量の上限（今の体重に対する割合） */
const MAX_RATIO = 0.05;
/** これを下回る目標は提案しない BMI（低体重の境目） */
const MIN_BMI = 18.5;

/** 達成までの1週間あたりのペース（kg）。増えていた・同じ日に達成したときは null */
export function achievedPerWeek(a: Achievement): number | null {
  const days = daysBetween(a.startDate, a.achievedDate);
  const lost = a.startWeight - a.achievedWeight;
  if (days <= 0 || lost <= 0) return null;
  return Math.round(((lost * 7) / days) * 100) / 100;
}

/** 目標を決めた日以降で最初の記録の体重（目標を決めたときに記録が無かった場合に使う） */
export function firstWeightSince(records: WeightRecord[], date: string): number | null {
  const first = records.filter((r) => r.date >= date).sort((a, b) => a.date.localeCompare(b.date))[0];
  return first ? first.weight : null;
}

export type Proposal =
  | { kind: "goal"; goalWeight: number; deadline: string; perWeekKg: number }
  | { kind: "keep" }; // これ以上減らすと低体重になる

/**
 * 次の目標の提案：前回の達成ペース（上限は週1kg、無ければ週0.5kg）で4週間分。
 * 一度に減らすのは今の体重の5%まで。身長があれば BMI 18.5 を下回らないようにする。0.5kg 単位。
 */
export function proposeNextGoal(
  currentWeight: number,
  last: Achievement | undefined,
  heightCm: number | null,
  today: string,
): Proposal {
  const pace = Math.min((last && achievedPerWeek(last)) ?? DEFAULT_PER_WEEK_KG, MAX_PER_WEEK_KG);
  const loss = Math.min(pace * PROPOSAL_WEEKS, currentWeight * MAX_RATIO);
  let goal = Math.ceil((currentWeight - loss) * 2) / 2;

  if (heightCm !== null) {
    const m = heightCm / 100;
    const floor = Math.ceil(MIN_BMI * m * m * 2) / 2;
    goal = Math.max(goal, floor);
  }
  if (goal >= currentWeight) return { kind: "keep" };

  return { kind: "goal", goalWeight: goal, deadline: addDays(today, PROPOSAL_WEEKS * 7), perWeekKg: pace };
}
