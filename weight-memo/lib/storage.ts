// F-09 自動保存：すべてのデータを localStorage に保存する

import type { Kcal, Meals } from "./meals";

export type WeightRecord = {
  date: string; // "2026-11-24"（1日1件）
  weight: number; // 体重（kg、小数第1位まで）
  meal: string; // 食事のひとことメモ（F-13 以前の記録。新しい記録では空）
  meals?: Meals; // F-13 朝・昼・夜・間食（空でも可）
  kcal?: Kcal; // F-14 区分ごとのカロリー（未入力は null）
};

export type Data = {
  goalWeight: number | null;
  height: number | null; // F-19 身長（cm）
  goalDeadline: string | null; // F-16 目標の期限 "2027-03-31"
  records: WeightRecord[];
};

const KEY = "weight-memo";
export const EMPTY: Data = { goalWeight: null, height: null, goalDeadline: null, records: [] };

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedData: Data = EMPTY;

function parse(raw: string | null): Data {
  if (!raw) return EMPTY;
  try {
    const d = JSON.parse(raw) as Partial<Data>;
    return {
      goalWeight: typeof d.goalWeight === "number" ? d.goalWeight : null,
      height: typeof d.height === "number" ? d.height : null,
      goalDeadline: typeof d.goalDeadline === "string" ? d.goalDeadline : null,
      records: Array.isArray(d.records) ? d.records : [],
    };
  } catch {
    console.error("[weight-memo] 保存データを読み込めませんでした");
    return EMPTY;
  }
}

/** 現在のデータ（同じ内容なら同じオブジェクトを返す） */
export function getSnapshot(): Data {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedData = parse(raw);
  }
  return cachedData;
}

/** サーバー側では localStorage がないので「未読み込み」を返す */
export function getServerSnapshot(): Data | null {
  return null;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // 別のタブで変更されたときも反映する
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function save(data: Data): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    console.error("[weight-memo] 保存できませんでした");
  }
  listeners.forEach((l) => l());
}
