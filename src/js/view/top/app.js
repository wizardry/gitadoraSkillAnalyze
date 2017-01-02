var React  = require('react');
// var $ = require('jquery');

var ScrapingForm = require('./scrapingForm');

var AnalyzeData = require('./analyzeData');
var AnalyzeGraph = require('./analyzeControl');
var AnalyzeAgerage = require('./analyzeAveragesWrap');
var AnalyzeCalcs = require('./analyzeCalcs');

module.exports = class TopView extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		let wrapDisplay = 'block';
		if(
			this.props.models.model.viewStateModel.get('mode') == 'musicList' || 
			this.props.models.model.viewStateModel.get('mode') == 'skillList'
		){
			wrapDisplay = 'none';
		}
		return(
			<div style={{display:wrapDisplay}}>
				<div className="areaBlock" id="analyzeFormView">
					<ScrapingForm models={this.props.models}/>
				</div>
				<AnalyzeData models={this.props.models} />
				<AnalyzeGraph models={this.props.models} />
				<AnalyzeAgerage models={this.props.models} />
				<AnalyzeCalcs models={this.props.models} />
			</div>
		);		
	}
}