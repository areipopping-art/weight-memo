/**
 * アプリのキャラクター（オリジナルの女の子のイラスト）。
 * mood で表情が変わる：happy にこにこ / cheer 応援 / celebrate お祝い / sleepy ねむい
 */
export type Mood = "happy" | "cheer" | "celebrate" | "sleepy";

const HAIR = "#8a5a48";
const HAIR_SHADE = "#734a3b";
const SKIN = "#ffe6d8";
const LINE = "#5b3a33";
const CHEEK = "#ff9fbd";
const RIBBON = "#ff7aa3";
const MOUTH = "#e0567f";

function Eyes({ mood }: { mood: Mood }) {
  const stroke = { stroke: LINE, strokeWidth: 3, strokeLinecap: "round" as const, fill: "none" };
  switch (mood) {
    case "happy": // ◠ ◠
      return (
        <>
          <path d="M42 73 Q48 66 54 73" {...stroke} />
          <path d="M66 73 Q72 66 78 73" {...stroke} />
        </>
      );
    case "cheer": // きらきらの目
      return (
        <>
          {[48, 72].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={72} rx={4.2} ry={5.2} fill={LINE} />
              <circle cx={x + 1.4} cy={70} r={1.6} fill="#fff" />
              <circle cx={x - 1.2} cy={74} r={0.8} fill="#fff" />
            </g>
          ))}
        </>
      );
    case "celebrate": // ＞ ＜ ではなく ^ ^（うれしくて目をつぶる）
      return (
        <>
          <path d="M42 74 L48 68 L54 74" {...stroke} strokeLinejoin="round" />
          <path d="M66 74 L72 68 L78 74" {...stroke} strokeLinejoin="round" />
        </>
      );
    case "sleepy": // ‿ ‿（とろんとした目）
      return (
        <>
          <path d="M42 72 Q48 76 54 72" {...stroke} />
          <path d="M66 72 Q72 76 78 72" {...stroke} />
        </>
      );
  }
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case "happy":
      return <path d="M55 84 Q60 89 65 84" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" fill="none" />;
    case "cheer":
      return <path d="M54 82 Q60 92 66 82 Z" fill={MOUTH} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />;
    case "celebrate":
      return (
        <>
          <path d="M51 81 Q60 96 69 81 Z" fill={MOUTH} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
          <path d="M55 88 Q60 92 65 88" fill="#ffb3c8" />
        </>
      );
    case "sleepy":
      return <ellipse cx={60} cy={85} rx={2.6} ry={2.2} fill={MOUTH} />;
  }
}

/** まわりの飾り（きらきら・こぶし・Zzz） */
function Extras({ mood }: { mood: Mood }) {
  switch (mood) {
    case "celebrate":
      return (
        <g fill="#ffc62a">
          <path d="M14 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M104 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <path d="M108 92 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#a685fb" />
          <circle cx={16} cy={94} r={3} fill="#74e2bd" />
        </g>
      );
    case "cheer":
      return (
        <g>
          {/* 「がんばれ！」のポンポン */}
          {[
            [101, 80],
            [109, 85],
            [106, 94],
            [96, 94],
            [93, 85],
            [101, 88],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={6} fill={i % 2 ? "#ffd84f" : "#ff9fbd"} />
          ))}
          <path d="M111 68 l5 -5 M115 76 l7 -2 M103 66 l1 -7" stroke="#ff7aa3" strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
    case "sleepy":
      return (
        <text x={92} y={30} fontSize={16} fontWeight={800} fill="#a685fb" fontFamily="sans-serif">
          z
          <tspan x={102} y={20} fontSize={12}>
            z
          </tspan>
        </text>
      );
    default:
      return null;
  }
}

export default function Mascot({
  mood = "happy",
  size = 96,
  className = "",
  label,
}: {
  mood?: Mood;
  size?: number;
  className?: string;
  /** 読み上げ用の説明。省略すると飾りとして扱う */
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* ポニーテール */}
      <path d="M86 40 Q114 44 108 78 Q104 90 94 84 Q102 66 86 52 Z" fill={HAIR} />
      <path d="M92 50 Q106 58 101 76" stroke={HAIR_SHADE} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* 後ろの髪 */}
      <circle cx={60} cy={60} r={37} fill={HAIR} />
      {/* 顔 */}
      <circle cx={60} cy={69} r={31} fill={SKIN} />
      {/* 前髪 */}
      <path
        d="M27 64 Q26 30 60 28 Q94 30 93 64 Q87 50 76 45 Q72 55 61 53 Q50 52 47 44 Q35 50 27 64 Z"
        fill={HAIR}
      />
      {/* リボン */}
      <g transform="translate(88 36) rotate(20)">
        <path d="M0 0 L-12 -8 L-12 8 Z" fill={RIBBON} />
        <path d="M0 0 L12 -8 L12 8 Z" fill={RIBBON} />
        <circle r={4} fill="#ff5c8e" />
      </g>
      {/* ほっぺ */}
      <ellipse cx={40} cy={82} rx={6.5} ry={4} fill={CHEEK} opacity={0.75} />
      <ellipse cx={80} cy={82} rx={6.5} ry={4} fill={CHEEK} opacity={0.75} />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      <Extras mood={mood} />
    </svg>
  );
}
