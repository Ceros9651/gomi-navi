# Design

## Context

- リポジトリは Vite + TypeScript のテンプレートを最小化した状態（`src/main.ts` はプレースホルダー）。`vitest` と `vite-plugin-pwa` は導入済みで、`vite.config.ts` に `base: '/gomi-navi/'` を設定済み。
- 参照データは2026年版 E地区カレンダーPDF（2026-01-01〜12-31）。PDFを読み取った結果、例外日（1/1・1/2・12/30・12/31の収集なし、12/29の特別収集）を除き、全日付が曜日ルールどおりであることを確認済み。
- 品目例の出典は市ホームページ「資源・ごみの分別と出し方【詳細】」の種類別PDF。
- 利用端末は iPhone Safari（ホーム画面に追加したPWA）。サーバーは持たず、GitHub Pages の静的配信のみ。

## Goals / Non-Goals

**Goals:**

- 日付判定ロジックを、DOMや現在時刻に依存しない純粋関数にして、2026年の全日付をテストで照合できるようにする
- 年版の更新作業を「例外日データを1ブロック追加する」だけにする

**Non-Goals:**

- 他地区への対応（データ構造は地区を追加できる形にするが、UIや地区データは作らない）
- 祝日データの保持（祝日でも収集されるため不要）
- iOS以外のブラウザ固有の調整（Chrome等でも表示はできるが、確認はしない）

## Decisions

### 1. モジュール構成

```
src/
  schedule/
    types.ts        ごみの種類ID、ルール、例外日の型
    categories.ts   6種類の表示名・品目例・色トークン名
    rules-e.ts      E地区の曜日ルール
    exceptions.ts   年版ごとの例外日（{ year: 2026, noCollection: [...], special: [...] }）
    schedule.ts     getCollection(date) → { items: [{ category, special? }], estimated }
  view/
    clock.ts        現在時刻の取得、今日・明日・締め切りの算出（now を引数に取る純粋関数）
    render.ts       2日分のカードを描画
    install-hint.ts ホーム画面追加の案内
  icons/            種類ごとのSVGアイコン（自作）
  main.ts           初期化と再描画のトリガー
  style.css
```

判定（`schedule/`）と表示（`view/`）を分け、判定側はDOMに依存しない。代替案として日付→種類の全件JSON（Q5の(a)）もあったが、年版の更新量とデータ量の点でルール＋例外を選んだ（grillingで合意済み）。

### 2. 日付の扱い

- 日付は端末のローカル時刻から年・月・日だけを取り出した「暦日」（`{ y, m, d }` または `YYYY-MM-DD` 文字列）で扱う。`Date` のタイムゾーン変換やUTCで計算するとずれるため、曜日の計算には `new Date(y, m - 1, d).getDay()` を使う。
- 第n曜日は `Math.ceil(d / 7)` で求める。例外日で収集がなくても回数は変わらない（spec どおり）。
- 端末のタイムゾーンは日本時間を前提とし、タイムゾーンを判定するための処理は入れない。

### 3. 推定の判定

`exceptions.ts` に年版データがある年（現在は2026年）の日付は確定、それ以外の年は `estimated: true` とする。年単位で判定するのは、PDFが1月〜12月の1年単位で発行されているため。

### 4. 締め切りと再描画

- `clock.ts` の `getViewState(now)` が、今日・明日の暦日と「今日の締め切り済みか（`now` が今日の8:00以降か）」を返す。テストでは `now` を差し込む。
- 再描画のタイミング：`visibilitychange`（ホーム画面から復帰したとき）、`pageshow`、および次の境界時刻（今日の8:00、または翌日0:00のうち近いほう）に合わせた `setTimeout`。1分ごとのポーリングより無駄が少なく、境界をまたいでも表示が正しくなる。

### 5. 表示

