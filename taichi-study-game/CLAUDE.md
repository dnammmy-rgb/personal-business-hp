# taichi-study-game — 開発ガイド（Claude Code用）

このファイルは `taichi-study-game/` フォルダ配下でのみ有効な作業ルールです。
**このプロジェクトの作業は必ずこのフォルダの中だけで完結させ、リポジトリの他の場所（親フォルダの `index.html` / `css` / `js` / `assets` など、既存の別プロジェクト「個人事業ホームページ」）には一切触らないこと。**

## 1. プロジェクト概要

- 小学2年生の自由研究用に作る、ブラウザで遊べる学習ゲーム。
- タイトル：「九九・かけ算文章題・漢字を学べるモンスターたいじゲーム」
- 学べる内容（2モード、共通の敵8体で戦う）
  1. **かけ算モード** — 九九の計算問題（数字入力・約60%）とかけ算文章題（式の3択・約40%）をまぜて出題
  2. **漢字モード** — 小学2年生で習う漢字36語を、ひらがな→漢字の3択で出題
- 遊び方：モンスターが出てきて、問題に正解すると攻撃してHPを削り、倒すと次のモンスターへ進む「たいじゲーム」形式。3問連続正解すると必殺技「怒りの拳」が出て大ダメージを与える。
- 対象環境：**iPadのSafari** と **PCのChrome** で動作すること（タッチ操作・マウス操作の両対応、レスポンシブ）。
- ビルドツール・フレームワーク不要。素のHTML/CSS/JSのみ（ローカルで二重クリック、または簡易HTTPサーバーで動作）。

## 2. 現在のステータス

- ✅ 画面遷移（タイトル→モード選択→バトル→リザルト）の骨組み
- ✅ かけ算モード：実際に遊べる。九九の計算問題（約60%）とかけ算文章題（約40%）をランダムにまぜて出題し、直近5問と同じ問題は出さないようにしている（`js/multiplicationMode.js`）
  - **九九の計算問題**：答えを数字入力（`#answer-input` に入力して「こたえる」）
  - **かけ算文章題**：正しい式を3択で選ぶ形式（`#choice-list`）。まちがいの選択肢は①かける数とかけられる数を入れ替えたもの ②数字を1つだけずらしたもの、の2種類を自動生成（`js/multiplicationMode.js` の `buildFormulaChoices()`）。式を選んだ時点で正誤が決まる（選んだあとの数字入力は無し）
  - 正解時は「せいかい！」→（文章題のときだけ使った式と答えを1秒表示）→「キック！」の順で演出し、式と答えのつながりが分かるようにしている（`js/main.js` の `playCorrectSequence`）
  - 九九の計算問題：`js/data/kuku.js`（`generateKukuQuestion(tier)`）
  - かけ算文章題：`js/data/multiplicationQuestions.js`（配列に追加するだけで問題を増やせる）
- ✅ 漢字モード：実際に遊べる。小学1・2年生で習う漢字約56語（`js/data/kanji.js` の `KANJI_WORDS`）から、ひらがな語→漢字の3択で出題（`js/kanjiMode.js`）。まちがいの選択肢はできるだけ同じなかま（天気・生き物・かぞく等の`cluster`）から選ぶ。正解時は「ブレイクキック！」と表示（九九・文章題の「キック！」と区別）
- ✅ 敵の強さに応じた難易度調整：かけ算モード・漢字モードどちらも、今戦っているモンスターの`tier`（zako/boss/lastboss）に応じて出題の傾向が少しずつ難しくなる。ザコ敵はやさしめ、中ボスはやや難しめ、ラスボスは中ボスと同じ傾向をより強めに（詳細は下記6.）
- ✅ 必殺技「怒りの拳」：モード共通で、3問連続正解すると次の正解が必殺技になる（`js/battle.js` の `STREAK_FOR_SPECIAL`）。ザコ敵は残りHPに関わらず一撃で撃破、中ボス・ラスボスはHPを半分削る。画面フラッシュ＋モンスターの大きめアニメーション演出つき。まちがえると連続記録はリセットされる
- ✅ 効果音：Web Audio APIでその場で音を合成（外部音声ファイル不使用）。正解・失敗・必殺技・撃破・クリア・ゲームオーバーの一式（`js/sound.js`）。右上の🔊ボタンでミュート切り替え可能（`localStorage`に保存）
- ✅ BGM：効果音と同じくWeb Audio APIで合成。ザコ敵/中ボス（青鬼・赤鬼・黒鬼）/ラスボス（？？？）でそれぞれ専用BGMがあり、登場するモンスターの`tier`に応じて自動で切り替わる。効果音より小さい音量でループ再生し、効果音とは同時に鳴る（詳細は下記7.）
- ✅ 敵モンスターの画像：ユーザー提供の「敵キャラずかん」画像から8体分を切り出し・背景透過し実装済み（`assets/images/monsters/`）。絵文字表示は完全に廃止し、すべて`<img>`表示（詳細は下記5.）。

