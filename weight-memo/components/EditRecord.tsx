"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import BodyFatField from "@/components/BodyFatField";
import MealFields from "@/components/MealFields";
import { formatShortDate } from "@/lib/date";
import { MAX_KCAL, kcalInputOf, mealsOf, parseKcal, trimMeals, type KcalInput, type Meals } from "@/lib/meals";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { MAX_BODY_FAT, MAX_WEIGHT, MIN_BODY_FAT, MIN_WEIGHT, parseBodyFat, parseWeight } from "@/lib/weight";

/** F-12 過去の記録の体重・食事を修正する */
export default function EditRecord({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const router = useRouter();
  const { data, saveRecord } = useWeightMemo();
  // null = まだ触っていない（保存済みの値を初期値として表示する）
  const [weight, setWeight] = useState<string | null>(null);
  const [bodyFat, setBodyFat] = useState<string | null>(null); // F-21
  const [meals, setMeals] = useState<Meals | null>(null); // F-13
  const [kcal, setKcal] = useState<KcalInput | null>(null); // F-14
  const [meal, setMeal] = useState<string | null>(null); // 以前の1行メモ
  const [error, setError] = useState<string | null>(null);

  const title = <h1 className="text-xl font-bold">記録の編集</h1>;
  if (data === null) return title;

  const record = data.records.find((r) => r.date === date);
  if (!record) {
    return (
      <div className="space-y-6">
        {title}
        <p className="rounded-lg bg-white p-4 text-sm text-neutral-500 shadow-sm dark:bg-neutral-800">
          この日付の記録はありません。
          <Link href="/history" className="font-bold text-emerald-700 underline dark:text-emerald-400">
            記録一覧
          </Link>
          に戻る
        </p>
      </div>
    );
  }

  const weightValue = weight ?? record.weight.toFixed(1);
  const bodyFatValue = bodyFat ?? (record.bodyFat != null ? record.bodyFat.toFixed(1) : "");
  const mealsValue = meals ?? mealsOf(record);
  const kcalValue = kcal ?? kcalInputOf(record);
  const mealValue = meal ?? record.meal;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const w = parseWeight(weightValue);
    if (w === null) {
      setError(`体重は ${MIN_WEIGHT}〜${MAX_WEIGHT}kg の数字で入力してください`);
      return;
    }
    const parsedBodyFat = parseBodyFat(bodyFatValue);
    if (parsedBodyFat === "invalid") {
      setError(`体脂肪率は ${MIN_BODY_FAT}〜${MAX_BODY_FAT}% の数字で入力してください`);
      return;
    }
    const parsedKcal = parseKcal(kcalValue);
    if (parsedKcal === null) {
      setError(`カロリーは 0〜${MAX_KCAL}kcal の数字で入力してください`);
      return;
    }
    saveRecord({ date, weight: w, bodyFat: parsedBodyFat, meal: mealValue.trim(), meals: trimMeals(mealsValue), kcal: parsedKcal });
    router.push("/history");
  }

  const input = "w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900";

  return (
    <div className="space-y-6">
      {title}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800">
        <p className="text-sm text-neutral-500">日付：{formatShortDate(date)}</p>

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
            value={weightValue}
            onChange={(e) => setWeight(e.target.value)}
            className={`${input} text-2xl`}
          />
        </div>

        <BodyFatField id="edit-body-fat" value={bodyFatValue} onChange={setBodyFat} />

        <MealFields
          idPrefix="edit-meal"
          value={mealsValue}
          onChange={setMeals}
          kcal={kcalValue}
          onKcalChange={setKcal}
        />

        {/* 食事の区分ができる前の1行メモ。ある記録だけ表示する */}
        {record.meal && (
          <div className="space-y-1">
            <label htmlFor="edit-memo" className="block text-sm font-medium">
              メモ <span className="font-normal text-neutral-500">（以前の記録）</span>
            </label>
            <textarea
              id="edit-memo"
              rows={2}
              maxLength={200}
              value={mealValue}
              onChange={(e) => setMeal(e.target.value)}
              className={input}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href="/history"
            className="flex-1 rounded-md border border-neutral-300 py-3 text-center dark:border-neutral-600"
          >
            やめる
          </Link>
          <button
            type="submit"
            className="flex-1 rounded-md bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700"
          >
            保存する
          </button>
        </div>

        {error && (
          <p role="status" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
