var React  = require('react');
// var $ = require('jquery');


module.exports = class HowToGuideView extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	render(){
		return (
			<div className="sectionWrap">
				<div className="sectionBlock guideBlock commonBlock" id="guide">
					<h2 className="sectionHeadline">
						<span>使い方ガイド</span>
					</h2>
					<p className="attention">
						大幅改修によりCookieの競合が起きる可能性があります。<br />正常に読み込めない場合（各ボタンが反応しないなど）はCookieを削除し、再度お試しください。
					</p>
					<h3>
						当サイトを利用するまでの手順
					</h3>
					<ol>
						<li>
							<a href="http://xv-s.heteml.jp/skill/" target="_blank">GuitarFreaks &amp; DrumMania Skill Simulator</a>こちらのユーザー登録を行い、スキル状況を入力して下さい。<br />入力補佐ツールなどを使うと便利です（<a href="#links">LINK一覧</a>）
						</li>
						<li>
							曲情報入力画面上部にある「スキル公開用URL」か、ユーザー検索から自分のページへ行き、URLをコピーしてください。
						</li>
						<li>
							当サイト上部にある入力フィールドにURLをペーストし、インポートボタンをクリック、タップして下さい。
						</li>
						<li>
							成功した場合「データ詳細」に数値が反映されます。データ反映後各コンテンツがそのデータに応じて機能します。
						</li>
					</ol>
					<h3>
						電卓系のヒント
					</h3>
					<ul>
						<li>
							ブラウザによっては数値入力後カーソルキーで増減ができます。
						</li>
					</ul>
					<h3>
						グラフについてのヒント
					</h3>
					<ul>
						<li>
							軸反転 でx軸とy軸を反転できます。
						</li>
						<li>
							対象曲に絞るを外すとスキル対象外を含む登録データ全ての情報をグラフに描画します。
						</li>
						<li>
							右上にあるHOT/OLDをクリックすることで片側のみを有効にすることが可能です。
						</li>
						<li>
							グラフ内をドラッグすることで拡大表示することが出来ます。
						</li>
						<li>
							マーカーをタップもしくはマウスオーバーすることにより、簡易的な曲情報が見れます。
						</li>
						<li>
							例えばLv×Point にした場合、左側下部は高達成下限なので、放置でよい曲である可能性が高いです。<br />しかし、左側上部は特攻気味で詰める余地が残されています。<br />左下の曲を増やしつつ、右側は中～上に動かすように詰めていくのが理想形となります。<br />
						</li>
					</ul>
					<h3>
						その他
					</h3>
					<ul>
						<li>
							URLに#!analyze_[tri.gfdm-skill.net or gitadora.info]_[USER-ID]を付け足すと読込時に自動でインポートします。
						</li>
					</ul>
				</div>
			</div>
		);
	}
}