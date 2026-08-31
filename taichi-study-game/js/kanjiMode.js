// 「漢字モード」：小学1・2年生で習う漢字を出題する。
// 敵の強さ（tier）に応じて、出す問題の種類・むずかしさの配分を少しずつ変える。
//   ザコ敵　　：やさしい読み問題中心（1年生レベルを多め）
//   中ボス　　：2年生レベル中心＋文章の中の読み・反対語・なかま・季節や曜日などの並び
//   ラスボス　：中ボスと同じ種類の問題を、より難しい方に重みづけ（習っていない漢字は出さない）
const KANJI_RECENT_HISTORY_SIZE = 6;

const KanjiMode = {
  id: "kanji",
  recentKeys: [],

  reset() {
    this.recentKeys = [];
  },

  nextQuestion(tier) {
    let question;
    let attempts = 0;

    // 同じ問題文が続けて出ないよう、直近と被ったら数回だけ引き直す
    do {
      question = generateKanjiQuestionForTier(tier);
      attempts += 1;
    } while (this.recentKeys.includes(question.question) && attempts < 10);

    this.recentKeys.push(question.question);
    if (this.recentKeys.length > KANJI_RECENT_HISTORY_SIZE) {
      this.recentKeys.shift();
    }

    return question;
  },
};

// tierに応じた重み付き抽選で、出題する種類を選ぶ
function generateKanjiQuestionForTier(tier) {
  if (tier === "boss") {
    return pickWeighted([
      [35, () => generateReadingQuestion(2)],
      [25, generateSentenceQuestion],
      [20, generateAntonymQuestion],
      [10, generateSequenceQuestion],
      [10, generateCategoryQuestion],
    ])();
  }
  if (tier === "lastboss") {
    return pickWeighted([
      [25, () => generateReadingQuestion(2)],
      [30, generateSentenceQuestion],
      [20, generateAntonymQuestion],
      [15, generateSequenceQuestion],
      [10, generateCategoryQuestion],
    ])();
  }
  // ザコ敵：やさしい読み問題のみ。1年生レベルを多め、2年生レベルも少しまぜる
  return generateReadingQuestion(Math.random() < 0.75 ? 1 : 2);
}

function pickWeighted(options) {
  const total = options.reduce((sum, [weight]) => sum + weight, 0);
  let r = Math.random() * total;
  for (const [weight, fn] of options) {
    if (r < weight) return fn;
    r -= weight;
  }
  return options[options.length - 1][1];
}

// 「（ひらがな）」を かんじで かくと、どれ？
function generateReadingQuestion(levelPref) {
  const pool = KANJI_WORDS.filter((w) => w.level === levelPref);
  const entry = pickOne(pool.length ? pool : KANJI_WORDS);
  return {
    type: "kanji",
    question: `「${entry.reading}」を かんじで かくと、どれ？`,
    answer: entry.kanji,
    correctChoice: entry.kanji,
    choices: buildKanjiChoices(entry),
  };
}

// 「（みじかい文）」の「（ひらがな）」を かんじで かくと、どれ？
function generateSentenceQuestion() {
  const withSentence = KANJI_WORDS.filter((w) => w.sentence);
  const entry = pickOne(withSentence);
  return {
    type: "kanji",
    question: `「${entry.sentence}」の「${entry.reading}」を かんじで かくと、どれ？`,
    answer: entry.kanji,
    correctChoice: entry.kanji,
    choices: buildKanjiChoices(entry),
  };
}

// 「○」の はんたいは どれ？
function generateAntonymQuestion() {
  const pair = pickOne(KANJI_ANTONYMS);
  const [word, answerKanji] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
  const distractors = pickRandomKanji(2, [word, answerKanji]);
  return {
    type: "kanji",
    question: `「${word}」の はんたいは どれ？`,
    answer: answerKanji,
    correctChoice: answerKanji,
    choices: shuffleKanjiChoices([answerKanji, ...distractors]),
  };
}

// ○・○・○・？ の ？に はいる かんじは どれ？（季節・曜日・方角の並び）
function generateSequenceQuestion() {
  const names = Object.keys(KANJI_SEQUENCES);
  const seq = KANJI_SEQUENCES[pickOne(names)];
  const start = Math.floor(Math.random() * seq.length);
  const shown = [0, 1, 2].map((i) => seq[(start + i) % seq.length]);
  const answerKanji = seq[(start + 3) % seq.length];
  const distractors = pickRandomKanji(2, [...shown, answerKanji]);
  return {
    type: "kanji",
    question: `${shown.join("・")}・○ の ○に はいる かんじは どれ？`,
    answer: answerKanji,
    correctChoice: answerKanji,
    choices: shuffleKanjiChoices([answerKanji, ...distractors]),
  };
}

// つぎのうち、○○のなかまはどれ？
function generateCategoryQuestion() {
  const clusterCounts = {};
  KANJI_WORDS.forEach((w) => {
    clusterCounts[w.cluster] = (clusterCounts[w.cluster] || 0) + 1;
  });
  const eligibleClusters = Object.keys(clusterCounts).filter((c) => clusterCounts[c] >= 2);
  const cluster = pickOne(eligibleClusters);
  const members = KANJI_WORDS.filter((w) => w.cluster === cluster);
  const correctEntry = pickOne(members);
  const distractors = pickRandomKanji(2, [correctEntry.kanji], (w) => w.cluster !== cluster);

  return {
    type: "kanji",
    question: `つぎのうち、${KANJI_CLUSTER_LABELS[cluster] || cluster}の なかまは どれ？`,
    answer: correctEntry.kanji,
    correctChoice: correctEntry.kanji,
    choices: shuffleKanjiChoices([correctEntry.kanji, ...distractors]),
  };
}

// まちがいの漢字は、できるだけ「同じなかま・同じレベル」から選ぶ
function buildKanjiChoices(entry) {
  const sameClusterSameLevel = KANJI_WORDS.filter(
    (w) => w.cluster === entry.cluster && w.level === entry.level && w.kanji !== entry.kanji
  );
  const sameCluster = KANJI_WORDS.filter((w) => w.cluster === entry.cluster && w.kanji !== entry.kanji);
  const sameLevel = KANJI_WORDS.filter((w) => w.level === entry.level && w.kanji !== entry.kanji);

  const pool =
    sameClusterSameLevel.length >= 2 ? sameClusterSameLevel
    : sameCluster.length >= 2 ? sameCluster
    : sameLevel.length >= 2 ? sameLevel
    : KANJI_WORDS.filter((w) => w.kanji !== entry.kanji);

  const distractors = pickRandom(pool, 2).map((w) => w.kanji);
  return shuffleKanjiChoices([entry.kanji, ...distractors]);
}

function pickRandomKanji(count, exclude, extraFilter) {
  const seen = new Set();
  const pool = [];
  KANJI_WORDS.forEach((w) => {
    if (exclude.includes(w.kanji) || seen.has(w.kanji)) return;
    if (extraFilter && !extraFilter(w)) return;
    seen.add(w.kanji);
    pool.push(w.kanji);
  });
  return pickRandom(pool, count);
}

function pickOne(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickRandom(array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function shuffleKanjiChoices(choices) {
  const result = [...choices];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
