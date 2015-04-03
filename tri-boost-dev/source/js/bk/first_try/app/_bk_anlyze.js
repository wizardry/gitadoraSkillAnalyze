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
            'click #getDataTrigger':"getData"
        },
        initialize: function(){
            _.bindAll(this,"getData")
        },
        getData:function(e){
            e.preventDefault();

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
    var view = new AnalyzeView();
})