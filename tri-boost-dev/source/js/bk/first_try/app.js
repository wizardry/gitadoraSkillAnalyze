require([
	'jquery',
	'backbone',
	'app/collections/music_list',
	'app/views/app_view',
	'app/router'
],function($,MusicList,AppView,Router){
	var router = new Router();
	var musicList = new MusicList();
	// musicList.fetch();

	var appview = new AppView({
		router:router,
		collection:musicList
	})

	$(function(){
		Backbone.history.start();
		$('body').append(appview.render().el);
	})

})