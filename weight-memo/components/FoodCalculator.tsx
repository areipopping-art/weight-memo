"use client";

import { useState } from "react";
import {
  CATEGORY_EMOJI,
  MAX_GRAMS,
  MIN_GRAMS,
  kcalOf,
  parseGrams,
  searchFoods,
  shortName,
  type Food,
} from "@/lib/foods";
import { formatKcal } from "@/lib/meals";

/** 検索候補として出す数 */
const RESULT_LIMIT = 8;
/** どの食品にも出すグラムの目安 */
const QUICK_GRAMS = [50, 100, 200];

type Item = { food: Food; grams: number };

/**
 * F-29 食品を選んでグラムを入れると、カロリーを自動で計算する。
 * onApply にメモに足す文字（例：白米150g、鮭80g）と合計 kcal を渡す。
 * 入れられなかったときは onApply がエラーの文を返す。
 */
export default function FoodCalculator({
  idPrefix,
  mealLabel,
  onApply,
  onClose,
}: {
  idPrefix: string;
  mealLabel: string;
  onApply: (text: string, kcal: number) => string | null;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  const results = selected ? [] : searchFoods(query, RESULT_LIMIT);
  const parsedGrams = parseGrams(grams);
  const total = items.reduce((sum, i) => sum + kcalOf(i.food, i.grams), 0);

  function select(food: Food) {
    setSelected(food);
    setGrams(String(food.unit?.grams ?? 100));
    setError(null);
  }

  function add() {
    if (!selected) return;
    if (parsedGrams === null) {
      setError(`量は ${MIN_GRAMS}〜${MAX_GRAMS}g の数字で入力してください`);
      return;
    }
    setItems([...items, { food: selected, grams: parsedGrams }]);
    setSelected(null);
    setQuery("");
    setGrams("");
    setError(null);
  }

  function apply() {
    const text = items.map((i) => `${shortName(i.food)}${i.grams}g`).join("、");
    const message = onApply(text, total);
    if (message) setError(message);
  }

  const gramOptions = [
    ...(selected?.unit ? [{ label: `${selected.unit.label} ${selected.unit.grams}g`, grams: selected.unit.grams }] : []),
    ...QUICK_GRAMS.filter((g) => g !== selected?.unit?.grams).map((g) => ({ label: `${g}g`, grams: g })),
  ];

  return (
    <div
      className="animate-pop-in mt-2 space-y-3 rounded-[var(--radius-card)] border-2 border-dashed border-sakura-200 bg-sakura-50/60 p-3 dark:border-sakura-800 dark:bg-[var(--tint-sakura)]"
      role="group"
      aria-label={`${mealLabel}の食品からカロリー計算`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-sakura-700 dark:text-sakura-300">🔍 {mealLabel}の食品から計算</p>
        <button type="button" onClick={onClose} className="text-xs font-bold text-muted hover:underline">
          閉じる
        </button>
      </div>

      {selected ? (
        <div className="space-y-2">
          <p className="text-sm font-bold">
            <span aria-hidden>{CATEGORY_EMOJI[selected.category]} </span>
            {selected.name}
            <span className="ml-1 text-xs font-normal text-muted">100gあたり {selected.kcalPer100g}kcal</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gramOptions.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setGrams(String(o.grams))}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                  parsedGrams === o.grams
                    ? "border-sakura-500 bg-sakura-500 text-white"
                    : "border-sakura-200 bg-[var(--card)] text-sakura-800 dark:border-sakura-800 dark:text-sakura-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={`${idPrefix}-grams`} className="text-sm font-medium">
              量
            </label>
            <input
              id={`${idPrefix}-grams`}
              type="number"
              inputMode="decimal"
              min={MIN_GRAMS}
              max={MAX_GRAMS}
              step="any"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              onKeyDown={(e) => {
                // Enter でフォーム全体を送信せず、一覧に追加する
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              className="input-soft w-24 text-right"
            />
            <span className="text-sm">g</span>
            <span className="ml-auto text-lg font-extrabold text-sakura-700 dark:text-sakura-300" aria-live="polite">
              {parsedGrams !== null ? `= ${formatKcal(kcalOf(selected, parsedGrams))}` : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelected(null)} className="btn-soft flex-1 py-2 text-sm">
              食品を選び直す
            </button>
            <button type="button" onClick={add} className="btn-primary flex-1 py-2 text-sm">
              ＋ 追加
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor={`${idPrefix}-search`} className="sr-only">
            食品名
          </label>
          <input
            id={`${idPrefix}-search`}
            type="search"
            autoComplete="off"
            autoFocus
            placeholder="食品名で検索（例：ごはん、たまご、鮭）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (results[0]) select(results[0]);
              }
            }}
            className="input-soft w-full"
          />
          {query.trim() !== "" && results.length === 0 && (
            <p className="text-xs text-muted">見つかりませんでした。別の呼び方で探してみてください</p>
          )}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {results.map((food) => (
                <button
                  key={food.name}
                  type="button"
                  onClick={() => select(food)}
                  className="rounded-full border border-sakura-200 bg-[var(--card)] px-3 py-1 text-xs font-bold text-sakura-800 hover:bg-sakura-100 dark:border-sakura-800 dark:text-sakura-200"
                >
                  <span aria-hidden>{CATEGORY_EMOJI[food.category]} </span>
                  {food.name}
                  <span className="ml-1 font-normal text-sakura-600 dark:text-sakura-300">{food.kcalPer100g}kcal/100g</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-1 border-t border-sakura-200 pt-2 dark:border-sakura-800">
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span aria-hidden>{CATEGORY_EMOJI[item.food.category]}</span>
                <span className="min-w-0 flex-1 truncate">
                  {shortName(item.food)} {item.grams}g
                </span>
                <span className="font-bold">{formatKcal(kcalOf(item.food, item.grams))}</span>
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  aria-label={`${shortName(item.food)}を外す`}
                  className="px-1 text-muted hover:text-sakura-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <p className="text-right text-sm font-extrabold">合計 {formatKcal(total)}</p>
          <button type="button" onClick={apply} className="btn-primary w-full py-2 text-sm">
            ✅ メモとカロリーに入れる
          </button>
        </div>
      )}

      {error && (
        <p role="status" className="text-xs font-bold text-sakura-700 dark:text-sakura-300">
          {error}
        </p>
      )}
      <p className="text-[11px] text-muted">※ 目安の値です。商品の栄養表示があればそちらを優先してください</p>
    </div>
  );
}
