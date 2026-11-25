"use client";

import { useState } from "react";
import {
  ACTIVITIES,
  MAX_AGE,
  MIN_AGE,
  SEX_LABELS,
  parseAge,
  type Activity,
  type Profile,
  type Sex,
} from "@/lib/calorie";

/** F-20 カロリー計算に使う年齢・性別・活動量 */
export default function ProfileForm({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
  // null = まだ触っていない（保存済みの値を初期値として表示する）
  const [age, setAge] = useState<string | null>(null);
  const [sex, setSex] = useState<Sex | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const ageValue = age ?? (profile.age !== null ? String(profile.age) : "");
  const sexValue = sex ?? profile.sex;
  const activityValue = activity ?? profile.activity;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const a = parseAge(ageValue);
    if (a === null) {
      setMessage({ ok: false, text: `年齢は ${MIN_AGE}〜${MAX_AGE} の整数で入力してください` });
      return;
    }
    if (sexValue === null || activityValue === null) {
      setMessage({ ok: false, text: "性別と活動量を選んでください" });
      return;
    }
    onSave({ age: a, sex: sexValue, activity: activityValue });
    setAge(null);
    setSex(null);
    setActivity(null);
    setMessage({ ok: true, text: "保存しました" });
  }

  const choice = (selected: boolean) =>
    `flex-1 cursor-pointer rounded-full border-2 px-3 py-2 text-center text-sm transition-colors ${
      selected
        ? "border-sakura-400 bg-sakura-50 font-bold text-sakura-800 dark:bg-[#3a2733] dark:text-sakura-200"
        : "border-[var(--input-border)]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 card">
      <h2 className="font-extrabold">🧮 カロリー計算に使う情報</h2>
      <p className="text-xs text-muted">目標ページの「1日の目安カロリー」の計算に使います。</p>

      <div className="space-y-1">
        <label htmlFor="age" className="block text-sm font-medium">
          年齢
        </label>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          step={1}
          min={MIN_AGE}
          max={MAX_AGE}
          placeholder="例：35"
          value={ageValue}
          onChange={(e) => setAge(e.target.value)}
          className="input-soft w-full"
        />
      </div>

      <fieldset className="space-y-1">
        <legend className="text-sm font-medium">性別</legend>
        <div className="flex gap-2">
          {(Object.keys(SEX_LABELS) as Sex[]).map((key) => (
            <label key={key} className={choice(sexValue === key)}>
              <input
                type="radio"
                name="sex"
                value={key}
                checked={sexValue === key}
                onChange={() => setSex(key)}
                className="sr-only"
              />
              {SEX_LABELS[key]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="text-sm font-medium">ふだんの活動量</legend>
        <div className="space-y-2">
          {ACTIVITIES.map((a) => (
            <label key={a.key} className={`${choice(activityValue === a.key)} block text-left`}>
              <input
                type="radio"
                name="activity"
                value={a.key}
                checked={activityValue === a.key}
                onChange={() => setActivity(a.key)}
                className="sr-only"
              />
              {a.label}
              <span className="ml-2 text-xs font-normal text-muted">{a.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="w-full btn-primary py-2">
        保存する
      </button>
      {message && (
        <p role="status" className={message.ok ? "text-sm font-bold text-mint-700 dark:text-mint-300" : "text-sm font-bold text-sakura-700 dark:text-sakura-300"}>
          {message.text}
        </p>
      )}
    </form>
  );
}
