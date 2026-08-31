// モンスターの一覧データ（「敵キャラずかん」のデザインに準拠）。
// tier: "zako"（ザコ敵）/ "boss"（中ボス）/ "lastboss"（ラスボス） … CSSの表示サイズ切り替えに使う
// revealName: ラスボスのように戦闘中は名前を伏せ、倒したときだけ本当の名前を表示したい場合に指定する
const MONSTERS = [
  { name: "こだこ", image: "assets/images/monsters/kodako.png", tier: "zako", hpMax: 2 },
  { name: "小ジャケ", image: "assets/images/monsters/kojake.png", tier: "zako", hpMax: 3 },
  { name: "タツノオトシゴ", image: "assets/images/monsters/tatsunootoshigo.png", tier: "zako", hpMax: 3 },
  { name: "鮭", image: "assets/images/monsters/sake.png", tier: "zako", hpMax: 4 },
  { name: "青鬼", image: "assets/images/monsters/aooni.png", tier: "boss", hpMax: 5 },
  { name: "赤鬼", image: "assets/images/monsters/akaoni.png", tier: "boss", hpMax: 5 },
  { name: "黒鬼", image: "assets/images/monsters/kurooni.png", tier: "boss", hpMax: 5 },
  { name: "？？？", revealName: "大魔王 闇", image: "assets/images/monsters/lastboss.png", tier: "lastboss", hpMax: 7 },
];
