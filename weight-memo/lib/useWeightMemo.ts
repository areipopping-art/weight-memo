"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, save, subscribe, type WeightRecord } from "./storage";

export function useWeightMemo() {
  // data が null の間は「まだ読み込んでいない」（サーバー側の表示）
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setGoalWeight(goalWeight: number) {
    save({ ...getSnapshot(), goalWeight });
  }

  /** F-03 同じ日付の記録があれば上書き、なければ追加 */
  function saveRecord(record: WeightRecord) {
    const current = getSnapshot();
    const others = current.records.filter((r) => r.date !== record.date);
    save({ ...current, records: [...others, record] });
  }

  /** F-08 指定した日付の記録を削除 */
  function deleteRecord(date: string) {
    const current = getSnapshot();
    save({ ...current, records: current.records.filter((r) => r.date !== date) });
  }

  return { data, setGoalWeight, saveRecord, deleteRecord };
}
