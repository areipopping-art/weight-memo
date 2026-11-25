"use client";

import { useState } from "react";
import { PERSONAS, personaInfo, type Persona } from "@/lib/persona";
import { themeCopy } from "@/lib/theme";
import { useWeightMemo } from "@/lib/useWeightMemo";

/** ヘッダーの A/B 切り替えスイッチ */
export default function PersonaToggle() {
  const { data, setPersona } = useWeightMemo();
  const [notice, setNotice] = useState<string | null>(null);
  const current: Persona = data?.persona ?? "B";
  const copy = themeCopy(data?.sex);
  const emojiOf = (p: Persona) => (p === "A" ? copy.personaAEmoji : personaInfo(p).emoji);

  function choose(p: Persona) {
    if (p === current) return;
    setPersona(p);
    const info = personaInfo(p);
    setNotice(`${emojiOf(p)} ${copy.switched(info.short)}`);
    setTimeout(() => setNotice(null), 2200);
  }

  return (
    <div className="relative">
      <div
        role="radiogroup"
        aria-label="モードの切り替え"
        className="flex rounded-full border-2 border-[var(--input-border)] bg-[var(--card)] p-0.5 text-xs"
      >
        {PERSONAS.map((p) => {
          const active = current === p.key;
          return (
            <button
              key={p.key}
              type="button"
              role="radio"
              aria-checked={active}
              title={p.description}
              aria-label={p.label}
              disabled={data === null}
              onClick={() => choose(p.key)}
              className={`rounded-full px-2.5 py-1 font-bold whitespace-nowrap transition-colors ${
                active
                  ? p.key === "A"
                    ? "bg-sakura-400 text-white"
                    : "bg-mint-500 text-white"
                  : "text-muted hover:bg-sakura-50 dark:hover:bg-[var(--hover)]"
              }`}
            >
              <span aria-hidden>{emojiOf(p.key)}</span> {p.key}
              <span className="hidden sm:inline"> {p.short}</span>
            </button>
          );
        })}
      </div>
      {notice && (
        <p
          role="status"
          className="absolute top-full right-0 z-20 mt-2 animate-pop-in rounded-full bg-sakura-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
