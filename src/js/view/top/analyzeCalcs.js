var React  = require('react');

module.exports = class AnalyzeCalcsView extends React.Component {
	constructor(props){
		super(props);
		var self = this;
		this.state = {
			avgCalcTotal:0,
			avgCalcSelect:0,
			avgCalcAns:function(){
				if( self.state.avgCalcTotal == 0 ){
					return 'null'
				}
				let ans = self.state.avgCalcTotal;
				if(self.state.avgCalcSelect == 0){
					ans = ans / 50
				}else{
					ans = ans / 25
				}
				return ans;
			},
			skillCalcLv:0,
			skillCalcRate:0,
			skillCalcAns:function(){
				if(self.state.skillCalcLv == 0 || self.state.skillCalcRate == 0){
					return 'null';
				}
				return ( (self.state.skillCalcLv*100*2)* ( self.state.skillCalcRate * 100 )) / 100000
			},
			rateCalcLv:0,
			rateCalcPaf:0,
			rateCalcCombo:0,
			rateCalcRate:function(){
				if(
					self.state.rateCalcLv == 0 ||
					self.state.rateCalcPaf == 0 ||
					self.state.rateCalcCombo == 0 
				){
					return 'null'
				}

				let perfect = self.state.rateCalcPaf;
				let combo = self.state.rateCalcCombo;
				let great = 100-perfect;

				//grが多すぎた場合Missもあると仮定して上限を設ける
				if(great > 10){
				    great = 10;
				}
				let tmp = ( perfect * 85 ) + ( great * 25 );
				let result = tmp+(combo*15);
				tmp = result+'';
				result = tmp.slice(0,-2)+'.'+tmp.slice(-2);
				return result;
			},
			rateCalcPoint:function(){
				if(
					self.state.rateCalcLv == 0 ||
					self.state.rateCalcPaf == 0 ||
					self.state.rateCalcCombo == 0 
				){
					return 'null'
				}

				return ( (self.state.rateCalcLv*100*2) * (self.state.rateCalcRate()*100) ) / 100000
			},
		}
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	avgCalcHandler(){
		if(this.refs.avgCalcTotal.value != ''){
			let total = this.refs.avgCalcTotal.value;
			this.setState({avgCalcTotal:parseFloat(total)});
		}
		if(this.refs.avgCalcSelect.value != ''){
			this.setState({avgCalcSelect:parseInt(this.refs.avgCalcSelect.value)});
		}
	}
	skillCalcHandler(){
		if(this.refs.skillCalcLv.value != ''){
			let lv = this.refs.skillCalcLv.value
			if(lv.indexOf('.') == -1){
				lv = lv+'.00';
			}
			this.setState({skillCalcLv:parseFloat(lv)});
		}
		if(this.refs.skillCalcRate.value != ''){
			this.setState({skillCalcRate:parseInt(this.refs.skillCalcRate.value)});
		}

	}
	rateCalcHandler(){
		if(this.refs.rateCalcLv.value != ''){
			let lv = this.refs.rateCalcLv.value
			if(lv.indexOf('.') == -1){
				lv = lv+'.00';
			}
			this.setState({rateCalcLv:parseFloat(lv)});
		}
		if(this.refs.rateCalcCombo.value != ''){
			this.setState({rateCalcCombo:parseInt(this.refs.rateCalcCombo.value)});
		}
		if(this.refs.rateCalcPaf.value != ''){
			this.setState({rateCalcPaf:parseInt(this.refs.rateCalcPaf.value)});
		}

	}
	render(){
		return (
			<div className="areaBlock calcBlock" id="analyzeSubCalcView">
				<section>
					<h3>理想SPを単曲で計算する</h3>
					<div className="input">
						<input id="subCalcSingleAvgTotal" placeholder="1000" type="number" onChange={this.avgCalcHandler.bind(this)} ref='avgCalcTotal'/>
						pt上げるには
						<select id="subCalcSingleAvgFilter" ref="avgCalcSelect" onChange={this.avgCalcHandler.bind(this)} >
							<option value="0">すべての曲</option>
							<option value="1">新曲</option>
							<option value="2">旧曲</option>
						</select>
						を対象にした場合1曲あたり
					</div>
					<div className="output">
						<span id="subCalcSingleAvg">{this.state.avgCalcAns()}</span>pt上げる必要がある
					</div>
				</section>
				<section>
					<h3>Lv×達成率による簡易スキルポイント計算</h3>
					<div className="input">
						<input id="subCalcSkillMathLv" max="9.99" min="1.00" placeholder="7.00" type="number" onChange={this.skillCalcHandler.bind(this)} ref="skillCalcLv" />
						の曲を
						<input id="subCalcSkillMathRate" max="100" min="0.00" placeholder="90.00" type="number" onChange={this.skillCalcHandler.bind(this)} ref="skillCalcRate" />
						%でクリアすると
					</div>
					<div className="output">
						単曲スキルは<span id="subCalcSkillMath">{this.state.skillCalcAns()}</span>ptです。
					</div>
				</section>
				<section>
					<h3>
						達成率計算
					</h3>
					<div className="input">
						<ul>
							<li>
								レベル
								<input id="subCalcRateMathLv" max="9.99" min="1.00" placeholder="7" type="number" onChange={this.rateCalcHandler.bind(this)} ref="rateCalcLv" />
							</li>
							<li>
								コンボ（%）
								<input id="subCalcRateMathCombo" max="100" min="0" placeholder="48" step="1" type="number" onChange={this.rateCalcHandler.bind(this)} ref="rateCalcCombo" />
							</li>
							<li>
								Perfect（%）
								<input id="subCalcRateMathPerfect" max="100" min="0" placeholder="98" step="1" type="number" onChange={this.rateCalcHandler.bind(this)} ref="rateCalcPaf" />
							</li>
						</ul>
					</div>
					<div className="output">
						達成率はおおよそ
						<span id="subCalcRateMathRate">{this.state.rateCalcRate()} <br /></span>スキルポイントはだいたい
						<span id="subCalcRateMathPoint">{this.state.rateCalcPoint()}</span>
						ptです。
					</div>
				</section>
			</div>
		);
	}
}