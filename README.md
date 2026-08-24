# エンタジェネレーター

画像と左右の縦書きテキストから、4:3 の PNG を作成する静的 Web アプリです。画像処理と書き出しは HTML Canvas を使ってブラウザ内で完結します。

## セットアップ

Node.js 20 以降を用意し、依存パッケージをインストールします。

```bash
npm install
```

## 開発起動

```bash
npm run dev
```

表示されたローカル URL をブラウザで開いてください。

## ビルド

```bash
npm run build
```

静的ファイルが `dist` ディレクトリに生成されます。ローカルで本番ビルドを確認する場合は `npm run preview` を実行します。

## Cloudflare Pages へのデプロイ

1. このリポジトリを GitHub または GitLab に push します。
2. Cloudflare Dashboard の **Workers & Pages** から Pages プロジェクトを作成し、リポジトリを接続します。
3. Framework preset は `Vite`（または None）、Build command は `npm run build`、Output directory は `dist` に設定します。
4. 保存してデプロイします。サーバーや環境変数の設定は不要です。

## 共有機能

- Web Share API 対応環境では、生成した PNG のファイル共有に対応している場合は画像ファイルを含めて共有します。
- ファイル共有に非対応の場合は、共有文言と現在のサイト URL を Web Share API で共有します。
- Web Share API が利用できない場合は共有文言と URL をクリップボードへコピーし、X（Twitter）の投稿画面を開きます。先に「PNGで保存」した画像を投稿へ添付してください。
- ブラウザの共有画面をキャンセルした場合は、X を開かずその旨を表示します。

## プライバシー

アップロードした画像はサーバーへ送信されません。読み込み、編集、PNG 生成のすべてを利用中のブラウザ内で処理します。
