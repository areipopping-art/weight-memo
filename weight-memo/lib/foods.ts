// F-29 食品表からのカロリー自動計算
// 値は「食品カロリー計算表」（100g あたり kcal）による目安。
// F-30 たんぱく質・脂質・糖質は表になかったため、一般的な食品成分表（日本食品標準成分表）の目安値を入れた。
// ご飯・麺は調理後、肉・魚・野菜は生、小麦粉・米などの穀物は調理前の値。

export type FoodCategory = "grain" | "vegetable" | "fruit" | "meat" | "fish" | "eggDairyBean" | "oilSeasoning" | "sweets";

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  grain: "ご飯・穀物・小麦",
  vegetable: "野菜",
  fruit: "果物",
  meat: "肉",
  fish: "魚介",
  eggDairyBean: "卵・乳・豆",
  oilSeasoning: "油・調味料",
  sweets: "お菓子・パン",
};

export const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  grain: "🍚",
  vegetable: "🥬",
  fruit: "🍎",
  meat: "🍖",
  fish: "🐟",
  eggDairyBean: "🥚",
  oilSeasoning: "🧈",
  sweets: "🍰",
};

/** よく食べる量の目安（例：1杯 150g） */
export type FoodUnit = { label: string; grams: number };

export type Food = {
  name: string;
  kcalPer100g: number;
  /** F-30 100g あたりのたんぱく質・脂質・糖質（g）。糖質 ＝ 炭水化物 − 食物繊維 */
  protein: number;
  fat: number;
  carbs: number;
  category: FoodCategory;
  /** 検索で使う別の呼び方（ひらがな・カタカナは区別しない） */
  aliases?: string[];
  unit?: FoodUnit;
};

function foods(category: FoodCategory, list: Omit<Food, "category">[]): Food[] {
  return list.map((f) => ({ ...f, category }));
}

