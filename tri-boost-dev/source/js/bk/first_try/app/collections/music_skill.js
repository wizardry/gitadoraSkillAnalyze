define([
	'backbone',
	'app/model/user_music'
],function(Backbone,UserMusic){

//スキル対象曲
//Model -> user_music.js|UserMusic

UserMusicSkill = Backbone.Collection.extend({
	model:UserMusic
})
return UserMusicSkill;