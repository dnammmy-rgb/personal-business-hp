// 九九モード用の問題生成ロジック。
const KukuMode = {
  id: "kuku",

  // ランダムな九九の問題を1問作る（1〜9のだん × 1〜9）
  nextQuestion() {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    const answer = a * b;
    return {
      text: `${a} × ${b} = ？`,
      answer,
      choices: buildChoices(answer),
    };
  },
};

// 正解と、正解に近いダミーの数字3つをシャッフルして4択にする
function buildChoices(answer) {
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const offset = 1 + Math.floor(Math.random() * 6);
    const sign = Math.random() < 0.5 ? -1 : 1;
    const dummy = answer + sign * offset;
    if (dummy > 0 && dummy !== answer) {
      choices.add(dummy);
    }
  }
  return shuffle([...choices]);
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
