$(function(){
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
	}
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

	//データインポート
	dataImport()

	//　pt以下の曲をn　pt上げたと仮定する計算
	ifMathFunc()

	//達成率計算
	mathPerOfSongFunc()

	function dataImport(){
		var url = ''
		$('#importBtn').submit(function(){
			url = $('#importUrl').val();

			//cookie処理
			$.cookie('url',url,{expires:30});
			console.log($.cookie('url'))


			console.log('#importUrl | ' + url)
			if(url != ''){
				$.ajax({
					type:'GET'
					,url:url
					,dataType:'html'
					,cache:false
					,success:function(res){
						$('#importedData').append(res.responseText).find('meta , link , div , title , style , br , img').remove()
						.end().find('table').eq(0).remove().end().eq(1).remove().eq(4).remove();
					}
					,complete:function(data){

						// //不要Node削除
						// $('#importedData')
						// $('#importedData').find('table').eq(0).remove().end().eq(1).remove().eq(4).remove();

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

					}
				})
			}
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
		var result;

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
})