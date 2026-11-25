"use client";

import { useState } from "react";
import BodyFatField from "@/components/BodyFatField";
import CelebrationModal from "@/components/CelebrationModal";
import CheerBubble from "@/components/CheerBubble";
import GoalProgress from "@/components/GoalProgress";
import MealFields from "@/components/MealFields";
import MemoField from "@/components/MemoField";
import PhotoFields from "@/components/PhotoFields";
import PreviousDiff from "@/components/PreviousDiff";
import Streak from "@/components/Streak";
import TodayNutrition from "@/components/TodayNutrition";
import { cheerMessage } from "@/lib/cheer";
import { themeCopy } from "@/lib/theme";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { formatShortDate, todayString } from "@/lib/date";
import { EMPTY_KCAL_INPUT, EMPTY_MEALS, EMPTY_MEAL_NUTRIENTS, MAX_KCAL, formatKcal, parseKcal, totalKcal, trimMeals } from "@/lib/meals";
import { showsDetail } from "@/lib/persona";
import type { WeightRecord } from "@/lib/storage";
import { applyPhotoChanges, type PhotoChanges } from "@/lib/photos";
import { justReachedGoal } from "@/lib/stats";
import {
  MAX_BODY_FAT,
  MAX_WEIGHT,
  MIN_BODY_FAT,
  MIN_WEIGHT,
  formatBodyFat,
  formatKg,
  parseBodyFat,
  parseWeight,
} from "@/lib/weight";

