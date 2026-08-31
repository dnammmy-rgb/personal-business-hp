// 「漢字モード」：小学2年生で習う漢字を、ひらがな語→漢字の3択で出題する。
const KANJI_RECENT_HISTORY_SIZE = 5;

const KanjiMode = {
  id: "kanji",
  recentKeys: [],

  reset() {
    this.recentKeys = [];
  },

  nextQuestion() {
    let entry;
    let attempts = 0;

    do {
      entry = KANJI_WORDS[Math.floor(Math.random() * KANJI_WORDS.length)];
      attempts += 1;
    } while (this.recentKeys.includes(entry.kanji) && attempts < 10);

    this.recentKeys.push(entry.kanji);
    if (this.recentKeys.length > KANJI_RECENT_HISTORY_SIZE) {
      this.recentKeys.shift();
    }

    return {
      type: "kanji",
      question: `「${entry.reading}」を かんじで かくと、どれ？`,
      answer: entry.kanji,
      correctChoice: entry.kanji,
      choices: buildKanjiChoices(entry),
    };
  },
};

// まちがいの漢字は、できるだけ同じなかま（天気・生き物など）から選ぶ
function buildKanjiChoices(entry) {
  const sameCluster = KANJI_WORDS.filter((w) => w.cluster === entry.cluster && w.kanji !== entry.kanji);
  const pool = sameCluster.length >= 2 ? sameCluster : KANJI_WORDS.filter((w) => w.kanji !== entry.kanji);
  const distractors = pickRandom(pool, 2).map((w) => w.kanji);
  return shuffleKanjiChoices([entry.kanji, ...distractors]);
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
