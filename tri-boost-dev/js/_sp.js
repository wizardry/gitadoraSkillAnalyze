$(function(){
	var spSize = 700;

	// alert($(window).width())
	//tap or click
	var click = 'click'
	var ua = navigator.userAgent;

	if(ua.search(/iPhone/) != -1 || ua.search(/iPad/) != -1 || ua.search(/Android/) != -1){
	  click = 'touchend';
	}else{
	  click = 'click'
	}
	function smartPhoneFunc(){
		var wh = $(window).width()
		function currentSet(){
			wh = $(window).width()
			var eq = $('#spNavi').find('.current').index()
			if(eq == 0){
				$('.calcContents').show();
				$('#graphSection,aside').hide();
			}else if(eq == 1){
				$('#graphSection').show();
				$('.calcContents,aside').hide();
			}else if(eq == 2){
				$('aside').show();
				$('#graphSection,.calcContents').hide();
			}
				
		}

		if(wh < spSize){
			currentSet()
		}else{
			$('#graphSection,.calcContents,aside').show();
		}

		$('#spNavi li').on(click,function(){
			$('#spNavi').find('.current').removeClass('current')
			$(this).addClass('current')
			currentSet()
		})
		$(window).resize(function(){
			if(wh < spSize){
				currentSet()
			}else{
				$('#graphSection,.calcContents,aside').show();
			}
		})

	}
	smartPhoneFunc()
})