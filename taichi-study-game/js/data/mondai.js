// 文章題モード用の問題データ（TODO: ユーザーから詳しい仕様が届いたら実装する）。
//
// 実装イメージ（例）:
// const MONDAI_LIST = [
//   { text: "1はこに あめが 4こ入っています。3ばこ分だと あめは何こ？", answer: 12, choices: [10, 12, 14, 16] },
//   ...
// ];
// const MondaiMode = {
//   id: "mondai",
//   nextQuestion() {
//     const q = MONDAI_LIST[Math.floor(Math.random() * MONDAI_LIST.length)];
//     return { text: q.text, answer: q.answer, choices: shuffleChoices(q.choices) };
//   },
// };
//
// 現時点では未実装のため、main.js側でモード選択自体を無効化している。
