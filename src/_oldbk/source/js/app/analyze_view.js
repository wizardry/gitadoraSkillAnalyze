var AnalyzeView = Backbone.View.extend({
    el:'#analyzeView',
    constructor: function() {
        if (!AnalyzeView.instance) {
            AnalyzeView.instance = this;
            Backbone.View.apply(AnalyzeView.instance, arguments);
        }
        return AnalyzeView.instance;
    },
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
        //発火タイミングに関わらず一括で呼び出しておく。
        this.analyzeFormView = new AnalyzeFormView({
            model:this.model.importId
        });
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
        this.analyzeRecommendView = new AnalyzeRecommendView({
            'model':{
                'importId':this.model.importId,
                'skillUser':this.model.skillUser,
                'music':new AnalyzeRecMusic()
            },
            'collection':{
                'skillList':this.collection.skillList,
                'recList':new AnalyzeRecList(),
            }
        })
        this.analyzeSubCalcView = new AnalyzeSubCalcView({
            'model':{
                'avgMath':new SubCalcSingleAvg(),
                'skillMatn':new subCalcSkillMath(),
                'rateMath':new subCalcRateMathPoint()
            }
        })
        this.listenTo(this.collection.skillList,'add',this.runGraphFunc);

        this.render();
    },
    render:function(){
        $(this.el).show();
        return this;
    },
    ajaxFunc:function(e){
        loader(true)
        this.analyzeFormView.submitFunc(e)
    },
    runGraphFunc:function(){
        this.analyzeDataView.setData();
        this.analyzeGraphView.render();
        this.analyzeRecommendView.ajax();
    }
})

