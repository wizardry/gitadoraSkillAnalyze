// var $ = require('jquery');
// var Backbone = require('backbone');

var SongModel = Backbone.Model.extend({});
var SongCollection = Backbone.Collection.extend({
	model:SongModel,
	url:'http://tri.gfdm-skill.net/musics/',
	comparator:'level',
	wFetch:function(){
		this.reset();
		this.fetch({
			url:this.url+'hot',
			type:'get',
			dataType:'html',
			remove:false,
			success:function(collection){
			}
		});
		this.fetch({
			url:this.url+'other',
			type:'get',
			dataType:'html',
			remove:false,
			success:function(collection){
			}

		});
	},
	getNewFilter:function(selectValue){
		var result = this;
		if(selectValue == 1){
			result = _.where(this,{part:'hot'});
		}
		if(selectValue == 1){
			result = _.where(this,{part:'old'});
		}
		return result;
	},
	genDataFunc:function(DOM,type){
		let $trs = $(DOM).find('#sTable_musics tbody tr');
		let data = [];
		let partMaster = [
			'BSC-D','ADV-D','EXT-D','MAS-D',
			'BSC-G','ADV-G','EXT-G','MAS-G',
			'BSC-B','ADV-B','EXT-B','MAS-B',
		];
		let partEqMaster = [
			1,2,3,4,
			5,6,7,8,
			9,10,11,12,
		]
		$trs.each(function(index,tr){
			let $tr = $(this)
			let title = $tr.find('td').eq(0).text().trim();
			//難易度別にModelを作成する。1行 drum,guitar,base * bsc,adv,ext,masの12曲
			_.each(partMaster,function(partVal,eq){
				let level = $tr.find('td').eq(partEqMaster[eq]).text().trim();

				if(level == '' || level == '-'){ return true;}

				data.push({
					title:title,
					type:type,
					part:partVal,
					level:level,
				});
			});
		});
		return data;
	},
	parse:function(res,data){
		let result;
		if(data.url.indexOf('hot') !== -1){
			result = this.genDataFunc(res.responseText,'hot');
		}else{
			result = this.genDataFunc(res.responseText,'old');
		}
		return result;
	}
});
/*
var self = this;
var ajaxOp1 ={
    type:'GET',
    async:true,
    url:AJAX_URL_BASE['mimi-tb']+'/musics/hot',
    dataType:'html',
    cache:false
}
var ajaxOp2 ={
    type:'GET',
    async:true,
    url:AJAX_URL_BASE['mimi-tb']+'/musics/other',
    dataType:'html',
    cache:false
}
$.when(
    $.ajax(ajaxOp1),
    $.ajax(ajaxOp2)
).pipe(function(hotList,oldList){
    self.collection.list.reset();
    loader(false)
    self.setMusicData(hotList,false)
    self.setMusicData(oldList,true)
    //oldLListのsetMusicDataが終わるとcollectionのListenToからthis.draw()発火
},function(){
    alert('接続に失敗しました。\n接続状況を見直し再度試みてください。');
})
*/
module.exports = SongCollection;