export const FOODS: Food[] = [
  ...foods("grain", [
    { name: "白米（炊いたご飯）", kcalPer100g: 156, protein: 2.5, fat: 0.3, carbs: 35.6, aliases: ["ごはん", "ご飯", "ライス", "こめ", "米"], unit: { label: "1杯", grams: 150 } },
    { name: "玄米（炊いたご飯）", kcalPer100g: 152, protein: 2.8, fat: 1.0, carbs: 34.2, aliases: ["げんまい", "ごはん"], unit: { label: "1杯", grams: 150 } },
    { name: "おかゆ", kcalPer100g: 65, protein: 1.1, fat: 0.1, carbs: 15.6, aliases: ["かゆ"], unit: { label: "1杯", grams: 200 } },
    { name: "もち", kcalPer100g: 223, protein: 4.0, fat: 0.6, carbs: 49.5, aliases: ["餅"], unit: { label: "1個", grams: 50 } },
    { name: "食パン", kcalPer100g: 248, protein: 8.9, fat: 4.1, carbs: 42.2, aliases: ["ぱん", "トースト"], unit: { label: "6枚切り1枚", grams: 60 } },
    { name: "フランスパン", kcalPer100g: 289, protein: 9.4, fat: 1.3, carbs: 54.8, aliases: ["ぱん", "バゲット"] },
    { name: "うどん（ゆで）", kcalPer100g: 95, protein: 2.6, fat: 0.4, carbs: 20.8, aliases: ["饂飩"], unit: { label: "1玉", grams: 200 } },
    { name: "そば（ゆで）", kcalPer100g: 130, protein: 4.8, fat: 1.0, carbs: 24.0, aliases: ["蕎麦"], unit: { label: "1玉", grams: 200 } },
    { name: "中華麺（ゆで）", kcalPer100g: 133, protein: 4.9, fat: 0.6, carbs: 27.9, aliases: ["ラーメン", "ちゅうかめん", "焼きそば"], unit: { label: "1玉", grams: 200 } },
    { name: "パスタ（ゆで）", kcalPer100g: 150, protein: 5.8, fat: 0.9, carbs: 30.3, aliases: ["スパゲッティ", "スパゲティ"], unit: { label: "1人前", grams: 250 } },
    { name: "パスタ（乾燥）", kcalPer100g: 347, protein: 12.9, fat: 1.8, carbs: 68.9, aliases: ["スパゲッティ", "スパゲティ"], unit: { label: "1人前", grams: 100 } },
    { name: "小麦粉（薄力粉）", kcalPer100g: 349, protein: 8.3, fat: 1.5, carbs: 73.3, aliases: ["こむぎこ", "はくりきこ"] },
    { name: "小麦粉（強力粉）", kcalPer100g: 337, protein: 11.8, fat: 1.5, carbs: 69.0, aliases: ["こむぎこ", "きょうりきこ"] },
    { name: "米粉", kcalPer100g: 356, protein: 6.0, fat: 0.7, carbs: 81.3, aliases: ["こめこ"] },
    { name: "オートミール（乾燥）", kcalPer100g: 350, protein: 13.7, fat: 5.7, carbs: 59.7, aliases: ["オーツ"], unit: { label: "1食", grams: 30 } },
    { name: "コーンフレーク", kcalPer100g: 380, protein: 7.8, fat: 1.7, carbs: 81.2, aliases: ["シリアル"], unit: { label: "1食", grams: 40 } },
  ]),
  ...foods("vegetable", [
    { name: "キャベツ", kcalPer100g: 23, protein: 1.3, fat: 0.2, carbs: 3.4 },
    { name: "レタス", kcalPer100g: 11, protein: 0.6, fat: 0.1, carbs: 1.7 },
    { name: "白菜", kcalPer100g: 13, protein: 0.8, fat: 0.1, carbs: 1.9, aliases: ["はくさい"] },
    { name: "ほうれん草", kcalPer100g: 18, protein: 2.2, fat: 0.4, carbs: 0.3, aliases: ["ほうれんそう"] },
    { name: "小松菜", kcalPer100g: 13, protein: 1.5, fat: 0.2, carbs: 0.5, aliases: ["こまつな"] },
    { name: "ブロッコリー", kcalPer100g: 37, protein: 5.4, fat: 0.6, carbs: 1.5, unit: { label: "小房4つ", grams: 50 } },
    { name: "きゅうり", kcalPer100g: 13, protein: 1.0, fat: 0.1, carbs: 1.9, aliases: ["胡瓜"], unit: { label: "1本", grams: 100 } },
    { name: "トマト", kcalPer100g: 20, protein: 0.7, fat: 0.1, carbs: 3.7, unit: { label: "1個", grams: 150 } },
    { name: "ミニトマト", kcalPer100g: 30, protein: 1.1, fat: 0.1, carbs: 5.8, aliases: ["プチトマト"], unit: { label: "1個", grams: 10 } },
    { name: "大根", kcalPer100g: 15, protein: 0.5, fat: 0.1, carbs: 2.7, aliases: ["だいこん"] },
    { name: "にんじん", kcalPer100g: 35, protein: 0.7, fat: 0.2, carbs: 6.5, aliases: ["人参"] },
    { name: "玉ねぎ", kcalPer100g: 33, protein: 1.0, fat: 0.1, carbs: 6.9, aliases: ["たまねぎ", "玉葱"] },
    { name: "長ねぎ", kcalPer100g: 35, protein: 1.4, fat: 0.1, carbs: 5.8, aliases: ["ながねぎ", "ねぎ", "葱"] },
    { name: "ピーマン", kcalPer100g: 20, protein: 0.9, fat: 0.2, carbs: 2.8 },
    { name: "なす", kcalPer100g: 18, protein: 1.1, fat: 0.1, carbs: 2.9, aliases: ["茄子"] },
    { name: "もやし", kcalPer100g: 15, protein: 1.7, fat: 0.1, carbs: 1.3, unit: { label: "1袋", grams: 200 } },
    { name: "かぼちゃ", kcalPer100g: 78, protein: 1.9, fat: 0.3, carbs: 17.1, aliases: ["南瓜"] },
    { name: "さつまいも", kcalPer100g: 126, protein: 1.2, fat: 0.2, carbs: 28.3, aliases: ["さつま芋", "いも"] },
    { name: "じゃがいも", kcalPer100g: 59, protein: 1.8, fat: 0.1, carbs: 13.0, aliases: ["じゃが芋", "ポテト", "いも"], unit: { label: "1個", grams: 150 } },
    { name: "れんこん", kcalPer100g: 66, protein: 1.9, fat: 0.1, carbs: 13.5, aliases: ["蓮根"] },
    { name: "ごぼう", kcalPer100g: 58, protein: 1.8, fat: 0.1, carbs: 9.7, aliases: ["牛蒡"] },
    { name: "アボカド", kcalPer100g: 176, protein: 2.1, fat: 17.5, carbs: 0.9, unit: { label: "1/2個", grams: 70 } },
  ]),
  // 補った値（表の果物は「りんごム 118」の1行だけで読み取れなかったため、一般的な目安を入れた）
  ...foods("fruit", [
    { name: "りんご", kcalPer100g: 53, protein: 0.1, fat: 0.2, carbs: 14.1, aliases: ["林檎"], unit: { label: "1/2個", grams: 125 } },
    { name: "バナナ", kcalPer100g: 93, protein: 1.1, fat: 0.2, carbs: 21.4, unit: { label: "1本", grams: 100 } },
    { name: "みかん", kcalPer100g: 49, protein: 0.7, fat: 0.1, carbs: 11.0, aliases: ["蜜柑"], unit: { label: "1個", grams: 80 } },
    { name: "いちご", kcalPer100g: 31, protein: 0.9, fat: 0.1, carbs: 7.1, aliases: ["苺", "ストロベリー"] },
    { name: "ぶどう", kcalPer100g: 58, protein: 0.4, fat: 0.1, carbs: 15.2, aliases: ["葡萄", "グレープ"] },
    { name: "キウイ", kcalPer100g: 51, protein: 1.0, fat: 0.2, carbs: 10.8, aliases: ["キウイフルーツ"], unit: { label: "1個", grams: 85 } },
    { name: "もも", kcalPer100g: 38, protein: 0.6, fat: 0.1, carbs: 8.9, aliases: ["桃", "ピーチ"] },
    { name: "なし", kcalPer100g: 38, protein: 0.3, fat: 0.1, carbs: 10.4, aliases: ["梨"] },
  ]),
  // 補った値（表に「4. 肉類」がなかったため、一般的な目安を入れた。鶏むねは「よく使う食品の量」の表の値）
  ...foods("meat", [
    { name: "鶏むね肉（皮なし）", kcalPer100g: 105, protein: 23.3, fat: 1.9, carbs: 0.1, aliases: ["とりむね", "鶏肉", "とりにく", "チキン"], unit: { label: "1枚の半分", grams: 100 } },
    { name: "鶏もも肉（皮つき）", kcalPer100g: 190, protein: 16.6, fat: 14.2, carbs: 0.0, aliases: ["とりもも", "鶏肉", "とりにく", "チキン"] },
    { name: "ささみ", kcalPer100g: 98, protein: 23.9, fat: 0.8, carbs: 0.1, aliases: ["鶏ささみ", "とりにく"], unit: { label: "1本", grams: 50 } },
    { name: "豚ロース", kcalPer100g: 248, protein: 19.3, fat: 19.2, carbs: 0.2, aliases: ["ぶた", "豚肉", "とんかつ"] },
    { name: "豚バラ", kcalPer100g: 366, protein: 14.4, fat: 35.4, carbs: 0.1, aliases: ["ぶた", "豚肉"] },
    { name: "豚ひき肉", kcalPer100g: 209, protein: 17.7, fat: 17.2, carbs: 0.1, aliases: ["ぶた", "豚肉", "ひきにく", "挽肉"] },
    { name: "牛もも", kcalPer100g: 196, protein: 19.5, fat: 13.3, carbs: 0.4, aliases: ["ぎゅう", "牛肉", "ビーフ"] },
    { name: "牛バラ", kcalPer100g: 381, protein: 12.8, fat: 39.4, carbs: 0.2, aliases: ["ぎゅう", "牛肉", "ビーフ", "カルビ"] },
    { name: "牛ひき肉", kcalPer100g: 251, protein: 17.1, fat: 21.1, carbs: 0.3, aliases: ["ぎゅう", "牛肉", "ひきにく", "挽肉"] },
    { name: "ロースハム", kcalPer100g: 211, protein: 18.6, fat: 14.5, carbs: 2.0, aliases: ["ハム"], unit: { label: "1枚", grams: 10 } },
    { name: "ベーコン", kcalPer100g: 400, protein: 12.9, fat: 39.1, carbs: 0.3, unit: { label: "1枚", grams: 17 } },
    { name: "ウインナー", kcalPer100g: 319, protein: 11.5, fat: 30.6, carbs: 3.3, aliases: ["ウィンナー", "ソーセージ"], unit: { label: "1本", grams: 20 } },
  ]),
  ...foods("fish", [
    { name: "鮭", kcalPer100g: 124, protein: 22.3, fat: 4.1, carbs: 0.1, aliases: ["さけ", "しゃけ", "サーモン"], unit: { label: "1切れ", grams: 80 } },
    { name: "さば", kcalPer100g: 211, protein: 20.6, fat: 16.8, carbs: 0.3, aliases: ["鯖"], unit: { label: "1切れ", grams: 80 } },
    { name: "まぐろ（赤身）", kcalPer100g: 115, protein: 26.4, fat: 1.4, carbs: 0.1, aliases: ["鮪", "マグロ", "刺身"] },
    { name: "まぐろ（トロ）", kcalPer100g: 308, protein: 20.1, fat: 27.5, carbs: 0.1, aliases: ["鮪", "マグロ", "とろ", "刺身"] },
    { name: "ぶり", kcalPer100g: 222, protein: 21.4, fat: 17.6, carbs: 0.3, aliases: ["鰤"], unit: { label: "1切れ", grams: 80 } },
    { name: "たら", kcalPer100g: 72, protein: 17.6, fat: 0.2, carbs: 0.1, aliases: ["鱈"], unit: { label: "1切れ", grams: 80 } },
    { name: "えび", kcalPer100g: 82, protein: 18.4, fat: 0.3, carbs: 0.3, aliases: ["海老", "エビ"] },
    { name: "いか", kcalPer100g: 76, protein: 17.9, fat: 0.8, carbs: 0.1, aliases: ["烏賊"] },
    { name: "たこ", kcalPer100g: 70, protein: 16.4, fat: 0.7, carbs: 0.1, aliases: ["蛸"] },
    { name: "あさり", kcalPer100g: 27, protein: 6.0, fat: 0.3, carbs: 0.4, aliases: ["浅蜊"] },
    { name: "ほたて", kcalPer100g: 66, protein: 13.5, fat: 0.9, carbs: 1.5, aliases: ["帆立"] },
    { name: "しらす", kcalPer100g: 113, protein: 23.1, fat: 1.6, carbs: 0.2 },
  ]),
  ...foods("eggDairyBean", [
    { name: "卵（全卵）", kcalPer100g: 142, protein: 12.2, fat: 10.2, carbs: 0.4, aliases: ["たまご", "玉子", "タマゴ", "ゆで卵", "目玉焼き"], unit: { label: "1個", grams: 50 } },
    { name: "牛乳", kcalPer100g: 61, protein: 3.3, fat: 3.8, carbs: 4.8, aliases: ["ぎゅうにゅう", "ミルク"], unit: { label: "1杯", grams: 200 } },
    { name: "低脂肪乳", kcalPer100g: 42, protein: 3.8, fat: 1.0, carbs: 5.5, aliases: ["ミルク"], unit: { label: "1杯", grams: 200 } },
    { name: "無脂肪ヨーグルト", kcalPer100g: 37, protein: 4.0, fat: 0.3, carbs: 5.7, aliases: ["よーぐると"], unit: { label: "1個", grams: 100 } },
    { name: "プレーンヨーグルト", kcalPer100g: 56, protein: 3.6, fat: 3.0, carbs: 4.9, aliases: ["よーぐると"], unit: { label: "1個", grams: 100 } },
    { name: "ギリシャヨーグルト", kcalPer100g: 100, protein: 9.0, fat: 5.0, carbs: 4.5, aliases: ["よーぐると"], unit: { label: "1個", grams: 100 } },
    { name: "プロセスチーズ", kcalPer100g: 313, protein: 22.7, fat: 26.0, carbs: 1.3, aliases: ["チーズ"], unit: { label: "1切れ", grams: 20 } },
    { name: "木綿豆腐", kcalPer100g: 73, protein: 7.0, fat: 4.9, carbs: 0.8, aliases: ["とうふ", "豆腐"], unit: { label: "1/2丁", grams: 150 } },
    { name: "絹ごし豆腐", kcalPer100g: 56, protein: 5.3, fat: 3.5, carbs: 1.1, aliases: ["とうふ", "豆腐"], unit: { label: "1/2丁", grams: 150 } },
    { name: "納豆", kcalPer100g: 184, protein: 16.5, fat: 10.0, carbs: 5.4, aliases: ["なっとう"], unit: { label: "1パック", grams: 45 } },
    { name: "豆乳（無調整）", kcalPer100g: 43, protein: 3.6, fat: 2.0, carbs: 2.9, aliases: ["とうにゅう"], unit: { label: "1杯", grams: 200 } },
    { name: "おから", kcalPer100g: 88, protein: 6.1, fat: 3.6, carbs: 2.3 },
    { name: "ゆで大豆", kcalPer100g: 163, protein: 14.8, fat: 9.8, carbs: 2.7, aliases: ["だいず"] },
  ]),
  ...foods("oilSeasoning", [
    { name: "サラダ油", kcalPer100g: 886, protein: 0, fat: 100, carbs: 0, aliases: ["あぶら", "油"], unit: { label: "小さじ1", grams: 4 } },
    { name: "オリーブオイル", kcalPer100g: 886, protein: 0, fat: 100, carbs: 0, aliases: ["あぶら", "油"], unit: { label: "小さじ1", grams: 4 } },
    { name: "ごま油", kcalPer100g: 890, protein: 0, fat: 100, carbs: 0, aliases: ["あぶら", "油", "胡麻油"], unit: { label: "小さじ1", grams: 4 } },
    { name: "バター", kcalPer100g: 700, protein: 0.6, fat: 81.0, carbs: 0.2, unit: { label: "1かけ", grams: 10 } },
    { name: "マヨネーズ", kcalPer100g: 668, protein: 1.4, fat: 76.0, carbs: 3.6, unit: { label: "大さじ1", grams: 12 } },
    { name: "ケチャップ", kcalPer100g: 104, protein: 1.6, fat: 0.2, carbs: 25.9, unit: { label: "大さじ1", grams: 15 } },
    { name: "醤油", kcalPer100g: 76, protein: 7.7, fat: 0, carbs: 7.9, aliases: ["しょうゆ"], unit: { label: "大さじ1", grams: 18 } },
    { name: "味噌", kcalPer100g: 182, protein: 12.5, fat: 6.0, carbs: 17.0, aliases: ["みそ", "味噌汁"], unit: { label: "大さじ1", grams: 18 } },
    { name: "砂糖", kcalPer100g: 391, protein: 0, fat: 0, carbs: 99.3, aliases: ["さとう"], unit: { label: "小さじ1", grams: 3 } },
    { name: "はちみつ", kcalPer100g: 329, protein: 0.3, fat: 0, carbs: 81.7, aliases: ["蜂蜜", "ハニー"], unit: { label: "大さじ1", grams: 21 } },
    { name: "ピーナッツ", kcalPer100g: 585, protein: 25.4, fat: 47.5, carbs: 11.4, aliases: ["落花生", "ナッツ"] },
    { name: "アーモンド", kcalPer100g: 609, protein: 19.6, fat: 51.8, carbs: 9.7, aliases: ["ナッツ"], unit: { label: "10粒", grams: 10 } },
    { name: "くるみ", kcalPer100g: 713, protein: 14.6, fat: 68.8, carbs: 4.2, aliases: ["胡桃", "ナッツ"] },
  ]),
  ...foods("sweets", [
    { name: "ショートケーキ", kcalPer100g: 320, protein: 6.9, fat: 14.0, carbs: 42.3, aliases: ["けーき"], unit: { label: "1個", grams: 100 } },
    { name: "チョコレート", kcalPer100g: 550, protein: 6.9, fat: 34.1, carbs: 51.9, aliases: ["ちょこ"], unit: { label: "1かけ", grams: 5 } },
    { name: "クッキー", kcalPer100g: 480, protein: 5.7, fat: 23.2, carbs: 62.6, aliases: ["ビスケット"], unit: { label: "1枚", grams: 10 } },
    { name: "ポテトチップス", kcalPer100g: 540, protein: 4.7, fat: 35.2, carbs: 50.5, aliases: ["ポテチ"], unit: { label: "1袋", grams: 60 } },
    { name: "どら焼き", kcalPer100g: 280, protein: 6.6, fat: 3.1, carbs: 55.9, aliases: ["どらやき"], unit: { label: "1個", grams: 80 } },
    { name: "大福", kcalPer100g: 250, protein: 4.8, fat: 0.5, carbs: 53.0, aliases: ["だいふく"], unit: { label: "1個", grams: 70 } },
    { name: "あんパン", kcalPer100g: 280, protein: 7.0, fat: 5.3, carbs: 48.0, aliases: ["ぱん"], unit: { label: "1個", grams: 100 } },
    { name: "メロンパン", kcalPer100g: 350, protein: 8.0, fat: 10.5, carbs: 57.6, aliases: ["ぱん"], unit: { label: "1個", grams: 100 } },
    // 補った値（表では「約4105」と数字が崩れていたため 410 にした）
    { name: "クロワッサン", kcalPer100g: 410, protein: 7.9, fat: 23.0, carbs: 42.0, aliases: ["ぱん"], unit: { label: "1個", grams: 40 } },
  ]),
];

