var $ = require('jquery');
var Backbone = require('backbone');

//スクレイピング処理
var skillScrapingFunc =function(type){
	type = null;//URL増えた時用

	var hotData = $('#sortableTable tbody tr').map(function(){
		var data = {};
		data.title = $(this).find('td').eq(1).text().trim();
		data.leavel = $(this).find('td').eq(2).text().split(' ')[0];
		data.dif = $(this).find('td').eq(2).text().split(' ')[1];
		data.rate = $(this).find('td').eq(3).text().split('%')[0];
		data.rank = $(this).find('td').eq(3).text().split('%')[1];
		data.frame = 'hot';
		return data;
	});
	var oldData = $('#sortableTable2 tbody tr').map(function(){
		var data = {};
		data.title = $(this).find('td').eq(1).text().trim();
		data.leavel = $(this).find('td').eq(2).text().split(' ')[0];
		data.dif = $(this).find('td').eq(2).text().split(' ')[1];
		data.rate = $(this).find('td').eq(3).text().split('%')[0];
		data.rank = $(this).find('td').eq(3).text().split('%')[1];
		data.frame = 'old';
		return data;
	});
	var allData = hotData.concat(oldData);
	return allData;
};

var SkillMusic = Backbone.Model.extend({});
var SkillList = Backbone.Collection.extend({
	model:SkillMusic
});

//ユーザー情報
var UserModel = Backbone.Model.extend({
	url:function(){
		return '../../data/user.html';
		// return this.get('urlType')+'/users/'+this.get('id')+'/'+this.get('gameType');
	},
	skillScrapingFunc:function(type){
		skillScrapingFunc(type)
	},
	beforeFetch:function(){
		if(this.has(data)){
			this.remove('data');
		}
	},
	parse:function(res){
		var data = skillScrapingFunc(res);

		return {data:new SkillList(data)};
	},
	saveCookieFunc:function(){
		// cookie保存 ModelをママJSONで保存する。
		var cookieJson = {
			id:this.get('id'),
			gameType:this.get('gameType'),
			urlType:this.get('urlType'),
		};
		$.cookie("uid",JSON.stringify(cookieJson));
	}
});

/*
不要？
var userModel = new UserModel();
*/
/*
やってみたけど少なくともModelまわりではclass化するメリットがなさそう
class UserModelClass {
	constructor(data){
		console.log(this.isCreated)
		if(this.isCreated){
			return this;
		}else{
			this.model = new UserModel(data);
			this.isCreated = true;
		}
	}
	call(){
		return this.model;
	}
}
*/
// export default UserModelClass;
module.exports = UserModel;