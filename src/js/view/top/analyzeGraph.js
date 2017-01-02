var React  = require('react');
// var $ = require('jquery');

module.exports = class AnlyzeGraphView extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		if(_.isEmpty(this.props.highChartsData)){
			this.props.setHighChartsData();
		}
	}
	componentDidMount(){
		$('#analyzeGraphCanvas').highcharts(this.props.highChartsData);
	}
	componentDidUpdate(){
		$('#analyzeGraphCanvas').highcharts(this.props.highChartsData);
	}
	componentWillReceiveProps(){
	}
	render(){
		if(this.props.toggleFlg){
			return null;
		}
		return (
			<div className="graphCanvas areaBlock" id="analyzeGraphCanvas">
			</div>
		);
	}
}