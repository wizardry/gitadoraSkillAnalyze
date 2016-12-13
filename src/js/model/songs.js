// var $ = require('jquery');
// var Backbone = require('backbone');

var SongModel = Backbone.Model.extend({});
var SongCollection = Backbone.Collection.extend({
	model:SongModel
});

module.exports = SongCollection;