次のステップ：とくに指定なし。ユーザーからの追加要望を待つ。

## 3. ディレクトリ構成

```
taichi-study-game/
├── CLAUDE.md            # このファイル
├── README.md            # 遊び方・確認方法（ユーザー向け）
├── index.html           # ゲーム本体（1ページ完結、画面はJSで切り替え）
├── css/
│   └── style.css        # 全スタイル
├── js/
│   ├── main.js               # エントリーポイント。画面遷移・演出・イベント配線
│   ├── battle.js              # バトル（出題〜正解判定〜HP増減・必殺技判定）の共通ロジック
│   ├── multiplicationMode.js  # 「かけ算モード」：九九と文章題を混ぜて出題する
│   ├── kanjiMode.js           # 「漢字モード」：ひらがな→漢字の3択を出題する
│   ├── storage.js             # localStorageへの記録保存（ベストスコアなど）
│   ├── sound.js               # 効果音（Web Audio APIでその場合成、外部ファイル無し）
│   └── data/
│       ├── kuku.js                     # 九九の計算問題を1問作る（実装済み）
│       ├── multiplicationQuestions.js  # かけ算文章題データ（実装済み・追加しやすい配列形式）
│       ├── kanji.js                    # 漢字データ（KANJI_WORDS、実装済み・追加しやすい配列形式）
│       └── monsters.js                 # モンスター一覧（名前・HP・tier・画像パス）
└── assets/
    ├── images/
    │   ├── monsters/      # 敵キャラ画像（8体分の透過PNG + 元の「敵キャラずかん」原画像）
    │   └── ui/             # アイコンなどUI画像
    └── sounds/             # （未使用。効果音はsound.jsで合成するため音声ファイルは置いていない）
```

## 4. コーディング方針

- フレームワーク・npm・ビルド不要。`<script>` を複数読み込むだけのシンプルな構成を維持する。
- 対象ユーザーが小学2年生であることを常に意識する：
  - ボタンは大きく、タップしやすく（最小44px角）。
  - 文字は大きめ・ふりがな配慮（漢字モード実装時は学年相当の漢字以外は極力ひらがな表記）。
  - 派手すぎない、子どもが楽しめる配色・演出。
- iPad Safari対応で気をつける点：
  - `touchstart`/クリックの両方で反応するよう `click` イベントで統一（Safariでも問題なく発火）。
  - 100vh問題を避けるため `min-height` やflexboxレイアウトを使う。
  - ダブルタップズームなどの誤操作を防ぐため `touch-action: manipulation` を指定済み。
