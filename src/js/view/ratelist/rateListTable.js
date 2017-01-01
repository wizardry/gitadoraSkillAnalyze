var React  = require('react');
// var $ = require('jquery');


module.exports = class rateListControl extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
	}
	render(){
		let lvMax = this.props.lvMax;
		let lvMin = this.props.lvMin;
		let rateMax = this.props.rateMax;
		let rateMin = this.props.rateMin;
		let threshold = this.props.threshold;
		let sortType = this.props.sortType

		if(lvMax == 0 || rateMax == 0){
			return null;
		}
		
		let heading = (int) => {return '達成率： '+int+'%'};
		let xThText = (int) => {return 'Lv'+int;};
		let yThText = (int) => {return int+'%';};
		let renderType = 'Lv/達成率'
		let calc = (lv,rate) => {
			if(lv == 0 || rate == 0){
				return;
			}
			let _tmp = ((lv*2)*(rate/100)).toFixed(2);
			return _tmp
		};

		let xData = {min:lvMin,max:lvMax};
		let yData = {min:rateMin,max:rateMax};
		if(sortType == 1 ){
			xData = {min:rateMin,max:rateMax};
			yData = {min:lvMin,max:lvMax};
			heading = (int) => {return 'Lv： '+int+'台';};
			xThText = (int) => {return int+'%';};
			yThText = (int) => {return 'Lv'+int;};
			renderType = '達成率/Lv';
			calc = (rate,lv) => {
				if(lv == 0 || rate == 0){
					return;
				}
				let _tmp = ((lv*2)*(rate/100)).toFixed(2);
				return _tmp
			};

		}
		let tableData = [];
		let tableDataIndex = 0;
		let tableRoopIntY = yData.min*1;
		while(tableRoopIntY < yData.max+1){
			let tmp =[];
			let tableRoopIntX = xData.min*1;
			while(tableRoopIntX < xData.max+1){
				let point = calc(tableRoopIntX,tableRoopIntY);
				tmp.push( point )
				tableRoopIntX++
			}
			tableData.push(tmp);
			tableDataIndex++
			tableRoopIntY++
		}

		let _tmp = _.clone(tableData);
		tableData = [];
		for (var i = 0; i < _tmp.length/5; i++) {
			tableData[i] = [ _tmp[(i*5)+0] ,_tmp[(i*5)+1] ,_tmp[(i*5)+2] ,_tmp[(i*5)+3] ,_tmp[(i*5)+4] ];
		};

		var DOM = tableData.map(function(table,index1){
			var rowDOM = table.map(function(row,index2){
				if(row == undefined){
					return null;
				}
				var cellDOM = row.map(function(cell,index3){
					if(cell == undefined){
						return (<td></td>)
					}
					let classname = parseFloat(cell) >= threshold/100 ? 'threshold':''
					return (
						<td key={cell} className={classname}>
							{cell}pt
						</td>
					)
				});

				return (
					<tr key={index1*index2}>
						<th>{yThText(yData.min + ( (index1*5)+index2) )}</th>
						{cellDOM}
					</tr>
				);
			});

			let theadDOM = []
			for (var i = xData.min; i < xData.max+1; i++) {
				theadDOM.push(<th>{xThText(i)}</th>);
			};

			return (
				<div className='skillListWrap'>
					<h2><b>{heading( (index1*5)+yData.min)}</b></h2>
					<table>
						<thead>
							<th>{renderType}</th>
							{theadDOM}
						</thead>
						<tbody>
							{rowDOM}
						</tbody>
		 			</table>
				</div>
			);
		});

		return (
			<div>
				{DOM}
			</div>
		);
	}
}