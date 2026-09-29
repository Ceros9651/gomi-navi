# ごみナビ

春日井市 E地区の「今日」と「明日」に出せるごみの種類を表示する、iPhone向けのWebアプリ（PWA）です。

https://ceros9651.github.io/gomi-navi/

- 収集日当日の朝8時を過ぎると、今日の分に「締め切り済み」と表示します
- 種類をタップすると品目例が開きます
- 年版カレンダーの範囲外の日付は、曜日ルールからの「推定（未確認）」として表示します
- 一度開けばオフラインでも動きます

参照：[2026年版 資源・ごみ出しカレンダー E地区（PDF）](https://www.city.kasugai.lg.jp/_res/projects/default_project/_page_/001/033/284/2026_E_A4size.pdf)、[資源・ごみの分別と出し方【詳細】](https://www.city.kasugai.lg.jp/kurashi/1032702/1032853/1032855/1032955/index.html)

## iPhoneのホーム画面に追加する

1. Safariで上のURLを開く
2. 共有ボタン（□に↑）をタップ
3. 「ホーム画面に追加」をタップ

## 開発

```sh
npm install
npm run dev        # http://localhost:5173/gomi-navi/
npm test           # 2026年の全日付の照合を含む
npm run build      # dist/ に出力
npm run preview    # ビルド結果の確認（Service Worker も動く）
```

開発サーバーでは `?now=2026-12-29T07:30` を付けると、その日時として表示できます（本番ビルドでは無効）。

`main` にpushすると、GitHub Actions がテストとビルドを行い、GitHub Pages に公開します（テストが失敗したら公開しません）。

## 毎年のカレンダー更新

市から新しい年版のカレンダーPDFが出たら、次の手順で更新します。

1. PDFの凡例で、曜日ルールが変わっていないか確認する。変わっていたら `src/schedule/rules-e.ts` を直す
2. 年末年始などの例外日を `src/schedule/exceptions.ts` に1ブロック追加する（収集なし `noCollection` と特別収集 `special`）
3. PDFの全日付を見て、`src/schedule/fixtures/calendar-2026-e.ts` と同じ形式で、新しい年の期待値ファイルを書き起こす。**ルールから生成せず、PDFを見て手で書く**（ルールの誤りを検出するため）
4. `src/schedule/schedule.test.ts` に、新しい年の照合テストを追加する
5. `npm test` が通ったら `main` にpushする。例外日データがある年は「推定」の表示が消えます

ホーム画面のアプリは、次に開いたときに裏で新しいバージョンを取得し、その次に開いたときに反映されます。
