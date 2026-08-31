// 漢字モード用の問題データ（TODO: ユーザーから出題したい漢字リストが届いたら実装する）。
//
// 実装イメージ（例）:
// const KANJI_LIST = [
//   { text: "「あめ」を漢字で書くと？", answer: "雨", choices: ["雨", "雲", "空", "花"] },
//   ...
// ];
// const KanjiMode = {
//   id: "kanji",
//   nextQuestion() {
//     const q = KANJI_LIST[Math.floor(Math.random() * KANJI_LIST.length)];
//     return { text: q.text, answer: q.answer, choices: shuffleChoices(q.choices) };
//   },
// };
//
// 現時点では未実装のため、main.js側でモード選択自体を無効化している。
