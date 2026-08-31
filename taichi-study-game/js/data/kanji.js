// 漢字モード用のデータ（小学2年生で習う漢字より、ひらがな語→漢字1文字を出題）。
// cluster は「まちがいの漢字」を同じなかまから選ぶための分類（天気・生き物など）。
const KANJI_WORDS = [
  { reading: "くも", kanji: "雲", cluster: "weather" },
  { reading: "ゆき", kanji: "雪", cluster: "weather" },
  { reading: "かぜ", kanji: "風", cluster: "weather" },
  { reading: "ほし", kanji: "星", cluster: "weather" },

  { reading: "うみ", kanji: "海", cluster: "nature" },
  { reading: "いけ", kanji: "池", cluster: "nature" },
  { reading: "たに", kanji: "谷", cluster: "nature" },
  { reading: "いわ", kanji: "岩", cluster: "nature" },

  { reading: "とり", kanji: "鳥", cluster: "animal" },
  { reading: "うし", kanji: "牛", cluster: "animal" },
  { reading: "うま", kanji: "馬", cluster: "animal" },
  { reading: "さかな", kanji: "魚", cluster: "animal" },

  { reading: "かお", kanji: "顔", cluster: "body" },
  { reading: "くび", kanji: "首", cluster: "body" },
  { reading: "こえ", kanji: "声", cluster: "body" },
  { reading: "あたま", kanji: "頭", cluster: "body" },
  { reading: "こころ", kanji: "心", cluster: "body" },

  { reading: "ちち", kanji: "父", cluster: "family" },
  { reading: "はは", kanji: "母", cluster: "family" },
  { reading: "あに", kanji: "兄", cluster: "family" },
  { reading: "あね", kanji: "姉", cluster: "family" },
  { reading: "おとうと", kanji: "弟", cluster: "family" },
  { reading: "いもうと", kanji: "妹", cluster: "family" },

  { reading: "はる", kanji: "春", cluster: "season" },
  { reading: "なつ", kanji: "夏", cluster: "season" },
  { reading: "あき", kanji: "秋", cluster: "season" },
  { reading: "ふゆ", kanji: "冬", cluster: "season" },

  { reading: "ひがし", kanji: "東", cluster: "direction" },
  { reading: "にし", kanji: "西", cluster: "direction" },
  { reading: "みなみ", kanji: "南", cluster: "direction" },
  { reading: "きた", kanji: "北", cluster: "direction" },

  { reading: "こめ", kanji: "米", cluster: "food" },
  { reading: "むぎ", kanji: "麦", cluster: "food" },
  { reading: "ちゃ", kanji: "茶", cluster: "food" },
  { reading: "にく", kanji: "肉", cluster: "food" },

  { reading: "あさ", kanji: "朝", cluster: "time" },
  { reading: "ひる", kanji: "昼", cluster: "time" },
  { reading: "よる", kanji: "夜", cluster: "time" },
  { reading: "いま", kanji: "今", cluster: "time" },
];
