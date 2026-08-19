# Flow Design — 個人事業ホームページ（LP）

営業代行・事務代行・秘書業務・バックオフィス支援を行うフリーランス向けの、
見積依頼・無料相談への導線を最優先にした1ページ完結型ホームページです。

## 1. ディレクトリ構成

```
personal-business-hp/
├── index.html              # メインページ（LP本体）
├── css/
│   └── style.css           # スタイル一式（セクションごとにコメントで区切り）
├── js/
│   └── main.js             # モバイルメニュー開閉・フォーム仮送信処理
├── assets/
│   └── images/
│       ├── favicon.svg     # 仮ファビコン
│       ├── ogp.svg         # 仮OGP画像（SNSシェア用）
│       └── hero-bg.webp    # ファーストビュー背景写真
└── README.md
```

ビルドツール不要の素のHTML/CSS/JSで構成しているため、そのままどこにでもデプロイできます。
将来的に複数ページへ分割する場合は、各`<section id="...">`を別ファイル（例: `services.html`）に切り出し、
ヘッダーナビの`href`を`#services`から`services.html`のように変更するだけで移行できます。

## 2. ローカルで確認する手順

Node.js等は不要です。以下のいずれかの方法でブラウザから直接確認できます。

**方法A: ファイルを直接開く**
`index.html` をダブルクリック、またはブラウザにドラッグ＆ドロップして開く。

**方法B: 簡易サーバーを立てる（推奨・スマホ表示確認にも便利）**
```bash
cd personal-business-hp
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

VS Codeを使っている場合は「Live Server」拡張機能でも確認できます。

## 3. 文章・料金を変更したい場合の編集箇所

すべて `index.html` 内に日本語のテキストとして直接記載されています。HTMLタグの構造を崩さなければ、
文言・料金・見出しはそのまま書き換えて問題ありません。主な編集ポイントは以下の通りです。

| 内容 | 該当箇所（index.htmlのid） |
|---|---|
| キャッチコピー・サブコピー | `#hero` 内 `.hero__title` / `.hero__sub` |
| ヒーロー背景写真 | `assets/images/hero-bg.webp` を同名で上書き（推奨・横長 1600px前後）、またはパスを変える場合は `css/style.css` の `--hero-bg-image` を書き換え |
| お悩みリスト | `#worries` 内 `.card--worry` |
| 提供サービス一覧 | `#services` 内 `.service-group__list` |
| 選ばれる理由 | `#reasons` 内 `.card--reason` |
| 料金プラン・金額表記 | `#plans` 内 `.card--plan` |
| 実績・対応事例 | `#works` 内 `.card--work` |
| ご依頼の流れ | `#flow` 内 `.flow__step` |
| よくある質問 | `#faq` 内 `.faq__item`（`<details><summary>`構造） |
| 最終CTAの文言 | `#final-cta` |
| Googleフォームのリンク先 | `#contact` 内 `.contact__panel` の `<a>` の `href`（`docs.google.com/forms/...`） |
| 会社名・ロゴ表記 | `.header__logo` / `.footer__logo` |
| 配色 | `css/style.css` 冒頭の `:root { ... }` の変数（`--accent`など） |

※ 現在、連絡先はGoogleフォーム経由のみとしています（いたずら防止のため、メールアドレス・LINEは非公開）。再度掲載したい場合は `#contact` セクションに `<a>` タグを追加してください。

## 4. お問い合わせフォームについて

`#contact` セクションはGoogleフォームへの案内パネル（`.contact__panel`）になっています。
「Googleフォームで相談する」ボタンから、別タブでGoogleフォームが開く仕組みです（実際に送信され、回答はGoogle側のスプレッドシートに蓄積されます）。

フォームのリンク先を変更したい場合は、`index.html` 内 `.contact__panel` の `<a href="https://docs.google.com/forms/...">` を書き換えてください。

他のフォーム手段（Formspreeなどの送信サービスや、自前のサーバーサイド処理）に変更したい場合は、
同じ `.contact__panel` 内のボタンの `href`／リンク先をそのサービスのURLに差し替えるだけで移行できます。

## 5. 公開方法の候補

### Vercel
- GitHubリポジトリと連携するだけで自動デプロイ可能。静的サイトなのでビルド設定不要（Build Command: なし / Output Directory: `.`）
- 独自ドメインの設定も無料枠内で可能。更新のたびに自動で再デプロイされるため運用が楽
- おすすめ度: ★★★（更新頻度が高い・無料で始めたい場合に最適）

### Netlify
- Vercelと同様にGit連携で自動デプロイ可能。ドラッグ＆ドロップでのアップロードにも対応しており、Gitを使わなくても公開できる
- フォーム送信機能（Netlify Forms）を標準で持っているため、上記「選択肢B」の代わりにNetlify純正のフォーム機能を使う選択肢もある
- おすすめ度: ★★★（フォーム機能も含めて手軽に完結させたい場合に最適）

### レンタルサーバー（エックスサーバー、ロリポップ等）
- FTP/SFTPやファイルマネージャーで `index.html` 等一式をそのままアップロードするだけで公開可能
- 独自ドメイン・メールアドレスを既に契約している場合や、会社としての体裁を重視する場合に向いている
- Vercel/Netlifyと比べると更新のたびに手動アップロードが必要になる点は手間がかかる
- おすすめ度: ★★（既にレンタルサーバー契約がある、社用メールも運用したい場合）

## 6. 今後のカスタマイズ候補（任意）

- 実際の写真・プロフィール画像への差し替え（`assets/images/`配下に追加）
- Googleアナリティクス／Search Consoleの設置（`index.html`の`</head>`直前にトラッキングタグを追加）
- お客様の声・FAQの追加
- 複数ページ化（サービス詳細ページ、プロフィールページなどの独立）
