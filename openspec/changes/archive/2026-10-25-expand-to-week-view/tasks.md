# Tasks

## 1. 1週間分の日付（clock）

- [x] 1.1 `src/view/clock.ts` に `DAYS_SHOWN = 7` を追加し、`ViewState` の `today` / `tomorrow` を `days: CalendarDate[]`（今日から6日後まで）に置き換える。`clock.test.ts` を更新し、9/29 から 10/5 の7日分、月末（9/30 → 10/6）、年末（12/28 → 2027-01-03）、既存の7:59/8:00 境界と `nextBoundary` のテストが `npm test` で通ることを確認する

## 2. 短い名前（categories）

- [x] 2.1 `src/schedule/types.ts` の `Category` に `shortName` を追加し、`categories.ts` に design の表（燃やせる／燃やせない／プラ／缶・びん・ペット／古紙・古着／金属類）のとおり設定する。全種類に空でない `shortName` があることをテストで確認し、`npx tsc` が通ることを確認する

## 3. 画面（render と style）

- [x] 3.1 `src/view/render.ts` を、HTML 文字列を返す `weekHtml(state)` と、それを `innerHTML` に入れる `render()` に分ける。今日・明日のカードは `days[0]` / `days[1]` から既存の `dayHtml` で描画し、見た目が変わらないことを `npm run dev` で確認する
- [x] 3.2 `days[2]`〜`days[6]` を「この先の予定」の見出し付き `<ol class="week">` のコンパクトな行（日付・曜日、種類ごとの色チップ＋アイコン＋短い名前、収集なし、「特別」バッジ、「推定」バッジ）として描画する。`src/view/render.test.ts` を新しく作り、spec のシナリオ（9/29 の7日分の並びと中身、10/6 が出ないこと、12/27 の 12/29 の特別、12/28 の 2027-01-01〜01-03 だけに推定、8:00 以降でも 10/2 に締め切り表示がないこと）を `weekHtml` の出力で確認する
- [x] 3.3 `src/style.css` にコンパクトな行のスタイル（固定幅の日付列、`flex-wrap` のチップ、既存の `--cat-*` / `--warn-*` 変数の再利用）を追加する。`npm run dev` の `?now=2026-09-29T10:00`（第1木曜で種類が2つの日を含む）と `?now=2026-12-28T10:00` で、iPhone 幅（375px）のライト／ダーク両方で横スクロールが出ず、種類の色が区別できることを確認する

## 4. 説明文とドキュメント

- [x] 4.1 `vite.config.ts` のマニフェスト `description`、`index.html` の `meta description`、`README.md` の冒頭の説明を「今日から1週間」の表現に更新し、`npm run build` が通ることを確認する
- [x] 4.2 アーカイブ時に、`openspec/specs/daily-view/spec.md` の Purpose（「今日とその翌日」）を「今日から1週間」に合わせて書き換える（delta では Purpose を変えられないため）。書き換えた後に `openspec validate --specs --strict` が通ることを確認する

## 5. 実機での確認

- [ ] 5.1 `main` にマージして Pages にデプロイされた後、iPhone のホーム画面から開き、今日・明日のカードがスクロールせずに見えること、少しのスクロールで6日後まで見えること、ホーム画面追加の案内やホームインジケーターに最後の行が隠れないことを確認する（デプロイ前にユーザーの確認をとる）
