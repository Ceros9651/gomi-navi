# GitHub Pages でごみナビを公開した記録

ごみナビ（https://ceros9651.github.io/gomi-navi/ ）をインターネットに公開するために、GitHub Pages で何をしたかをまとめる。GitHub Pages を初めて使ったときの記録なので、仕組みの説明も含めている。

## GitHub Pages とは

GitHub のリポジトリに置いたファイルを、そのままWebサイトとして配信してくれるサービス。

- **無料**。ただし無料プランではリポジトリが **Public** である必要がある（だから `gomi-navi` は Public にした）
- 配信できるのは **静的ファイル**（HTML / CSS / JavaScript / 画像）だけ。サーバーで処理を動かすこと（データベース、プッシュ通知の送信など）はできない
- URL は `https://<ユーザー名>.github.io/<リポジトリ名>/` になる。ごみナビなら `https://ceros9651.github.io/gomi-navi/`
- **1つのリポジトリにつき、公開できるサイトは1つ**。これが、共有リポジトリ `Oroginal-Tools` ではなく専用リポジトリ `gomi-navi` を作った理由（ブランチごとに別のアプリを公開することはできない）

ごみナビは、判定に使うデータもすべてアプリの中に入っていて、サーバーを必要としない。そのため GitHub Pages で十分だった。

## 全体の流れ

```
手元のPC                GitHub                                  利用者（iPhone）
─────────              ─────────────────────────────           ─────────────
git push  ───────▶  main ブランチ
                        │ push をきっかけに自動で起動
                        ▼
                    GitHub Actions（deploy.yml）
                      1. npm ci        依存パッケージを入れる
                      2. npm test      テスト（失敗したらここで止まる）
                      3. npm run build dist/ にサイトを出力
                      4. dist/ を Pages にアップロード
                        │
                        ▼
                    GitHub Pages  ─────────────────────────▶  ブラウザで開く
                    https://ceros9651.github.io/gomi-navi/
```

**自分がやることは `main` に push するだけ**で、あとは自動でテスト・ビルド・公開まで進む。

## やったこと

### 1. 専用リポジトリを Public で作る

GitHub の画面で `Ceros9651/gomi-navi` を Public で作成した。手元のフォルダは、git の remote（push 先）を新しいリポジトリに向け直した。

```sh
git remote set-url origin https://github.com/Ceros9651/gomi-navi.git
```

### 2. サイトの置き場所（base）をアプリに教える

サイトは `https://ceros9651.github.io/` の直下ではなく、`/gomi-navi/` の下に置かれる。そのため、ビルドツール（Vite）に「このアプリは `/gomi-navi/` の下で動く」と教えておく必要がある。これを忘れると、JavaScript や CSS が見つからず真っ白な画面になる。

```ts
// vite.config.ts
export default defineConfig({
  base: '/gomi-navi/',
  // ...
})
```

同じ理由で、PWA の設定（`manifest` の `start_url` と `scope`）も `/gomi-navi/` にしている。

### 3. 自動デプロイのワークフローを書く

`.github/workflows/deploy.yml` に、GitHub Actions で動かす手順を書いた。GitHub Actions は、push などをきっかけに GitHub 上のサーバーでコマンドを実行してくれる仕組み。

```yaml
on:
  push:
    branches: [main]     # main に push されたら動く
  workflow_dispatch:     # GitHub の画面から手動でも動かせる

permissions:
  contents: read
  pages: write           # Pages に公開する権限
  id-token: write        # Pages への公開時の認証に必要

jobs:
  build:                 # テストとビルド → dist/ をアップロード
    ...
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:                # アップロードしたものを公開
    needs: build         # build が成功したときだけ動く
    ...
      - uses: actions/deploy-pages@v4
```

ポイントは、**テスト（`npm test`）が失敗したら公開されない**こと。ごみナビのテストには「2026年の365日すべてがPDFのカレンダーと一致するか」の照合が入っている。そのため、カレンダーのデータを間違えて更新しても、間違った内容が公開される前に止まる。

### 4. Pages の公開方法を「GitHub Actions」にする

GitHub Pages には公開方法が2種類ある。

| 公開方法 | 内容 |
|---|---|
| Deploy from a branch | ブランチに置いたファイルをそのまま公開する。ビルドが要らない素のHTMLサイト向け |
| **GitHub Actions** | ワークフローでビルドした結果を公開する。**今回はこちら** |

ごみナビは TypeScript をビルドしてから公開するので、「GitHub Actions」を選んだ。GitHub の画面なら **Settings → Pages → Build and deployment → Source** で設定できる。今回はコマンドで設定した。

```sh
gh api -X POST repos/Ceros9651/gomi-navi/pages -f build_type=workflow
```

### 5. push して公開する

```sh
git push -u origin main
```

push するとワークフローが自動で動き、数十秒〜1分ほどで公開が終わった。初回の公開後、URL・マニフェスト・Service Worker・アイコンがすべて返ってくること（HTTP 200）を確認した。

## 更新するとき

1. 手元で変更して、`npm test` が通ることを確認する
2. `main` に push する
3. 公開されたかを確認する（下の「状況の確認」）

ホーム画面に追加した iPhone では、PWA の自動更新の仕組みにより、**更新が反映されるのは「更新後に1回開いた、その次に開いたとき」**になる。1回目に開いたときに裏で新しい版を取得し、2回目で切り替わる。すぐに反映されなくても故障ではない。

## 状況の確認

- **GitHub の画面**：リポジトリの **Actions** タブで、実行の一覧と成功（緑）・失敗（赤）が見られる。失敗した実行を開くと、どの手順で止まったかとログが見られる
- **コマンド**：

  ```sh
  gh run list -R Ceros9651/gomi-navi        # 最近の実行の一覧
  gh run watch <実行ID> -R Ceros9651/gomi-navi   # 実行が終わるまで見守る
  ```

- **公開中のURL**：**Settings → Pages** にも表示される

## うまくいかないとき

| 症状 | 考えられる原因 |
|---|---|
| Actions が赤（失敗）になる | ログで止まった手順を見る。`npm test` で止まっていれば、テストが失敗している（手元で `npm test` を実行して直す） |
| 画面が真っ白で、JS や CSS が 404 になる | `vite.config.ts` の `base` がリポジトリ名と合っていない |
| push したのに iPhone の表示が古い | PWA の自動更新待ち。アプリを2回開き直す。急ぐ場合は Safari で直接 URL を開く |
| 公開をやめたい | **Settings → Pages** で公開を止めるか、リポジトリを Private にする（無料プランでは Private にすると Pages は使えなくなる） |

## 元に戻したいとき

問題のある変更を公開してしまったら、そのコミットを打ち消すコミットを作って push すれば、1つ前の状態が公開し直される。

```sh
git revert <問題のコミットID>
git push
```

## 今後の宿題

デプロイの際、GitHub Actions から「Node.js 20 を使うアクションは非推奨」という警告が出ている（`actions/checkout@v4` など）。今は問題なく動くが、いずれ各アクションを新しいバージョンに上げる必要がある。
