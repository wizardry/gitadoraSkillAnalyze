

$(function(){
    var UserData = Backbone.Model.extend({
        default:{
            id:"",
            part:""

        },
        initialize:function(){
            this.id = $("#userData_id");
            this.part = $("#userData_part");
        }
    })
    var userData = new UserData;
    var IndexView = Backbone.View.extend({
        el:".contents",
        events:{
            'change #userData_searchType':"setUserData_searchType",
            'blur #userData_url':"setUserData_url",
            'change #userData_id':"setUserData_id",
            'change #userData_part':"setUserData_part",
            'click #getDataTrigger':"toAnalyze",
        },
        initialize: function(){
            _.bindAll(this,'setCookie','setUserData_url','setUserData_id','setUserData_part','toAnalyze');
            this.setCookie();
        },
        rendare:function(){

        },
        setCookie:function(){
            console.log('cookie')
            if(!$.isEmptyObject($.cookie())){
                var urlCookie = $.cookie('url');
                var cookiesData = [];

                cookiesData[0] = urlCookie.split('.php?uid=');
                cookiesData[1] = cookiesData[0][1].substr(1);
                cookiesData[2] = cookiesData[0][1].substr(0,1);
                $('#userData_id').val(cookiesData[1]);
                $('#userData_part').val(cookiesData[2]);
                $('#userData_url').val(urlCookie);
                $('#userData_searchType').val();
            }
        },
        setUserData_url:function(e){
            var val = $(e.target).val();
            if(val.indexOf('.php?uid=') == -1){
                alert('正しい値を入力してください。')
            }else{
                val = val.split('.php?uid=')
                userData.set("id",val[1].substr(1))
                userData.set("part",val[1].substr(0,1))
            }
        },
        setUserData_id:function(e){
            var val = $(e.target).val();
            userData.set("id",val)
        },
        setUserData_part:function(e){
            var val = $(e.target).val();
            userData.set("part",val)
        },
        toAnalyze:function(e){
            e.preventDefault();
            Backbone.history.navigate('!analyze/'+userData.part+userData.id,false)
            return false;
        },
    })
    


    //ajaxでアクセスしたHTMLからスキル情報を取得する
    var SkillData = Backbone.Model.extend({
        default:{
            title:"",
            lv:0,
            part:'',
            rate:0,
            point:0,
            rank:"",
            scope:"",

        },
        initialize:function(){
            // _.bindAll(this,"setSkillData")
        },
        setSkillData:function(index,elem,scope){
            var lvAndPart = $(elem).find('td').eq(2).text().split(' ')
            this.set("title",$(elem).find('td').eq(1).text())
            this.set("lv",parseInt(lvAndPart[0].replace('.','')))
            this.set("part",lvAndPart[1])
            this.set("rate",parseInt($(elem).find('td').eq(3).text().replace('.','').replace('%','')))
            this.set("point",parseInt($(elem).find('td').eq(4).text().replace('.','')))
            this.set("rank",$(elem).find('td').eq(5).text())
            this.set("scope",scope)
        }
    })

    // Model skillData の集合体
    var SkillDataBook = Backbone.Collection.extend({
        model:SkillData,
        comparator:'scope'
    });

    var AnalyzeView = Backbone.View.extend({
        el:"#analyze",
        events:{
        },
        initialize: function(){
            _.bindAll(this,"getData")
            this.getData();
        },
        getData:function(e){
            // e.preventDefault();

            var ajaxOption = {
                type:'GET',
                async:true,
                url:"http://xv-s.heteml.jp/skill/gdod.php?uid=g4053",
                dataType:'html',
                cache:false
            }

            $.ajax(ajaxOption).done(function(res){
                console.log('AJAX SUCCESS DONE')
                

                //DOM整形
                $('#test').empty().html(res.results)

                var hotNode = '<table id="scopeHot">'+$('#test > table').eq(2).html()+'</table>';
                var oldNode = '<table id="scopeOld">'+$('#test > table').eq(3).html()+'</table>';

                $('#test').empty().html(hotNode+oldNode)

                //データ連携
                var nowSkillDataBook = new SkillDataBook;

                $('#scopeHot').find('tr').not(':first-child').each(function(i,d){
                    var skillData = new SkillData;
                    skillData.setSkillData(i,d,'hot');
                    nowSkillDataBook.add(skillData)
                })
                $('#scopeOld').find('tr').not(':first-child').each(function(i,d){
                    var skillData = new SkillData;
                    skillData.setSkillData(i,d,'old');
                    nowSkillDataBook.add(skillData)
                })
            })
            return false;
        }
    })
    //ルーティング設定
    var Router = Backbone.Router.extend({
        routes:{
            '':'index',
            '!top':'index',
            '!analyze(/:id)':'analyze',
            '!skillPoint':'skillPoint',
            '!songlist':'songlist',
            '!calc':'calc',

        }
    })
    var router = new Router;
    Backbone.history.start();

    router.on('route:index',function(){
        console.log('index')
        new IndexView()

    })
    router.on('route:analyze',function(id){
        console.log('analyze')
        new AnalyzeView();
    })
    router.on('route:skillPoint',function(){
        
    })
    router.on('route:songlist',function(){
        
    })
    router.on('route:calc',function(){
        
    })

})