// 九九の計算問題を1問作る（1〜9のだん × 1〜9）。答えは数字入力で答える形式。
// 敵の強さ（tier）に応じて、出やすい段を少しずつ変える：
//   ザコ敵　：1〜5の段を多め、6〜9の段も少し
//   中ボス　：6〜9の段を多め。7×8・8×9・6×7など少し難しい組み合わせも増やす
//   ラスボス：6〜9の段が中心（7・8・9を特に多め）、簡単な問題も少し混ぜる
const KUKU_POOL_ZAKO = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9];
const KUKU_POOL_BOSS = [3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const KUKU_POOL_LASTBOSS = [3, 4, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9];
const KUKU_EASY_POOL = [1, 2, 3, 4, 5];
const KUKU_HARD_COMBOS = [
  [7, 8], [8, 7], [8, 9], [9, 8], [6, 7], [7, 6], [7, 9], [9, 7],
];

function generateKukuQuestion(tier) {
  const [a, b] = pickKukuFactors(tier);
  const answer = a * b;
  return {
    type: "kuku",
    question: `${a} × ${b} ＝ ？`,
    formula: `${a}×${b}`,
    answer,
  };
}

function pickKukuFactors(tier) {
  if (tier === "lastboss") {
    if (Math.random() < 0.15) return [pickFromPool(KUKU_EASY_POOL), pickFromPool(KUKU_EASY_POOL)];
    return [pickFromPool(KUKU_POOL_LASTBOSS), pickFromPool(KUKU_POOL_LASTBOSS)];
  }
  if (tier === "boss") {
    if (Math.random() < 0.35) return KUKU_HARD_COMBOS[Math.floor(Math.random() * KUKU_HARD_COMBOS.length)];
    return [pickFromPool(KUKU_POOL_BOSS), pickFromPool(KUKU_POOL_BOSS)];
  }
  // ザコ敵（tier未指定時のデフォルトもこちら）
  return [pickFromPool(KUKU_POOL_ZAKO), pickFromPool(KUKU_POOL_ZAKO)];
}

function pickFromPool(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}
