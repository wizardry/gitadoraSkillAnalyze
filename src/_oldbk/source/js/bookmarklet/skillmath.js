javascript:(function(func) {
	var scr = document.createElement("script");
	scr.src = "//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js";
	scr.onload = function() {
		func(jQuery.noConflict(true));
	};
	document.body.appendChild(scr);
})(function($) {
	var target = $('.skill_table_tb')
	if(target.length == 0){
		alert('該当ページではありません。\bギタドラ公式ページよりスキル対象曲の画面で実行してください。');
	}else{
		var skills = getList();
		setData(skills);
	}
	function getList(){
		var skills=[];
		target.find('.skill_cell').each(function(i){
			skills[i] = parseInt($(this).text().replace('.',''))
		});
		return skills;
	}
	function setData(intAry){
		var data = {
			total : function(){
				var tmp=0;
				$.each(intAry,function(i,d){
					tmp += d;
				});
				return tmp;
			},
			avg : function(){
				var tmp=0;
				tmp = this.total();
				return Math.round(tmp/25);
			}
		};
		function outputFunc(skill){
			var tmp = [
				(skill+'').slice(0,-2),
				(skill+'').slice(-2)
			];
			return parseFloat(tmp[0]+'.'+tmp[1]).toFixed(2);

		};
		var area = $('<textarea/>').css({
				'margin':'10px auto',
				'padding':'3px 5px',
				'height':'80px'
			}).val('Total:'+outputFunc(data.total())+'\nAVG.:'+outputFunc(data.avg()));

		$('body').prepend('<div class="ex-bookmarkletarea" style="margin:10px auto;padding:10px;background:rgba(0,0,0,0.75)"><p class="bookmarkletclose" style="text-decoration:underline; color:#fff;">閉じる</p></div>');
		$('.ex-bookmarkletarea').prepend(area)
		$('.bookmarkletclose').on('click',function(){
			$('.ex-bookmarkletarea').remove();
		})

	}
});