- 問題オブジェクトは `type` / `question` / `answer` を共通で持つ。`choices`配列があれば選択式UI（`#choice-list`）、無ければ数字入力（`#answer-form`）を`js/main.js`の`renderQuestion`が自動で出し分ける。選択式の場合は正誤判定に使う文字列を`correctChoice`に入れる（`battle.js`の`answer()`は`correctChoice`があればそれを、無ければ`answer`を正解として文字列比較する）。新しい出題タイプを足す場合もこの型に揃えると実装しやすい。
- `hidden`属性で要素を出し分ける際は要注意：要素に`display:flex`等のCSSを個別指定していると`[hidden]`のUA既定スタイルを上書きしてしまうため、`css/style.css`冒頭の `[hidden] { display: none !important; }` で強制している。新しく`hidden`で切り替える要素を増やす場合もこのルールでカバーされる。
- 進捗・ベストスコアは `localStorage`（キー接頭辞 `taichiStudyGame_`）に保存する。サーバーやDBは使わない。
- コメントは「なぜそうしているか」が非自明な箇所にのみ最小限で付ける。

## 5. モンスター画像について

- 画像は `js/data/monsters.js` の各モンスターに `image: "assets/images/monsters/xxx.png"` の形で持たせ、ゲーム画面では常に `<img>` で表示する（絵文字フォールバックは廃止済み）。
- `tier`（`"zako"` / `"boss"` / `"lastboss"`）で表示サイズが変わる。CSS側は `.monster-image--zako` / `--boss` / `--lastboss`（`css/style.css`）でクランプ指定しており、ザコ敵130〜180px・中ボス200〜250px・ラスボス250〜320px程度になるようレスポンシブに調整済み。
- ザコ敵が複数同時に並ぶ画面用に `#monster-group`（`.monster-group`、`data-count`属性で1〜3体に応じてザコ敵の表示サイズを自動的に少し縮める）というコンテナと、複数体を配列で受け取れる `renderMonsterGroup(monsters)`（`js/main.js`）を用意済み。ただし現在のバトルの流れ（`js/battle.js`）は1ステージ=1体のままで、複数体が同時に出現する新しい遭遇ロジックまでは実装していない（下記7.の「怒りの拳」もこの1体構成の上で動く）。
- ラスボスは戦闘中は `name: "？？？"` と表示され、倒した瞬間の演出でだけ `revealName: "大魔王 闇"` を表示する（`js/battle.js` の `onMonsterDefeated` は最後の1体を倒した場合も必ず呼ばれるようになっている）。
- 元の「敵キャラずかん」画像（`assets/images/monsters/` 内のChatGPT生成ファイル）から8体を切り出し・AI背景除去（rembg）で透過PNG化したものを使用している。同じ手順が必要な場合は、Pillowで座標を指定して切り出し→rembgで透過、の順で行うとよい。

## 6. 敵の強さに応じた難易度調整について

`js/battle.js` の `askNextQuestion()` が `mode.nextQuestion(currentMonster().tier)` のようにtierを渡し、各モードが出題の傾向を変える。かけ算モード・漢字モードとも、モード選択自体やモード内の基本比率（九九:文章題=60:40など）は変えていない。

- **九九**（`js/data/kuku.js` の `generateKukuQuestion(tier)`）：段の数字を重み付き配列（`KUKU_POOL_ZAKO`/`KUKU_POOL_BOSS`/`KUKU_POOL_LASTBOSS`）から抽選している。
  - ザコ敵：1〜5の段を多め、6〜9も少し
  - 中ボス：6〜9の段を多め。加えて35%の確率で`KUKU_HARD_COMBOS`（7×8・8×9・6×7など）から直接出す
  - ラスボス：7・8・9の段を特に多め、15%の確率で1〜5の簡単な問題を混ぜる
  - かけ算文章題（`multiplicationQuestions.js`）は今回は難易度調整の対象外（従来どおりtierに関係なく出題）
