import { addDays } from "./date";
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
