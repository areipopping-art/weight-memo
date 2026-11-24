import { addDays, daysBetween } from "./date";
import type { WeightRecord } from "./storage";

/** 新しい順に並べた記録 */
export function sortNewestFirst(records: WeightRecord[]): WeightRecord[] {
  return [...records].sort((a, b) => b.date.localeCompare(a.date));
}

/** F-10 最新の記録と、その前の記録との差（kg）。記録が2件未満なら null */
export function diffFromPrevious(records: WeightRecord[]): number | null {
  const [latest, previous] = sortNewestFirst(records);
  if (!latest || !previous) return null;
  return Math.round((latest.weight - previous.weight) * 10) / 10;
}

/**
 * F-11 連続記録日数。今日から（今日がまだなら昨日から）遡って、記録が途切れるまで数える。
 * 今日も昨日も記録がなければ 0。
 */
export function recordStreak(records: WeightRecord[], today: string): number {
  const dates = new Set(records.map((r) => r.date));
  let day = dates.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (dates.has(day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

/**
 * F-18 記録を保存したことで、初めて目標に届いたか。
 * 保存前の最新体重が目標より上（または記録なし）で、保存後の最新体重が目標以下なら true。
 */
export function justReachedGoal(
  before: WeightRecord[],
  after: WeightRecord[],
  goalWeight: number | null,
): boolean {
  if (goalWeight === null) return false;
  const latestBefore = sortNewestFirst(before)[0];
  const latestAfter = sortNewestFirst(after)[0];
  if (!latestAfter || latestAfter.weight > goalWeight) return false;
  return !latestBefore || latestBefore.weight > goalWeight;
}

/** F-15 BMI（小数第1位まで） */
export function calcBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

/** F-15 日本肥満学会の判定 */
export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "低体重";
  if (bmi < 25) return "普通体重";
  if (bmi < 30) return "肥満（1度）";
  if (bmi < 35) return "肥満（2度）";
  if (bmi < 40) return "肥満（3度）";
  return "肥満（4度）";
}

export type GoalPace =
  | { kind: "achieved" }
  | { kind: "overdue"; remainingKg: number }
  | { kind: "pace"; remainingKg: number; daysLeft: number; perWeekKg: number };

/** F-16 期限までに目標へ届くための「1週間あたり ◯kg」の目安 */
export function goalPace(latestWeight: number, goalWeight: number, deadline: string, today: string): GoalPace {
  const remainingKg = Math.round((latestWeight - goalWeight) * 10) / 10;
  if (remainingKg <= 0) return { kind: "achieved" };
  const daysLeft = daysBetween(today, deadline);
  if (daysLeft <= 0) return { kind: "overdue", remainingKg };
  const perWeekKg = Math.round(((remainingKg * 7) / daysLeft) * 100) / 100;
  return { kind: "pace", remainingKg, daysLeft, perWeekKg };
}

/** F-17 今日を含む直近 days 日間の記録（古い順） */
export function recordsInLastDays(records: WeightRecord[], today: string, days: number): WeightRecord[] {
  const from = addDays(today, -(days - 1));
  return records
    .filter((r) => r.date >= from && r.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}
