var React  = require('react');
// var $ = require('jquery');

module.exports = class AnlyzeDataView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			calcResult:{diffPoint:'null',length:'null',total:'null'},
			calcInput:{}
		};

	}
	componentWillMount(){
		console.log('willmount',this.props);
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
		console.log('didmount',this.props)
	}
	calcHandler(){
		console.log(this)
		console.log(this.refs)
		let type = this.refs.calcType.value;
		let min = this.refs.calcMin.value;
		let upper = this.refs.calcUpper.value;

		if(min == '' || upper == ''){
			return false;
		}

		this.setState({
			calcResult:this.props.models.model.userModel.get('data').calcIf(type,min,upper)
		});
	}
	render(){
		let dataCollection = this.props.models.model.userModel.get('data');
		console.log('analyze data.js render',this,dataCollection)
		if(dataCollection == undefined || dataCollection.length == 0){
			return null;
		}
		return (
			<div className="analyzeInforBlock">
				<div className="areaBlock userDataBlock" id="analyzeDataView">
					<h2 className="sectionHeadline">
						<span>データ詳細</span>
					</h2>
					<div className="userDataListWrap">
						<table>
							<tbody><tr>
								<th>
									総合 pt/Avg.
								</th>
								<td>
									<span id="analyzeDataTotalPoint">{dataCollection.getTotalSkill()}</span>pt
								</td>
								<td>
									<span id="analyzeDataTotalAvg">{dataCollection.getTotalAvg()}</span>Avg.
								</td>
							</tr>
							<tr>
								<th>
									Hot pt/Avg.
								</th>
								<td>
									<span id="analyzeDataHotPoint">{dataCollection.getHotSkillPoint()}</span>pt
								</td>
								<td>
									<span id="analyzeDataHotAvg">{dataCollection.getHotAvg()}</span>Avg.
								</td>
							</tr>
							<tr>
								<th>
									Old pt/Avg.
								</th>
								<td>
									<span id="analyzeDataOldPoint">{dataCollection.getOldSkillPoint()}</span>pt
								</td>
								<td>
									<span id="analyzeDataOldAvg">{dataCollection.getOldAvg()}</span>Avg.
								</td>
							</tr>
						</tbody></table>
					</div>
				</div>
				<div className="analyzeCalcBlock" id="analyzeCalcView">
					<div className="areaBlock">
						<div className="mathInput">
							<p>
								<select className="mathGenre" id="analyzeCalcFilter" name="" ref="calcType" onChange={this.calcHandler.bind(this)}>
									<option value="all">
										すべての曲
									</option>
									<option value="hot">
										新曲
									</option>
									<option value="old">
										旧曲
									</option>
								</select>
								から
								<br />
								<input className="pointInput em4" id="analyzeCalcUnder" placeholder="120.00" type="number" ref="calcMin" onChange={this.calcHandler.bind(this)} />
								pt以下の曲を
								<input className="pointInput em4 inline" id="analyzeCalcUpper" placeholder="120.00" type="number" ref="calcUpper" onChange={this.calcHandler.bind(this)} />
								に上げたと仮定すると...
							</p>
						</div>
						<div className="mathOutput">
							<p>
								<span id="analyzeCalcDiffPoint">{this.state.calcResult.diffPoint}</span>
								pt上昇して
								<br />
								<span id="analyzeCalcResult">{this.state.calcResult.total}</span>ptになります。
								<br />
								更新曲数は<span id="analyzeCalcMusicLength">{this.state.calcResult.length}</span> 曲です。
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}