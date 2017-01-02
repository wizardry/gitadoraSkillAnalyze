var React  = require('react');
// var $ = require('jquery');
var RateListTable = require('./rateListTable')

module.exports = class rateListControl extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			lvMax:0,
			lvMin:0,
			rateMax:0,
			rateMin:0,
			threshold:0,
			sortType:0
		}

	}
	componentWillMount(){
		var cookie = $.cookie('skillView');
		/**
		* ex cookie
		* key : skillView
		* oldValue: "{"startLv":10,"endLv":25,"startRate":80,"endRate":100,"threshold":48,"drawType":0}"
		* value: "{"lvMax":20,"lvMin":10,"rateMax:80,"rateMin":60,"threshold":30,"sortType":0}""
		*/
		if(cookie != undefined ){
			cookie = JSON.parse(cookie);
			if(cookie.drawType !== undefined){
				alert('Cookie情報が古いため過去の入力情報を破棄します。');
				$.removeCookie('skillView');
			}
			cookie.hasCookie = true;
			this.state = cookie;
		}
		// this.props.models.model.userModel.on()
	}
	componentDidMount(){
		if(this.state.hasCookie){
			this.refs.levelMax.value = this.state.lvMax
			this.refs.levelMin.value = this.state.lvMin
			this.refs.rateMax.value = this.state.rateMax
			this.refs.rateMin.value = this.state.rateMin
			this.refs.threshold.value = this.state.threshold
			this.refs.sortSelect.value = this.state.sortType
		}
	}
	submitHandler(e){
		e.preventDefault();

		let lvMax = parseInt( this.refs.levelMax.value );
		let lvMin = parseInt( this.refs.levelMin.value );
		let rateMax = parseInt( this.refs.rateMax.value );
		let rateMin = parseInt( this.refs.rateMin.value );
		let threshold = parseFloat( this.refs.threshold.value ) * 100;
		let sortType = parseInt( this.refs.sortSelect.value );
		$.cookie('skillView',JSON.stringify({
			lvMax:lvMax,
			lvMin:lvMin,
			rateMax:rateMax,
			rateMin:rateMin,
			threshold:threshold,
			sortType:sortType
		}));
		this.setState({
			lvMax:lvMax,
			lvMin:lvMin,
			rateMax:rateMax,
			rateMin:rateMin,
			threshold:threshold,
			sortType:sortType
		});
	}
	render(){
		return (
			<div className="sectionWrap">
				<div className="sectionBlock skillListBlock" id="skillListView">
					<h2 className="sectionHeadline">
						<span>Lv×達成率軸 スキルポイント一覧</span>
					</h2>
					<div className="attentionArea">
						<h3 className="partHeadline">
							ご注意
						</h3>
						<p className="read">
							使用はユーザーの皆さまにお任せ致します。<br />半端無い値を入れてブラウザが固まったり、落ちたりしても責任は負いませんのでご了承ください。
						</p>
					</div>
					<div className="areaBlock" id="skillFormView">
						<form id="skillForm" onSubmit={this.submitHandler.bind(this)}>
							<dl>
								<dt className="formHeadline">
									レベル
								</dt>
								<dd>
									<select id="skillListLevelMin" name="levelMin" ref="levelMin">
										<option value="10">
											1.00
										</option>
										<option value="15">
											1.50
										</option>
										<option value="20">
											2.00
										</option>
										<option value="25">
											2.50
										</option>
										<option value="30">
											3.00
										</option>
										<option value="35">
											3.50
										</option>
										<option value="40">
											4.00
										</option>
										<option value="45">
											4.50
										</option>
										<option value="50">
											5.00
										</option>
										<option value="55">
											5.50
										</option>
										<option value="60">
											6.00
										</option>
										<option value="65">
											6.50
										</option>
										<option value="70">
											7.00
										</option>
										<option value="75">
											7.50
										</option>
										<option value="80">
											8.00
										</option>
										<option value="85">
											8.50
										</option>
										<option value="90">
											9.00
										</option>
										<option value="95">
											9.50
										</option>
										<option value="99">
											9.99
										</option>
									</select>
									～
									<select id="skillListLevelMax" name="levelMax" ref="levelMax">
										<option value="10">
											1.00
										</option>
										<option value="15">
											1.50
										</option>
										<option value="20">
											2.00
										</option>
										<option value="25">
											2.50
										</option>
										<option value="30">
											3.00
										</option>
										<option value="35">
											3.50
										</option>
										<option value="40">
											4.00
										</option>
										<option value="45">
											4.50
										</option>
										<option value="50">
											5.00
										</option>
										<option value="55">
											5.50
										</option>
										<option value="60">
											6.00
										</option>
										<option value="65">
											6.50
										</option>
										<option value="70">
											7.00
										</option>
										<option value="75">
											7.50
										</option>
										<option value="80">
											8.00
										</option>
										<option value="85">
											8.50
										</option>
										<option value="90">
											9.00
										</option>
										<option value="95">
											9.50
										</option>
										<option value="99">
											9.99
										</option>
									</select>
								</dd>
							</dl>
							<dl>
								<dt className="formHeadline">
									達成率<sup>（整数0～100まで）</sup>
								</dt>
								<dd>
									<input className="rate" id="skillListRateMin" max="100" min="0" type="number" ref="rateMin" />
									% ～
									<input className="rate" id="skillListRateMax" max="100" min="0" type="number" ref="rateMax" />%
								</dd>
							</dl>
							<dl>
								<dt className="formHeadline">
									閾値
								</dt>
								<dd>
									<input className="point" id="skillListThreshold" placeholder="150" type="number" ref="threshold" />pt
								</dd>
							</dl>
							<dl>
								<dt className="formHeadline">
									描画タイプ
								</dt>
								<dd>
									<select id="skillListGenType" ref="sortSelect">
										<option value="0">
											Lv×達成率
										</option>
										<option value="1">
											達成率×Lv
										</option>
									</select>
								</dd>
							</dl>
							<div className="buttonWrap">
								<label className="submitBase primary" htmlFor="skillListSubmit">生成</label><button id="skillListSubmit" type="submit">生成</button>
							</div>
						</form>
					</div>
					<div className="areaBlock" id="skillOutputView">
						<RateListTable lvMax={this.state.lvMax} lvMin={this.state.lvMin} rateMax={this.state.rateMax} rateMin={this.state.rateMin} threshold={this.state.threshold} sortType={this.state.sortType} />
					</div>
				</div>
			</div>
		);
	}
}