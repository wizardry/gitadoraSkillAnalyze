define([
	'backbone'
],function(Backbone){
	//曲一覧で使用する曲情報
	var MusicData = Backbone.Model.extend({
		sortPoint:function(){
			return this.get('point');
		},
		sortScope:function(){
			return this.get('scope');
		}
	})
	return MusicData;
});
