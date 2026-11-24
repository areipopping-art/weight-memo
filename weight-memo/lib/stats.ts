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
