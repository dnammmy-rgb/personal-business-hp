# 敵モンスター画像

## 現在使用中の画像

以下の8体は、ユーザー提供の「敵キャラずかん」画像から切り出し・背景透過して作成し、
`js/data/monsters.js` から使用しています。

| ファイル | キャラクター | 分類 |
|---|---|---|
| `kodako.png` | こだこ | ザコ敵 |
| `kojake.png` | 小ジャケ | ザコ敵 |
| `tatsunootoshigo.png` | タツノオトシゴ | ザコ敵 |
| `sake.png` | 鮭 | ザコ敵 |
| `aooni.png` | 青鬼 | 中ボス |
| `akaoni.png` | 赤鬼 | 中ボス |
| `kurooni.png` | 黒鬼 | 中ボス |
| `lastboss.png` | ラスボス（戦闘中は「？？？」、倒すと「大魔王 闇」と判明） | ラスボス |

`ChatGPT Image ....png` は元の「敵キャラずかん」原画像（アーカイブ用に残しています）。

## 新しいモンスター画像を追加する場合

`assets/images/monsters/` にPNG（背景透過推奨）を配置し、`js/data/monsters.js` の該当モンスターに
以下のように `image` と `tier`（`"zako"` / `"boss"` / `"lastboss"`）を追加してください。

```js
{ name: "オニタロウ", image: "assets/images/monsters/onitarou.png", tier: "zako", hpMax: 3 }
```
