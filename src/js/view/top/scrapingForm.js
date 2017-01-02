var React  = require('react');
// var $ = require('jquery');

module.exports = class ScrapingFormView extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}
	componentWillMount(){

		/**
		* ex cookie
		* key : uid
		* oldValue : "{"userId":"410","part":"g","webType":"mimi-tb","url":"http://tri.gfdm-skill.net/users/users/410/guiter","search":"1"}"
		* value : "{"userId":"410","idType":"g","webType":"http://tri.gfdm-skill.net/users/"}"
		*/
		let cookie = $.cookie('uid');
		if(cookie != undefined){
			cookie = JSON.parse(cookie);
			if(cookie.part !== undefined){
				alert('Cookie情報が古いため過去の入力情報を破棄します。');
				$.removeCookie('uid');
			}
			cookie.hasCookie = true;
			this.state = cookie;
		}
	}
	componentDidMount(){
		if(this.state.hasCookie){
			this.refs.idType.value = this.state.idType;
			this.refs.webType.value = this.state.webType;
			this.refs.userId.value = this.state.userId;
		}
		this.dataFetch(this);
	}
	submitHandler(e){
		e.preventDefault();
		$.cookie('uid',JSON.stringify({
			userId:this.refs.userId.value,
			idType:this.refs.idType.value,
			webType:this.refs.webType.value
		}));
		this.dataFetch(this);
	}
	dataFetch(self){
		let data = {
			idType:self.refs.idType.value,
			webType:self.refs.webType.value,
			userId:self.refs.userId.value
		};
		self.props.models.model.userModel.setURL(data.webType,data.idType,data.userId);
		self.props.models.model.userModel.fetch({
			dataType:'html',
			type:'GET',
			success:function(a,b,c){
			}
		});

	}
	userIdChangeHandler(){}
	idTypeChangeHandler(){}
	webTypeChangeHandler(){}
	render(){
		return (
			<form action="" id="analyzeForm" ref="analyzeForm" onSubmit={(e) => this.submitHandler(e) }>
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
								// <option value="./data/user.html">develop</option>
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