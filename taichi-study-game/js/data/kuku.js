// 九九の計算問題を1問作る（1〜9のだん × 1〜9）。答えは数字入力で答える形式。
function generateKukuQuestion() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const answer = a * b;
  return {
    type: "kuku",
    question: `${a} × ${b} ＝ ？`,
    formula: `${a}×${b}`,
    answer,
  };
}
