define([
	'backbone',
	'app/model/user_music'

],function(Backbone,UserMusic){

	//スキルシミュ登録曲
	//Model -> user_music.js|UserMusic

	UserMusicAll = Backbone.Collection.extend({
		model:UserMusic
	})
	return UserMusicAll;
})