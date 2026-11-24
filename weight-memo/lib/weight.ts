export const MIN_WEIGHT = 20;
export const MAX_WEIGHT = 300;

/** 入力文字列を体重（小数第1位まで）に変換。不正なら null */
export function parseWeight(input: string): number | null {
  const n = Number(input);
  if (input.trim() === "" || !Number.isFinite(n)) return null;
  if (n < MIN_WEIGHT || n > MAX_WEIGHT) return null;
  return Math.round(n * 10) / 10;
}

export function formatKg(n: number): string {
  return `${n.toFixed(1)}kg`;
}
