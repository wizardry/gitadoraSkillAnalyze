# ギタドラスキルアナライズ

## 使用技術

* middleman (3.3.7) -> 監視、ビルドツール
** scss (verはgemfile記載) -> CSSメタ言語
** slim (verはgemfile記載) -> HTMLテンプレート言語

ライブラリ詳細はGemfile/Gemfile.lock参照

## ディレクトリ説明

build/
	middlemanよりビルドされた最終ソース

data/
	データ類のjson

source
	作業用ファイル

編集などの作業はsourceディレクトリで行う。
成果物コピーなどはbuildディレクトリから行う。


middleman、scss、slimの使い方についてはGoogleなどで検索してください。
→基本てきに閲覧用に[middleman]or[middleman server],build用に[middleman build]しかコマンドは使っていないです。

## source側ディレクトリ説明

css/
	scssファイル置き場。

img/
	使用する画像を保存する。

include/
	共通ファイル。
	読込分岐は各Viewファイルのfrontmatterで宣言するとよい。

js/

layouts/
	レイアウトファイル。
	読込分岐は各Viewファイルのfrontmatterで宣言するとよい。

以上