export default function Home() {
  const { data, saveRecord } = useWeightMemo();
  const [date, setDate] = useState<string | null>(null); // null = 今日
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState(""); // F-21
  const [meals, setMeals] = useState(EMPTY_MEALS); // F-13
  const [kcal, setKcal] = useState(EMPTY_KCAL_INPUT); // F-14
  const [nutrients, setNutrients] = useState(EMPTY_MEAL_NUTRIENTS); // F-30
  const [memo, setMemo] = useState(""); // F-04 A モードのひとことメモ
  const [photos, setPhotos] = useState<PhotoChanges>({}); // F-23
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [celebrating, setCelebrating] = useState(false); // F-18

  // data が null の間はサーバー側の表示（まだ localStorage を読んでいない）
  if (data === null) {
    return <h1 className="text-xl font-bold">今日の記録</h1>;
  }

  const today = todayString();
  const dateValue = date ?? today;
  const todayRecord = data.records.find((r) => r.date === today);
  const todayKcal = todayRecord ? totalKcal(todayRecord) : null; // F-14
  const detail = showsDetail(data.persona); // B しっかりモードの項目を出すか

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const w = parseWeight(weight);
    if (w === null) {
      setMessage({ ok: false, text: `体重は ${MIN_WEIGHT}〜${MAX_WEIGHT}kg の数字で入力してください` });
      return;
    }
    // 今のモードで出していない項目は、同じ日の記録の値を引き継ぐ（消さない）
    const existing = data!.records.find((r) => r.date === dateValue);
    if (!detail) {
      saveAndFinish(w, {
        meal: memo.trim(),
        meals: existing?.meals,
        kcal: existing?.kcal,
        nutrients: existing?.nutrients,
        bodyFat: existing?.bodyFat ?? null,
      });
      return;
    }

    const parsedBodyFat = parseBodyFat(bodyFat);
    if (parsedBodyFat === "invalid") {
      setMessage({ ok: false, text: `体脂肪率は ${MIN_BODY_FAT}〜${MAX_BODY_FAT}% の数字で入力してください` });
      return;
    }
    const parsedKcal = parseKcal(kcal);
    if (parsedKcal === null) {
      setMessage({ ok: false, text: `カロリーは 0〜${MAX_KCAL}kcal の数字で入力してください` });
      return;
    }
    saveAndFinish(w, {
      meal: existing?.meal ?? "",
      meals: trimMeals(meals),
      kcal: parsedKcal,
      nutrients,
      bodyFat: parsedBodyFat,
    });
  }

  function saveAndFinish(w: number, rest: Omit<WeightRecord, "date" | "weight">) {
    const { before, after } = saveRecord({ date: dateValue, weight: w, ...rest });
    if (justReachedGoal(before, after, data!.goalWeight)) setCelebrating(true);
    applyPhotoChanges(dateValue, photos).catch(() =>
      setMessage({ ok: false, text: "写真を保存できませんでした（体重と食事は保存しました）" }),
    );
    setPhotos({});
    setWeight("");
    setBodyFat("");
    setMeals(EMPTY_MEALS);
    setKcal(EMPTY_KCAL_INPUT);
    setNutrients(EMPTY_MEAL_NUTRIENTS);
    setMemo("");
    setMessage({ ok: true, text: `${formatShortDate(dateValue)} の体重 ${formatKg(w)} を保存しました` });
  }

  return (
    <div className="space-y-6">
      <CheerBubble cheer={cheerMessage(data, today)} />

      <h1 className="sr-only">今日の記録</h1>

      {todayRecord && (
        <p className="rounded-full border-2 border-mint-200 bg-mint-50 px-4 py-2 text-mint-800 dark:border-mint-800 dark:bg-[var(--tint-mint)] dark:text-mint-200">
          <span className="font-bold">✅ 今日は記録済み</span>
          <span className="ml-2 text-sm">{formatKg(todayRecord.weight)}</span>
          {detail && todayRecord.bodyFat != null && <span className="ml-2 text-sm">・体脂肪率 {formatBodyFat(todayRecord.bodyFat)}</span>}
          {detail && todayKcal !== null && <span className="ml-2 text-sm">・合計 {formatKcal(todayKcal)}</span>}
        </p>
      )}

      <GoalProgress data={data} />
      {detail && <TodayNutrition record={todayRecord} kcalTarget={data.kcalTarget} />}
      <div className="grid grid-cols-2 gap-3">
        <PreviousDiff records={data.records} />
        <Streak records={data.records} today={today} />
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="text-lg font-extrabold text-sakura-700 dark:text-sakura-300">✏️ 今日の記録</h2>
        <div className="space-y-1">
          <label htmlFor="date" className="block text-sm font-medium">
            日付
          </label>
          <input
            id="date"
            type="date"
            max={today}
            value={dateValue}
            onChange={(e) => setDate(e.target.value || null)}
            className="input-soft w-full"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="weight" className="block text-sm font-medium">
            体重（kg）
          </label>
          <input
            id="weight"
            type="number"
            inputMode="decimal"
            step="0.1"
            min={MIN_WEIGHT}
            max={MAX_WEIGHT}
            placeholder="例：62.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-soft w-full text-2xl font-bold"
          />
        </div>

        {detail ? (
          <>
            <BodyFatField id="home-body-fat" value={bodyFat} onChange={setBodyFat} />
            <MealFields
              idPrefix="home-meal"
              value={meals}
              onChange={setMeals}
              kcal={kcal}
              onKcalChange={setKcal}
              nutrients={nutrients}
              onNutrientsChange={setNutrients}
              records={data.records}
            />
          </>
        ) : (
          <MemoField id="home-memo" value={memo} onChange={setMemo} records={data.records} />
        )}

        <PhotoFields idPrefix="home-photo" date={dateValue} changes={photos} onChange={setPhotos} />

        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg"
        >
          {themeCopy(data.sex).recordButton}
        </button>

        {message && (
          <p role="status" className={message.ok ? "text-sm font-bold text-mint-700 dark:text-mint-300" : "text-sm font-bold text-sakura-700 dark:text-sakura-300"}>
            {message.text}
          </p>
        )}
      </form>

      {celebrating && data.goalWeight !== null && (
        <CelebrationModal goalWeight={data.goalWeight} sex={data.sex} onClose={() => setCelebrating(false)} />
      )}
    </div>
  );
}
