// F-09 自動保存：すべてのデータを localStorage に保存する

import type { Achievement } from "./achievements";
import type { Activity, Profile, Sex } from "./calorie";
import type { Kcal, Meals } from "./meals";
import type { Persona } from "./persona";

export type WeightRecord = {
  date: string; // "2026-11-24"（1日1件）
  weight: number; // 体重（kg、小数第1位まで）
  meal: string; // 食事のひとことメモ（F-13 以前の記録。新しい記録では空）
  meals?: Meals; // F-13 朝・昼・夜・間食（空でも可）
  kcal?: Kcal; // F-14 区分ごとのカロリー（未入力は null）
  bodyFat?: number | null; // F-21 体脂肪率（%、未入力は null）
};

export type Data = Profile & {
  goalWeight: number | null;
  height: number | null; // F-19 身長（cm）
  goalDeadline: string | null; // F-16 目標の期限 "2027-03-31"
  goalSetDate: string | null; // F-26 目標を決めた日
  goalStartWeight: number | null; // F-26 目標を決めたときの体重（記録が無ければ null）
  achievements: Achievement[]; // F-26 達成記録（古い順）
  persona: Persona; // A ゆるっと / B しっかり（無ければ B）
  records: WeightRecord[];
};

const KEY = "weight-memo";
export const EMPTY: Data = {
  goalWeight: null,
  height: null,
  goalDeadline: null,
  age: null,
  sex: null,
  activity: null,
  goalSetDate: null,
  goalStartWeight: null,
  achievements: [],
  persona: "B",
  records: [],
};

const SEXES: Sex[] = ["male", "female"];
const ACTIVITY_KEYS: Activity[] = ["low", "normal", "high"];

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
      // F-20 カロリー計算用
      age: typeof d.age === "number" ? d.age : null,
      sex: SEXES.includes(d.sex as Sex) ? (d.sex as Sex) : null,
      activity: ACTIVITY_KEYS.includes(d.activity as Activity) ? (d.activity as Activity) : null,
      // F-26 達成記録
      goalSetDate: typeof d.goalSetDate === "string" ? d.goalSetDate : null,
      goalStartWeight: typeof d.goalStartWeight === "number" ? d.goalStartWeight : null,
      achievements: Array.isArray(d.achievements) ? d.achievements : [],
      persona: d.persona === "A" ? "A" : "B",
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
