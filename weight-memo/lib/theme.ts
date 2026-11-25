// 性別ごとの言葉づかい・絵文字（女性：やさしくかわいい / 男性：クールで元気）

import type { Sex } from "./calorie";

export type ThemeCopy = {
  recordButton: string;
  goalEmoji: string;
  emptyHistory: string;
  celebrateTitle: string;
  celebrateBody: string;
  celebrateButton: string;
  personaAEmoji: string;
  switched: (mode: string) => string;
};

const FEMALE: ThemeCopy = {
  recordButton: "記録する 💖",
  goalEmoji: "🌸",
  emptyHistory: "まだ記録がないよ…",
  celebrateTitle: "やったね！目標達成🎉",
  celebrateBody: "毎日の記録、ほんとうにがんばったね！",
  celebrateButton: "ありがとう 💖",
  personaAEmoji: "🌸",
  switched: (mode) => `${mode}モードにしたよ！`,
};

const MALE: ThemeCopy = {
  recordButton: "記録する 🔥",
  goalEmoji: "🏁",
  emptyHistory: "まだ記録がない。今日からスタートだ！",
  celebrateTitle: "ミッションクリア！🏆",
  celebrateBody: "毎日の積み重ねの勝利だ。ナイスファイト！",
  celebrateButton: "よっしゃ！ 💪",
  personaAEmoji: "🌊",
  switched: (mode) => `${mode}モードに切り替えた！`,
};

/** 性別に合わせた文言（未設定は女性と同じ） */
export function themeCopy(sex: Sex | null | undefined): ThemeCopy {
  return sex === "male" ? MALE : FEMALE;
}
