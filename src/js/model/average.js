var $ = require('jquery');
var Backbone = require('backbone');

var AvgSongModel = Backbone.Model.extend({});
var AverageCollection = Backbone.Collection.extend({
	model:AvgSongModel
});

module.exports = AverageCollection;