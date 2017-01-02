var React  = require('react');

var PageHeader = require('./elements/header');
var Navigation = require('./elements/navigation');
var PageFooter = require('./elements/footer');

var TopView = require('./top/app');
var RateTable = require('./ratelist/app');
var MusicList = require('./songlist/app');

var HowtoGuide = require('./elements/guid');
var LinkList = require('./elements/linklist');
var Updates = require('./elements/updateinfo');


module.exports = class MainWrapper extends React.Component {
	constructor(props){
		super(props);
		this.state = {models:[]};
	}
	componentWillMount(){
		var self = this;
		this.props.models.model.userModel.on('change sync',function(){
			var model = self.state.models;
			model.userModel = this;
			self.setState({models:model});
		});
		this.props.models.model.viewStateModel.on('change',function(){
			//FIXME Hash¤ò¤ß¤¿³õÆÚ¥¤¥ó¥Ý©`¥È„IÀí
			if(this.get('path').indexOf('analyze_') != -1){
				let path = this.get('path').split('_');
			}

			if(this.get('path').indexOf('songlist') != -1){
			}
			if(this.get('path').indexOf('skillPointList') != -1){
			}
			var model = self.state.models;
			model.viewStateModel = this;
			self.setState({models:model});

		});
		this.props.models.model.viewStateModel.set({path:location.hash})
		this.setState({models:this.props.models});
	}
	render(){
		return(
			<div>
				<PageHeader />
				<div id="masterView">
					<Navigation />
					<div className="contents">
						<div className="loader">
							<i className="loading loadpos"></i>
						</div>
						<div className="contentsInnerWrap">
							<TopView models={this.state.models}/>
							<RateTable models={this.state.models} />
							<MusicList models={this.state.models} />
							<HowtoGuide />
							<LinkList />
							<Updates />
							<a href="http://www.amazon.co.jp/gp/product/B00I3LHM6S/ref=as_li_tf_il?ie=UTF8&amp;camp=247&amp;creative=1211&amp;creativeASIN=B00I3LHM6S&amp;linkCode=as2&amp;tag=dcskillsim-22">
								<img src="http://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&amp;ASIN=B00I3LHM6S&amp;Format=_SL250_&amp;ID=AsinImage&amp;MarketPlace=JP&amp;ServiceVersion=20070822&amp;WS=1&amp;tag=dcskillsim-22" />
							</a>
							<img alt="" src="http://ir-jp.amazon-adsystem.com/e/ir?t=dcskillsim-22&amp;l=as2&amp;o=9&amp;a=B00I3LHM6S" style={{border:'none !important', margin:'0px !important', width:'1px',height:'0px'}} />
						</div>
					</div>
				</div>
				<PageFooter />
			</div>
		);
	}
}