var React  = require('react');
// var $ = require('jquery');

var AnalyzeAverage = require('./analyzeAverages')
module.exports = class AnalyzeAverageWrapView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hot:[],
			old:[],
		}
	}
	componentWillMount(){
		var props = this.props;
		var self = this;
		this.props.models.model.userModel.on('sync',function(model,res){
			let point = model.get('data').getTotalSkill();
			//百の位まで切り捨て
			point = parseInt( parseInt( point ) / 100 ) * 100
			if(point == 0){
				return ;
			}
			let options = model.getOptions();
			options.skillPoint = point;
			props.models.model.averageCollection.setOptions(options);
			props.models.model.averageCollection.userModel = model;
			// if(options.webType.indexOf('tri.gfdm-skill.net') != -1){
			// gitadorainfoではhot枠をわけてないのでtri.gfdmからとってくる
				let url = props.models.model.averageCollection.url();
				props.models.model.averageCollection.fetch({
					dataType:'html',
					type:'GET',
					reset:false,
					remove:false,
					url:url,
					timeout: 1000*60,
					success:function(avgModel,avgRes){
						self.setState({
							old:avgModel.getUseAverage('old')
						})
					}
				})
				props.models.model.averageCollection.fetch({
					dataType:'html',
					type:'GET',
					url:url.replace('other','hot'),
					reset:false,
					remove:false,
					timeout: 1000*60,
					success:function(avgModel,avgRes){
						self.setState({
							hot:avgModel.getUseAverage('hot')
						});
					}
				});

			// }

		});
		this.props.models.model.averageCollection.on('sync',function(model,res){
		});

	}
	componentDidMount(){
	}
	render(){
		let dataCollection = this.props.models.model.userModel.get('data');
		if(dataCollection == undefined || dataCollection.length == 0){
			return null;
		}
		return (
			<div id="analyzeRecommendView">
				<div className="areaBlock">
					<div className="recListWrap" id="recListWrap">
						<AnalyzeAverage models={this.props.models} heading='新曲枠' wrapClass='recListHotArea' data={this.state.hot} key='hot' />
						<AnalyzeAverage models={this.props.models} heading='旧曲枠' wrapClass='recListOldArea' data={this.state.old} key='old' />
					</div>
				</div>
			</div>
		);
	}
}