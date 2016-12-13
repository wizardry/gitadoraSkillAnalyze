var React  = require('react');
// var $ = require('jquery');

module.exports = class ScrapingFormView extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		console.log('willmount',this.props);
		// this.props.models.model.userModel.on()

	}
	componentDidMount(){
		console.log('didmount',this.props)
	}
	submitHandler(e){
		e.preventDefault();
		console.log('submit',this,e);
		let data = {
			idType:this.refs.idType.value,
			webType:this.refs.webType.value,
			userId:this.refs.userId.value
		};
		this.props.models.model.userModel.setURL(data.webType,data.idType,data.userId);
		this.props.models.model.userModel.fetch({
			dataType:'html',
			type:'GET',
			success:function(a,b,c){
				debugger;
			}
		});
		// $.ajax({
		// 	url:this.props.models.model.userModel.url,
		// 	dataType:'html',
		// 	type:'GET',
		// 	success:function(a,b,c){
		// 		debugger;
		// 	}
		// })
		console.log(this.props.models.model.userModel.url)
	}
	userIdChangeHandler(){}
	idTypeChangeHandler(){}
	webTypeChangeHandler(){}
	render(){
		return (
			<form action="" id="analyzeForm" onSubmit={(e) => this.submitHandler(e) }>
				<p className="sectionHeadline">
					<span>データ取得</span>
				</p>
				<div className="js-formToggleWrap toggleWrap toggleForm">
					<div className="js-formToggleVal1 toggleArea current">
						<p className="formHeadline">
							利用サイト
						</p>
						<p className="formline">
							<select id="userData_WebType" name="siteType" onChange={() => this.webTypeChangeHandler} ref="webType">
								<option value="http://tri.gfdm-skill.net/users/">
									http://tri.gfdm-skill.net - TriBoost
								</option>
								<option value="http://gitadora.info/targetskill50?gtype=">GITADORA info</option>
								<option value="./data/user.html">develop</option>
							</select>
						</p>
						<p className="formHeadline">
							PART / ID
						</p>
						<p className="formline">
							<select id="userData_part" name="idType" onChange={() => this.idTypeChangeHandler} ref="idType">
								<option value="g">
									GUITARFREAKS
								</option>
								<option value="d">
									DRUMMANIA
								</option>
							</select>
							<input className="em2" id="userData_id" name="getData" type="text" onChange={() => this.userIdChangeHandler} ref="userId" />
						</p>
					</div>
				</div>
				<div className="buttonWrap">
					<label className="submitBase primary" htmlFor="getDataTrigger">送信</label>
					<input id="getDataTrigger" type="submit" />
				</div>
			</form>
		);
	}
}