var UserModel = require('./user');
var SettingModel = require('./settings');
var SongModel = require('./songs');
var AverageModel = require('./average');
var RateModel = require('./rate');

class UserModelClass {
	constructor(){
		this.model = {};
		this.model.userModel = new UserModel();
		this.model.settingModel = new SettingModel();
		this.model.songCollection = new SongModel();
		this.model.averageCollection = new AverageModel();
		this.model.rateModel = new RateModel();
		this.model.viewStateModel = new Backbone.Model();
	}
	call(){
		return this.model;
	}
}
module.exports = UserModelClass;