"use client";

import { useSyncExternalStore } from "react";
import { firstWeightSince } from "./achievements";
import type { Profile } from "./calorie";
import type { Persona } from "./persona";
import { todayString } from "./date";
import { clearPhotos, deletePhotosForDate } from "./photos";
import { justReachedGoal, sortNewestFirst } from "./stats";
import { EMPTY, getServerSnapshot, getSnapshot, save, subscribe, type WeightRecord } from "./storage";

export function useWeightMemo() {
  // data が null の間は「まだ読み込んでいない」（サーバー側の表示）
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /** F-01/F-02 目標体重を保存。F-26 決めた日と、そのときの体重も残す */
  function setGoalWeight(goalWeight: number, goalDeadline?: string | null) {
    const current = getSnapshot();
    save({
      ...current,
      goalWeight,
      goalSetDate: todayString(),
      goalStartWeight: sortNewestFirst(current.records)[0]?.weight ?? null,
      ...(goalDeadline !== undefined ? { goalDeadline } : {}),
    });
  }

  /** F-03 同じ日付の記録があれば上書き、なければ追加。保存前と保存後の記録を返す */
  function saveRecord(record: WeightRecord): { before: WeightRecord[]; after: WeightRecord[] } {
    const current = getSnapshot();
    const others = current.records.filter((r) => r.date !== record.date);
    const after = [...others, record];
    // F-26 この記録で目標に届いたら達成記録に残す
    const achievements = [...current.achievements];
    if (current.goalWeight !== null && justReachedGoal(current.records, after, current.goalWeight)) {
      const latest = sortNewestFirst(after)[0];
      const startDate = current.goalSetDate ?? sortNewestFirst(after).at(-1)!.date;
      // 同じ目標をいったん上回ってからもう一度届いたときは、2回目を記録しない
      const already = achievements.some((a) => a.goalWeight === current.goalWeight && a.startDate === startDate);
      if (!already) achievements.push({
        goalWeight: current.goalWeight,
        startDate,
        startWeight: current.goalStartWeight ?? firstWeightSince(after, startDate) ?? latest.weight,
        achievedDate: latest.date,
        achievedWeight: latest.weight,
      });
    }
    save({ ...current, records: after, achievements });
    return { before: current.records, after };
  }

  /** F-08 指定した日付の記録を削除 */
  function deleteRecord(date: string) {
    const current = getSnapshot();
    save({ ...current, records: current.records.filter((r) => r.date !== date) });
    // F-23 その日の写真も消す
    deletePhotosForDate(date).catch(() => console.error("[weight-memo] 写真を削除できませんでした"));
  }

  /** F-19 身長（cm）を保存 */
  function setHeight(height: number) {
    save({ ...getSnapshot(), height });
  }

  /** F-16 目標の期限を保存（null で解除） */
  function setGoalDeadline(goalDeadline: string | null) {
    save({ ...getSnapshot(), goalDeadline });
  }

  /** F-20 年齢・性別・活動量を保存 */
  function setProfile(profile: Profile) {
    save({ ...getSnapshot(), ...profile });
  }

  /** A/B のモードを切り替える */
  function setPersona(persona: Persona) {
    save({ ...getSnapshot(), persona });
  }

  /** F-19 全データを削除 */
  function deleteAll() {
    save(EMPTY);
    // F-23 写真もすべて消す
    clearPhotos().catch(() => console.error("[weight-memo] 写真を削除できませんでした"));
  }

  return { data, setGoalWeight, saveRecord, deleteRecord, setHeight, deleteAll, setGoalDeadline, setProfile, setPersona };
}
