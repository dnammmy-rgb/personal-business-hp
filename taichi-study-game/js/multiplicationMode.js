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
  return { ...source };
}
