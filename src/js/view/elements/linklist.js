var React  = require('react');
// var $ = require('jquery');

var mainlinks = [
	{ href:'http://tri.gfdm-skill.net/' , text:'GITADORA Tri-boost スキルシミュレータ' },
	{ href:'http://gitadora.info/index' , text:'GITADORA Info' },
	{ href:'http://xv-s.heteml.jp/skill/' , text:'GuitarFreaks &amp; DrumMania Skill Simulator' },
	{ href:'http://suitap.iceextra.org/xgcrawler/' , text:'XGCrawler 配布サイト （スキルシミュレーター自動入力ツール）' },
	{ href:'http://funachun.net/skill.html' , text:'funachun.net （XGCrawlerのGUI）' },
	{ href:'http://www.konami.jp/bemani/gfdm/gitadora/' , text:'公式' },
	{ href:'http://p.eagate.573.jp/game/gfdm/gitadora/p/cont/' , text:'公式e-amu' },
	{ href:'/old/od/' , text:'GITADORA Skill Analyze ( Over Drive )' },
];
var sublinks = [
	{href:'http://dragonscrown.web.fc2.com/' ,text:'ドラゴンズクラウン　スキルシミューレーター'},
	{href:'http://mh4hakkutsu.web.fc2.com/' ,text:'発掘装備 一覧 | モンスターハンター4 '},
];
module.exports = class LinkListView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			mainlinks:mainlinks,
			sublinks:sublinks
		}
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	render(){
		let mainLinkList = this.state.mainlinks.map(function(link){
			return (
				<li key={link.href}>
					<a href={link.href} target="_blank">{link.text}</a>
				</li>
			);
		});

		let subLinkList = this.state.sublinks.map(function(link){
			return (
				<li key={link.href}>
					<a href={link.href} target="_blank">{link.text}</a>
				</li>
			);
		});


		return (
			<div className="sectionWrap">
				<div className="sectionBlock commonBlock" id="link">
					<h2 className="sectionHeadline">
						<span>リンク</span>
					</h2>
					<ul>
						{mainLinkList}
					</ul>
					<h3>
						他こんなのもつくってました。
					</h3>
					<ul>
						{subLinkList}
					</ul>
				</div>
			</div>
		);
	}
}