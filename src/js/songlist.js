function songListFunc() {
	var songData = [];
	var drumSongData = [];
	var guitarSongData = [];

	function wheright(){
		padding = 40
		header = 60
		$('.wrap').css({
			minHeight:($(window).height() - padding - header )+'px'
		})
		$('#alphaLayer').css({
			minHeight:$(window).height()+'px'
		})
	}
	wheright()

	function songDataGenFunc(){
		function songDataGen(elem,nowFrame){
			elem.find('tr').each(function(i){
				songData.push({
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'drummania'
					,part:'BSC'
					,level:$.trim($(this).find('td').eq(2).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'drummania'
					,part:'ADV'
					,level:$.trim($(this).find('td').eq(3).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'drummania'
					,part:'EXT'
					,level:$.trim($(this).find('td').eq(4).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'drummania'
					,part:'MAS'
					,level:$.trim($(this).find('td').eq(5).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'BSC-G'
					,level:$.trim($(this).find('td').eq(6).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'ADV-G'
					,level:$.trim($(this).find('td').eq(7).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'EXT-G'
					,level:$.trim($(this).find('td').eq(8).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'MAS-G'
					,level:$.trim($(this).find('td').eq(9).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'BSC-B'
					,level:$.trim($(this).find('td').eq(10).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'ADV-B'
					,level:$.trim($(this).find('td').eq(11).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'EXT-B'
					,level:$.trim($(this).find('td').eq(12).text())
				},{
					frame:nowFrame
					,title:$.trim($(this).find('td').eq(0).text())
					,gameType:'GUITARFREAKS'
					,part:'MAS-B'
					,level:$.trim($(this).find('td').eq(13).text())
				})
			})
		}
		//新曲
		nowFrame = 'hot'
		elem = $('#importedDataHot')
		songDataGen(elem,nowFrame)
		
		//旧曲
		nowFrame = 'old'
		elem = $('#importedDataOld')
		songDataGen(elem,nowFrame)

		console.log(songData)
		//songData整形
		$.each(songData,function(i,d){
			if(d.level == ''){
				delete songData[i]
			}else{
				d.level = d.level*100
				d.level = parseInt(d.level)
				if(d.gameType == 'drummania'){
					drumSongData.push(d)

				}else{
					guitarSongData.push(d)
				}
			}
		})
	}

	function songImport(){
		function songImportFunc(url,elem){
			$.ajax({
				type:'GET'
				,async:true
				,url:url
				,dataType:'html'
				,cache:false
				,success:function(res){
					elem.empty().html(res.responseText)
				}
				,complete:function(data){
					console.log('finish')
					// //不要Node削除
					elem.find('meta , link , div , title , style , br , img , font , strong').remove()
					.end().find('table').addClass('songDataTable');
					elem.find('.songDataTable').eq(0).remove().end().find('tr').slice(0,2).remove()

					if(url == 'http://xv-s.heteml.jp/skill/music_gdod.php?k=old'){
						songDataGenFunc()
						$('#alphaLayer,#loader').fadeOut(500,function(){
							setTimeout(function(){
								$(this).remove()
							},1000)
						})
					}
				}
			})
		}
		//新曲
		url = 'http://xv-s.heteml.jp/skill/music_gdod.php?k=new'
		elem = $('#importedDataHot')
		songImportFunc(url,elem)

		//旧曲
		url = 'http://xv-s.heteml.jp/skill/music_gdod.php?k=old'
		elem = $('#importedDataOld')
		songImportFunc(url,elem)

	}
	songImport()

	//読込
	$('#sort').submit(function(){
		var data = []
		gameType = $('#gameType').val()
		filter = $('#levelFilter').val()
		orderFlg = $('#order').prop('checked')
		partAry = ['BSC','ADV','EXT','MAS','BSC-G','ADV-G','EXT-G','MAS-G','BSC-B','ADV-B','EXT-B','MAS-B']
		frameFilter = $('#settingFrame').val()
		filterAry = [
			[100,149]
			,[150,199]
			,[200,249]
			,[250,299]
			,[300,349]
			,[350,399]
			,[400,449]
			,[450,499]
			,[500,549]
			,[550,599]
			,[600,649]
			,[650,699]
			,[700,749]
			,[750,799]
			,[800,849]
			,[850,899]
			,[900,949]
			,[950,999]
			,[100,999]
		]

		//難易度フィルター inArrayで文字列検索かける。
		$("[name=settingParts]").each(function(i){
			if (!$(this).prop('checked')){
				delete partAry[i]
			}
		})

		debug = {
			gameType: gameType
			,filter:filter
			,orderFlg:orderFlg
			,partAry:partAry
			,frameFilter:frameFilter
		}
		console.log(debug)

		if(gameType == 'g'){
			//GUITARFREAKS
			data = guitarSongData
		}else{
			//DRUMMANIA
			data = drumSongData
		}
		data.sort(function(d,d2){
			if(orderFlg){
				return (d.level > d2.level) ? -1 : 1;
			}else{
				return (d.level < d2.level) ? -1 : 1;
			}
		})

		var node = ''
		$.each(data,function(i,d){
			if(filterAry[filter][0] <= d.level && filterAry[filter][1] >= d.level ){
				var diffcult = d.part.slice(0,3).toLowerCase()
				var lv = d.level.toString(10).substr(0,1)+'.'+d.level.toString(10).substr(1)

				//新旧フィルター
				if(frameFilter == 1){
					if (d.frame == 'hot'){
						return
					}
				}else if(frameFilter == 2){
					if (d.frame == 'old'){
						return
					}
				}

				//難易度フィルター
				if($.inArray(d.part,partAry) == -1){
					return
				}

				// console.log(lv)
				// console.log(diffcult)
				// node += '<td>'+d.level+'</td>';

				node += '<tr class="'+diffcult+'">';
				node += '<td>'+d.frame+'</td>';
				node += '<td>'+d.title+'</td>';
				node += '<td>'+d.part+'</td>';
				node += '<td>'+lv+'</td>';
				node += '</tr>';
			}
		})

		$('#drawTable tbody').html(node)

		return false

	})

}
$(function(){
	songListFunc()
	$('#slideToggleTrigger').click(function(){
		$('.exForms').stop().slideToggle(300)
	})
})