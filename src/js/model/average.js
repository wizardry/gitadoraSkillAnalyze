// var $ = require('jquery');
// var Backbone = require('backbone');


// mimi tb = http://tri.gfdm-skill.net/average/drum/other/7000/7200
// gitadorainfo = http://gitadora.info/average/7000/7200/g
var AvgSongModel = Backbone.Model.extend({});
var AverageCollection = Backbone.Collection.extend({
	comparator:'recPoint',
	model:AvgSongModel,
	setOptions:function(op){
		this.options = op;
	},
	url:function(){
		if(this.options == undefined ){
			return null;
		}
		let url = '';
		let nowPoint = this.options.skillPoint;
		let maxPoint = nowPoint+200;
		// if(this.options.webType.indexOf('tri.gfdm-skill.net') != -1){
			// url = this.options.webType.replace('users/','')+'average/';
			url = 'http://tri.gfdm-skill.net/average/';
			if(this.options.idType == 'g'){
				url = url+'guitar';
			}else{
				url = url+'drum';
			}
			url = url+'/other/'+nowPoint+'/'+maxPoint
		// }
		// if(this.options.webType.indexOf('gitadora.info') != -1){
		// 	url = this.options.webType+'/average/'+nowPoint+'/'+maxPoint+'/'+this.options.idType;
		// }
		return url;
	},
	scrapingFunc:function(verDOM){
		var data = [];
		// if(this.options.webType.indexOf('tri.gfdm-skill.net') != -1){
			let type = $(verDOM).find('h2').text();
			if(type == 'Other'){
				type = 'old';
			}else{
				type = 'hot';
			}
			$(verDOM).find('#averageTable tbody tr').each(function(index,tr){
				let $tr = $(tr)
				// let className = $tr.attr('class').replace(/ odd/g,'').replace(/ even/g,'');
				let title = $tr.find('td').eq(1).text();
				let part = $tr.find('td').eq(2).text().trim().split(' ')[1];
				let level = $tr.find('td').eq(2).text().slice(0,4);
				let rate = $tr.find('td').eq(3).text().slice(0,5);
				let skill = $tr.find('td').eq(4).text();
				let register = $tr.find('td').eq(5).text();
				data.push({
					title:title,
					part:part,
					level:level,
					rate:rate,
					skill:skill,
					register:register,
					type:type,
					recPoint:parseInt(level)*parseInt(rate)*parseInt(register)
				});
			});
		// }
		// if(this.options.webType.indexOf('gitadora.info') != -1){

		// }
		return data;
	},
	getUseAverage:function(type){
		let data = this.where({type:type});
		let registData = this.userModel.get('data');
		registData.each(function(music,index){
			data = data.filter(function(music2){
				return music2.get('title') !== music.get('title');
			});
		});
		return data;
	},
	oldFetched:false,
	parse:function(res,b,c){
		var verDOM = $(res.responseText);
		var data = this.scrapingFunc(verDOM);

		return data;
	},

});

module.exports = AverageCollection;