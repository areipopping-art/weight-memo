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

export const MIN_HEIGHT = 100;
export const MAX_HEIGHT = 250;

/** 入力文字列を身長（cm、小数第1位まで）に変換。不正なら null */
export function parseHeight(input: string): number | null {
  const n = Number(input);
  if (input.trim() === "" || !Number.isFinite(n)) return null;
  if (n < MIN_HEIGHT || n > MAX_HEIGHT) return null;
  return Math.round(n * 10) / 10;
}

// F-21 体脂肪率
export const MIN_BODY_FAT = 3;
export const MAX_BODY_FAT = 60;

/** 体脂肪率（%、小数第1位まで）に変換。空欄は null、不正な値は "invalid" */
export function parseBodyFat(input: string): number | null | "invalid" {
  if (input.trim() === "") return null;
  const n = Number(input);
  if (!Number.isFinite(n) || n < MIN_BODY_FAT || n > MAX_BODY_FAT) return "invalid";
  return Math.round(n * 10) / 10;
}

export function formatBodyFat(n: number): string {
  return `${n.toFixed(1)}%`;
}