- **漢字**（`js/kanjiMode.js`）：`KANJI_WORDS` に `level`（1=1年生相当、2=2年生相当）を持たせ、tierごとに出題タイプを重み付き抽選する（`generateKanjiQuestionForTier()`）。
  - ザコ敵：「ひらがな→漢字」の読み問題のみ。`level:1`を75%、`level:2`を25%の比率で出す
  - 中ボス／ラスボス：読み問題（`level:2`中心）に加えて、文章の中から答える問題（`generateSentenceQuestion`、`sentence`フィールドを持つ語のみ対象）、反対語（`generateAntonymQuestion`、`KANJI_ANTONYMS`）、季節・曜日・方角の並び问題（`generateSequenceQuestion`、`KANJI_SEQUENCES`）、なかま問題（`generateCategoryQuestion`、`cluster`を利用）を重み付きで混ぜる。ラスボスの方が中ボスよりこれらの応用問題の比率をやや高めている
  - 新しい漢字を追加する場合は`level`を1か2にし、`cluster`も指定する。文章問題に使いたい場合は`sentence`も追加する（未指定の語は文章問題には出ない）。小学2年生までの範囲を超える漢字は追加しないこと
  - まちがいの選択肢（`buildKanjiChoices`）は「同じなかま・同じレベル」を優先して選ぶため、レベルをまたいだ変な組み合わせになりにくい

## 7. 必殺技「怒りの拳」・効果音・BGMについて

- `js/battle.js` の `state.streak` で連続正解数を管理し、`STREAK_FOR_SPECIAL`（現在3）に達した次の正解が必殺技になる。まちがえると`streak`は0に戻る。ダメージ量は`tier`によって分岐：ザコ敵は`state.monsterHp`をそのまま渡して一撃撃破、中ボス・ラスボスは`Math.ceil(state.monsterHp / 2)`で半分減らす。
- 演出は`js/main.js`の`playCorrectSequence`が`isSpecial`フラグを見て分岐する。通常時は`.monster-image.hit`、必殺技時は`.monster-image.big-hit`（より大きい振動＋明滅、`css/style.css`）と`#screen-flash`（画面全体を一瞬明るくするオーバーレイ）を発動する。
- 効果音は音声ファイルを使わず、`js/sound.js`がWeb Audio APIのオシレーター/ノイズバッファでその場合成している（`Sound.correct()` / `Sound.wrong()` / `Sound.special()` / `Sound.defeat()` / `Sound.clear()` / `Sound.gameOver()`）。iPad Safariの自動再生制限があるため、最初のユーザー操作（「はじめる」ボタンのクリック）で`Sound.unlock()`を呼びAudioContextを起こしている。ミュート状態は`localStorage`（`taichiStudyGame_muted`）に保存し、画面右上の`#btn-mute`で切り替えられる。
- 新しい効果音を足したい場合は`js/sound.js`に`tone()`/`noiseBurst()`を組み合わせた関数を追加する形でよい（外部音声ファイルは置かない方針）。
- **BGM**も同じく`js/sound.js`内で完結（外部音声ファイル不使用）。`tone()`/`noiseBurst()`を`setInterval`で一定間隔ごとに呼び出す簡易シーケンサー（`startBgm(id, stepMs, steps)`）で、ザコ敵/中ボス/ラスボスの3種類をそれぞれ`zakoBgmSteps`/`bossBgmSteps`/`lastbossBgmSteps`という配列で表現している。効果音より確実に小さい音量（`gain`0.02〜0.1程度）にしている。
  - `Sound.playBgmForTier(monster.tier)` を `js/main.js` の `renderMonster()` から呼んでおり、tierが変わらない限り再生し直さないので多重再生にならない（`bgmId`で判定）。
  - `Sound.stopBgm()` を `js/main.js` の `showResult()` の先頭で呼び、クリア/ゲームオーバー時にBGMを止めている。リトライ時は`battle.start()`→最初のモンスター描画で`playBgmForTier`が再度呼ばれ、自然に頭から再生される。
  - BGMのオン/オフも効果音と同じ`muted`フラグ・同じミュートボタンに乗っている（`tone()`/`noiseBurst()`内部の判定を共用しているため、BGM側に個別のミュート制御は実装していない）。

## 8. ローカル確認方法

```bash
cd taichi-study-game
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

`index.html` を直接ダブルクリックして開いても動作する。
