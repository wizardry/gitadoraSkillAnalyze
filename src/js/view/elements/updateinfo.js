var React  = require('react');
// var $ = require('jquery');

var updates = [
	{date:'01/03', text:'描画ライブラリの変更、<a href="http://gitadora.info/index" target="_blank">gitadoraInfo</a>の対応、レコメンドの一部復活を行いました。（重いのか旧曲がアクセス出来ない状態を解決できませんでした。）'},
	{date:'2017&nbsp;', text:'↓2016年　↑2017年'},
	{date:'2016&nbsp;', text:'↓2015年　↑2016年'},
	{date:'08/06', text:'GuitarFreaks &amp; DrumMania Skill Simulator が 403 Forbidden 状態のため選択できないようにしました。'},
	{date:'07/21', text:'<a href="http://tri.gfdm-skill.net/" target="_blank">http://tri.gfdm-skill.net/</a>に対応しました。'},
	{date:'05/07', text:'公式で実行するbookmarkletをアップしました。（<a href="./bookmarklet.html">ブックマークレットはこちら</a>）'},
	{date:'04/10', text:'新作稼働準備に伴い内部をBackbone.jsに書き換えました。'},
	{date:'04/10', text:'<em>スキルポイント</em>が上がるかもしれない曲 の精度を格段に向上しました。'},
	{date:'2015&nbsp;', text:'↓2014年　↑2015年'},
	{date:'11/28', text:'ソース整理して若干軽量化しました。'},
	{date:'11/18', text:'Lv別取得スキルポイント一覧を作成しました。'},
	{date:'11/11', text:'<em>スキルポイント</em>が上がるかもしれない曲一覧機能のβを外しました。'},
	{date:'09/30', text:'<em>スキルポイント</em>が上がるかもしれない曲一覧機能をβで実装しました。'},
	{date:'09/30', text:'曲一覧の一部表記ミスを修正しました。'},
	{date:'09/30', text:'曲一覧のフィルター機能を拡張しました。'},
	{date:'09/29', text:'曲一覧のページを作成しました'},
	{date:'09/26', text:'新デザインをあてました。'},
	{date:'09/23', text:'ファビコン追加しました'},
	{date:'09/14', text:'達成率計算Bが計算式Cフォームからできてしまうので実装中止しました。'},
	{date:'09/13', text:'ランクグラフをペンディングにしました。'},
	{date:'09/09', text:'<em>達成率</em>計算C実装'},
	{date:'09/09', text:'<em>スキルポイント</em>計算B実装'},
	{date:'09/03', text:'仕事が忙しいので更新頻度さがります。'},
	{date:'09/03', text:'インポート完了後にLv*Pointグラフを描画するようにしました。'},
	{date:'09/03', text:'表記入れ子を修正しました。'},
	{date:'08/25', text:'使い方ガイド簡易版を作成しました。'},
	{date:'08/24', text:'データインポート開始をわかりやすくしました。'},
	{date:'08/24', text:'URLにゴミがつくのを一部修正しました。'},
	{date:'08/24', text:'スマホ表示を簡易的に調整しました。'},
	{date:'08/21', text:'グラフ（達成*Lvの散布図）実装しました'},
	{date:'08/21', text:'グラフB（<em>スキルポイント</em>*Lvの散布図）実装しました'},
	{date:'08/21', text:'グラフB（達成*スキルポイントの散布図）実装しました'},
	{date:'08/19', text:'グラフ作成中'},
	{date:'08/19', text:'やることリストを設置'},
	{date:'08/19', text:'ajax時読込み反映が不安定だった現象を恐らく解消'},
	{date:'08/19', text:'計算系作成'},
	{date:'08/18', text:'データ参照まわり作成'},
	{date:'08/17', text:'<em>GITADORA OD Skill Analyze</em>プロジェクトキックオフ'},
];

module.exports = class UpdateInformationView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			updates:updates
		}
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	render(){
		let list = this.state.updates.map(function(item,index){
			let text = item.date+' : '+item.text;
			return (<li key={item.date+'_'+index} dangerouslySetInnerHTML={{__html:text}} ></li>);
		});

		return (
			<div className="sectionWrap">
				<div className="sectionBlock commonBlock" id="news">
					<h2 className="sectionHeadline">
						<span>更新履歴</span>
					</h2>
					<ul className="updates">
						{list}
					</ul>
				</div>
			</div>
		);
	}
}