export const MIN_GRAMS = 1;
export const MAX_GRAMS = 2000;

/** カロリー ＝ 100gあたりのkcal × 食べた量(g) ÷ 100（四捨五入） */
export function kcalOf(food: Pick<Food, "kcalPer100g">, grams: number): number {
  return Math.round((food.kcalPer100g * grams) / 100);
}

// F-30 たんぱく質・脂質・糖質

export type Nutrients = { protein: number; fat: number; carbs: number };
export const ZERO_NUTRIENTS: Nutrients = { protein: 0, fat: 0, carbs: 0 };

/** 小数第1位で四捨五入 */
const round1 = (n: number) => Math.round(n * 10) / 10;

/** 食べた量の栄養素（g） */
export function nutrientsOf(food: Pick<Food, "protein" | "fat" | "carbs">, grams: number): Nutrients {
  return {
    protein: round1((food.protein * grams) / 100),
    fat: round1((food.fat * grams) / 100),
    carbs: round1((food.carbs * grams) / 100),
  };
}

export function addNutrients(a: Nutrients, b: Nutrients): Nutrients {
  return { protein: round1(a.protein + b.protein), fat: round1(a.fat + b.fat), carbs: round1(a.carbs + b.carbs) };
}

export const NUTRIENT_LABELS: { key: keyof Nutrients; label: string }[] = [
  { key: "protein", label: "たんぱく質" },
  { key: "fat", label: "脂質" },
  { key: "carbs", label: "糖質" },
];

