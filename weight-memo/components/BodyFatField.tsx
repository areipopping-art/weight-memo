import { MAX_BODY_FAT, MIN_BODY_FAT } from "@/lib/weight";

/** F-21 体脂肪率の入力欄（任意） */
export default function BodyFatField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        体脂肪率（%） <span className="font-normal text-neutral-500">（任意）</span>
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="0.1"
        min={MIN_BODY_FAT}
        max={MAX_BODY_FAT}
        placeholder="例：25.0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-900"
      />
    </div>
  );
}
