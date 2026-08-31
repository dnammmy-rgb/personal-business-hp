// かけ算の文章題データ。
// どれも「1回のかけ算だけ」で答えられる、小学2年生向けの短い文章題。
// 新しい問題を増やしたいときは、この配列に
// { type: "word", question: "…", formula: "◯×◯", answer: ◯◯ } を追加するだけでよい。
const MULTIPLICATION_WORD_PROBLEMS = [
  { type: "word", question: "1つの はこに りんごが 4こ はいっています。はこが 3こ あります。りんごは ぜんぶで なんこですか？", formula: "4×3", answer: 12 },
  { type: "word", question: "1だいの くるまに タイヤが 4こ あります。くるまが 5だい あります。タイヤは ぜんぶで なんこですか？", formula: "4×5", answer: 20 },
  { type: "word", question: "1チームに 6にん います。4チームでは なんにんに なりますか？", formula: "6×4", answer: 24 },
  { type: "word", question: "1ぴきの たこには あしが 8ほん あります。たこが 3びき いたら、あしは ぜんぶで なんぼんですか？", formula: "8×3", answer: 24 },
  { type: "word", question: "こだこが 3びき います。1ぴきが いしを 2こずつ もっています。いしは ぜんぶで なんこですか？", formula: "2×3", answer: 6 },
  { type: "word", question: "モンスターを 1たい たおすと、コインが 3まい もらえます。モンスターを 5たい たおすと、コインは ぜんぶで なんまいに なりますか？", formula: "3×5", answer: 15 },
  { type: "word", question: "1つの ふくろに あめが 5こ はいっています。ふくろが 6つ あります。あめは ぜんぶで なんこですか？", formula: "5×6", answer: 30 },
  { type: "word", question: "1ぽんの えんぴつが 7えんです。えんぴつを 4ほん かうと、いくらに なりますか？", formula: "7×4", answer: 28 },
  { type: "word", question: "1はこに ケーキが 6こ はいっています。はこが 7はこ あります。ケーキは ぜんぶで なんこですか？", formula: "6×7", answer: 42 },
  { type: "word", question: "1ぽんの きに りんごが 9こ なっています。きが 3ぼん あります。りんごは ぜんぶで なんこですか？", formula: "9×3", answer: 27 },
  { type: "word", question: "1つの すいそうに きんぎょが 4ひき います。すいそうが 8つ あります。きんぎょは ぜんぶで なんびきですか？", formula: "4×8", answer: 32 },
  { type: "word", question: "1にんが おりがみを 5まいずつ もらいます。7にんに くばると、おりがみは ぜんぶで なんまい いりますか？", formula: "5×7", answer: 35 },
  { type: "word", question: "1つの プリンに いちごが 2こ のっています。プリンが 9こ あります。いちごは ぜんぶで なんこ いりますか？", formula: "2×9", answer: 18 },
  { type: "word", question: "1だいの じてんしゃに しゃりんが 2こ あります。じてんしゃが 6だい あります。しゃりんは ぜんぶで なんこですか？", formula: "2×6", answer: 12 },
  { type: "word", question: "ばななが 1ふさに 3ぼんずつ あります。ふさが 8つ あります。ばななは ぜんぶで なんぼんですか？", formula: "3×8", answer: 24 },
  { type: "word", question: "おばけが 1ぴきにつき、キャンディを 4こ もっています。おばけが 6ぴき いたら、キャンディは ぜんぶで なんこですか？", formula: "4×6", answer: 24 },
  { type: "word", question: "1しゅうかんは 7にちです。3しゅうかんでは なんにちに なりますか？", formula: "7×3", answer: 21 },
  { type: "word", question: "はなだんに チューリップが 1れつに 6ほん さいています。れつが 4れつ あります。チューリップは ぜんぶで なんぼんですか？", formula: "6×4", answer: 24 },
  { type: "word", question: "1つの おさらに クッキーが 8まい のっています。おさらが 4まい あります。クッキーは ぜんぶで なんまいですか？", formula: "8×4", answer: 32 },
  { type: "word", question: "ドラゴンの たまごが 1つの すに 3こ あります。すが 9つ あります。たまごは ぜんぶで なんこですか？", formula: "3×9", answer: 27 },
  { type: "word", question: "1つの はこに ボールが 1こ はいっています。はこが 7こ あります。ボールは ぜんぶで なんこですか？", formula: "1×7", answer: 7 },
  { type: "word", question: "1にんが えんぴつを 9ほんずつ もっています。2にんでは えんぴつは ぜんぶで なんぼんですか？", formula: "9×2", answer: 18 },
];
