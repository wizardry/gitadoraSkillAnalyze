define([
	'backbone'
],function(Backbone){
	//ID や 行動情報など
	var UserFormInfo = Backbone.Model.extend({
		getId:function(){
			return this.get('type')+this.get('id');
		}
	})
	return UserFormInfo;
	// スキル値など 曲情報は入らない。
	var UserSkillInfo = Backbone.Model.extend({
	})
	return UserSkillInfo;
});
