"use client";

import { useState } from "react";
import PersonaSection from "@/components/PersonaSection";
import ProfileForm from "@/components/ProfileForm";
import { downloadCsv, recordsToCsv } from "@/lib/csv";
import { todayString } from "@/lib/date";
import { showsDetail } from "@/lib/persona";
import { useWeightMemo } from "@/lib/useWeightMemo";
import { MAX_HEIGHT, MIN_HEIGHT, parseHeight } from "@/lib/weight";

/** F-19 設定：身長の登録と全データの削除。F-20 カロリー計算用の情報。F-25 CSV 書き出し */
export default function SettingsPage() {
  const { data, setHeight, deleteAll, setProfile, setPersona } = useWeightMemo();
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

  const box = "space-y-3 card";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold text-sakura-700 dark:text-sakura-300">⚙️ 設定</h1>

      {data && <PersonaSection value={data.persona} onChange={setPersona} />}

      <form onSubmit={handleSubmit} className={box}>
        <label htmlFor="height" className="block text-sm font-medium">
          📏 身長（cm）
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
          className="input-soft w-full text-lg font-bold"
        />
        <p className="text-xs text-muted">BMI の計算に使います。</p>
        <button
          type="submit"
          className="w-full btn-primary py-2"
        >
          保存する
        </button>
        {message && (
          <p role="status" className={message.ok ? "text-sm font-bold text-mint-700 dark:text-mint-300" : "text-sm font-bold text-sakura-700 dark:text-sakura-300"}>
            {message.text}
          </p>
        )}
      </form>

      {/* カロリー計算用の情報と CSV は B しっかりモードだけ */}
      {data && showsDetail(data.persona) && (
        <>
          <ProfileForm profile={data} onSave={setProfile} />

          <section className={box}>
            <h2 className="font-extrabold">📄 CSV 書き出し</h2>
            <p className="text-sm text-muted">
              すべての記録を CSV ファイルでダウンロードします。Excel やスプレッドシートで開けます。
            </p>
            <button
              type="button"
              disabled={!data || data.records.length === 0}
              onClick={() => data && downloadCsv(recordsToCsv(data.records), `weight-memo-${todayString()}.csv`)}
              className="w-full rounded-full border-2 border-mint-300 bg-mint-50 py-2 text-sm font-bold text-mint-800 hover:bg-mint-100 disabled:opacity-50 dark:border-mint-800 dark:bg-[#1f3330] dark:text-mint-200"
            >
              CSV をダウンロード{data ? `（${data.records.length}件）` : ""}
            </button>
          </section>
        </>
      )}

      <section className={box}>
        <h2 className="font-extrabold">🗑️ 全データの削除</h2>
        <p className="text-sm text-muted">
          体重・食事の記録と写真、目標、身長・年齢などの設定をすべて削除します。元に戻せません。
        </p>
        {confirming ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="btn-soft flex-1 py-2 text-sm"
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
              className="flex-1 rounded-full bg-sakura-600 py-2 text-sm font-bold text-white hover:bg-sakura-700"
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
            className="w-full rounded-full border-2 border-sakura-200 py-2 text-sm font-bold text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900 dark:text-sakura-300 dark:hover:bg-[#3a2733]"
          >
            すべて削除する
          </button>
        )}
        {deleted && (
          <p role="status" className="text-sm font-bold text-mint-700 dark:text-mint-300">
            すべてのデータを削除しました
          </p>
        )}
      </section>
    </div>
  );
}
