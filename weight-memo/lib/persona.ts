// ペルソナ A/B のモード
// A ゆるっと：毎日10秒で記録したい人向け。要件定義書で B 向けの機能を隠す
// B しっかり：数字で管理したい人向け。すべての機能を出す

export type Persona = "A" | "B";

export const PERSONAS: { key: Persona; short: string; label: string; emoji: string; description: string }[] = [
  {
    key: "A",
    short: "ゆるっと",
    label: "A ゆるっとモード",
    emoji: "🌸",
    description: "体重とひとことメモだけ。毎日10秒で記録して、続けることを大事にしたい人に。",
  },
  {
    key: "B",
    short: "しっかり",
    label: "B しっかりモード",
    emoji: "📊",
    description: "食事の区分・カロリー・体脂肪率・BMI・グラフまで。数字で管理したい人に。",
  },
];

export const personaInfo = (p: Persona) => PERSONAS.find((x) => x.key === p)!;

/** B（しっかり）の機能を出すか。読み込み前（null）は B として扱う */
export const showsDetail = (persona: Persona | undefined | null) => persona !== "A";
