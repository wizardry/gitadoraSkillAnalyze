$(function(){
    //view -------------------------------------------------
    var MasterView = Backbone.View.extend({
        el:'#masterView',
        mainview:null,
        initialize:function(){
            var skillList = new SkillList();
            var userInfo = new UserForm();
        }
    })
    var SkillImportView = Backbone.View.extend({
        el:'#skillImport',
        events:{
            'submit #skillImport':'skillImportFunc',
            'click #getDataTrigger':'skillImportFunc',
            'change #userData_searchType':'searchTypeToggleFunc'
        },
        initialize:function(){
            console.log('index')
            _.bindAll(this,'skillImportFunc','cookieSaveFunc')
            this.cookieLoadFunc()
        },
        skillImportFunc:function(e){
            e.preventDefault();
            //多重送信防止
            $(e.target).attr('disabled','disabled');
            this.ajaxFunc()

        },
        ajaxFunc:function(){
            this.cookieSaveFunc();

            var userform = this.setUserForm();

            var ajaxOption = {
                type:'GET',
                async:true,
                url:SKILL_URL+userform.get("part")+userform.get("id"),
                dataType:'html',
                cache:false
            }

            $.ajax(ajaxOption).pipe(function(res){
                console.log('AJAX SUCCESS DONE');
                $('input[type=submit]').removeAttr('disabled');
                $('#importData').html(res.results)

                var hotNode = '<table id="scopeHot">'+$('#importData > table').eq(2).html()+'</table>';
                var oldNode = '<table id="scopeOld">'+$('#importData > table').eq(3).html()+'</table>';

                $('#importData').empty().html(hotNode+oldNode);

                skillList = new SkillList();

                $('#scopeHot').find('tr').not(':first-child').each(function(i,d){
                    var skillMusic = new SkillMusic;
                    skillMusic.setSkillData(i,d,'hot');
                    skillList.add(skillMusic)
                })
                $('#scopeOld').find('tr').not(':first-child').each(function(i,d){
                    var skillMusic = new SkillMusic;
                    skillMusic.setSkillData(i,d,'old');
                    skillList.add(skillMusic)
                })
                console.log('BACKBONE COLLECTION ADD-------');
                
                Backbone.history.navigate('!analyze_'+userform.get("part")+userform.get("id"),true)
                return skillList;


            },function(){
                //error
                alert('接続に失敗しました。\n回線状況を確認し、再度実行してください。');
                $(e.target).removeAttr('disabled');
            })

            //データセット
        },
        cookieSaveFunc:function(){
            var xvsBaseURL = '';
            var searchType = $('#userData_searchType').val();
            if( searchType == 1){
                svxBaseURL = SKILL_URL+$('#userData_part').val()+$('#userData_id').val();
                $.cookie('url',svxBaseURL);
                console.log('addCookie => URL')
            }else{
                $.cookie('url',$('#userData_url').val());
                console.log('addCookie => URL')
            }
            $.cookie('searchType',searchType)
        },
        cookieLoadFunc:function(){
            // $.cookie('searchType',1||2)
            // $.cookie('url','http://xv-s.heteml.jp/skill/gdod.php?uid=g4053')

            //searchType周り
            var searchType = $.cookie('searchType')
            if( searchType != undefined ){
                $('#userData_searchType').val(searchType)
            }


            //id周り
            var cookieUrl = $.cookie('url');
            
            if( cookieUrl != undefined && cookieUrl.indexOf('.php?uid=') != -1){
                //ex cookie url => http://xv-s.heteml.jp/skill/gdod.php?uid=g4053
                var splitStr = cookieUrl.split('.php?uid=');
                $('#userData_url').val(cookieUrl);
                $('#userData_id').val(splitStr[1].substr(1))
                $('#userData_part').val(splitStr[1].substr(0,1))
            }
            
        },
        setUserForm:function(){
            //Model UserFormに値を入れる
            userInfo = new UserForm();
            var url = '';

            if($('#userData_searchType').val() == 1){
                userInfo.set('id',$('#userData_id').val());
                userInfo.set('part',$('#userData_part').val());
            }else if($('#userData_searchType').val() == 2){
                url = $('userData_url').val();
                if(url.indexOf('.php?uid=') != -1){
                    url = url.split('.php?uid=');
                    userInfo.set('part',url[1].substr(0,1))
                    userInfo.set('id',url[1].substr(1))
                }
            }
            return userInfo;

        },
        hashToUserForm:function(id){
            $('#userData_searchType').val(1)
            $('#userData_id').val(id.substr(1))
            $('#userData_part').val(id.substr(0,1))
            return this;
        },
        searchTypeToggleFunc:function(){

        }

    })

    var AnalyzeView = Backbone.View.extend({
        el:'#analyzeBlock',
        initialize:function(){
            console.log('analyzeView')
            console.log(skillList)
            console.log(skillList.getTargetSkill())
        },
        setSkillUser:function(){

        },
        setSkillMusic:function(){

        },


    });


    //rooter -------------------------------------------------
    var Router = Backbone.Router.extend({
        routes:{
            '':'index',
            '!analyze(_:id)':'analyze',
            '!calc':'calc',
            '!musicList':'musicList',
            '!skillPointList':'skillPointList'
        },
        index: function index(){
            var skillImportView = new SkillImportView();
        },
        analyze: function analyze(id){
            var skillImportView = new SkillImportView();

            if(id == null){
                Backbone.history.navigate('',true);
            }else if(id != null && typeof skillList == "undefined"){
                skillImportView.hashToUserForm(id)
                skillImportView.ajaxFunc()
            }
            var analyzeView = new AnalyzeView();
        },
        calc: function calc(){
            // var analyzeView = new AnalyzeView();
        },
        musicList: function musicList(){
            // var analyzeView = new AnalyzeView();
        },
        skillPointList: function skillPointList(){
            // var analyzeView = new AnalyzeView();
        }
    })
    router = new Router();
    masterView = new MasterView();
    Backbone.history.start();


})
;