- 1画面に「今日」「明日」の2枚のカードを縦に並べる。カードには日付と曜日、ごみの種類ごとの行（色帯＋アイコン＋表示名）、または「収集なし」を表示する。
- 品目例は種類ごとの行を `<details>` / `<summary>` にして開閉する。JavaScriptなしで開閉でき、アクセシビリティも確保できる。
- 色は `:root` のCSS変数で定義し、`@media (prefers-color-scheme: dark)` で背景と文字色を切り替える。種類の色はダークモードでは彩度・明度を少し落とした同系色にし、文字とのコントラストを保つ。
- 締め切り済みの今日のカードは `opacity` を下げ、「締め切り済み（朝8時まで）」のラベルを付ける。
- `viewport-fit=cover` と `env(safe-area-inset-*)` でノッチ部分を避ける。

### 6. アイコン

種類ごとのSVGアイコンは自作し、`currentColor` で塗る単色アイコンにする（炎、斜線入りの炎、プラマーク風の容器、缶・びん、新聞、電池）。市のPDFのイラストはトレースしない。アプリアイコン（180×180の `apple-touch-icon`、192/512のマニフェスト用）も自作のシンプルな図案をPNGで用意する。

### 7. PWA

- `vite-plugin-pwa` を `registerType: 'autoUpdate'` で使う。Service Worker がビルド成果物をすべてプリキャッシュするので、オフラインで動作する。
- iOSはマニフェストのアイコンではなく `apple-touch-icon` を使うため、`index.html` に `apple-touch-icon`、`apple-mobile-web-app-capable`、`apple-mobile-web-app-title`（ごみナビ）、`apple-mobile-web-app-status-bar-style` を書く。
- マニフェストは `name: ごみナビ`、`display: standalone`、`start_url` と `scope` は `/gomi-navi/`。

### 8. ホーム画面追加の案内

- ホーム画面から起動したかどうかは `navigator.standalone === true`（iOS独自）、または `matchMedia('(display-mode: standalone)')` で判定する。
- 案内を閉じたことは `localStorage` に保存する。読み書きは `try/catch` で囲み、失敗したら案内を表示するだけにする（画面が壊れないことを優先）。

### 9. デプロイ

`.github/workflows/deploy.yml` で、`main` へのpushをきっかけに `npm ci` → `npm test` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages` の順に実行する。テストが失敗したらデプロイしない。リポジトリの Pages 設定のソースを「GitHub Actions」にする必要がある（`gh api` で設定するか、ユーザーが画面で設定する。実施前に確認をとる）。

### 10. テスト

- `schedule.test.ts`：spec の各シナリオに加え、PDFから書き起こした2026年全日付の期待値（`fixtures/calendar-2026-e.ts`）と `getCollection` の結果を照合する。期待値はルールから生成せず、PDFの各月の画像を見て手で書き起こす（ルールの誤りを検出できるようにするため）。
- `clock.test.ts`：7:59 / 8:00 の境界、月末・年末をまたぐ明日の計算、次の再描画時刻。
- 表示とPWAは、iPhone実機（またはSafari）での手動確認とする。

## Risks / Trade-offs

- [PDFの書き起こし誤り] → 書き起こした期待値とルールによる計算がずれた日は、PDFの画像を再度確認する。ずれた理由が例外日として正当か、書き起こしの誤りかを判断してから直す。
- [推定の誤り（2027年の年末年始など）] → 推定であることを常に画面に明示する。新しいPDFが出たら例外日を追加する運用を README に書く。
- [iOSのストレージ削除] → iOSはホーム画面に追加していないサイトのデータを一定期間で消すことがあり、案内を閉じた記録が消える場合がある。案内がもう一度出るだけなので許容する。
- [Service Worker の更新遅延] → `autoUpdate` でも、反映は更新を取得した後の起動になる。年1回程度の例外日更新には十分と判断した（Q17で合意）。
- [端末の時計・タイムゾーン] → 端末の時刻がずれていると表示もずれる。日本国内で使う個人用アプリのため許容する。

## Migration Plan

初版のため移行はない。公開はPages設定の後、`main` へのpushで行う。問題があれば、直前のコミットを revert して push すれば元に戻る。
