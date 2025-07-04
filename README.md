# BlockTwitterer

BlockTwittererは、Twitter（X）上で特定のキーワードをツイートしたユーザーを自動的にブロックするChrome拡張機能です。Plasmoフレームワークを用いて開発されています。

## 主な機能

- 指定したキーワードを含むツイートをしたユーザーを自動的にブロック

## ディレクトリ構成

- `popup/` … 拡張機能のポップアップUI
- `options/` … オプション（設定）ページ
- `content/` … Twitterページ上で動作するスクリプト
- `README.md` … このファイル

## 開発環境構築

1. 依存パッケージのインストール

```bash
pnpm install
```

2. 開発サーバーの起動

```bash
pnpm dev
```

3. Chromeで開発用ビルドを読み込む

例: Chrome + Manifest v3の場合 → `build/chrome-mv3-dev` ディレクトリを拡張機能として読み込む

## 本番ビルド

```bash
pnpm build
```

`build/` ディレクトリに本番用バンドルが生成されます。

## 参考リンク

- [Plasmo公式ドキュメント](https://docs.plasmo.com/)
- [Chrome拡張公式ドキュメント](https://developer.chrome.com/docs/extensions/)
