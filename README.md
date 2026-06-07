# 画面QRリーダー

表示中のページにあるQRコードを読み取り、URLを確認してから新規タブで開くChrome拡張機能です。

## Features

- 表示中のタブを一時的にキャプチャしてQRコードを解析します。
- QRコードの解析はローカル同梱の `jsQR.js` で行います。
- 外部API、外部サーバー、クラウド送信は使いません。
- URLは `http:` または `https:` のみ開けます。
- URL以外のQRコード内容は表示のみ行います。

## Permissions

- `activeTab`: ユーザーが拡張機能を操作した時に、現在のタブをキャプチャしてQRコードを読み取るために使います。

## Development

Chromeの `chrome://extensions` でデベロッパーモードを有効にし、「パッケージ化されていない拡張機能を読み込む」からこのフォルダを選択してください。

## Chrome Web Store notes

- Single purpose: 表示中のページにあるQRコードを読み取り、URLを確認してから開く。
- Permission justification for `activeTab`: ユーザーがスキャン操作をした時だけ、表示中タブの見えている範囲を一時的にキャプチャしてQRコードを解析するため。
- Remote code: No.
- Data collection: No data is collected, stored, shared, or sold.
- Privacy policy: Use `PRIVACY_POLICY.md` as the source text and publish it at a public URL before submitting to the Chrome Web Store.

## Third-party library

This extension includes jsQR by cozmo, licensed under the Apache License 2.0.
