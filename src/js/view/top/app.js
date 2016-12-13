var React  = require('react');
// var $ = require('jquery');

var ScrapingForm = require('./scrapingForm');
var AnlyzeData = require('./analyzeData');
module.exports = class TopView extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div>
				<div className="areaBlock" id="analyzeFormView">
					<ScrapingForm models={this.props.models}/>
				</div>
				<AnlyzeData models={this.props.models} />
			</div>
		);		
	}
}