define([
	'backbone',
	'app/model/music_data'
],function(Backbone,MusicData){

	//曲一覧
	//Model -> music_data.js|MusicData

	MusicList = Backbone.Collection.extend({
		model:MusicData
	})
	return MusicList;
})