var React  = require('react');
// var $ = require('jquery');


module.exports = class MusicListTable extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	render(){
		if(this.props.renderData == undefined || this.props.renderData.length == 0){
			return null;
		}
		let partMaster = [
			'BSC-D','ADV-D','EXT-D','MAS-D',
			'BSC-G','ADV-G','EXT-G','MAS-G',
			'BSC-B','ADV-B','EXT-B','MAS-B',
		];
		let filterPart = this.props.filterPart.map(function(val){
			return partMaster[val];
		});
		let tr = this.props.renderData.map(function(model){
			if(filterPart.indexOf(model.get('part')) == -1){
				return null;
			}
			let classname = model.get('part').slice(0,3).toLowerCase();

			return (
				<tr className={classname}>
					<td className="musicScope">{model.get('type')}</td>
					<td className="musicTitle">{model.get('title')}</td>
					<td className="musicPart">{model.get('part')}</td>
					<td className="musicLv">{model.get('level')}</td>
				</tr>
			);
		});
		return (
			<tbody>
				{tr}
			</tbody>
		);
	}
}