// 「かけ算モード」：九九の計算問題とかけ算文章題をまぜて出題する。
const MULTIPLICATION_WORD_RATIO = 0.4; // 文章題を出す割合（のこりは九九の計算問題）
const RECENT_HISTORY_SIZE = 5; // 直近このかずの問題とは かぶらないようにする

const MultiplicationMode = {
  id: "multiplication",
  recentKeys: [],

  reset() {
    this.recentKeys = [];
  },

  nextQuestion() {
    let question;
    let key;
    let attempts = 0;

    // 同じ問題が続けて出ないよう、直近と被ったら数回だけ引き直す
    do {
      question = Math.random() < MULTIPLICATION_WORD_RATIO ? pickWordProblem() : generateKukuQuestion();
      key = `${question.type}:${question.formula}`;
      attempts += 1;
    } while (this.recentKeys.includes(key) && attempts < 10);

    this.recentKeys.push(key);
    if (this.recentKeys.length > RECENT_HISTORY_SIZE) {
      this.recentKeys.shift();
    }

    return question;
  },
};

function pickWordProblem() {
  const source = MULTIPLICATION_WORD_PROBLEMS[Math.floor(Math.random() * MULTIPLICATION_WORD_PROBLEMS.length)];
  return { ...source, correctChoice: source.formula, choices: buildFormulaChoices(source.formula) };
}

// 文章題の「式の3択」を作る。
// まちがいの式は2種類：①かける数とかけられる数を入れ替えたもの ②どちらかの数字を1つだけずらしたもの
function buildFormulaChoices(formula) {
  const [a, b] = formula.split("×").map(Number);
  const correct = `${a}×${b}`;
  const swapped = `${b}×${a}`;

  let nudged;
  let attempts = 0;
  do {
    const nudgeFirst = Math.random() < 0.5;
    const delta = Math.random() < 0.5 ? -1 : 1;
    const na = nudgeFirst ? Math.max(1, a + delta) : a;
    const nb = nudgeFirst ? b : Math.max(1, b + delta);
    nudged = `${na}×${nb}`;
    attempts += 1;
  } while ((nudged === correct || nudged === swapped) && attempts < 10);

  return shuffleChoices([correct, swapped, nudged]);
}

function shuffleChoices(choices) {
  const result = [...choices];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
