require({
	baseUrl:'js/',
	paths:{
		'jquery':'lib/jquery.min',
		'jquery.cookie':'lib/jquery.cookie',
		'jquery.xdomainajax':'lib/jquery.xdomainajax',
		'underscore':'lib/underscore',
		'backbone':'lib/backbone'
	},
	shim:{
		'underscore':{
			exports:'_'
		},
		'backbone':{
			exports:'Backbone',
			deps:['jquery','underscore']
		}
	}
})