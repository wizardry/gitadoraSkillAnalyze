var React  = require('react');
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

//ユーザー情報
var UserModel = Backbone.Model.extend({
	url:function(){
		return '../../data/user.html';
		// return this.get('urlType')+'/users/'+this.get('id')+'/'+this.get('gameType');
	},
	skillScrapingFunc:function(type){
		skillScrapingFunc(type)
	},
	parse:function(res){
		var data = skillScrapingFunc(res);
		debugger;
		return data;
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


var userModel = new UserModel();

var SkillMusic = Backbone.Model.extend({});
var SkillList = Backbone.Collection.extend({
	model:SkillMusic
});

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

// export default UserModelClass;
module.exports = UserModelClass;