var AnalyzeFormView = Backbone.View.extend({
        el:'#analyzeFormView',
        events:{
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
                cookUid = JSON.parse(cookUid);
                //DOM側
                $('#userData_url').val(cookUid.url);
                $('#userData_id').val(cookUid.userId);
                $('#userData_part').val(cookUid.part);
                $('#userData_WebType').val(cookUid.webType);

                this.model.set(cookUid);
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
                search:$('#userData_searchType').val(),
                webType:$('#userData_WebType').val()
            }
            //Model set
            this.model.set(formVal);

            //serchによってmodelに空が出るためそれを埋める
            this.model.setUserID();

            //Cookie保存
            this.model.saveCookieFunc();

        },
        toAnalyze:function(){
            Backbone.history.navigate('!analyze/'+this.model.get('webType')+'/'+this.model.getUserID(),true)
        }
})
var AnalyzeAjaxController = Backbone.View.extend({
    initialize:function(){
        _.bindAll(this,'getSkillDataFunc',"setSkillDataFunc");
    },
    getSkillDataFunc:function(webtype,userId){
        var self = this;//jQuery関数内にはいるとthisがviewではない方を向くためスコープにしておく。
        var xUrl;
        console.log(0)
        if(webtype == 'xv-od'){
            //ajax URL set
            xUrl = SKILL_URL['xv-od']+userId;

            //#urlでアクセスした際のmodel set
            this.model.importId.set('part',userId.slice(0,1))
            this.model.importId.set('userId',userId.slice(1))
            this.model.importId.set('url',xUrl)
            this.model.importId.set('webType','xv-od')
        }else if(webtype == 'mimi-tb'){

            var tmp = userId.split('_')
            console.log(tmp);
            //ajax URL set
            xUrl = SKILL_URL['mimi-tb']+tmp[0]+'/'+tmp[1];

            //#urlでアクセスした際のmodel set
            this.model.importId.set('part',userId[1].slice(0,1))
            this.model.importId.set('userId',userId[0])
            this.model.importId.set('url',xUrl)
            this.model.importId.set('webType','mimi-tb')
        }
        var ajaxOp ={
            type:'GET',
            async:true,
            timeout:10000,
            url:xUrl,
            dataType:'html',
            cache:false
        }

        //collection初期化
        self.collection.skillList.reset();

        $.ajax(ajaxOp).pipe(function(res){
            self.setSkillDataFunc(res)
        },function(){
            alert('接続に失敗しました。\n回線状況を確認し、再度実行してください。');
        })
    },
    // makeNode ajaxDone
    setSkillDataFunc:function(res){
        var view = this;//jQuery関数内にはいるとthisがviewではない方を向くためスコープにしておく。
        $('input[type=submit]').removeAttr('disabled');
        $('#importData').html(res.results)
        if(this.model.importId.get('webType') == 'xv-od'){
            this.xvodAjax();
        }else if(this.model.importId.get('webType') == 'mimi-tb'){
            this.mimitbAjax();
        }

    },
    xvodAjax:function(){
        var view = this;
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

            //result.scope,scopeIndexは実行先で入れる。
            return result;
        }
    },
    mimitbAjax:function(){
        var view = this;
        var hotNode = '<table id="scopeHot">'+$('#importData #sortableTable tbody').html()+'</table>';
        var oldNode = '<table id="scopeOld">'+$('#importData #sortableTable2 tbody').html()+'</table>';
        $('#importData').empty().html(hotNode+oldNode);
        var lastindex = $('#scopeOld').find('tr').length - 2
        $('#scopeHot').find('tr').each(function(i,d){
            var skillData = nodeToObject(d);

            skillData.scope = 'hot';
            skillData.scopeIndex=i
            view.collection.skillList.add(skillData,{silent:true})
        })
        $('#scopeOld').find('tr').each(function(i,d){
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
            var rateIndex;
            var rate = $(node).find('td').eq(3).text().replace('.','').replace('(','').replace(')','');
            rate = rate.split(' ');
            rate[1] = rate[1].split('/')

            result.title = $(node).find('td').eq(1).text()
            result.lv = parseInt(lvAndPart[0].replace('.',''))
            result.part = lvAndPart[1]
            result.rate = parseInt(rate[0])
            result.point = parseInt($(node).find('td').eq(4).text().replace('.',''))
            result.rank = rate[1][0];

            //result.scope,scopeIndexは実行先で入れる。
            return result;
        }
    }
})
var AnalyzeDataView = Backbone.View.extend({
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

        $('#analyzeDataTotalPoint').text(toDecimalFunc(this.model.get('skillPoint')) );
        $('#analyzeDataHotPoint').text(toDecimalFunc(this.model.get('hotSkill')) );
        $('#analyzeDataOldPoint').text(toDecimalFunc(this.model.get('oldSkill')) );
        $('#analyzeDataTotalAvg').text(toDecimalFunc(this.model.getTotalAvg()) );
        $('#analyzeDataHotAvg').text(toDecimalFunc(this.model.getHotSkillAvg()) );
        $('#analyzeDataOldAvg').text(toDecimalFunc(this.model.getOldSkillAvg()) );
    }
})
var AnalyzeGraphView = Backbone.View.extend({
    el:'#analyzeGraphView',
    events:{
        "change #graphType":"setGraphType",
        "change #limit":"setConfigLimit",
        "change #reverse":"setConfigReverse",
        "click #graphTypeUi li":"setGraphTypeDom",
        "click #limitUi":"setConfigLimitDom",
        "click #reverseUi":"setConfigReverseDom",
        "click #graphToggleTrigger":"toggleGraphArea",
    },
    render:function(){
        this.cookieLoad();
        this.getData();
        this.drawGraph();
    },
    cookieLoad:function(){
        var cookie = $.cookie('graphConfig');

        if(cookie != undefined){
            cookie = cookie.split('&');
            $.each(cookie,function(i,d){
                cookie[i] = d.split('=');
            })

            //0 graphType
            this.model.config.setAxis(cookie[0][1]);
            $('#graphType').val(cookie[0][1]);
            $('#graphTypeUi').find('li').removeClass('current').eq(cookie[0][1]).addClass('current');

            //1 limit
            if(cookie[1][1] == 'false'){//cookieから取得するため文字列の true/false になる
                this.model.config.set('limitLength',false)
                $('#limit').prop('checked',false);
                $('#limitUi').removeClass('current');
            }else{
                this.model.config.set('limitLength',true)
                $('#limit').prop('checked',true);
                $('#limitUi').addClass('current');
            }

            //2 reverse
            if(cookie[2][1] == 'false'){//cookieから取得するため文字列の true/false になる
                this.model.config.set('axisReverse',false)
                $('#reverse').prop('checked',false);
                $('#reverseUi').removeClass('current');
            }else{
                this.model.config.set('axisReverse',true)
                $('#reverse').prop('checked',true);
                $('#reverseUi').addClass('current');
            }
        }else{
            this.model.config.setAxis(0);
            $('#graphType').val(0);
            $('#graphTypeUi').find('li').removeClass('current').eq(0).addClass('current');
            this.model.config.set('limitLength',true)
            $('#limit').prop('checked',true);
            $('#limitUi').addClass('current');
            this.model.config.set('axisReverse',false)
            $('#reverse').prop('checked',false);
            $('#reverseUi').removeClass('current');

        }
    },
    cookieSave:function(){
        var cook  = '0='+$('#graphType').val()+'&1='+$('#limit').prop('checked')+'&2='+$('#reverse').prop('checked')
        $.cookie('graphConfig',cook)
    },
    getData:function(){
        //計算対象曲の生成
        var tmpDataA
        var tmpDataB

        if(this.model.config.get('limitLength')){
             tmpDataA = this.collection.skillList.getOldSkillMusic();
             tmpDataB = this.collection.skillList.getHotSkillMusic();
        }else{
            tmpDataA = this.collection.skillList.getOldMusic();
            tmpDataB = this.collection.skillList.getHotMusic();
        }

        this.collection.oldData.reset(tmpDataA.toJSON())
        this.collection.hotData.reset(tmpDataB.toJSON())

    },
    drawGraph:function(){
        //設定値からデータ生成とグラフ描画
        //対象曲は別生成で、そこからAxisを抜き出すのはここ。
        var data = {}
        var axisTitle = this.model.config.getStrAxis( parseInt($('#graphType').val()) );
        var axisKey = this.model.config.getKeyAxis( parseInt($('#graphType').val()) );

        //軸反転
        if(this.model.config.get('axisReverse')){
            axisTitle.reverse();
            axisKey.reverse();

        }
        this.model.graphTitle.set('xKey',axisTitle[0]);
        this.model.graphTitle.set('yKey',axisTitle[1]);
        data = {
            'old':this.collection.oldData.setGraphData(axisKey[1],axisKey[0]),
            'hot':this.collection.hotData.setGraphData(axisKey[1],axisKey[0])
        }
        graphDrawing(data,this.model.graphTitle.get('xKey'),this.model.graphTitle.get('yKey'));
        //Hichartsの描画
        function graphDrawing(datas,xKey,yKey){//object/str/str
            /*
                datas= datas{
                    hot:[ {name:str , x:int , y:int} ],
                    old[ {name:str , x:int , y:int} ]
                }
            */

            $('#analyzeGraphCanvas').highcharts(graphOp(datas,xKey,yKey));
        };
    },
    setGraphType:function(e){
        //グラフタイプのモデルセット、クッキーセット、グラフ再描画
        e.preventDefault();
        var eq = parseInt($(e.target).val())
        this.cookieSave();
        this.model.config.setAxis(eq);
        this.drawGraph();
    },
    setConfigLimit:function(e){
        //対象曲に絞るのモデルセット、クッキーセット、グラフ再描画
        e.preventDefault();
        this.cookieSave();
        this.model.config.set('limitLength',$(e.target).prop('checked'));

        //データ取得し直す
        this.getData();
        this.drawGraph();
    },
    setConfigReverse:function(e){
        //軸反転のモデルセット、クッキーセット、グラフ再描画
        e.preventDefault();
        this.cookieSave();
        this.model.config.set('axisReverse',$(e.target).prop('checked'))
        this.drawGraph();
    },
    setGraphTypeDom:function(e){
        e.preventDefault();
        i = $(e.target).index();
        $('#graphTypeUi').find('li').removeClass('current').eq(i).addClass('current')
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
    toggleGraphArea:function(){
        if($('.js-graphToggleArea').hasClass('active')){
            $('.js-graphToggleArea').removeClass('active')
        }else{
            $('.js-graphToggleArea').addClass('active')
        }
    },
})
var AnalyzeCalcView = Backbone.View.extend({
    el:'#analyzeCalcView',
    events:{
        'change #analyzeCalcFilter':'setConfig',
        'change #analyzeCalcUnder':'setConfig',
        'change #analyzeCalcUpper':'setConfig'
    },
    initialize:function(){
        this.listenTo(this.model.config,'change',this.calc);
    },
    show:function(){},
    reset:function(){},
    calc:function(){
        /*
            必要なもの
                ・スキル対象（pointのフィルター）
                ・値上書き後の数値と上書き前の数値差
                ・上書きした数
            this.model.config と this.collection.skillListが必要。
            また、それぞれ単独で終わるようにコントロールしてあげる。
        */
        var beforeData,afterData;
        var self = this
        var under,upper;
        var chcke =function(){
            var flg = true;
            _.each(self.model.config.toJSON(),function(val,key){
                if(val==null){
                    flg = false;
                }
            })
            return flg;
        }
        if(chcke()){
            under =  self.model.config.get('under');
            upper =  self.model.config.get('upper');
            beforeData = self.beforeSkillData()//array[]
            
            if(under.indexOf('.') == -1){
                under = (under*1)*100;
            }else{
                under = under.replace('.','')*1
            }
            if(upper.indexOf('.') == -1){
                upper = (upper*1)*100;
            }else{
                upper = upper.replace('.','')*1
            }
            afterData = self.afterSkillData(beforeData,under,upper);
            
            this.output(afterData);
        }
    },
    beforeSkillData:function(){
        //return Array[];
        var filter = this.model.config.get('filter');
        var data = new SkillList();
        var result;

        if(filter == 0){
            data = this.collection.skillList.getAllSkillMusic();
        }else if(filter == 1){
            data = this.collection.skillList.getHotSkillMusic();
        }else if(filter == 2){
            data = this.collection.skillList.getOldSkillMusic();
        }

        result = data.pluck('point')

        return result;
    },
    afterSkillData:function(data,under,upper){
        var res;
        var len=0;
        var diff=0;
        // data がただのaryなのでjQueryで整形する。
        $.each(data,function(i,d){
            if(d<=under){
                len++;
                diff += (upper-d);
            }else{
                return true;
            }
        })
        res = [len,diff]
        return res;
    },
    output:function(data){
        var point = this.model.skillUser.get('skillPoint');

        $('#analyzeCalcDiffPoint').text(
            toDecimalFunc(data[1])
        );
        $('#analyzeCalcResult').text(
            toDecimalFunc(data[1]+point)
        );
        $('#analyzeCalcMusicLength').text(data[0])
    },
    setConfig:function(e){
        var self = this
        switch ($(e.target).attr('id')){
            case 'analyzeCalcFilter':
                self.model.config.set('filter',$(e.target).val());
            break;
            case 'analyzeCalcUnder':
                self.model.config.set('under',$(e.target).val());
            break;
            case 'analyzeCalcUpper':
                self.model.config.set('upper',$(e.target).val());
            break;
        }
    }
})
var AnalyzeRecommendView = Backbone.View.extend({
    el:'#analyzeRecommendView',
    events:{},
    initialize:function(){
        this.listenTo(this.collection.recList,'add',this.draw);
    },
    render:function(){},
    ajax:function(){
        var self = this;
        if(self.model.importId.get('webType') == 'xv-od'){
            var id = function(){

                var result,part,index,userSkill;
                userSkill = self.model.skillUser.get('skillPoint')+'';
                userSkill = parseInt(userSkill.slice(0,-4) + '00');
                part = self.model.importId.get('part')
                $.each(AVG_LIST['xv-od'][part],function(i,d){
                    if(userSkill == d.skill){
                        index = i
                        return false;
                    }
                })

                result = [
                    part+AVG_LIST['xv-od'][part][index].userId,
                    part+AVG_LIST['xv-od'][part][index-1].userId
                ]

                return result;
            };
            avgid = id();
            var ajaxOp1 ={
                type:'GET',
                async:true,
                timeout:10000,
                url:SKILL_URL['xv-od']+avgid[0],
                dataType:'html',
                cache:false
            };
            var ajaxOp2 ={
                type:'GET',
                async:true,
                timeout:10000,
                url:SKILL_URL['xv-od']+avgid[1],
                dataType:'html',
                cache:false
            };
            $.when(
                $.ajax(ajaxOp1),
                $.ajax(ajaxOp2)
            ).pipe(function(ad,bd){
                self.collection.recList.reset();
                self.setData(ad,false)
                self.setData(bd,true)
                loader(false)
                //bdのsetDataが終わるとcollectionのListenToからthis.draw()発火
            },function(){
                alert('接続に失敗しました。\n一部機能が表示されません。');
            })
        }else{
            loader(false);
            $('#recListHot').text('平均データがありません。');
            $('#recListOld').text('平均データがありません。');
        }

    },
    draw:function(){
        this.getData();
        this.genNode();
    },
    setData:function(res,silen){
        var self = this;
        var regRateEq = 6
        var inputElem = $('#recRes1');
        if(silen){
            inputElem = $('#recRes2')
        }
        if(this.model.importId.get('part') == 'g'){
            regRateEq = 7
        }

        var node = '<div>'+res[0].results+'</div>';//<html>からだとjQuery objectで正常にDOMが取れない。
        // var obj = $()
        node = $(node)
        node = '<table id="recHot">'+$(node).find('table').eq(4).html()+'</table><table id="recOld">'+$(node).find('table').eq(5).html()+'</table>'
        inputElem.html(node);
        

        $('#recHot').find('tr').not(':first-child').each(function(i,d){
            var musicData;
            musicData = nodeToData(d,regRateEq);
            musicData.scope = 'hot'
            self.collection.recList.add(musicData,{silent:true})
        })
        $('#recOld').find('tr').not(':first-child').each(function(i,d){
            var musicData;
            musicData = nodeToData(d,regRateEq);
            musicData.scope = 'old'
            self.collection.recList.add(musicData,{silent:true})
            if($('#recOld').find('tr').length-2 == i && silen){
                self.collection.recList.add(musicData,{silent:false})
            }
        })

        function nodeToData(elem,regEq){
            var result = {};
            var lvAndPart = $(elem).find('td').eq(2).text().split(' ');
            var rate;

            rate = $(elem).find('td').eq(regRateEq).text().replace('.','');
            rate = rate.replace('%','')

            result.title = $(elem).find('td').eq(1).text()
            result.level = parseInt(lvAndPart[0].replace('.',''))
            result.part = lvAndPart[1]
            result.regRate = rate*1
            return result;
        }
    },
    getData:function(){
        var userSkillUnder = [
            this.collection.skillList.getHotSkillMusic().at(24).get('point'),
            this.collection.skillList.getOldSkillMusic().at(24).get('point'),
        ]
        var titleList = this.collection.skillList.getTitle()

        //下限フィルター
        this.collection.recList.filterPoint(userSkillUnder[0],userSkillUnder[1]);

        //平均二種内での重複フィルター
        this.collection.recList.checkThisOverlap();

        //ユーザーデータとの重複フィルター
        this.collection.recList.checkUserOverlap(titleList);

        //データソート
        this.collection.recList.sort();

    },
    genNode:function(){
        var hotData,oldData,hotNode,oldNode,i;

        hotData = this.collection.recList.where({scope:'hot'}).reverse()
        oldData = this.collection.recList.where({scope:'old'}).reverse()
        this.collection.recList.reset(hotData,{sort:false});

        hotNode = '<ul class="recHotList">'
        i = 0;
        this.collection.recList.each(function(d,i){
            i++
            if(i<31 ){
                var tmp,classname;
                classname = d.get('part').slice(0,3);
                classname = classname.toLowerCase();
                tmp = d.get('level')+''
                tmp = tmp.slice(0,1)+'.'+tmp.slice(1),
                hotNode += '<li class="'+classname+'">'
                hotNode += '<span class="title">'+d.get('title')+'</span>'
                hotNode += '<span class="part">'+d.get('part')+'</span>'
                hotNode += '<span class="lv">'+tmp+'</span>'
                hotNode += '</li>'
            }else{
                return false
            }
        })
        hotNode += '</ul>'

        this.collection.recList.reset(oldData,{sort:false});

        oldNode = '<ul class="recOldList">'
        i=0;
        this.collection.recList.each(function(d,i){
            i++
            if(i<31 ){

                var tmp,classname;
                classname = d.get('part').slice(0,3);
                classname = classname.toLowerCase();

                tmp = d.get('level')+''
                tmp = tmp.slice(0,1)+'.'+tmp.slice(1),
                oldNode += '<li class="'+classname+'">'
                oldNode += '<span class="title">'+d.get('title')+'</span>'
                oldNode += '<span class="part">'+d.get('part')+'</span>'
                oldNode += '<span class="lv">'+tmp+'</span>'
                oldNode += '</li>'
            }else{
                return false;
            }
        })
        oldNode += '</ul>'
        $('#recListHot').html(hotNode)
        $('#recListOld').html(oldNode)
    }
});
var AnalyzeSubCalcView = Backbone.View.extend({
    el:"#analyzeSubCalcView",
    events:{
        'change #subCalcSingleAvgTotal':'avgRender',
        'change #subCalcSingleAvgFilter':'avgRender',
        'change #subCalcSkillMathLv':'skillMathRender',
        'change #subCalcSkillMathRate':'skillMathRender',
        'change #subCalcRateMathLv':'rateMathRender',
        'change #subCalcRateMathCombo':'rateMathRender',
        'change #subCalcRateMathPerfect':'rateMathRender'
    },
    avgRender:function(){
        var self = this;
        this.model.avgMath.set('total',$('#subCalcSingleAvgTotal').val());
        this.model.avgMath.set('filter',$('#subCalcSingleAvgFilter').val());
        $('#subCalcSingleAvg').text(self.model.avgMath.math());
    },
    skillMathRender:function(){
        var self = this;
        this.model.skillMatn.set('lv',$('#subCalcSkillMathLv').val());
        this.model.skillMatn.set('rate',$('#subCalcSkillMathRate').val());
        $('#subCalcSkillMath').text(self.model.skillMatn.math());
    },
    rateMathRender:function(){
        var self = this;
        this.model.rateMath.set('lv',$('#subCalcRateMathLv').val());
        this.model.rateMath.set('combo',$('#subCalcRateMathCombo').val());
        this.model.rateMath.set('perfect',$('#subCalcRateMathPerfect').val());
        $('#subCalcRateMathRate').text(self.model.rateMath.rateMath());
        $('#subCalcRateMathPoint').text(self.model.rateMath.pointMath());
    },
})
