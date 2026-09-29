# Tasks

## 1. 収集日の判定（collection-schedule）

- [x] 1.1 `src/schedule/types.ts` と `categories.ts` に6種類の型・表示名・色トークン名を定義し、`npx tsc` が通ることを確認する
- [x] 1.2 市ホームページの種類別PDF（燃やせるごみ、燃やせないごみ、プラスチック製容器包装、飲料缶・ガラスびん・ペットボトル、新聞紙・段ボール・牛乳パック類・古着、雑誌・雑がみ、金属類）から品目例を書き起こして `categories.ts` に入れ、出典URLをコメントに残す。全種類に1つ以上の品目例があることをテストで確認する
- [x] 1.3 PDFの2026年1〜12月のカレンダー画像を見て、日付ごとの種類を `src/schedule/fixtures/calendar-2026-e.ts` に書き起こす（ルールから生成しない）。365日分あることをテストで確認する
- [x] 1.4 `rules-e.ts`（曜日ルール）、`exceptions.ts`（2026年の例外日）、`schedule.ts`（`getCollection`）を実装する。spec の全シナリオと、1.3 の2026年全日付の照合テストが `npm test` で通ることを確認する
- [x] 1.5 範囲外（2027年）の推定と、特別収集の注記のテストが通ることを確認する

## 2. 今日と明日の画面（daily-view）

- [x] 2.1 `src/view/clock.ts` に、今日・明日・締め切り済みかどうか・次の再描画時刻を返す純粋関数を実装し、7:59/8:00の境界、月末・年末をまたぐケースのテストが通ることを確認する
- [x] 2.2 `src/icons/` に6種類のSVGアイコンを自作する。`npm run dev` で全アイコンが表示されることを目で確認する
- [x] 2.3 `src/view/render.ts` と `style.css` で2日分のカード（日付・曜日、色帯＋アイコン＋表示名、`<details>` の品目例、収集なし、締め切り済み、推定の注記、特別収集の注記）を実装する。`npm run dev` で、端末の日時を変えて各表示が出ることを確認する
- [x] 2.4 ライト／ダークの配色とsafe-areaへの対応を入れる。Safariの開発ツールかiPhoneで、両モードとも種類の色が区別でき、ノッチに内容が隠れないことを確認する
- [x] 2.5 `main.ts` で初期描画と再描画（`visibilitychange`、`pageshow`、境界時刻の `setTimeout`）をつなぐ。境界時刻を数十秒後にずらした状態で、表示が自動で切り替わることを確認する

## 3. PWA（pwa-install）

- [x] 3.1 アプリアイコン（`apple-touch-icon` 180px、マニフェスト用 192px・512px）を自作して `public/` に置く
- [x] 3.2 `vite.config.ts` に `vite-plugin-pwa`（`autoUpdate`、マニフェスト：ごみナビ・standalone・scope `/gomi-navi/`）を設定し、`index.html` にiOS用のmetaタグを追加する。`npm run build && npm run preview` で、マニフェストとService Workerが読み込まれ、オフラインにしても表示されることをブラウザの開発ツールで確認する
- [x] 3.3 `src/view/install-hint.ts` でホーム画面追加の案内（standaloneのときは出さない、閉じたら `localStorage` に記録、読み書きは `try/catch`）を実装する。表示条件の判定をテストし、プレビューで案内の表示・非表示を確認する

## 4. デプロイとドキュメント

- [x] 4.1 `.github/workflows/deploy.yml`（`npm ci` → `npm test` → `npm run build` → Pagesへデプロイ）を作成する
- [x] 4.2 `README.md` に、使い方（iPhoneでホーム画面に追加する手順）、開発コマンド、毎年のカレンダー更新手順（`exceptions.ts` と期待値fixtureの追加）を書く
- [x] 4.3 ユーザーの確認をとってから、Pagesのソースを「GitHub Actions」に設定して `main` をpushする。Actionsが成功し、https://ceros9651.github.io/gomi-navi/ が表示されることを確認する

## 5. 実機での確認

- [x] 5.1 iPhoneで、ホーム画面への追加、全画面での起動、今日・明日の表示、品目例の開閉、ダークモード、機内モードでの起動、翌朝に復帰したときの更新を確認する
