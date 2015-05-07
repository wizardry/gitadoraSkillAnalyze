$(function(){
	// $.cookie('M573SSID','e94b609b-2280-45d7-843b-2d1843bef68c')
	$.cookie("cmTPSet","Y")
	$.cookie("CMAVID","none")
	$.cookie("CoreID6","29529518011214280312390&ci=50340000|knm02")
	$.cookie("50340000|knm02_clogin","v=1&l=1429859624&e=1429861587116")
	$.cookie("M573SSID","2c0e5e5f-78a3-434f-b21e-5cb9a698f9cf")
	$.cookie("irsess_eg_api","ubisrjshs3e3km9eutt4e6sv64")
	
	console.log($.ajax({utl:'/'}))
	$.ajax({
		type:'GET',
		async:false,
		timeout:10000,
		data:{'M573SSID':'2c0e5e5f-78a3-434f-b21e-5cb9a698f9cf'},
		url:"http://p.eagate.573.jp/game/gfdm/gitadora/p/cont/play_data_tb/skill.html",
		dataType:'html',
		cache:false,
		processData:true,
		crossDomain:true,
		headrs:{'M573SSID':'2c0e5e5f-78a3-434f-b21e-5cb9a698f9cf'},
		xhrFields: {withCredentials: true},
		dataFileter:function(data,type){
			console.log(data)
			console.log(type)
			return data;
		},
		success:function(test,test1){
			console.log(test)
			$('#test2').html(test.responseText)
			alert(2)
		},
		error:function(test,test1){
			console.log(test)
			console.log(test1)
			alert(5)
		}
	}).success(function(){
		
	})
	$('#button').click(function(){
		var htm = $('#frame iframe').html()
		console.log(htm)
	})
})