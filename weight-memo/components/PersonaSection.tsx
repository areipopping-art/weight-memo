"use client";

import { PERSONAS, type Persona } from "@/lib/persona";

/** 設定ページの A/B モード選択（説明つき） */
export default function PersonaSection({
  value,
  onChange,
  aEmoji,
}: {
  value: Persona;
  onChange: (p: Persona) => void;
  /** A モードの絵文字（性別で変わる） */
  aEmoji: string;
}) {
  return (
    <fieldset className="card space-y-2">
      <legend className="sr-only">モード</legend>
      <h2 className="font-extrabold">🔀 モード</h2>
      <p className="text-xs text-muted">いつでも切り替えられます。隠れている記録も消えません。</p>
      {PERSONAS.map((p) => {
        const active = value === p.key;
        return (
          <label
            key={p.key}
            className={`block cursor-pointer rounded-2xl border-2 p-3 transition-colors ${
              active
                ? "border-sakura-400 bg-sakura-50 dark:bg-[var(--tint-sakura)]"
                : "border-[var(--input-border)] hover:bg-sakura-50/60 dark:hover:bg-[var(--hover)]"
            }`}
          >
            <input
              type="radio"
              name="persona"
              value={p.key}
              checked={active}
              onChange={() => onChange(p.key)}
              className="sr-only"
            />
            <span className="font-extrabold">
              <span aria-hidden>{p.key === "A" ? aEmoji : p.emoji} </span>
              {p.label}
              {active && <span className="ml-2 text-xs text-sakura-700 dark:text-sakura-300">✓ いまのモード</span>}
            </span>
            <span className="mt-0.5 block text-xs text-muted">{p.description}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
