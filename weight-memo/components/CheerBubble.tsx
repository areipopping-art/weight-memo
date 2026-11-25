import Mascot from "@/components/Mascot";
import type { Cheer } from "@/lib/cheer";

/** キャラクターと吹き出し */
export default function CheerBubble({ cheer }: { cheer: Cheer }) {
  return (
    <div className="flex items-end gap-2">
      <Mascot mood={cheer.mood} size={84} className="shrink-0 animate-bounce-soft" />
      <p
        key={cheer.text}
        role="status"
        className="card relative mb-3 flex-1 animate-pop-in py-3 text-sm leading-relaxed font-bold text-sakura-800 dark:text-sakura-200"
      >
        {/* 吹き出しのしっぽ */}
        <span
          aria-hidden
          className="absolute bottom-3 -left-2 h-4 w-4 rotate-45 border-b border-l border-[var(--card-border)] bg-[var(--card)]"
        />
        {cheer.text}
      </p>
    </div>
  );
}
