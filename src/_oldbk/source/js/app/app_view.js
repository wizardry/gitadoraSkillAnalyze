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
        	        '!analyze/:webtype/(:id)':'analyze',
        	        '!calc':'calc',
        	        '!musicList':'musicList',
        	        '!skillPointList':'skillPointList'
        	    },
        	    index: function index(){
                    $('#analyzeView').show();
                    $('#skillListView,#musicListView').hide()
                    navCurrent(0);
                    if(analyzeview.collection.skillList.size() == 0){
                        $('#analyzeGraphView,#analyzeCalcView,#analyzeDataView,#analyzeRecommendView,#analyzeSubCalcView').hide();
                    }

        	    },
        	    analyze: function analyze(webtype,id){
                    $('#analyzeView').show();
                    $('#skillListView,#musicListView').hide()
                    navCurrent(0);
                    $('#analyzeGraphView,#analyzeCalcView,#analyzeDataView,#analyzeRecommendView,#analyzeSubCalcView').show();
                    if(webtype == 'xv-od'){
            	        if(id.slice(0,1) != 'g' && id.slice(0,1) != 'd' ){
            	        	Backbone.history.navigate('')
            	        	alert('URLが不正です。TOPにリダイレクトします。')
            	        	return false;
            	        }
                    }else if(webtype == 'mimi-tb'){
                        var tmp = id.split('_')
                        if(tmp[1].slice(0,1) != 'g' && tmp[1].slice(0,1) != 'd' ){
                            Backbone.history.navigate('')
                            alert('URLが不正です。TOPにリダイレクトします。')
                            return false;
                        }
                    }
                    loader(true)
                    console.log(1)
        	        analyzeview.analyzeAjaxController.getSkillDataFunc(webtype,id);
        	    },
        	    musicList: function musicList(){
        	    	$('#musicListView').show();
        	    	$('#skillListView,#analyzeView').hide();
                    musicListView.loadDataFunc();
                    navCurrent(1);
        	    },
        	    skillPointList: function skillPointList(){
        	    	$('#skillListView').show();
        	    	$('#analyzeView,#musicListView').hide()
                    navCurrent(2);

        	    }
        	})
            function navCurrent(index){
                $('.globalNavWrap').find('.current').removeClass('current');
                $('.globalNavWrap').find('li').eq(index).addClass('current')
            }
        	var router = new Router();
        	// this.listenTo(router,'all',this.hashCheck)
        },
        // hashCheck:function(hash,arg1,arg2){
        // 	console.log(hash)
        // 	console.log(arg1)
        // 	console.log(arg2)
        	
        // },
        toMusicList:function(){
            $(window).scrollTop(0)
			Backbone.history.navigate('!musicList',true)
        },
        toSkillPointList:function(){
            $(window).scrollTop(0)
			Backbone.history.navigate('!skillPointList',true)
        },
        toTop:function(){
            $(window).scrollTop(0)
			Backbone.history.navigate('',true)
        },
        toHome:function(){
            $(window).scrollTop(0)
            Backbone.history.navigate('',true)
        }

    });
    //rooter -------------------------------------------------
    var masterView = new MasterView();
    Backbone.history.start();

    //MasterViewより外のもの -------------------------------------------------
    var navFlg = false;
    var navWindowFlg = false;
    var ws = $(window).scrollTop();
    var wh = $(window).height();
    var $nav = $('.globalNavWrap');
    $(window).scroll(function(e){
        ws = $(window).scrollTop();
        if(ws > wh/2 && !$nav.hasClass('fixed')){
            $nav.addClass('fixed');
        }else if(ws < wh/2 && $nav.hasClass('fixed')){
            $nav.removeClass('fixed');
        }
    })
    $('.navTrigger').click(function(e){
        if(!$('.globalNavWrap').hasClass('active')){
            $('.globalNavWrap').addClass('active').stop().delay(300).queue(function(){
                navFlg = true
            });
        }
    })
    $(document).click(function(){
        if(navFlg){
            $('.globalNavWrap').find('ul').addClass('close').stop(true,true).delay(500).queue(function(){
                $('.globalNavWrap').find('ul').removeClass('close').end().removeClass('active');
                navFlg = false;
            })
        }
    })

    //slidetoggle]
    function toggleAreaFunc(){
        $('.js-toggleTrigger').click(function(){
            var target =  $(this).closest('.js-toggleWrap').find('.js-toggleArea')
            if(!target.hasClass('current')){
                target.addClass('current')
            }else{
                target.addClass('close').stop(true,true).delay(500).queue(function(){
                    target.removeClass('close').removeClass('current')
                })
            }
        })
    }
    // function spMenuMargin(){
    //     if(isSP){
    //         $('.globalNavWrap ul').css({
    //             'marginTop':$(window).height()/2
    //         })
    //     }
    // }
    toggleAreaFunc();
    //fcaf kill
    setTimeout(function(){
        $('.globalFooter').nextAll().remove()
    },500)

    // alert('こちらは開発中画面です。\nTwitterにて御意見受け付けています。\nID:@wiz_rein')

})