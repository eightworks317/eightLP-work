# 石山寿司 LP v2 — GitHub Pages用

編集するLPは `ishiyama-sushi-lp-v2.html` の1ファイルです。CSSとJavaScriptはHTML内にあり、画像は同じ階層の `img/` を相対参照します。フレームワーク・npm依存・APIキーは必要ありません。

このフォルダを新規リポジトリのルートとして使用してください。上位フォルダ全体や旧版の `.git` をコピーしないでください。旧版には公式サイトから取得した画像が含まれていますが、このフォルダには含まれていません。

## GitHub Pagesで公開する手順

1. このフォルダの中身を、`.github` を含めてGitHubリポジトリのルートへアップロードします。
2. リポジトリの Settings → Pages → Build and deployment → Source で **GitHub Actions** を選択します。
3. `main` へpushするか、Actionsの「Publish LP to GitHub Pages」を手動実行します。別のブランチを使う場合はワークフローの `branches` を変更してください。
4. 成功したActionsのDeployment URLで確認します。

公開時には `scripts/prepare.mjs` がHTMLを `_site/index.html` にコピーし、画像4枚のみを同梱します。GitHub Pagesから実際の公開URLを受け取り、OG画像URL・`og:url`・canonicalを絶対URLに設定します。リポジトリ名を含むサブディレクトリでも、画像は相対パスで読み込まれます。

GitHubの公開設定を行ったこと、および実際のデプロイ成功はこのローカル納品時点では未確認です。サイト名・リポジトリ名やGitHubアカウントを推測して公開しません。

## ローカルでの確認

HTMLをブラウザで直接開いて確認できます。公開用の状態を生成する場合は、このフォルダで `node scripts/prepare.mjs` を実行してください。出力は `_site/` です。

## 画像・表記

写真風画像4枚は、このLP向けに内蔵ImageGenで新規作成したものです。元の公式サイトの写真・ロゴは使用していません。各画像の近くにAI生成イメージであることを表示しています。元の生成PNGはCodexの生成画像フォルダに保持し、LPには軽量化したJPEGを使用します。プロンプトは `generation-prompts.txt` に記録しています。

料理の写真風イメージは実際のコース内容を保証するものではありません。架空の店内・外観写真も作成していません。AI生成であることだけを理由に、第三者の権利について全面的に保証するものではありません。

現状は非公式のデザイン試作で、その旨をページに表示し `noindex,nofollow` を設定しています。店舗の正式な公開用LPとして採用する場合は、店舗への事実確認を行い、立場に合う表記・インデックス設定へ変更してください。

## 情報の更新

確認日と情報の差異・未確認項目は `SOURCES.md` に記録しています。価格・営業条件は公式サイトの確認内容から記載し、文章は書き起こしています。Googleマップは住所による埋め込みです。電話・ネット予約・マップボタンは外部サービスへ移動するリンクです。予約データをこのLPで収集・保存する機能はありません。

参考：[GitHub Pagesのカスタムワークフロー](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
