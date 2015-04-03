$(function(){
    var viewEvents = {};
    _.extend(viewEvents,Backbone.Events);
    var MasterView = Backbone.View.extend({
        el:'#masterView',
        views:{},
        initialize:function(){

        },
    });
    var AnalyzeView = Backbone.View.extend({
        el:'#analyzeView',
        events:{
            'submit #analyzeForm':'ajaxFunc'
        },
        model:{
            'importId':new ImportId(),
            'skillUser':new SkillUser(),
            'skillMusic':new SkillMusic()
        },
        collection:{
            'skillList':new SkillList(),
        },
        initialize:function(){
            var analyzeEvents = {};
            _.extend(analyzeEvents,Backbone.Events);

            console.log("av:init")
            // アンチパターンっぽい　var skillList = new SkillList();
            // アンチパターンっぽい　var skillUser = new SkillUser();
            // アンチパターンっぽい　var importId = new ImportId();

            //this.から作成してAnalyzeView関数内から参照できるように。
            //view の model にセットしてあげて、thisで参照できるようにする。
            this.analyzeFormView = new AnalyzeFormView({model:this.model.importId});
            this.analyzeAjaxController =  new AnalyzeAjaxController({
                model:{
                    'importId':this.model.importId,
                    'skillMusic':this.model.skillMusic,
                    'skillUser':this.model.skillUser
                },
                collection:{
                    'skillList':this.collection.skillList,
                }
            });
            this.analyzeGraphView = new AnalyzeGraphView({
                model:{
                    'skillMusit':this.model.skillMusic,
                    'skillUser':this.model.skillUser,
                    'graphTitle': new GraphTitle(),
                    'graphData' : new GraphData(),
                    'config'    : new GraphConfig()
                },collection:{
                    'skillList':this.collection.skillList,
                    'oldData' : new GraphDatas(),
                    'hotData' : new GraphDatas()
                }
            })
            this.analyzeDataView = new AnalyzeDataView({
                'model':this.model.skillUser,
                'collection':this.collection.skillList
            })
            this.analyzeCalcView = new AnalyzeCalcView({
                'model':{
                    'skillUser':this.model.skillUser,
                    'config':new AnalyzeCalcConfig()
                },
                'collection':{
                    'skillList':this.collection.skillList,
                }
            })
            this.listenTo(this.collection.skillList,'add',this.runGraphFunc);

            // アンチパターンっぽい　this.listenTo("submit_import",this.ajaxFunc(importId.getUserID()))
            // アンチパターンっぽい　this.listenTo("ajaxDone",this)
            this.render();
            //this.つけることにより継承してajax発火出来たがEventタイミングの制御が出来ない。
            //http://ameblo.jp/softwaredeveloper/entry-11967156520.html　参考？
        },
        render:function(){
            $(this.el).show();
            return this;
        },
        ajaxFunc:function(e){
            console.log('an:ajaxFunc')
            this.analyzeFormView.submitFunc(e)
            this.analyzeAjaxController.getSkillDataFunc(this.model.importId.getUserID());
        },
        runGraphFunc:function(){
            console.log('an:runGraph')
            this.analyzeDataView.setData();
            this.analyzeGraphView.render();
        }

    });

    //Form入力～送信まで ajaxはAnalyzeAjaxcontrollerに任せる。
    var AnalyzeFormView = Backbone.View.extend({
        el:'#analyzeFormView',
        events:{
            //アンチパターンっぽい　親Viewから見ればいい 'submit form':'submitFunc',
            'change #userData_searchType':'searchTypeToggleFunc'
        },
        initialize:function(){
           
            this.loadCookieFunc();
            this.searchTypeToggleFunc();
            this.render();

        },
        render:function(){

            $("#analyzeFormView").show();
            return this;

        },
        loadCookieFunc:function(){

            //cookieがあった場合の処理
            var cookUid = $.cookie('uid');
            if(cookUid != undefined){

                //DOM側
                $('#userData_url').val(SKILL_URL+cookUid);
                $('#userData_id').val(cookUid.substr(1));
                $('#userData_part').val(cookUid.substr(0,1));

                //Model側
                this.model.set({
                    userId:cookUid.substr(1),
                    part:cookUid.substr(0,1), 
                    url:SKILL_URL+cookUid
                })
            }
        },
        searchTypeToggleFunc:function(){
            //検索種別セレクト変更による挙動
            var val = $('#userData_searchType').val();

            //DOM
            $('.js-formToggleWrap').children().removeClass('current').end()
            .find('.js-formToggleVal'+val).addClass('current');

            //Model
            this.model.set('search',val);
        },
        submitFunc:function(e){
            e.preventDefault();
            this.setFormDataFunc()
            this.toAnalyze()
            return this;
        },
        setFormDataFunc:function(){

            var formVal = {
                userId : $('#userData_id').val(),
                part : $('#userData_part').val(),
                url : $('#userData_url').val(),
                search:$('#userData_searchType').val()
            }

            this.model.set(formVal);
            this.model.setUserID();
            this.model.saveCookieFunc();

        },
        toAnalyze:function(){
            Backbone.history.navigate('!analyze_'+this.model.getUserID(),true)
        }

    });
    //AJAX～データ整形、ユーザースキル値反映まで。グラフ描画はAnalyzeGraphViewに任せる。
    var AnalyzeAjaxController = Backbone.View.extend({
        initialize:function(){
            _.bindAll(this,'getSkillDataFunc',"setSkillDataFunc");
            console.log(this.model.importId.getUserID())
        },
        getSkillDataFunc:function(userId){
            var self = this;//jQuery関数内にはいるとthisがviewではない方を向くためスコープにしておく。
            var ajaxOp ={
                type:'GET',
                async:true,
                url:SKILL_URL+this.model.importId.getUserID(),
                dataType:'html',
                cache:false
            }

            //collection初期化
            self.collection.skillList.reset();


            $.ajax(ajaxOp).pipe(function(res){
                console.log('AnalyzeAjaxController AJAX SUCCESS DONE');
                self.setSkillDataFunc(res)
            },function(){
                console.log('AnalyzeAjaxController AJAX SUCCESS DONE');
                alert('接続に失敗しました。\n回線状況を確認し、再度実行してください。');
            })
        },
        // makeNode ajaxDone
        setSkillDataFunc:function(res){
            var view = this;//jQuery関数内にはいるとthisがviewではない方を向くためスコープにしておく。
            $('input[type=submit]').removeAttr('disabled');
            $('#importData').html(res.results)

            var hotNode = '<table id="scopeHot">'+$('#importData > table').eq(2).html()+'</table>';
            var oldNode = '<table id="scopeOld">'+$('#importData > table').eq(3).html()+'</table>';

            $('#importData').empty().html(hotNode+oldNode);
            
            var lastindex = $('#scopeOld').find('tr').length - 2

            $('#scopeHot').find('tr').not(':first-child').each(function(i,d){
                var skillData = nodeToObject(d);

                skillData.scope = 'hot';
                skillData.scopeIndex=i
                view.collection.skillList.add(skillData,{silent:true})
            })
            $('#scopeOld').find('tr').not(':first-child').each(function(i,d){
                var skillData = nodeToObject(d);

                skillData.scope = 'old';
                skillData.scopeIndex=i
                view.collection.skillList.add(skillData,{silent:true})
                if(lastindex == i){
                    view.collection.skillList.add(skillData,{silent:false})
                }
            })

            function nodeToObject(node){
                var result = {};
                var lvAndPart = $(node).find('td').eq(2).text().split(' ');

                result.title = $(node).find('td').eq(1).text()
                result.lv = parseInt(lvAndPart[0].replace('.',''))
                result.part = lvAndPart[1]
                result.rate = parseInt($(node).find('td').eq(3).text().replace('.','').replace('%',''))
                result.point = parseInt($(node).find('td').eq(4).text().replace('.',''))
                result.rank = $(node).find('td').eq(5).text()

                //result.scopeは実行先で入れる。
                return result;
            }
            console.log('setSkillDataFuncFINISH')
        }
        
    });
    var AnalyzeDataView = Backbone.View.extend({
        events:{

        },
        initialize:function(){
            this.model.clear();
        },
        setData:function(){

            //modelSET
            var list,skill;

            list = this.collection.getAllSkillMusic();
            skill = this.collection.getSkillPoint(list)
            this.model.set('skillPoint',skill)

            list = this.collection.getOldSkillMusic();
            skill = this.collection.getSkillPoint(list)
            this.model.set('oldSkill',skill)

            list = this.collection.getHotSkillMusic();
            skill = this.collection.getSkillPoint(list)
            this.model.set('hotSkill',skill)

            //DOM SET
            var doms = [
                '#analyzeDataTotalPoint',
                '#analyzeDataHotPoint',
                '#analyzeDataOldPoint',
                '#analyzeDataTotalAvg',
                '#analyzeDataHotAvg',
                '#analyzeDataOldAvg'
            ];
            $(doms[0]).text(toDecimalFunc(this.model.get('skillPoint')) );
            $(doms[1]).text(toDecimalFunc(this.model.get('hotSkill')) );
            $(doms[2]).text(toDecimalFunc(this.model.get('oldSkill')) );
            $(doms[3]).text(toDecimalFunc(this.model.getTotalAvg()) );
            $(doms[4]).text(toDecimalFunc(this.model.getHotSkillAvg()) );
            $(doms[5]).text(toDecimalFunc(this.model.getOldSkillAvg()) );
        }

    });
    var AnalyzeGraphView = Backbone.View.extend({
        el:'#analyzeGraphView',
        events:{
            "change #graphType":"setGraphType",
            "change #limit":"setConfigLimit",
            "change #reverse":"setConfigReverse",
            "click #grapyTypeUi li":"setGraphTypeDom",
            "click #limitUi":"setConfigLimitDom",
            "click #reverseUi":"setConfigReverseDom"
        },
        render:function(){
            this.cookieLoad();
            this.getData();
            this.drawGraph();
        },
        cookieLoad:function(){
            var self = this;
            var cookie = $.cookie('garphConfig')
            var param;
            var target = [
                {
                    ui:'#grapyTypeUi',
                    form:'#graphType',
                    model:'axis',
                },{
                    ui:'#limitUi',
                    form:'#limit',
                    model:'limitLength',
                },{
                    ui:'#reverseUi',
                    form:'#reverse',
                    model:'axisReverse',
                }
            ]
            if(cookie != undefined){
                cookie = cookie.split('&');
                $.each(cookie,function(i,d){
                    param = d.split('=')

                    //Model.DomUI
                    switch (param[0]){
                        case "0":
                            //HTML依存
                            var tmpText = $.trim($(target[param[0]].ui).find('li').eq(param[1]).text()).split('×')
                            $(target[param[0]].ui).find('li').removeClass('current').eq(param[1]).addClass('current');
                            $(target[param[0]].form).val(param[1])
                            self.model.config.set(target[param[0]].model,[tmpText[1],tmpText[0]])
                        break;
                        case "1":
                            if(param[1]　== 'true'){//cookieでいれてたら文字列のfalseになってた。
                                $(target[param[0]].ui).addClass('current').text('ON');
                                $(target[param[0]].form).prop('checked',true)
                                self.model.config.set(target[param[0]].model,true)
                            }else{
                                $(target[param[0]].ui).removeClass('current').text('OFF');
                                $(target[param[0]].form).prop('checked',false)
                                self.model.config.set(target[param[0]].model,false)
                            }
                        break;
                        case "2":
                            if(param[1] == 'true'){//cookieでいれてたら文字列のfalseになってた。
                                $(target[param[0]].ui).addClass('current').text('ON');
                                $(target[param[0]].form).prop('checked',true)
                                self.model.config.set(target[param[0]].model,true)
                            }else{
                                $(target[param[0]].ui).removeClass('current').text('OFF');
                                $(target[param[0]].form).prop('checked',false)
                                self.model.config.set(target[param[0]].model,false)
                            }
                        break;
                    }
                })
            }


        },
        cookieSave:function(){
            var cook  = '0='+$('#graphType').val()+'&1='+$('#limit').prop('checked')+'&2='+$('#reverse').prop('checked')
            $.cookie('garphConfig',cook)
            console.log($.cookie('garphConfig'))
        },
        getData:function(){
            // console.log(this.collection.skillList.toJSON())
            var tmpDataA
            var tmpDataB
            //reset

            if(this.model.config.get('limitLength')){
                 tmpDataA = this.collection.skillList.getOldSkillMusic();
                 tmpDataB = this.collection.skillList.getHotSkillMusic();
            }else{
                tmpDataA = this.collection.skillList.getOldMusic();
                tmpDataB = this.collection.skillList.getHotMusic();
            }
            this.collection.oldData.reset(tmpDataA)
            this.collection.hotData.reset(tmpDataB)

        },
        drawGraph:function(){
            var data = {}
            var ax = [this.model.config.get('axis')[0],this.model.config.get('axis')[1]]
            console.log(this.model.config)
            //軸反転
            if(this.model.config.get('axisReverse')){
                console.log(this.model.config.get('axisReverse'))
                var tmp = this.model.config.get('axis');
                ax=[ tmp[1],tmp[0] ];
                
            }
            console.log(ax)

            this.model.graphTitle.set('yKey',ax[1]);
            this.model.graphTitle.set('xKey',ax[0]);
            
            // var tmpData;
            data = {
                'old':this.collection.oldData.setGraphData(ax[0],ax[1]),
                'hot':this.collection.hotData.setGraphData(ax[0],ax[1])
            }
            console.log(data);
            graphDrawing(data,this.model.graphTitle.get('xKey'),this.model.graphTitle.get('yKey'));
        },
        setGraphType:function(e){
            e.preventDefault();
            var eq = parseInt($(e.target).val())
            var tmp =$.trim($('#grapyTypeUi').find('li').eq(eq).text()).split('×')
            this.cookieSave();
            this.model.config.set('axis',[tmp[1],tmp[0]])
            console.log(this.model.config)
            this.drawGraph();
        },
        setConfigLimit:function(e){
            e.preventDefault();
            this.cookieSave();
            this.model.config.set('limitLength',$(e.target).prop('checked'));

            //データ取得し直す
            this.getData();
            this.drawGraph();
        },
        setConfigReverse:function(e){
            e.preventDefault();
            this.cookieSave();
            this.model.config.set('axisReverse',$(e.target).prop('checked'))
            this.drawGraph();
        },
        setGraphTypeDom:function(e){
            e.preventDefault();
            i = $(e.target).index();
            $('#grapyTypeUi').find('li').removeClass('current').eq(i).addClass('current')
            $('#graphType').val(i).change();
        },
        setConfigLimitDom:function(e){
            e.preventDefault();
            if($(e.target).hasClass('current')){
                $(e.target).removeClass('current').text('OFF');
                $('#limit').prop('checked',false).change();
            }else{
                $(e.target).addClass('current').text('ON');
                $('#limit').prop('checked',true).change();
            }
        },
        setConfigReverseDom:function(e){
            e.preventDefault();
            if($(e.target).hasClass('current')){
                $(e.target).removeClass('current').text('OFF');
                $('#reverse').prop('checked',false).change();
            }else{
                $(e.target).addClass('current').text('ON');
                $('#reverse').prop('checked',true).change();
            }
        },
        // render:function(){
        //     console.log(this.collection.skillList)
        // }
    });

    var AnalyzeCalcView = Backbone.View.extend({
        el:'#analyzeCalcView',
        events:{
            'change #analyzeCalcFilter':'calc',
            'change #analyzeCalcUnder':'calc',
            'change #analyzeCalcUpper':'calc'
        },
        model:{
            config:new AnalyzeCalcConfig()
        },
        initialize:function(){},
        show:function(){},
        reset:function(){},
        calc:function(){
            var self = this
            self.setFilter();
            self.setUnder();
            self.setUpper();
            var check = [
                this.model.config.get('filter'),
                this.model.config.get('under'),
                this.model.config.get('upper'),
            ]
            check = _.filter(check,function(val){
                return val == null  || val == '';
            })
            if(check.length == 0){
                self.model.config.get()
                var txt = [];
                var nowSkill;
                var points;
                var pointsTmp;
                if(self.model.config.get('filter') == 0){
                    points = self.collection.skillList.getAllSkillMusic();
                    nowskill = self.model.skillUser.get('skillPoint')*1;
                }else if(self.model.config.get('filter') == 1){
                    points = self.collection.skillList.getHotSkillMusic();
                    nowskill = self.model.skillUser.get('hotSkill')*1;
                }else if(self.model.cinfig.get('filter') == 2){
                    points = self.collection.skillList.getOldSkillMusic();
                    nowskill = self.model.skillUser.get('oldSkill')*1;
                }
                console.log(points)
                points = _.pluck(points.toJSON,'point')
                pointsTmp = points.concat();
                console.log(points)
                $.each(pointsTmp ,function(i,d){
                    if(d <= self.model.config.get('under')*1){
                        pointsTmp[i]=model.config.get('upper')*1
                    }
                })
                txt[1] = function(){
                    var res = 0;
                    _.each(pointsTmp,function(i,d){
                        console.log(i)
                        res += d;
                    })
                    console.log(res)
                    return res;
                }
                txt[0] = function(){
                    var res ;
                    res = txt[1]();
                    console.log(res)
                    return res - nowskill;
                }

                txt[2] = function(){
                    var tmp;
                    tmp = points.filter(function(num){
                        return num <= self.model.config.get('under')*1
                    })
                    console.log(tmp)
                    return tmp.length
                }
                $('#analyzeCalcDiffPoint').text(
                    toDecimalFunc(txt[0]())
                );
                $('#analyzeCalcResult').text(
                    toDecimalFunc(txt[1]())
                );
                $('#analyzeCalcMusicLength').text(txt[2]())
            }

        },
        setFilter:function(){
            this.model.config.set('filter',$('#analyzeCalcFilter').val())
        },
        setUnder:function(){
            this.model.config.set('under',$('#analyzeCalcUnder').val())
        },
        setUpper:function(){
            this.model.config.set('upper',$('#analyzeCalcUpper').val())
        }
    });

    var MusicView = Backbone.View.extend({});
    var MusicFilterView = Backbone.View.extend({});
    var MusicListView = Backbone.View.extend({});

    var SkillView = Backbone.View.extend({});
    var SkillFilterView = Backbone.View.extend({});
    var SkillListView = Backbone.View.extend({});


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
            var analyzeView = new AnalyzeView();
        },
        analyze: function analyze(id){
            console.log('ROUTER : analyze/ID=> '+id)
            var analyzeView = new AnalyzeView();  
            // analyzeView.ajaxFunc();
        },
        calc: function calc(){
            var analyzeView = new AnalyzeView();
        },
        musicList: function musicList(){
        },
        skillPointList: function skillPointList(){
        }
    })
    var router = new Router();
    var masterView = new MasterView();
    Backbone.history.start();

    var FixtureData = {};
    FixtureData.importId = new ImportId({
        userId:"4053",
        part:"g",
        url:SKILL_URL+"g4053",
        search:"1"
    });
    console.log(FixtureData)
    

    //----------------------------graph

    //Hichartsの描画
    function graphDrawing(datas,xKey,yKey){//object/str/str
        /*
            datas= datas{
                hot:[ {name:str , x:int , y:int} ],
                old[ {name:str , x:int , y:int} ]
            }
        */

        $('#analyzeGraphCanvas').highcharts({
            chart:{
                type:'scatter'
                ,zoomType:'xy'
            }
            ,title: {
                text:yKey+' × '+ xKey
            }
            ,subtitle:{
                text:''
            }
            ,xAxis:{
                title:{
                    enabled: true
                    ,title:xKey
                }
                ,startOnTick:true
                ,endOnTick:true
                ,showLastLavel:true
            }
            ,yAxis:{
                title:{
                    text:yKey
                }
            }
            ,legend:{
                layout:'vertical'
                ,align:'right'
                ,verticalAlign:'top'
                ,x:5
                ,y:5
                ,floating:true
                ,backgroundColor:('#ccc')
                ,borderWidth:2
            },
            plotOptions:{
                scatter:{
                    marker:{
                        radius:8
                        ,states:{
                            hover:{
                                enabled:true
                                ,lineColor:'rgb(100,100,100)'
                            }
                        }
                    }
                    ,states:{
                        hover:{
                            marker:{
                                enabled:true
                            }
                        }
                    }
                    ,tooltip:{
                        headerFormat:'{series.name} | {point.key}<br>'
                        ,pointFormat:xKey+'{point.x} | '+yKey+'{point.y}'
                    }
                }
            },
            series:[{
                name:'HOT'
                ,color:'rgba(233,83,83,.5)'
                ,data:datas.hot
            },{
                name:'OLD'
                ,color:'rgba(119, 152, 191, .5)'
                ,data:datas.old
            }]
        });
    };


})