$(function(){

    var viewEvents = {};
    _.extend(viewEvents,Backbone.Events);
    var MasterView = Backbone.View.extend({
        el:'#masterView',
        views:{

        },
        events:{
        	'click #toMusicListNav':'toMusicList',
        	'click #toSkillListNav':'toSkillPointList',
            'click .js-toAnalyze':'toTop',
        	'click .js-toHome':'toHome',
        },
        initialize:function(){
        	// this.listenTo("#toMusicListNav","click",this.musiclistrender())
        	var view;
	        var analyzeview = new AnalyzeView();
            var musicListView = new MusicListView();
            var skillListView = new SkillListView();
        	var Router = Backbone.Router.extend({
        	    routes:{
        	        '':'index',
        	        '!analyze(_:id)':'analyze',
        	        '!calc':'calc',
        	        '!musicList':'musicList',
        	        '!skillPointList':'skillPointList'
        	    },
        	    index: function index(){
        	    	$('#analyzeView').show();
        	    	$('#skillListView,#musicListView').hide()

        	    },
        	    analyze: function analyze(id){
        	    	$('#analyzeView').show();
        	    	$('#skillListView,#musicListView').hide()

        	        if(id.slice(0,1) != 'g' && id.slice(0,1) != 'd' ){
        	        	Backbone.history.navigate('')
        	        	alert('URLが不正です。TOPにリダイレクトします。')
        	        	return false;
        	        }
        	        analyzeview.analyzeAjaxController.getSkillDataFunc(id);
        	    },
        	    musicList: function musicList(){
        	    	$('#musicListView').show();
        	    	$('#skillListView,#analyzeView').hide();
                    musicListView.loadDataFunc();

        	    },
        	    skillPointList: function skillPointList(){
        	    	$('#skillListView').show();
        	    	$('#analyzeView,#musicListView').hide()

        	    }
        	})
        	var router = new Router();
        	// this.listenTo(router,'all',this.hashCheck)
        },
        // hashCheck:function(hash,arg1,arg2){
        // 	console.log(hash)
        // 	console.log(arg1)
        // 	console.log(arg2)
        	
        // },
        toMusicList:function(){
			Backbone.history.navigate('!musicList',true)
        },
        toSkillPointList:function(){
			Backbone.history.navigate('!skillPointList',true)
        },
        toTop:function(){
			Backbone.history.navigate('',true)
        },
        toHome:function(){
            Backbone.history.navigate('',true)
        }

    });
    //rooter -------------------------------------------------
    var masterView = new MasterView();
    Backbone.history.start();
})