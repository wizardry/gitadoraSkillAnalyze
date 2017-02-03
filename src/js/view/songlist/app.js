var React  = require('react');
// var $ = require('jquery');
var MusicListTable = require('./songListTable')

module.exports = class MusicListWrap extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			toggle:true
		};
	}
	componentWillMount(){
		// this.props.models.model.userModel.on()
		let self = this;
		this.props.models.model.songCollection.on('sync',function(collection){
			// fetch時にはローカルストレージの更新を行う
			self.setState({data:this})
			console.log('localstrage set item ',JSON.stringify( this.toJSON() ) )
			localStorage.setItem('musiclist', JSON.stringify( this.toJSON() ) );
		});
		/**
		* ex musiclist
			[{
				"scope":"old",
				"title":"innocent world",
				"lv":100,
				"part":"BSC-G",
				"type":"g"
			},{
				"scope":"old","title":"優勢オーバードーズ","lv":100,"part":"BSC-D","type":"d"
			}]
		*/
		let musicList = JSON.parse( localStorage.getItem('musiclist') );

		// ローカルストレージ上にない、データが破損していればFetchを行う
		if(musicList == null || !Array.isArray(musicList) ) {
			this.props.models.model.songCollection.wFetch();
			console.log('localStorageData is Null');
		}
		//古い形式の場合もFetchを行う
		else if(musicList[0].scope != undefined){
			this.props.models.model.songCollection.wFetch();
			console.log('localStorageData is Old');
		}

		// nullや 新しい形式であればcollectionに突っ込む
		else {
			this.props.models.model.songCollection.set(musicList);
			this.setState({data:this.props.models.model.songCollection})
			console.log('has localStorage',this.props.models.model.songCollection);
		}
	}
	componentDidMount(){
	}
	fetchHandler(e){
		e.preventDefault();
		this.props.models.model.songCollection.wFetch();
	}
	renderHandler(e){
		e.preventDefault();
		var data =  this.state.data;
		var partFilterValues = [];
		$('[name=musicListPartFilters]').each(function(){
			if($(this).prop('checked')){
				partFilterValues.push($(this).val());
			}
		});
		// this.refs.scopeFilter.value
		// this.refs.orderSort.checked
		// this.refs.filterLv.value
		// this.refs.gameType.value


		// GUITAR OR DRUM でフィルターする
		if(this.refs.gameType.value == 'g'){
			data = data.filter(function(model){
				return model.get('part').indexOf('-D') == -1
			});
		}else{
			data = data.filter(function(model){
				return model.get('part').indexOf('-D') != -1
			});
		}

		// old or hot でフィルターする
		if(this.refs.scopeFilter.value == 1){
			data = data.filter(function(model){
				return model.get('type') == 'hot';
			});
		}
		if(this.refs.scopeFilter.value == 2){
			data = data.filter(function(model){
				return model.get('type') == 'old';
			})
		}

		// Lvでフィルターする
		let valAry = [
			[1.00,1.49],[1.50,1.99],[2.00,2.49],[2.50,2.99],
			[3.00,3.49],[3.50,3.99],[4.00,4.49],[4.50,4.99],
			[5.00,5.49],[5.50,5.99],[6.00,6.49],[6.50,6.99],
			[7.00,7.49],[7.50,7.99],[8.00,8.49],[8.50,8.99],
			[9.00,9.49],[9.50,9.99],[1.00,9.99],
		];
		let _tmp = valAry[parseInt(this.refs.filterLv.value)];
		data = data.filter(function(model){
			return parseFloat(model.get('level')) >= _tmp[0] && parseFloat(model.get('level')) <= _tmp[1] ;
		});

		if(!this.refs.orderSort.checked){
			data = _.sortBy(data,function(model){
				return parseFloat(model.get('level'))*-1;
			})
		}
		this.setState({
			gameType:this.refs.gameType.value,
			filterLv:this.refs.filterLv.value,
			sort:this.refs.orderSort.checked,
			filterScope:this.refs.scopeFilter.value,
			filterPart:partFilterValues,
			renderData:data
		});
	}
	toggleDetailArea(){
		this.setState({toggle:!this.state.toggle});
	}
	render(){
		let wrapDisplay = 'block'
		if( this.props.models.model.viewStateModel.get('mode') != 'musicList'){ wrapDisplay = 'none'; }
		return (
			<div className="sectionBlock musicBlock" id="musicListView" style={{display:wrapDisplay}}>
				<h1 className="sectionHeadline">
					<span>曲一覧<sup>（難易度軸）</sup></span>
				</h1>
				<div id="MusicFormView">
					<form className="areaBlock" id="musicListConfigForm" onSubmit={this.fetchHandler.bind(this)}>
						<div className="buttonWrap">
							<label className="submitBase primary" htmlFor="musicListGetDataSubmit">曲情報を再取得する</label><button id="musicListGetDataSubmit" type="submit">曲情報を再取得する</button>
						</div>
						<p className="oneLinerForm">
							<input defaultChecked="checked" id="musicListSaveToLocal" type="checkbox" />
							<label htmlFor="musicListSaveToLocal">ローカルストレージに曲データを保存する</label>
						</p>
						<p className="whatCheck">
							<sup>※チェックをすると次回から読み込み速度が速くなりますが、最新情報を取得しなくなります。</sup>
						</p>
					</form>
					<form className="areaBlock" id="musicListDrawForm" onSubmit={this.renderHandler.bind(this)}>
						<select id="musicListType" ref='gameType'>
							<option value="g">
								GUITARFREAKS
							</option>
							<option value="d">
								DRUMMANIA
							</option>
						</select>
						<select id="musicListLv" ref="filterLv">
							<option value="17">
								9.50 - 9.99
							</option>
							<option value="16">
								9.00 - 9.49
							</option>
							<option value="15">
								8.50 - 8.99
							</option>
							<option value="14">
								8.00 - 8.49
							</option>
							<option value="13">
								7.50 - 7.99
							</option>
							<option value="12">
								7.00 - 7.49
							</option>
							<option value="11">
								6.50 - 6.99
							</option>
							<option value="10">
								6.00 - 6.49
							</option>
							<option value="9">
								5.50 - 5.99
							</option>
							<option value="8">
								5.00 - 5.49
							</option>
							<option value="7">
								4.50 - 4.99
							</option>
							<option value="6">
								4.00 - 4.49
							</option>
							<option value="5">
								3.50 - 3.99
							</option>
							<option value="4">
								3.00 - 3.49
							</option>
							<option value="3">
								2.50 - 2.99
							</option>
							<option value="2">
								2.00 - 2.49
							</option>
							<option value="1">
								1.50 - 1.99
							</option>
							<option value="0">
								1.00 - 1.49
							</option>
							<option value="18">
								all
							</option>
						</select>
						<div className="checkboxWrap oneLinerForm">
							<input defaultChecked="checked" id="musicListSortVector" type="checkbox" ref="orderSort" />
							<label htmlFor="musicListSortVector">降順</label>
						</div>
						<div className="js-toggleWrap toggleWrap">
							<p className="toggleTrigger js-toggleTrigger" onClick={this.toggleDetailArea.bind(this)}>
								詳細設定
							</p>
							<div className="wrap toggleArea js-toggleArea" style={{display:this.state.toggle?'none':'block',opacity:this.state.toggle?0:1}}>
								<p className="formHeadline">
									スキル枠フィルター
								</p>
								<select id="musicListScopeFilter" ref="scopeFilter">
									<option value="0">
										全曲
									</option>
									<option value="1">
										新曲枠のみ
									</option>
									<option value="2">
										旧曲枠のみ
									</option>
								</select>
								<p className="formHeadline">
									パート/難易度フィルター
								</p>
								<ul className="partfilterList">
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter1" name="musicListPartFilters" type="checkbox" value="0" />
												<label htmlFor="musicListPartFilter1">BSC-D</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter2" name="musicListPartFilters" type="checkbox" value="1" />
												<label htmlFor="musicListPartFilter2">ADV-D</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter3" name="musicListPartFilters" type="checkbox" value="2" />
												<label htmlFor="musicListPartFilter3">EXT-D</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter4" name="musicListPartFilters" type="checkbox" value="3" />
												<label htmlFor="musicListPartFilter4">MAS-D</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter5" name="musicListPartFilters" type="checkbox" value="4" />
												<label htmlFor="musicListPartFilter5">BSC-G</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter6" name="musicListPartFilters" type="checkbox" value="5" />
												<label htmlFor="musicListPartFilter6">ADV-G</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter7" name="musicListPartFilters" type="checkbox" value="6" />
												<label htmlFor="musicListPartFilter7">EXT-G</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter8" name="musicListPartFilters" type="checkbox" value="7" />
												<label htmlFor="musicListPartFilter8">MAS-G</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter9" name="musicListPartFilters" type="checkbox" value="8" />
												<label htmlFor="musicListPartFilter9">BSC-B</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter10" name="musicListPartFilters" type="checkbox" value="9" />
												<label htmlFor="musicListPartFilter10">ADV-B</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter11" name="musicListPartFilters" type="checkbox" value="10" />
												<label htmlFor="musicListPartFilter11">EXT-B</label>
											</div>
										</div>
									</li>
									<li>
										<div className="paddingWrap">
											<div className="checkboxWrap">
												<input defaultChecked="checked" id="musicListPartFilter12" name="musicListPartFilters" type="checkbox" value="11" />
												<label htmlFor="musicListPartFilter12">MAS-B</label>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<div className="buttonWrap">
							<label className="submitBase primary" htmlFor="musicListSubmit">出力</label>
							<button id="musicListSubmit" type="submit">出力</button>
						</div>
					</form>
				</div>
				<div className="areaBlock musicListTableBlock" id="musicOutputView">
					<table className="musicListTable">
						<colgroup>
							<col className="type" />
							<col />
							<col className="part" />
							<col className="lv" />
						</colgroup>
						<thead>
							<tr>
								<th>
									新旧
								</th>
								<th>
									曲名
								</th>
								<th>
									パート
								</th>
								<th>
									レベル
								</th>
							</tr>
						</thead>
						<MusicListTable gameType={this.state.gameType} filterLv={this.state.filterLv} sort={this.state.sort} filterScope={this.state.filterScope} filterPart={this.state.filterPart} renderData={this.state.renderData} />
					</table>
				</div>
			</div>
		)
	}
}