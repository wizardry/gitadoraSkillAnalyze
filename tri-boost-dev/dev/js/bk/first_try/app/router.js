define([
	'backbone'
],function(Backbone){
	return Backbone.Router.extend({
		routes:{
			'':'index',
			'#!top':'index',
			'#!analayze':'analyze',
			'#calc':'calc',
			'#musiclist':'musiclist'
		}
	})

})
;
