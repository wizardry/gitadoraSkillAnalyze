$(function(){

	//cookies
	function cookiesWriten(){
		var forms = [
			$('#levelMin')
			,$('#levelMax')
			,$('#rateMin')
			,$('#rateMax')
			,$('#point')
			,$('#genType')
		]
		$.each(forms,function(i,d){
			var keyName = d.attr('id')
			var val = d.val()
			var option = {
				expires:30
				,path:'/'
			}
			$.cookie(keyName,val,option)

		})
	}
	function cookiesLoad(){
		var forms = [
			$('#levelMin')
			,$('#levelMax')
			,$('#rateMin')
			,$('#rateMax')
			,$('#point')
			,$('#genType')
		]
		$.each(forms,function(i,d){
			var keyName = d.attr('id')
			if($.cookie(keyName) != null || $.cookie(keyName) != undefined ){
				d.val($.cookie(keyName))
			}
		})
	}

	function skillformula(lv,rate){
		var maslv = parseInt(lv)
		var masrate = parseInt(rate)
		var ans = ( ( maslv * masrate ) * 2 ) / 100

		return ( ans.toFixed(2) )

	}

	function dataGen(){
		var data = {rate:[],lv:[]}


		//n%-x%までの達成率を作成
		var minPer = parseInt($('#rateMin').val())
		var maxPer = parseInt($('#rateMax').val())
		for (var i = 0; i < (maxPer - minPer) + 1; i++) {
			data.rate[i] = minPer + i
		};

		//n-xまでのLvを作成
		var minLv = parseInt($('#levelMin').val())
		var maxLv = parseInt($('#levelMax').val())
		for (var i = 0; i < (maxLv - minLv )+1 ; i++) {
			data.lv[i] = minLv + i
		};

		return data;

	}

	function listGenType1(datas){ //datas = dataGen() lv * rate
		var nodes = '';
		$.each(datas.lv,function(i,d){
			if(d%5 == 0  || i ==0 ){
				nodes += '<h2><b>Level:'+d+'台</b></h2>'
				nodes += '<table>'
				nodes += '<tr>'
				nodes += '<th>LV/達成</th>'
				$.each(datas.rate,function(i2,d2){
					nodes += '<th>'+d2+'%</th>'
				})
				nodes += '</tr>'
			}
			nodes += '<tr>'
			nodes += '<th>Lv'+d+'</th>'
			$.each(datas.rate,function(i2,d2){
				var mathlv = d
				var mathrate = d2

				/*pointは生成とは別でroopさせた方が管理しやすいかも*/
				if( skillformula(mathlv,mathrate) > parseInt( $('#point').val() ) ){
					nodes += '<td class="imp">'+skillformula(mathlv,mathrate)+' pt</td>'
				}else{
					nodes += '<td>'+skillformula(mathlv,mathrate)+' pt</td>'
				}
			})
			nodes += '</tr>'
			if(d%5 == 4 || datas.lv.length-1 == i){
				nodes += '</table>'
			}
		})
		return nodes;
	}
	function listGenType2(datas){/*datas = dataGen()　rate * lv */
		var nodes = '';
		$.each(datas.rate,function(i,d){
			if(d%10 == 0  || i ==0 ){
				nodes += '<h2><b>達成率:'+d+' % ～</b></h2>'
				nodes += '<table>'
				nodes += '<tr>'
				nodes += '<th>達成/LV</th>'
				$.each(datas.lv,function(i2,d2){
					nodes += '<th>Lv'+d2+'</th>'
				})
				nodes += '</tr>'
			}
			nodes += '<tr>'
			nodes += '<th>'+d+'%</th>'
			$.each(datas.lv,function(i2,d2){
				var mathlv = d
				var mathrate = d2

				/*pointは生成とは別でroopさせた方が管理しやすいかも*/
				if( skillformula(mathlv,mathrate) > parseInt( $('#point').val() ) ){
					nodes += '<td class="imp">'+skillformula(mathlv,mathrate)+' pt</td>'
				}else{
					nodes += '<td>'+skillformula(mathlv,mathrate)+' pt</td>'
				}
			})
			nodes += '</tr>'
			if(d%10 == 9 || datas.rate.length-1 == i){
				nodes += '</table>'
			}
		})
		return nodes;
	}

	function listGenTypeSmartPhone(data){/*datas = dataGen()*/
		
	}

	function validatas(){
		//#rateMax
		var formVld = [
			numCompare($('#levelMin'),$('#levelMax'))
			,numCompare($('#rateMin'),$('#rateMax'))
			,rateVald($('#rateMin'))
			,rateVald($('#rateMax'))
			,rateMaxVald($('#rateMin'))
			,rateMaxVald($('#rateMax'))
			,lengthVald($('#rateMax'))
			,lengthVald($('#rateMin'))
			,lengthVald($('#point'))
			,pointVald()
		]
		var flg = true
		$.each(formVld,function(i,d){
			if(!d){
				flg = false
			}
		})
		return flg
	}
	function rateVald(elem){
		if (!elem.val().match(/^[0-9]+$/)){
			alert('達成率は半角数字整数のみで入力してください。')
			return false
		}else{
			return true
		}
	}
	function rateMaxVald(elem){
		if( elem.val() > 100 ){
			alert('達成率は100以下の整数で入力してください')
			return false
		}else{
			return true
		}
	}
	function lengthVald(elem){
		if(elem.val().length > 3){
			alert('3桁以内で入力してください')
			return false
		}else{
			return true
		}
	}
	function numCompare(elem,elem2){
		var num1 = parseInt(elem.val())
		var num2 = parseInt(elem2.val())
		if(num2 < num1){
			alert('最大値が最小値を超えてます。')
			return false
		}else{
			return true
		}
	}
	function pointVald(){
		console.log($('#point').val())
		if( !$('#point').val().match(/^[0-9]+$/) && $('#point').val() != '' ){
			alert('閾値は半角数字整数のみで入力してください。')
			return false
		}else{
			return true
		}
	}

	//読込時cookieを取得
	cookiesLoad()


	$('#submit').click(function(){
	//$('#listGen').submit(function(){
		cookiesWriten()

		var validata = validatas()
		if(!validata){
			return false;
		}

		var data = dataGen()
		var type = $('#genType').val()
		var node = ''
		if(type == 0 ){
			node = listGenType1(data)
		}else if(type == 1){
			node = listGenType2(data)
			console.log(node)
		}else if(type == 2){
			alert('作成中')
		}

		$('#output').empty().html(node)
		return false;
	})
/* base sample sorce
	var skillformula = function($lv,$per){
		var lv = parseInt($lv*100)
		var per = parseInt($per*100)

		return ( ( lv * per ) * 2 ) / 1000
	}
	var datas = {per:[],lv:[]}

	//0.85%-100%までの達成率を作成
	var masPer = 0.80
	for (var i = 0; i < ((1-masPer)*100) + 1; i++) {
		datas.per[i] = (masPer*100) + i
	};

	//700-900までのLvを作成
	var masLv = 70 //小数無し,1桁無し
	for (var i = 0; i < (99-masLv)+1 ; i++) {
		datas.lv[i] = masLv + i
	};
	
	console.log(datas)
	var nodes = '';
	function tableGeneratorLvPer(){
		$.each(datas.lv,function(i,d){
			if(d%10 == 0){
				nodes += '<h2><b>Level:'+d+'台</b></h2>'
				nodes += '<table>'
				nodes += '<tr>'
				nodes += '<th>LV/達成</th>'
				$.each(datas.per,function(i2,d2){
					nodes += '<th>'+d2+'%</th>'
				})
				nodes += '</tr>'
			}
			nodes += '<tr>'
			nodes += '<th>Lv'+d+'</th>'
			$.each(datas.per,function(i2,d2){
				var mathlv = d / 10
				var mathper = d2 / 100

				if( skillformula(mathlv,mathper) > 150){
					nodes += '<td class="imp">'+skillformula(mathlv,mathper)+' pt</td>'
				}else{
					nodes += '<td>'+skillformula(mathlv,mathper)+' pt</td>'
				}
			})
			nodes += '</tr>'
			if(d%10 == 9 || datas.lv.length-1 == i){
				nodes += '</table>'
			}
		})
	}

	tableGeneratorLvPer()
	$('body').append(nodes)
*/
})