# 敵モンスター画像

ここに敵キャラクターの画像ファイル（PNG推奨、背景透過だとなお良い）を配置してください。

配置後、`js/data/monsters.js` の該当モンスターに以下のように `image` を追加すると、
絵文字の代わりに画像が表示されるようになります（実装済みになり次第）。

```js
{ name: "オニタロウ", emoji: "👹", image: "assets/images/monsters/onitarou.png", hpMax: 3 }
```
