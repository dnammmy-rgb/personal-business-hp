// 「まぜまぜモード」：九九の計算問題と漢字の問題を、だいたい半分ずつまぜて出題する。
// 出題ロジック自体はkuku.js（generateKukuQuestion）とkanjiMode.js（generateKanjiQuestionForTier）を
// そのまま再利用し、敵の強さ（tier）による難易度調整もそれぞれの既存ロジックに乗る。
const MIXED_KANJI_RATIO = 0.5;
const MIXED_RECENT_HISTORY_SIZE = 6;

const MixedMode = {
  id: "mixed",
  recentKeys: [],

  reset() {
    this.recentKeys = [];
  },

  nextQuestion(tier) {
    let question;
    let attempts = 0;

    // 同じ問題文が続けて出ないよう、直近と被ったら数回だけ引き直す
    do {
      question = Math.random() < MIXED_KANJI_RATIO ? generateKanjiQuestionForTier(tier) : generateKukuQuestion(tier);
      attempts += 1;
    } while (this.recentKeys.includes(question.question) && attempts < 10);

    this.recentKeys.push(question.question);
    if (this.recentKeys.length > MIXED_RECENT_HISTORY_SIZE) {
      this.recentKeys.shift();
    }

    return question;
  },
};
