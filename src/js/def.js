$(function(){
	var skillData ={
		hot:[]
		,old:[]
	};
	/*
		大元の形はskillDataとして、
		hot/oldをkeyにした版、スキル対象曲のみ版を作成して
		機能に合わせてループしやすいようにしたい
	*/
	var skillTotalDetailData={
		total:0
		,hotTotal:0
		,oldTotal:0
		,average:0
		,hotAverage:0
		,oldAverage:0
	}
	/*
		rankの項が必要
	*/
	var urlCookie = $.cookie('url');
	console.log('1cookie | '+urlCookie)
	if(urlCookie != null || urlCookie != undefined ){
		$('#importUrl').val(urlCookie)
	}

	/*
		skillData.xxx.title => str
		skillData.xxx.level => int*100
		skillData.xxx.per => int*100
		skillData.xxx.point => int*100
		skillData.xxx.rank => str
	*/
	fixedOverlayAddHeight()

	//データインポート
	dataImport()

	//　pt以下の曲をn　pt上げたと仮定する計算
	ifMathFunc()

	//達成率計算
	mathPerOfSongFunc()

	//目標上昇ポイントと単曲あたりの上昇ポイント
	mathWannaIncreasePoint()

	//Lv,Combo,Pearfect入力により達成率吐き出し）
	mathRateGoal()

	//Lv,達成率入力により大凡のCombo、Perfect吐き出し
	mathRateWanna()

	//グラフ描画周り
	graphFunc()


	function fixedOverlayAddHeight(){
		var wh = $(window).height()
		$('.attentionLoadWrap').height(wh)
	}

	//データインポート
	function dataImport(){
		var url = ''
		$('#importBtn').submit(function(){
			url = $('#importUrl').val();
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

			//cookie処理
			$.cookie('url',url,{expires:30});
			console.log($.cookie('url'))


			console.log('#importUrl | ' + url)
			if(url != ''){
				$('#ajaxSup').text('読み込みを開始します。')
				$.ajax({
					type:'GET'
					,async:true
					,url:url
					,dataType:'html'
					,cache:false
					,success:function(res){
						$('#importedData').empty().html(res.responseText)
					}
					,complete:function(data){
						$('#ajaxSup').text('読み込みを完了しました。').fadeOut(500,function(){
							$('#ajaxSup').text('').show()
						})
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
						console.log('skillData ----------------------')
						console.log(skillData)
						//詳細表示
						detailWraitenFunc()

						//配列描画
						arrayOutputFunc()

						//Lv×Point
						$('#graphType1').click()

					}
				})
			}
			return false;
		})
		

	}

	//取得nodeからオブジェクトにデータ化する。
	function dataToDataFunc(frame,elem,i){
		var self = $(elem)
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
		}
	}

	//データ詳細の描画
	function detailWraitenFunc(){

		//hot
		$.each(skillData.hot,function(i,d){
			//上位25曲以上あった場合省く
			if(i > 24){
				console.log('新曲下限')
				console.log(d)
				return false;
			}
			skillTotalDetailData.total += d.point;
			skillTotalDetailData.hotTotal += d.point;
		})
		$.each(skillData.old,function(i,d){
			if(i > 24){
				console.log('旧曲下限')
				console.log(d)
				return false;
			}
			skillTotalDetailData.total += d.point;
			skillTotalDetailData.oldTotal += d.point;
		})
		skillTotalDetailData.oldAverage = parseInt(( skillTotalDetailData.oldTotal / 25 )) / 100
		skillTotalDetailData.hotAverage = parseInt(( skillTotalDetailData.hotTotal / 25 )) / 100
		skillTotalDetailData.average = parseInt(( skillTotalDetailData.total / 50 )) / 100

		console.log('skillTotalDetailData ----------------------')
		console.log(skillTotalDetailData)

		//トータルスキルポイントなど詳細データを書き出す
		$('#detailTotal').text( skillTotalDetailData.total/100 )
		$('#detailHotTotal').text( skillTotalDetailData.hotTotal/100 )
		$('#detailOldTotal').text( skillTotalDetailData.oldTotal/100 )
		$('#detailAvg').text( skillTotalDetailData.average )
		$('#detailHotAvg').text( skillTotalDetailData.hotAverage )
		$('#detailOldAvg').text( skillTotalDetailData.oldAverage )

	}

	//console.log確認するの面倒なのでhtmlに描画する
	function arrayOutputFunc(){
		var hotOutputNode,oldOutputNode;
		hotOutputNode = '<h3>HOT枠</h3><ul>'
		$.each(skillData.hot,function(i,d){
			hotOutputNode += '<li>{<ul>'
			hotOutputNode += '<li>title:'+ d.title+'</li>'
			hotOutputNode += '<li>level:'+ d.level+'</li>'
			hotOutputNode += '<li>per:'+ d.per+'</li>'
			hotOutputNode += '<li>point:'+ d.point+'</li>'
			hotOutputNode += '<li>rank:'+ d.rank+'</li>'
			hotOutputNode += '</ul>}</li>'
		})
		hotOutputNode +='</ul>'
		oldOutputNode = '<h3>OLD枠</h3><ul>'
		$.each(skillData.old,function(i,d){
			oldOutputNode += '<li>{<ul>'
			oldOutputNode += '<li>title:'+ d.title+'</li>'
			oldOutputNode += '<li>level:'+ d.level+'</li>'
			oldOutputNode += '<li>per:'+ d.per+'</li>'
			oldOutputNode += '<li>point:'+ d.point+'</li>'
			oldOutputNode += '<li>rank:'+ d.rank+'</li>'
			oldOutputNode += '</ul>}</li>'
		})
		oldOutputNode += '</ul>'
		$('#dataOutput').html('<div class="hotOutput">' + hotOutputNode + '</div><div class="oldOutput">' +  oldOutputNode + '</div>')
	}

	//仮定計算
	function ifMathFunc(){
		var result;
		var minP;
		var wannaP;
		var type;

		$('#mathInput1,#mathInput2,#genre').change(function(){
			var minP = parseInt($('#mathInput1').val())*100;
			var wannaP = parseInt($('#mathInput2').val())*100;
			var type = $('#genre').val();
			result = [0,0];

			if(minP > wannaP){
				alert('入力矛盾により計算結果が信用できませんなり')
			}
			if(minP != undefined || wannaP != undefined){
				result = ifMinPointFunc(type,minP,wannaP);
				
				$('#mathOutput1').text( result[0]/100 )
				$('#mathOutput2').text( (skillTotalDetailData.total+result[0]) / 100)
				$('#mathOutput3').text( result[1] )

			}
		})
		function ifMinPointFunc(type,minP,wannaP){
			result = [0,0]

			if(type == 0){//全曲
				$.each(skillData.hot,function(i,d){
					ifMinPointMathFunc(i,d,minP,wannaP)
				})
				$.each(skillData.old,function(i,d){
					ifMinPointMathFunc(i,d,minP,wannaP)
				})

			}else if(type == 1){ //新曲
				$.each(skillData.hot,function(i,d){
					ifMinPointMathFunc(i,d,minP,wannaP)
				})

			}else if(type == 2){ //旧曲
				$.each(skillData.old,function(i,d){
					ifMinPointMathFunc(i,d,minP,wannaP)
				})
			}

			return result;
		}
		function ifMinPointMathFunc(i,d,minP,wannaP){
			if(i > 24){//対象内
				return false;
			}
			if(d.point > minP){
				return true;
			}else{
				console.log('222 | '+wannaP+'|'+ $.isNumeric(d.point) )

				result[0] += wannaP - d.point
				result[1]++
			}
			return result
		}
	}

	//達成率計算
	function mathPerOfSongFunc(){
		var lv,per,result;

		$('#mathInput4,#mathInput5').change(function(){
			lv = parseInt($('#mathInput4').val() * 100)
			per = parseInt( $('#mathInput5').val() * 100 )

			if(lv != undefined || per != undefined){
				result = ((lv*2) * per / 100000 )
				console.log('250 |'+ (lv*2) )
				console.log('251 |'+ per)
				console.log('252 |'+result)
				$('#mathOutput4').text(result)
			}
		})
	}

	//目標上昇ポイントを単曲に割って1曲当りnpt上げる必要があるか
	function mathWannaIncreasePoint(){
		var wannaP,range,result;
		$('#mathInput6,#genre2').change(function(){
			wannaP = parseInt($('#mathInput6').val())*100;
			range = $('#genre2').val()
			console.log(wannaP +'~'+ range)
			if(range != 0){
				result = (wannaP / 25) / 100
				$('#mathOutput5').text(result)
			}else{
				result = (wannaP / 50) / 100
				$('#mathOutput5').text(result)
			}
		})
	}

	//Lv,Combo,Pearfect入力により達成率吐き出し）
	function mathRateGoal(){
		var lv,combo,perfect,great,result1,result2;
		var kariCalc1,kariCalc2;
		$('#mathInput7,#mathInput8,#mathInput9').change(function(){
			if($('#mathInput8').val().match(/[^0-9]/)){
				alert('入力が不正です。')
				return false;

			}else if($('#mathInput8').val() > 100){
				alert('入力が不正です。')
				return false;

			}
			if($('#mathInput9').val().match(/[^0-9]/)){
				alert('入力が不正です。')
				return false;

			}else if($('#mathInput9').val() > 100){
				alert('入力が不正です。')
				return false;
			}
			lv = parseInt($('#mathInput7').val())*100
			combo = parseInt($('#mathInput8').val())
			perfect = parseInt($('#mathInput9').val())
			great = 100 - perfect;
			if(great > 5){
				great = 5
			}
			kariCalc1 = (perfect*85) + (great*25)
			kariCalc2 = (combo*15)
			console.log(kariCalc1 + ' | ' +kariCalc2)
			
			result1=(kariCalc1+kariCalc2)/100
			result2=(lv*20*(result1/100))/100
			$('#mathOutput6').text(result1)
			$('#mathOutput7').text(result2)

		})

	}
	//Lv,達成率入力により大凡のCombo、Perfect吐き出し
	function mathRateWanna(){
		var lv,combo,perfect,great,rate,result1,result2;
		var kariCalc1,kariCalc2;
		$('#mathInput10,#mathInput11').change(function(){
			if($('#mathInput8').val() > 10){
				alert('入力が不正です。')
				return false;

			}
			if($('#mathInput9').val() > 100){
				alert('入力が不正です。')
				return false;
			}
			lv = parseInt($('#mathInput10').val())*100
			rate = parseInt($('#mathInput11').val())*100
			
			$('#mathOutput8').text('結構な数字')
			$('#mathOutput9').text('殆どのノーツをとった')
			$('#mathOutput10').text('すごい')
			$('#mathOutput11').text('作成途中だよ;p')

		})
	}

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
				$(this).closest('.btnArea').find('.current').removeClass('current')
				$(this).addClass('current')
			}
		})
		$('.controlArea button').on('click',function(){
			$(this).toggleClass('current')
		})

		//フラグまわり制御
		$('#axisToggle').click(function(){
			axisToggle = !axisToggle
			console.log('axisToggle | '+axisToggle)
			$('.btnArea').find('.current').click()
		})
		$('#inTargetToggle').click(function(){
			targetToggle = !targetToggle
			console.log('targetToggle | '+targetToggle)
			$('.btnArea').find('.current').click()
		})

		//Lv×Point
		$('#graphType1').click(function(){
			type = 'type1';
			xKey = 'Lv';
			yKey = 'Point';
			keys = graphKeyTitle(xKey,yKey)
			graphData = []//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1])
		})
		//Point×達成率
		$('#graphType2').click(function(){
			type = 'type2';
			xKey = '達成率';
			yKey = 'Point';
			keys = graphKeyTitle(xKey,yKey)
			graphData = []//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1])
		})
		//Lv×達成率
		$('#graphType3').click(function(){
			type = 'type3';
			xKey = 'Lv';
			yKey = '達成率';
			keys = graphKeyTitle(xKey,yKey)
			graphData = []//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1])
		})
		$('#graphType4,graphType5').click(function(){
			alert('未実装')
		})
		//Lv×ランク
		/*
		$('#graphType4').click(function(){
			type = 'type4';
			xKey = 'ランク';
			yKey = 'Lv';
			keys = graphKeyTitle(xKey,yKey)
			graphData = []//初期化
			graphData = graphDrawFunc(type);
			graphDrawing(graphData,keys[0],keys[1])
		})
		*/


		function graphKeyTitle(xKey,yKey){
			if(axisToggle){
				return [xKey,yKey]
			}else{
				return [yKey,xKey]
			}
		}
		function graphDrawFunc(type){
			var datas = {
				hot:[]
				,old:[]
			}
			if(type == 'type1'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type1')
				})
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type1')
				})
			}else if(type == 'type2'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type2')
				})
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type2')
				})
			}else if(type == 'type3'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type3')
				})
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type3')
				})
			}else if(type == 'type4'){
				$.each(skillData.hot,function(i,d){
					graphDataGen(d,i,datas.hot,'type4')
				})
				$.each(skillData.old,function(i,d){
					graphDataGen(d,i,datas.old,'type4')
				})
			}
			function graphDataGen(d,i,data,type){
				if(i>24 && targetToggle){
					return false;
				}
				var axisData=[]
				data[i] ={
					name:''
					,x:0
					,y:0
				}
				if(type == 'type1'){
					axisData[0] = d.level / 100
					axisData[1] = d.point / 100
				}else if(type == 'type2'){
					axisData[0] = d.per / 100
					axisData[1] = d.point / 100
				}else if(type == 'type3'){
					axisData[0] = d.level / 100
					axisData[1] = d.per / 100
				}else if(type == 'type4'){
					axisData[0] = d.level / 100
					axisData[1] = d.rank / 100
				}
				data[i].name = d.title;
				if(axisToggle){
					data[i].x = axisData[0]
					data[i].y = axisData[1]
				}else{
					data[i].x = axisData[1]
					data[i].y = axisData[0]
				}
			}
			return datas;
		}
	}

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
	}
})