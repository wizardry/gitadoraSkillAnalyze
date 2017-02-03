$(function(){
	console.time('load');
	/*--------------------------------------
		global vars
	--------------------------------------*/
	var skillData ={
		hot:[]
		,old:[]
	};
	var skillTotalDetailData={
		total:0
		,hotTotal:0
		,oldTotal:0
		,average:0
		,hotAverage:0
		,oldAverage:0
	};
	// スキルシミュレータの平均値URL表
	var avgRange = { g:[{skill:9000 ,userId:180 },{skill:8900 ,userId:179 },{skill:8800 ,userId:178 },{skill:8700 ,userId:177 },{skill:8600 ,userId:176 },{skill:8500 ,userId:175 },{skill:8400 ,userId:174 },{skill:8300 ,userId:173 },{skill:8200 ,userId:172 },{skill:8100 ,userId:171 },{skill:8000 ,userId:170 },{skill:7900 ,userId:169 },{skill:7800 ,userId:168 },{skill:7700 ,userId:167 },{skill:7600 ,userId:166 },{skill:7500 ,userId:165 },{skill:7400 ,userId:164 },{skill:7300 ,userId:163 },{skill:7200 ,userId:162 },{skill:7100 ,userId:161 },{skill:7000 ,userId:160 },{skill:6900 ,userId:159 },{skill:6800 ,userId:158 },{skill:6700 ,userId:157 },{skill:6600 ,userId:156 },{skill:6500 ,userId:155 },{skill:6400 ,userId:154 },{skill:6300 ,userId:153 },{skill:6200 ,userId:152 },{skill:6100 ,userId:151 },{skill:6000 ,userId:150 },{skill:5900 ,userId:149 },{skill:5800 ,userId:148 },{skill:5700 ,userId:147 },{skill:5600 ,userId:146 },{skill:5500 ,userId:145 },{skill:5400 ,userId:144 },{skill:5300 ,userId:143 },{skill:5200 ,userId:142 },{skill:5100 ,userId:141 },{skill:5000 ,userId:140 },{skill:4900 ,userId:139 },{skill:4800 ,userId:138 },{skill:4700 ,userId:137 },{skill:4600 ,userId:136 },{skill:4500 ,userId:135 },{skill:4400 ,userId:134 },{skill:4300 ,userId:133 },{skill:4200 ,userId:132 },{skill:4100 ,userId:131 },{skill:4000 ,userId:130 },{skill:3900 ,userId:129 },{skill:3800 ,userId:128 },{skill:3700 ,userId:127 },{skill:3600 ,userId:126 },{skill:3500 ,userId:125 },{skill:3400 ,userId:124 },{skill:3300 ,userId:123 },{skill:3200 ,userId:122 },{skill:3100 ,userId:121 },{skill:3000 ,userId:120 }] ,d:[{skill:9000 ,userId:180 },{skill:8900 ,userId:179 },{skill:8800 ,userId:178 },{skill:8700 ,userId:177 },{skill:8600 ,userId:176 },{skill:8500 ,userId:175 },{skill:8400 ,userId:174 },{skill:8300 ,userId:173 },{skill:8200 ,userId:172 },{skill:8100 ,userId:171 },{skill:8000 ,userId:170 },{skill:7900 ,userId:169 },{skill:7800 ,userId:168 },{skill:7700 ,userId:167 },{skill:7600 ,userId:166 },{skill:7500 ,userId:165 },{skill:7400 ,userId:164 },{skill:7300 ,userId:163 },{skill:7200 ,userId:162 },{skill:7100 ,userId:161 },{skill:7000 ,userId:160 },{skill:6900 ,userId:159 },{skill:6800 ,userId:158 },{skill:6700 ,userId:157 },{skill:6600 ,userId:156 },{skill:6500 ,userId:155 },{skill:6400 ,userId:154 },{skill:6300 ,userId:153 },{skill:6200 ,userId:152 },{skill:6100 ,userId:151 },{skill:6000 ,userId:150 },{skill:5900 ,userId:149 },{skill:5800 ,userId:148 },{skill:5700 ,userId:147 },{skill:5600 ,userId:146 },{skill:5500 ,userId:145 },{skill:5400 ,userId:144 },{skill:5300 ,userId:143 },{skill:5200 ,userId:142 },{skill:5100 ,userId:141 },{skill:5000 ,userId:140 },{skill:4900 ,userId:139 },{skill:4800 ,userId:138 },{skill:4700 ,userId:137 },{skill:4600 ,userId:136 },{skill:4500 ,userId:135 },{skill:4400 ,userId:134 },{skill:4300 ,userId:133 },{skill:4200 ,userId:132 },{skill:4100 ,userId:131 },{skill:4000 ,userId:130 },{skill:3900 ,userId:129 },{skill:3800 ,userId:128 },{skill:3700 ,userId:127 },{skill:3600 ,userId:126 },{skill:3500 ,userId:125 },{skill:3400 ,userId:124 },{skill:3300 ,userId:123 },{skill:3200 ,userId:122 },{skill:3100 ,userId:121 },{skill:3000 ,userId:120 }] }



	/*--------------------------------------
		cookie 周りの処理
	--------------------------------------*/

	function cookieFunc(){
		var url = '';
		var urlCookie = $.cookie('url');
		var cookiesData = [];

		//クッキーがあった場合フォームを入力済にさせる
		if(urlCookie != null || urlCookie != undefined ){
			cookiesData[0] = urlCookie.split('.php?uid=');
			cookiesData[1] = cookiesData[0][1].substr(1);
			cookiesData[2] = cookiesData[0][1].substr(0,1);
			$('#importUrl1').val(cookiesData[1]);
			$('#importType').val(cookiesData[2]);
			$('#importUrl2').val(urlCookie);
		}

		//PC版を見るをユーザーが選択した時に記憶させる
		$('#toPC').click(function(){
			$.cookie('toPc',true,{expires:30});
		})

		//サブミットした際はクッキー処理を入れる
		$('#importBtn').submit(function(){
			url = userPageUrlFunc();
			$.cookie('url',url,{expires:30});
			return false;
		})

	};
	function userPageUrlFunc(){
		var selectFlag = $('#importSelect').val();
		var url;
		if(selectFlag == 1){
			url = 'http://xv-s.heteml.jp/skill/gdod.php?uid='+$('#importType').val()+$('#importUrl1').val();
		}else if(selectFlag == 2){
			url = $('#importUrl2').val();
		}
		return url;
	};
	//UA判定してリダイレクトさせる
	function agentGadgeFunc(){
		var ua = {};
		ua.name = window.navigator.userAgent.toLowerCase();
		ua.isiPhone = ua.name.indexOf('iphone') >= 0;
		ua.isiPod = ua.name.indexOf('ipod') >= 0;
		ua.isiOS = (ua.isiPhone || ua.isiPod || ua.isiPad);
		ua.isAndroid = ua.name.indexOf('android') >= 0;

		var url = window.location;
		var path = url.href.split('/');
		var fileName = path.pop();

		var toPC = false;

		toPC = $.cookie('toPc');

		//FILENAME判定
		if(fileName == 'index.html' || fileName == '' ){
			//UA判定
			if(ua.isiPhone || ua.isiPod || ua.isiOS || ua.isAndroid){
				//cookie判定
				if(!toPC){
					location.href = './index-sp.html';
				};
			};
		};
	};

	/*--------------------------------------
		ajax　周りの処理
	--------------------------------------*/
	//global変数のskillDataにデータを格納する。 取得nodeからオブジェクトにデータ化する。
	function dataToDataFunc(frame,elem,i){
		var self = $(elem);
		var d;
		if(i == 0){
			return;
		}
		var musicTitle = $.trim(self.find('td').eq(1).text());
		var musicLevel = parseFloat(self.find('td').eq(2).text().replace(/\s*/,''))*100;
		var musicPer = parseFloat($.trim(self.find('td').eq(3).text().replace('%','').replace('.','')));
		var musicPoint = parseFloat($.trim(self.find('td').eq(4).text().replace('.','')));
		var musicRank = $.trim(self.find('td').eq(5).text());
		if(frame == 'hot'){
			skillData.hot[i-1] = {
				title: musicTitle
				,level: musicLevel
				,per: musicPer
				,point: musicPoint
				,rank: musicRank
			}
		}else{
			skillData.old[i-1] = {
				title: musicTitle
				,level: musicLevel
				,per: musicPer
				,point: musicPoint
				,rank: musicRank
			}
		};
	};

	//global変数のskillData から skillTotalDetailData を生成する。データ詳細の描画まで含める。
	function detailWraitenFunc(){

		//hot
		$.each(skillData.hot,function(i,d){
			//上位25曲以上あった場合省く
			if(i > 24){
				return false;
			}
			skillTotalDetailData.total += d.point;
			skillTotalDetailData.hotTotal += d.point;
		})
		$.each(skillData.old,function(i,d){
			if(i > 24){
				return false;
			}
			skillTotalDetailData.total += d.point;
			skillTotalDetailData.oldTotal += d.point;
		})
		skillTotalDetailData.oldAverage = parseInt(( skillTotalDetailData.oldTotal / 25 )) / 100;
		skillTotalDetailData.hotAverage = parseInt(( skillTotalDetailData.hotTotal / 25 )) / 100;
		skillTotalDetailData.average = parseInt(( skillTotalDetailData.total / 50 )) / 100;

		//トータルスキルポイントなど詳細データを書き出す
		$('#detailTotal').text( (skillTotalDetailData.total/100).toFixed(2) );
		$('#detailHotTotal').text( skillTotalDetailData.hotTotal/100 );
		$('#detailOldTotal').text( skillTotalDetailData.oldTotal/100 );
		$('#detailAvg').text( skillTotalDetailData.average );
		$('#detailHotAvg').text( skillTotalDetailData.hotAverage );
		$('#detailOldAvg').text( skillTotalDetailData.oldAverage );
	}
	//AVGデータのURLを探す
	function avgEach(data,skillPoint){
		var avgId=[]
		$.each(data,function(i,d){
			if(d.skill == skillPoint + 100){
				avgId[0] = d.userId
			}else if(d.skill == skillPoint + 200){
				avgId[1] = d.userId
			}
		})
		return avgId;
	}

	//AVGデータの対象入りしている曲を省く　重複チェックとソース類似の為時間あればまとめてしまう。
	function overlapFunc(eliminateList,data){
		var dataShadow=[];
		var overlapCheck = []
		$.each(eliminateList,function(i,d){

			$.each(data,function(i2,d2){
				if(d.title == d2.title){
					overlapCheck.push(i2)
				}
			})
		})
		$.each(overlapCheck,function(i,d){
			delete data[d]
		})

		dataShadow = $.extend(true,{},data);
		data.length = 0;
		$.each(dataShadow,function(i,d){
			if(d == undefined){
				return true
			}

			//ソート用数値
			if(d.part != ''){
				d.level = parseInt(d.part.substr(0,4).replace('.',''))
			}
			
			data.push(d)
		})
	}
	//AVGデータの重複データ削除
	function recDataGen(data){
		var recDataShadow=[];
		var overlapCheck = []
		$.each(data,function(i,d){

			$.each(data,function(i2,d2){
				if(i < i2 && d.title == d2.title && d.part == d2.part){
					overlapCheck.push(i2)
				}
			})
		})
		$.each(overlapCheck,function(i,d){
			delete data[d]
		})

		recDataShadow = $.extend(true,{},data);
		data.length = 0;
		$.each(recDataShadow,function(i,d){
			if(d == undefined){
				return true
			}
			data.push(d)
		})

	}
	//AVG取得と生成で使用する変数群
	function avgVarSetter(){
		var data = {};
		// data.skillPoint = parseInt($('#detailTotal').text().slice(0,-5) + '00');
		var skillPoint = Math.floor((skillTotalDetailData.total / 10000 )) * 100;
		data.skillPoint = parseInt(skillPoint)
		data.urlUid = $('#importUrl2').val().split('udi=')
		var gameTypeFunc = function(){
			var d;
			if( $('#importSelect').val() ==  1){
				d = $('#importType').val()
			}else{
				d = data.urlUid[1].index(0)
			}
			return d;
		}
		data.gameType = gameTypeFunc();
		data.avgId = [];
		var urlAryFunc = function(){
			var d
			var avgRangeData = avgRange;
			if(data.gameType == 'g'){
				data.avgId = avgEach(avgRangeData.g,data.skillPoint)
			}else{
				data.avgId = avgEach(avgRangeData.d,data.skillPoint)
			}
			d = ['http://xv-s.heteml.jp/skill/cp_gdod.php?uid=',data.gameType,data.avgId[0],'&tg=',data.gameType,data.avgId[1]]
			return d;
		}
		data.urlAry = urlAryFunc();
		

		data.url = data.urlAry[0]+data.urlAry[1]+data.urlAry[2]+data.urlAry[3]+data.urlAry[4]+data.urlAry[5]
		return data;
	}

	//AVGデータ用のHTMLを生成する
	function avgDataNodeGen(recData){
		var vars = avgVarSetter()
		var skillPoint = vars.skillPoint;
		var url = vars.url;
		var nodeHot = '<div class="recHotWrap"><h3>新曲枠</h3><ul>'
		var nodeOld = '<div class="recOldWrap"><h3>旧曲枠</h3><ul>'
		$.each(recData,function(masterKey,masterData){
			var node = '';
			$.each(masterData,function(i,d){
				node += '<li>'+d.title+' <span class="part">'+d.part+'</span></li>'
			})
			node += '</ul></div>'
			if(masterKey == 'hot' ){
				nodeHot += node
			}else if(masterKey == 'old'){
				nodeOld += node
			}
		})
		var linknode = '<p class="sup">参照元はこちら：<a href="'+url+'" target="_blank">スキル '+(vars.skillPoint + 100)+'、' + (vars.skillPoint + 200) +'平均</a></p>'
		$('#reccomendLists').empty().html(nodeHot + nodeOld + linknode)
	}

	function roadStart(selectFlag){
		var dfdStep1 = $.Deferred();
		if(selectFlag == 1){
			$('#ajaxSup1').text('読み込みを開始します。')
			dfdStep1.resolve();
		}else if(selectFlag == 2){
			$('#ajaxSup2').text('読み込みを開始します。')
			dfdStep1.resolve();
		}
		dfdStep1.promise();
	}

	//読込完了後の処理。　ajaxによりあちこち移るので関数化
	function roadFinish(selectFlag){
		if(selectFlag == 1){
			$('#ajaxSup1').text('読み込みを完了しました。').fadeOut(500,function(){
				$('#ajaxSup1').text('').show()
			})
		}else if(selectFlag == 2){
			$('#ajaxSup2').text('読み込みを完了しました。').fadeOut(500,function(){
				$('#ajaxSup2').text('').show()
			})
		}
	}


	/*ユーザーデータ取得*/
	function getterUserDatas(url){
		$.ajax({
			type:'GET'
			,async:true
			,url:url
			,dataType:'html'
			,cache:false
			,error:function(){

			}
			,success:function(res){
				$('#importedData').empty().html(res.responseText);
				setterUserDatas();
			}
			,complete:function(data){
			}
		}).done(function(){
			getterAvgDatas()
		});
	}
	/*取得したユーザーデータをHTMLなどに反映させる*/
	function setterUserDatas(){
		var dfdStep2 = $.Deferred();
		// //不要Node削除
		
		$('#importedData').find('meta , link , div , title , style , br , img').remove()
		.end().find('table').eq(0).remove().end().eq(1).remove().eq(4).remove();

		//データ化
		$('#importedData').find('table').eq(0).find('tr').each(function(i,d){
			dataToDataFunc('hot',d,i)
		})
		$('#importedData').find('table').eq(1).find('tr').each(function(i,d){
			dataToDataFunc('old',d,i)
		})
		//詳細表示
		detailWraitenFunc()

		//Lv×Point
		necessaryDOMsToggle.show()
		$('#graphType1').click()
		dfdStep2.resolve()
		dfdStep2.promise()
	}

	/*平均データ取得*/
	function getterAvgDatas(){

		//スコープ内変数
		var threshold = [parseInt($('#detailHotAvg').text()),parseInt($('#detailOldAvg').text())]
		var vars = avgVarSetter()
		var avgId = vars.avgId;
		var urlAry = vars.urlAry;
		var url = vars.url;
		var skillPoint = vars.skillPoint;
		var urlUid = vars.urlUid;
		var gameType = vars.gameType;
		var selectFlag = $('#importSelect').val();

		/*
			urlAry[0] = path
			urlAry[1],urlAry[4] = gameType
			urlAry[2] = MySkillPointAvg
			urlAry[3] = str
			urlAry[5] = 1rankupSkillPointAvg
		*/



		var init = function(){
			if(skillPoint > 8900){
				$('#reccomendLists').empty().text('そんな都合のいい曲はありません。')
				return false
			}else if(skillPoint < 100){
				$('#reccomendLists').empty().text('まずはスキル対象枠を埋めましょう。')
				return false
			}
			$.ajax({
				type:'GET'
				,async:true
				,url:url
				,dataType:'html'
				,cache:false
				,error:function(){
				}
				,success:function(res){
					$('#reccomendImport').empty().html(res.responseText)
				}
				,complete:function(data){

				}
			}).done(function(){
				setterAvgDatas()
				roadFinish(selectFlag)
			});
		}
		init();

	}
	/*取得した平均データをHTMLなどに反映させる*/
	function setterAvgDatas(){

		//スコープ内の変数
		var recData = {
			hot:[]
			,old:[]
		}
		var copyDataHot=[]//一時処理用
		var copyDataOld=[]//一時処理用
		var skillData2;//一時処理用

		$('#reccomendImport').find('meta , link , div , title , style , br , img').remove()
		.end().find('table').eq(0).remove().end().eq(1).remove();

		$('#reccomendImport').find('table').eq(0).attr('id','reccomendHot')
		.end().eq(1).attr('id','reccomendOld');

		$('#reccomendHot tr').each(function(i){
			if(i==0 || i ==1){
				return true
			}
			recData.hot.push({
				title:$.trim($(this).find('td').eq(1).text())
				,part:$.trim($(this).find('td').eq(2).text())
			},{
				title:$.trim($(this).find('td').eq(1).text())
				,part:$.trim($(this).find('td').eq(6).text())
			})
		})
		$('#reccomendOld tr').each(function(i){
			if(i==0 || i ==1){
				return true
			}
			recData.old.push({
				title:$.trim($(this).find('td').eq(1).text())
				,part:$.trim($(this).find('td').eq(2).text())
			},{
				title:$.trim($(this).find('td').eq(1).text())
				,part:$.trim($(this).find('td').eq(6).text())
			})
		})

		recDataGen(recData.hot)
		recDataGen(recData.old)

		//既に対象入りしている曲を省く
		skillData2 = $.extend(true,{},skillData);

		//対象入りに絞る
		skillData2.hot.length = 25
		skillData2.old.length = 25

		overlapFunc(skillData2.hot,recData.hot)
		overlapFunc(skillData2.old,recData.old)


		$.each(recData.hot,function(i,d){
			if(d.part != ''){
				copyDataHot.push(d)
			}
		})
		$.each(recData.old,function(i,d){
			if(d.part != ''){
				copyDataOld.push(d)
			}
		})
		recData = {
			hot:copyDataHot
			,old:copyDataOld
		}

		//レベルソートをかける
		recData.hot = $.grep(recData.hot,function(e){
			return e;
		})
		recData.old = $.grep(recData.old,function(e){
			return e;
		})
		recData.hot = recData.hot.sort(function(a,b){
			if(a.part != ''){
				return b.level - a.level
			}
		})
		recData.old = recData.old.sort(function(a,b){
			if(a.part != ''){
				return b.level - a.level
			}
		})

		//表示をmax30件にする。
		recData.hot.length = 30
		recData.old.length = 30
		avgDataNodeGen(recData)

	}

	function dataImportStart(){
		var url = ''
		var selectFlag = 0;
		var submitFlg = true;

		$('#importBtn').submit(function(){
			//ホントはajax終わってからと明示的にしたい…
			setTimeout(function(){
				submitFlg = true;
			},500)
			if(!submitFlg){
				return true;
			}
			submitFlg = false;
			console.time('ajax');
			selectFlag = $('#importSelect').val();
			if(selectFlag == 1){
				url = 'http://xv-s.heteml.jp/skill/gdod.php?uid='+$('#importType').val()+$('#importUrl1').val()
			}else if(selectFlag == 2){
				url = $('#importUrl2').val();
			}

			//データ初期化
			skillData ={
				hot:[]
				,old:[]
			};
			skillTotalDetailData={
				total:0
				,hotTotal:0
				,oldTotal:0
				,average:0
				,hotAverage:0
				,oldAverage:0
			}

			if(url != ''){
				$.when(roadStart(selectFlag))
				.done(getterUserDatas(url))
				console.timeEnd('ajax');
			}
			return false;
		})

	}

	/*--------------------------------------
		graph　周りの処理
	--------------------------------------*/

	//Hichartsの描画
	function graphDrawing(datas,xKey,yKey){

		$('#graph').highcharts({
			chart:{
				type:'scatter'
				,zoomType:'xy'
			}
			,title: {
				text:yKey+' × '+ xKey
			}
			,subtitle:{
				text:''
			}
			,xAxis:{
				title:{
					enabled: true
					,title:xKey
				}
				,startOnTick:true
				,endOnTick:true
				,showLastLavel:true
			}
			,yAxis:{
				title:{
					text:yKey
				}
			}
			,legend:{
				layout:'vertical'
				,align:'right'
				,verticalAlign:'top'
				,x:10
				,y:10
				,floating:true
				,backgroundColor:('#ccc')
				,borderWidth:2
			},
			plotOptions:{
				scatter:{
					marker:{
						radius:10
						,states:{
							hover:{
								enabled:true
								,lineColor:'rgb(100,100,100)'
							}
						}
					}
					,states:{
						hover:{
							marker:{
								enabled:true
							}
						}
					}
					,tooltip:{
						headerFormat:'{series.name} | {point.key}<br>'
						,pointFormat:xKey+'{point.x} | '+yKey+'{point.y}'
					}
				}
			},
			series:[{
				name:'HOT'
				,color:'rgba(233,83,83,.5)'
				,data:datas.hot
			},{
				name:'OLD'
				,color:'rgba(119, 152, 191, .5)'
				,data:datas.old
			}]
		});
	};

	//Hichatsに渡すデータをつくってあげる。
	function graphFunc(){
		var axisToggle = false;
		var targetToggle = true;
		var type;
		var graphData;
		var xKey = '';
		var yKey = '';

		//各current処理
		$('.btnArea button').on('click',function(){
			if(!$(this).hasClass('disalbe')){//データインポート前は反応しない　未実装
				$(this).closest('.btnArea').find('.current').removeClass('current');
				$(this).addClass('current');
			}
		});
		$('.controlArea button').on('click',function(){
			$(this).toggleClass('current');
			if($(this).hasClass('current')){
				$(this).text('ON');
			}else{
				$(this).text('OFF');
			};
		});

		//フラグまわり制御
		$('#axisToggle').click(function(){
			axisToggle = !axisToggle;
			$('.btnArea').find('.current').click();
		});
		$('#inTargetToggle').click(function(){
			targetToggle = !targetToggle;
			$('.btnArea').find('.current').click();
		});

		//Lv×Point
		$('#graphType1').click(function(){
			type = 'type1';
			xKey = 'Lv';
			yKey = 'Point';
			keys = graphKeyTitle(xKey,yKey);
			graphData = [];//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1]);
		});
		//Point×達成率
		$('#graphType2').click(function(){
			type = 'type2';
			xKey = '達成率';
			yKey = 'Point';
			keys = graphKeyTitle(xKey,yKey);
			graphData = [];//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1]);
		});
		//Lv×達成率
		$('#graphType3').click(function(){
			type = 'type3';
			xKey = 'Lv';
			yKey = '達成率';
			keys = graphKeyTitle(xKey,yKey);
			graphData = [];//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1])
		});

		function graphKeyTitle(xKey,yKey){
			if(axisToggle){
				return [xKey,yKey];
			}else{
				return [yKey,xKey];
			}
		}
		function graphDrawFunc(type){
			var datas = {
				hot:[]
				,old:[]
			};
			if(type == 'type1'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type1');
				});
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type1');
				});
			}else if(type == 'type2'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type2');
				});
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type2');
				});
			}else if(type == 'type3'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type3');
				});
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type3');
				});
			}else if(type == 'type4'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type4');
				});
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type4');
				});
			};
			function graphDataGen(d,i,data,type){
				if(i>24 && targetToggle){
					return false;
				};
				var axisData=[];
				data[i] ={
					name:''
					,x:0
					,y:0
				};
				if(type == 'type1'){
					axisData[0] = d.level / 100;
					axisData[1] = d.point / 100;
				}else if(type == 'type2'){
					axisData[0] = d.per / 100;
					axisData[1] = d.point / 100;
				}else if(type == 'type3'){
					axisData[0] = d.level / 100;
					axisData[1] = d.per / 100;
				}else if(type == 'type4'){
					axisData[0] = d.level / 100;
					axisData[1] = d.rank / 100;
				};
				data[i].name = d.title;
				if(axisToggle){
					data[i].x = axisData[0];
					data[i].y = axisData[1];
				}else{
					data[i].x = axisData[1];
					data[i].y = axisData[0];
				};
			}
			return datas;
		}
	}

	/*--------------------------------------
		電卓　周りの処理
	--------------------------------------*/
	var calc={
		//仮定計算
		ifMathFunc:function(){
			var result;
			var minP;
			var wannaP;
			var type;

			$('#mathInput1,#mathInput2,#genre').change(function(){
				minP = parseInt($('#mathInput1').val())*100;
				wannaP = parseInt($('#mathInput2').val())*100;
				type = $('#genre').val();
				result = [0,0];

				if(minP > wannaP){
					alert('入力矛盾により計算結果が信用できませんなり');
				};
				if(minP != undefined || wannaP != undefined){
					result = ifMinPointFunc(type,minP,wannaP);
					
					$('#mathOutput1').text( result[0]/100 );
					$('#mathOutput2').text( (skillTotalDetailData.total+result[0]) / 100);
					$('#mathOutput3').text( result[1] );

				};
			});
			function ifMinPointFunc(type,minP,wannaP){
				result = [0,0];

				if(type == 0){//全曲
					$.each(skillData.hot,function(i,d){
						ifMinPointMathFunc(i,d,minP,wannaP);
					});
					$.each(skillData.old,function(i,d){
						ifMinPointMathFunc(i,d,minP,wannaP);
					});

				}else if(type == 1){ //新曲
					$.each(skillData.hot,function(i,d){
						ifMinPointMathFunc(i,d,minP,wannaP);
					});

				}else if(type == 2){ //旧曲
					$.each(skillData.old,function(i,d){
						ifMinPointMathFunc(i,d,minP,wannaP);
					});
				};

				return result;
			}
			function ifMinPointMathFunc(i,d,minP,wannaP){
				if(i > 24){//対象内
					return false;
				};
				if(d.point > minP){
					return true;
				}else{
					result[0] += wannaP - d.point;
					result[1]++;
				};
				return result;
			}
		}
		,mathPerOfSongFunc:function(){
			//達成率計算
			var lv,per,result;

			$('#mathInput4,#mathInput5').change(function(){
				lv = parseInt($('#mathInput4').val() * 100);
				per = parseInt( $('#mathInput5').val() * 100 );

				if(lv != undefined || per != undefined){
					result = ((lv*2) * per / 100000 );
					$('#mathOutput4').text(result);
				};
			})
		}
		,mathWannaIncreasePoint:function(){
			//目標上昇ポイントを単曲に割って1曲当りnpt上げる必要があるか

			var wannaP,range,result;
			$('#mathInput6,#genre2').change(function(){
				wannaP = parseInt($('#mathInput6').val())*100;
				range = $('#genre2').val();
				if(range != 0){
					result = (wannaP / 25) / 100;
					$('#mathOutput5').text(result);
				}else{
					result = (wannaP / 50) / 100;
					$('#mathOutput5').text(result);
				};
			});
		}
		,mathRateGoal:function(){
			//Lv,Combo,Pearfect入力により達成率吐き出し）
			var lv,combo,perfect,great,result1,result2;
			var kariCalc1,kariCalc2;
			$('#mathInput7,#mathInput8,#mathInput9').change(function(){
				if($('#mathInput8').val().match(/[^0-9]/)){
					alert('入力が不正です。');
					return false;

				}else if($('#mathInput8').val() > 100){
					alert('入力が不正です。');
					return false;

				};
				if($('#mathInput9').val().match(/[^0-9]/)){
					alert('入力が不正です。');
					return false;

				}else if($('#mathInput9').val() > 100){
					alert('入力が不正です。');
					return false;
				};
				lv = $('#mathInput7').val()*100;
				combo = parseInt($('#mathInput8').val());
				perfect = parseInt($('#mathInput9').val());
				great = 100 - perfect;
				if(great > 5){
					great = 5;
				};
				kariCalc1 = (perfect*85) + (great*25);
				kariCalc2 = (combo*15);
				result1=(kariCalc1+kariCalc2)/100;
				result2=((lv*result1)*20)/10000;
				result2=result2.toFixed(2);
				$('#mathOutput6').text(result1);
				$('#mathOutput7').text(result2);

			});

		}
	};
	function calcInit(){
		calc.ifMathFunc();
		calc.mathPerOfSongFunc();
		calc.mathWannaIncreasePoint();
		calc.mathRateGoal();
	}

	/*--------------------------------------
		デザイン　周りの処理
	--------------------------------------*/
	//overlay用のwrapにウィンドウと同じ高さを与える。
	function fixedOverlayAddHeight(){
		var wh = $(window).height();
		$('.attentionLoadWrap').height(wh);
	};

	//メニューの挙動
	function menuBehavior(){
		var trigger = $('#glovalNavi li');
		var ancId,ancSec,pos;
		trigger.on('click',function(){
			ancId = $(this).attr('id');
			ancSec = ancId.replace('Anchor','');
			pos = $('#'+ancSec).offset().top;

			trigger.removeClass('current');
			$(this).addClass('current');
			if(ancId == 'thisLink'){
				location.href = $(this).find('a').attr('href');
				return true;
			};

			$('body,html').stop().animate({
				scrollTop:pos
			},500);
			return false;
		});
	};

	//初期描画時に不必要な情報は隠しておく。インポートまでの情報を制限する
	var necessaryDOMsToggle = {
		hide:function(){
			//インポートまでの情報を制限する
			importbefore(0);
		}
		,show:function(){
			importbefore(1);
		}
	};
	function importbefore(type){
		ids = [
			'#dataDetailSectionAnchor'
			,'#graphDrawSectionAnchor'
			,'#dataDetailSection'
			,'#graphDrawSection'
		];
		if(type == 0){
			$.each(ids,function(i,d){
				$(d).hide();
			});
		}else if(type == 1){
			$.each(ids,function(i,d){
				if($(d).is(':hidden')){
					$(d).fadeIn(300);
				};
			});
		};
	};

	//データインポート　○○で入力するを選択して必要なエリアをトグルさせる。
	function selectTypeToggle(){
		$('#importSelect').change(function(){
			var showAreaid = '#val' + $(this).val();
			$('#val1,#val2').hide();
			$(showAreaid).stop().fadeIn(500);
		});
	}

	fixedOverlayAddHeight();
	necessaryDOMsToggle.hide();
	cookieFunc();
	agentGadgeFunc();
	graphFunc();
	menuBehavior();
	calcInit();
	selectTypeToggle();
	dataImportStart();
	console.timeEnd('load');
});