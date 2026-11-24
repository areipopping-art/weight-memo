"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, save, subscribe } from "./storage";

export function useWeightMemo() {
  // data が null の間は「まだ読み込んでいない」（サーバー側の表示）
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setGoalWeight(goalWeight: number) {
    save({ ...getSnapshot(), goalWeight });
  }

  return { data, setGoalWeight };
}
