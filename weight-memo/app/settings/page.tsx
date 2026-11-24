"use client";

import { useState } from "react";
import { downloadCsv, recordsToCsv } from "@/lib/csv";
import { todayString } from "@/lib/date";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { MAX_HEIGHT, MIN_HEIGHT, parseHeight } from "@/lib/weight";

/** F-19 設定：身長の登録と全データの削除。F-25 CSV 書き出し */
export default function SettingsPage() {
  const { data, setHeight, deleteAll } = useWeightMemo();
  // null = まだ触っていない（現在の身長を初期値として表示する）
  const [input, setInput] = useState<string | null>(null);
  const value = input ?? (data?.height != null ? data.height.toFixed(1) : "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const h = parseHeight(value);
    if (h === null) {
      setMessage({ ok: false, text: `身長は ${MIN_HEIGHT}〜${MAX_HEIGHT}cm の数字で入力してください` });
      return;
    }
    setHeight(h);
    setInput(null);
    setMessage({ ok: true, text: `身長を ${h.toFixed(1)}cm で保存しました` });
  }

  const box = "space-y-3 rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">設定</h1>

      <form onSubmit={handleSubmit} className={box}>
        <label htmlFor="height" className="block text-sm font-medium">
          身長（cm）
        </label>
        <input
          id="height"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={MIN_HEIGHT}
          max={MAX_HEIGHT}
          placeholder="例：160.0"
          value={value}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-lg dark:border-neutral-600 dark:bg-neutral-900"
        />
        <p className="text-xs text-neutral-500">BMI の計算に使います。</p>
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700"
        >
          保存する
        </button>
        {message && (
          <p role="status" className={message.ok ? "text-sm text-emerald-700" : "text-sm text-red-600"}>
            {message.text}
          </p>
        )}
      </form>

      <section className={box}>
        <h2 className="font-bold">CSV 書き出し</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          すべての記録を CSV ファイルでダウンロードします。Excel やスプレッドシートで開けます。
        </p>
        <button
          type="button"
          disabled={!data || data.records.length === 0}
          onClick={() => data && downloadCsv(recordsToCsv(data.records), `weight-memo-${todayString()}.csv`)}
          className="w-full rounded-md border border-emerald-600 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
        >
          CSV をダウンロード{data ? `（${data.records.length}件）` : ""}
        </button>
      </section>

      <section className={box}>
        <h2 className="font-bold">全データの削除</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          体重・食事の記録、目標、身長をすべて削除します。元に戻せません。
        </p>
        {confirming ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-md border border-neutral-300 py-2 text-sm dark:border-neutral-600"
            >
              やめる
            </button>
            <button
              type="button"
              onClick={() => {
                deleteAll();
                setConfirming(false);
                setInput(null);
                setMessage(null);
                setDeleted(true);
              }}
              className="flex-1 rounded-md bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              本当にすべて削除
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setConfirming(true);
              setDeleted(false);
            }}
            className="w-full rounded-md border border-red-300 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
          >
            すべて削除する
          </button>
        )}
        {deleted && (
          <p role="status" className="text-sm text-emerald-700">
            すべてのデータを削除しました
          </p>
        )}
      </section>
    </div>
  );
}
