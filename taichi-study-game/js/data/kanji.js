// 漢字モード用のデータ（小学1・2年生で習う漢字より出題）。
// level: 1=小学1年生レベル（やさしい）、2=小学2年生レベル
// cluster: 「まちがいの漢字」を同じなかまから選ぶための分類。「なかま」問題の出題にも使う
// sentence: 文章の中から答える問題（例：「あおい そら」の「そら」）用の短い例文。無い語は出題されない
const KANJI_WORDS = [
  // ---- 天気（weather） ----
  { reading: "くも", kanji: "雲", cluster: "weather", level: 2, sentence: "しろい くも" },
  { reading: "ゆき", kanji: "雪", cluster: "weather", level: 2 },
  { reading: "かぜ", kanji: "風", cluster: "weather", level: 2 },
  { reading: "ほし", kanji: "星", cluster: "weather", level: 2, sentence: "ひかる ほし" },
  { reading: "そら", kanji: "空", cluster: "weather", level: 1, sentence: "あおい そら" },
  { reading: "あめ", kanji: "雨", cluster: "weather", level: 1 },

  // ---- しぜん（nature） ----
  { reading: "うみ", kanji: "海", cluster: "nature", level: 2, sentence: "ひろい うみ" },
  { reading: "いけ", kanji: "池", cluster: "nature", level: 2 },
  { reading: "たに", kanji: "谷", cluster: "nature", level: 2 },
  { reading: "いわ", kanji: "岩", cluster: "nature", level: 2 },
  { reading: "やま", kanji: "山", cluster: "nature", level: 1 },
  { reading: "かわ", kanji: "川", cluster: "nature", level: 1 },
  { reading: "はな", kanji: "花", cluster: "nature", level: 1 },
  { reading: "き", kanji: "木", cluster: "nature", level: 1 },

  // ---- いきもの（animal） ----
  { reading: "とり", kanji: "鳥", cluster: "animal", level: 2, sentence: "とぶ とり" },
  { reading: "うし", kanji: "牛", cluster: "animal", level: 2 },
  { reading: "うま", kanji: "馬", cluster: "animal", level: 2 },
  { reading: "さかな", kanji: "魚", cluster: "animal", level: 1, sentence: "およぐ さかな" },
  { reading: "いぬ", kanji: "犬", cluster: "animal", level: 1 },

  // ---- からだ（body） ----
  { reading: "かお", kanji: "顔", cluster: "body", level: 2, sentence: "わらう かお" },
  { reading: "くび", kanji: "首", cluster: "body", level: 2 },
  { reading: "こえ", kanji: "声", cluster: "body", level: 2, sentence: "おおきい こえ" },
  { reading: "あたま", kanji: "頭", cluster: "body", level: 2 },
  { reading: "こころ", kanji: "心", cluster: "body", level: 2 },

  // ---- かぞく（family） ----
  { reading: "ちち", kanji: "父", cluster: "family", level: 2, sentence: "やさしい ちち" },
  { reading: "はは", kanji: "母", cluster: "family", level: 2, sentence: "やさしい はは" },
  { reading: "あに", kanji: "兄", cluster: "family", level: 2, sentence: "つよい あに" },
  { reading: "あね", kanji: "姉", cluster: "family", level: 2, sentence: "やさしい あね" },
  { reading: "おとうと", kanji: "弟", cluster: "family", level: 2 },
  { reading: "いもうと", kanji: "妹", cluster: "family", level: 2 },

  // ---- きせつ（season） ----
  { reading: "はる", kanji: "春", cluster: "season", level: 2, sentence: "あたたかい はる" },
  { reading: "なつ", kanji: "夏", cluster: "season", level: 2, sentence: "あつい なつ" },
  { reading: "あき", kanji: "秋", cluster: "season", level: 2, sentence: "すずしい あき" },
  { reading: "ふゆ", kanji: "冬", cluster: "season", level: 2, sentence: "さむい ふゆ" },

  // ---- ほうがく（direction） ----
  { reading: "ひがし", kanji: "東", cluster: "direction", level: 2, sentence: "あさひの ひがし" },
  { reading: "にし", kanji: "西", cluster: "direction", level: 2 },
  { reading: "みなみ", kanji: "南", cluster: "direction", level: 2 },
  { reading: "きた", kanji: "北", cluster: "direction", level: 2 },

  // ---- たべもの（food） ----
  { reading: "こめ", kanji: "米", cluster: "food", level: 2, sentence: "しろい こめ" },
  { reading: "むぎ", kanji: "麦", cluster: "food", level: 2 },
  { reading: "ちゃ", kanji: "茶", cluster: "food", level: 2, sentence: "あつい ちゃ" },
  { reading: "にく", kanji: "肉", cluster: "food", level: 2 },

  // ---- じかん（time） ----
  { reading: "あさ", kanji: "朝", cluster: "time", level: 2, sentence: "はやい あさ" },
  { reading: "ひる", kanji: "昼", cluster: "time", level: 2 },
  { reading: "よる", kanji: "夜", cluster: "time", level: 2, sentence: "くらい よる" },
  { reading: "いま", kanji: "今", cluster: "time", level: 2 },

  // ---- いろ（color） ----
  { reading: "あか", kanji: "赤", cluster: "color", level: 1 },
  { reading: "あお", kanji: "青", cluster: "color", level: 1 },
  { reading: "しろ", kanji: "白", cluster: "color", level: 1 },

  // ---- いち・おおきさ（position/size） ----
  { reading: "おおきい", kanji: "大", cluster: "position", level: 1 },
  { reading: "ちいさい", kanji: "小", cluster: "position", level: 1 },
  { reading: "うえ", kanji: "上", cluster: "position", level: 1 },
  { reading: "した", kanji: "下", cluster: "position", level: 1 },

  // ---- がっこう（school） ----
  { reading: "とも", kanji: "友", cluster: "school", level: 2 },
  { reading: "かみ", kanji: "紙", cluster: "school", level: 2 },
  { reading: "かず", kanji: "数", cluster: "school", level: 2 },
];

// 「なかま」問題（例：つぎのうち、どうぶつのなかまはどれ？）で使う、クラスターのひらがな名前
const KANJI_CLUSTER_LABELS = {
  weather: "てんき",
  nature: "しぜん",
  animal: "いきもの",
  body: "からだ",
  family: "かぞく",
  season: "きせつ",
  direction: "ほうがく",
  food: "たべもの",
  time: "じかん",
  color: "いろ",
  position: "おおきさ・いち",
  school: "がっこう",
};

// 反対語（例：「東」の反対は？→西）。中ボス・ラスボスの問題で使う
const KANJI_ANTONYMS = [
  ["東", "西"],
  ["南", "北"],
  ["上", "下"],
  ["大", "小"],
  ["朝", "夜"],
  ["兄", "弟"],
  ["姉", "妹"],
  ["父", "母"],
];

// 順番に並ぶ漢字（例：はる・なつ・あき・○ → ふゆ）。中ボス・ラスボスの問題で使う
const KANJI_SEQUENCES = {
  season: ["春", "夏", "秋", "冬"],
  weekday: ["月", "火", "水", "木", "金", "土", "日"],
  direction: ["東", "西", "南", "北"],
};
