var React  = require('react');
// var $ = require('jquery');

var AnalyzeGraph = require('./analyzeGraph');

module.exports = class AnalyzeControlView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			toggleFlg:true,
			currentType:0,
			reserve:false,
			targetSkill:true,
			highChartsData:{},
		}
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()
	}
	componentDidMount(){
		this.genGraphData();
	}
	// 無限ループ
	componentDidUpdate(prevp,prevs){
		// グラフ周りの設定をいじった時にもグラフ情報を再ジェネレートする
		if(
			this.state.currentType !== prevs.currentType ||
			this.state.reserve !== prevs.reserve ||
			this.state.targetSkill !== prevs.targetSkill
		){
			this.genGraphData();
		}
	}
	graphTypes(){
		return [
			{className:'actionButtonBase primary', text:'Lv×Point', value:'0', xAxis:'Lv', yAxis:'Point' , xkey:'level', ykey:'point'},
			{className:'actionButtonBase primary', text:'Point×達成率', value:'1', xAxis:'Point', yAxis:'達成率',xkey:'point', ykey:'rate'},
			{className:'actionButtonBase primary', text:'Lv×達成率', value:'2', xAxis:'Lv', yAxis:'達成率', xkey:'level', ykey:'rate'},
		]
	}
	toggleHandler(){
		let flg = !this.state.toggleFlg;
		this.setState({toggleFlg:flg});
	}
	targetSkillHandler(){
		let flg = !this.state.targetSkill;
		this.setState({targetSkill:flg});
	}
	reserveHandler(){
		let flg = !this.state.reserve;
		this.setState({reserve:flg});
	}
	graphRender(e){
		this.setState({currentType:parseInt(e.currentTarget.getAttribute('data-value'))});
	}
	genGraphData(){
		let data = {'old':[],'hot':[]};
		let graphtype = this.graphTypes()[this.state.currentType];
		let xAxis = graphtype.xAxis;
		let yAxis = graphtype.yAxis;
		let xKey = graphtype.xkey;
		let yKey = graphtype.ykey;
		if(this.state.reserve){
			let tmp = xAxis+''; //shalow
			xAxis = yAxis+'';
			yAxis = tmp+'';

			tmp = xKey;
			xKey = yKey+'';
			yKey = tmp+'';
		}
		if(
			this.props.models.model.userModel.get('data') == undefined ||
			this.props.models.model.userModel.get('data').length == 0
		){
			return
		}
		this.props.models.model.userModel.get('data').each(function(musicModel,index){
			let setData = {
				name:musicModel.get('title'),
				x:musicModel.get(xKey)*1,
				y:musicModel.get(yKey)*1
			};
			data[musicModel.get('frame')].push(setData);
		});
		let options = {
			chart:{
				type:'scatter'
				,zoomType:'xy'
			},title: {
				text:xAxis+' × '+ yAxis
			},subtitle:{
				text:''
			},xAxis:{
				title:{
					enabled: true
					,title:xAxis
				},startOnTick:true
				,endOnTick:true
				,showLastLavel:true
			},yAxis:{
				title:{text:yAxis}
			},legend:{
				layout:'vertical'
				,align:'right'
				,verticalAlign:'top'
				,x:5
				,y:5
				,floating:true
				,backgroundColor:('#ccc')
				,borderWidth:2
			},plotOptions:{
				scatter:{
					marker:{
						radius:8
						,states:{
							hover:{
								enabled:true
								,lineColor:'rgb(100,100,100)'
							}
						}
					}
					,states:{
						hover:{
							marker:{
								enabled:true
							}
						}
					}
					,tooltip:{
						headerFormat:'{series.name} | {point.key}<br>'
						,pointFormat: yAxis+'{point.y} | '+xAxis+'{point.x}'
					}
				}
			},
			series:[{
					name:'HOT'
					,color:'rgba(233,83,83,.5)'
					,data:data.hot
				},{
					name:'OLD'
					,color:'rgba(119, 152, 191, .5)'
					,data:data.old
				}
			]
		};
		this.setState({highChartsData:options});
	}
	render(){
		
		if(
			this.props.models.model.userModel.get('data') == undefined ||
			this.props.models.model.userModel.get('data').length == 0
		){
			return null;
		}
		
		let self = this;
		let graphTypeUIDOM = this.graphTypes().map(function(graphType,index){
			let className = graphType.className;
			if(index == self.state.currentType){
				className += ' current';
			}
			return <li key={graphType.text} className={className} data-value={index} onClick={self.graphRender.bind(self)}>
			{graphType.text}
			</li>
		});

		let graphTypeDOM = this.graphTypes().map(function(graphType){
			return <option key={graphType.value} value={graphType.value}>{graphType.text}</option>
		});

		// 対象曲に絞る設定
		let targetSkillText = this.state.targetSkill ? 'ON' : 'OFF';
		let targetSkillClass = 'actionButtonBase secondary'
		targetSkillClass += this.state.targetSkill ? ' current' : '';

		// 軸反転設定
		let reserveText = this.state.reserve ? 'ON' : 'OFF';
		let reserveClass = 'actionButtonBase secondary'
		reserveClass += this.state.reserve ? ' current' : '';

		return (
			<div className="areaBlock" id="analyzeGraphView">
				<div className="toggleWrap js-toggleWrap sp-toggleWrap">
					<p className="toggleTrigger js-toggleTrigger" id="graphToggleTrigger">グラフ</p>
					<div className="graphToggleWrap toggleArea js-toggleArea">
						<div className="graphControles" id="analyzeGraphControls">
							<p className="formHeadline">グラフ軸</p>
							<div className="buttonGroup graphTypeUi">
								<ul id="graphTypeUi">
									{graphTypeUIDOM}
								</ul>
							</div>
							<dl className="buttonList">
								<dt className="formHeadline">
									対象曲に絞る
								</dt>
								<dd>
									<span className={targetSkillClass} id="limitUi" onClick={this.targetSkillHandler.bind(this)}>{targetSkillText}</span>
								</dd>
							</dl>
							<dl className="buttonList">
								<dt className="formHeadline">
									軸反転
								</dt>
								<dd>
									<span className={reserveClass} id="reverseUi" onClick={this.reserveHandler.bind(this)}>{reserveText}</span>
								</dd>
							</dl>
							<form className="hide">
								<select id="graphType">
									{graphTypeDOM}
								</select>
								<input checked="" id="limit" name="limit" type="checkbox" value="1" />
								<input id="reverse" name="reverse" type="checkbox" value="1" />
							</form>
						</div>
						<AnalyzeGraph models={this.props.models} toggle={this.state.toggleFlg} highChartsData={this.state.highChartsData} setHighChartsData={this.genGraphData.bind(this)} />
					</div>
				</div>
			</div>
		);
	}
}