/** 例：たんぱく質 12.3g・脂質 4.5g・糖質 50.1g */
export function formatNutrients(n: Nutrients): string {
  return NUTRIENT_LABELS.map(({ key, label }) => `${label} ${n[key].toFixed(1)}g`).join("・");
}

/** グラム欄の文字列を数値に（範囲外・数字でなければ null） */
export function parseGrams(text: string): number | null {
  const s = text.trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < MIN_GRAMS || n > MAX_GRAMS) return null;
  return Math.round(n * 10) / 10;
}

/** 食事メモに書く短い名前（かっこの補足を外す。例：鶏むね肉（皮なし）→ 鶏むね肉） */
export function shortName(food: Pick<Food, "name">): string {
  return food.name.replace(/（.*?）/g, "");
}

/** 検索用に、カタカナをひらがなにして小文字にする */
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** 名前・別の呼び方で部分一致する食品（名前の先頭で一致するものを先に） */
export function searchFoods(query: string, limit: number): Food[] {
  const q = normalize(query);
  if (q === "") return [];
  const scored: { food: Food; score: number }[] = [];
  for (const food of FOODS) {
    const names = [food.name, ...(food.aliases ?? [])].map(normalize);
    if (names.some((n) => n.startsWith(q))) scored.push({ food, score: 0 });
    else if (names.some((n) => n.includes(q))) scored.push({ food, score: 1 });
  }
  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.food);
}
