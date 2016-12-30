// var $ = require('jquery');
// var Backbone = require('backbone');

//スクレイピング処理
var skillScrapingFunc =function(DOM,type){
	type = null;//URL増えた時用

	var hotData = DOM.find('#sortableTable tbody tr').map(function($tr){
		var data = {};
		data.title = $(this).find('td').eq(1).text().trim();
		data.level = $(this).find('td').eq(2).text().split(' ')[0];
		data.dif = $(this).find('td').eq(2).text().split(' ')[1];
		data.rate = $(this).find('td').eq(3).text().split('%')[0];
		data.rank = $(this).find('td').eq(3).text().split('%')[1];
		data.frame = 'hot';
		return data;
	}).get();
	var oldData = DOM.find('#sortableTable2 tbody tr').map(function(){
		var data = {};
		data.title = $(this).find('td').eq(1).text().trim();
		data.level = $(this).find('td').eq(2).text().split(' ')[0];
		data.dif = $(this).find('td').eq(2).text().split(' ')[1];
		data.rate = $(this).find('td').eq(3).text().split('%')[0];
		data.rank = $(this).find('td').eq(3).text().split('%')[1];
		data.frame = 'old';
		return data;
	}).get();
	var allData = hotData.concat(oldData);
	return allData;
};

var SkillMusic = Backbone.Model.extend({});
var SkillList = Backbone.Collection.extend({
	tmp:{},
	getTotalSkill:function(){
		let hotSkill = this.getHotSkillPoint();
		let oldSkill = this.getOldSkillPoint();
		return ( parseFloat(hotSkill) + parseFloat(oldSkill) ).toFixed(2);
	},
	mathSkill:function(model){
		// Model上のrate,skillは小数点第二まである文字列で入っている。
		let _lv = parseInt(model.get('level').replace('.',''));
		let _rate = parseInt(model.get('rate').replace('.',''));

		// lv*2*10 * rate = music skill
		let formula = (_lv * 2 ) * _rate;
		
		let floatResult = ( formula / (1000000 / 10 ) );
		//少数第三位以下切り捨て
		floatResult = Math.floor(floatResult*100)/100;
		model.set({point:floatResult});
		return floatResult;
	},
	mathFrameSkillFunc:function(type){
		var musics = this.where({frame:type});
		var skillPoint = 0;
		var self = this;
		_.every(musics,function(music,index){
			if(index == 25){
				return false;
			}
			skillPoint = skillPoint + ( self.mathSkill(music) * 100);
			return true;
		});


		return (Math.floor(skillPoint)/100).toFixed(2);
	},
	getHotSkillPoint:function(){
		let hotSkillPoint = this.tmp.hotSkillPoint
		if(hotSkillPoint == undefined){
			hotSkillPoint = this.mathFrameSkillFunc('hot');
		}
		return hotSkillPoint
	},
	getOldSkillPoint:function(){
		let oldSkillPoint = this.tmp.oldSkillPoint
		if(oldSkillPoint == undefined){
			oldSkillPoint = this.mathFrameSkillFunc('old');
		}
		return oldSkillPoint
	},
	getTotalAvg:function(){
		return ( (parseFloat(this.getHotAvg()) + parseFloat(this.getOldAvg()) ) / 2).toFixed(2);
	},
	getHotAvg:function(){
		var len = this.where({frame:'hot'}).length > 25 ? 25 : this.where({frame:'hot'}).length;
		return (this.getHotSkillPoint() / len).toFixed(2);
	},
	getOldAvg:function(){
		var len = this.where({frame:'old'}).length > 25 ? 25 : this.where({frame:'old'}).length;
		return (this.getOldSkillPoint() / len).toFixed(2);
	},
	getSkillTargetModels:function(type){
		let hotModels = this.where({frame:'hot'}).slice(0,25);
		let oldModels = this.where({frame:'old'}).slice(0,25);
		let resultModels = null;
		if(type == 'hot'){
			resultModels = hotModels
		}else if(type == 'old'){
			resultModels = oldModels
		}else{
		 	resultModels = hotModels.concat(oldModels);
		}
		return resultModels;
	},
	calcIf:function(type,min,upper){
		let target=  this.getSkillTargetModels(type);
		if(type == null || min == '' || upper == ''){
			return {
				diffPoint:'null',
				length:'null',
				total:'null'
			}
		}

		let self = this;
		target = target.filter(function(model){
			return parseFloat(self.mathSkill(model)) <= parseFloat(min);
		});
		let masterPoint = parseFloat(self.getTotalSkill());
		let diffPoint = 0;
		_.each(target,function(model){
			let modelPoint = parseFloat(self.mathSkill(model))*100;
			diffPoint += (parseFloat(upper)*100) - modelPoint;
		});
		console.log({
			this:this,
			target:target,
			diffPoint:(diffPoint/100).toFixed(2),
			length:target.length,
			total:( (masterPoint*100)+diffPoint )/100
		})
		return {
			diffPoint:diffPoint/100,
			length:target.length,
			total:( (masterPoint*100)+diffPoint )/100
		};

	},
	model:SkillMusic
});

//ユーザー情報
var UserModel = Backbone.Model.extend({
	setURL:function(webType,idType,userId){
		this.setIdType(idType);
		this.setWebType(webType);
		this.setUserId(userId);
		let url = '';
		if(webType.indexOf('tri.gfdm-skill.net') != -1){
			url = webType+userId+'/';
			if(idType == 'g'){
				url = url+'guitar';
			}else{
				url = url+'drum';
			}
		}
		if(webType.indexOf('gitadora.info') != -1){
			url = webType;
			if(idType == 'g'){
				url = url+'gf';
			}else{
				url = url+'dm';
			}
			url = url+'&id='+userId;
		}
		if(webType.indexOf('data/user.html') != -1){
			url = webType;
		}
		this.url = url;
	},
	setIdType:function(idType){
		this.idType = idType;
	},
	setWebType:function(webType){
		this.webType = webType;
	},
	setUserId:function(userId){
		this.userId = userId;
	},
	getOptions:function(){
		return {
			idType:this.idType,
			webType:this.webType,
			userId:this.userId
		};
	},
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
		console.log('user parse',res)
		var verDOM = $(res.responseText);
		var data = skillScrapingFunc(verDOM);

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