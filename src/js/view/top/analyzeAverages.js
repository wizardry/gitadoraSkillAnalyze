var React  = require('react');
// var $ = require('jquery');


module.exports = class AnalyzeAverageView extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	render(){
		console.log(this.props.data);
		let renderData = this.props.data.slice(0,30);

		let resultDOM = [(<li>平均データがありません。</li>)];
		if(renderData.length != 0){
			resultDOM = renderData.map(function(data){
				console.log(data)
				return (<li key={data.get('title')+'_'+data.get('part')}>
	                <span className="title">{data.get('title')}</span>
	                <span className="part">{data.get('part')}</span>
    	            <span className="lv">{data.get('level')}</span>
				</li>);
			});
		}
		return (
			<div className={"recListArea "+this.props.wrapClass}>
				<h3 className="chapterHeadline">
					{this.props.heading}
				</h3>
				<ul>
					{resultDOM}
				</ul>
			</div>
		);
	}
}