//グローバル
var AJAX_URL_BASE = 'http://xv-s.heteml.jp/skill/';
var SKILL_URL = AJAX_URL_BASE+'gdod.php?uid=';
var SKILL_TARGET_COUNT=25;

var toDecimalFunc = function(int){
    var str = [int+''];
    str[1]= str[0].slice(0,-2)
    str[2]= str[0].slice(-2)
    return str[1]+'.'+str[2]
}

//model,collections
var ImportId = Backbone.Model.extend({
    defaults:{
        userId:"",//ex => 4053
        part:"", //ex => g || d
        url:"", //ex => http://xv-s.heteml.jp/skill/gdod.php?uid=g4053
        search:"", //ex => 1 || 2
    },
    getUserID:function(){
        if(this.get("search") == 1){//ID
            return this.get("part")+this.get("userId");
        }else if(search == 2){//url
            var userid = this.get("url").split('.php?uid=');
            return userid[1];
        }else{
            alert('Model > ImportId.getUserID => Error:searchTypeNone');
        }
    },
    setUserID:function(){
        if(this.get("search") == 1){//ID
            this.set("url",SKILL_URL+this.get("part")+this.get("userId"));
        }else if(search == 2){//url
            var userid = this.get("url").split('.php?uid=');

            this.set('part',userid[1].substr(0,1));
            this.set('userId',userid[1].substr(1));
        }else{
            alert('Model > ImportId.setUserID => Error:searchTypeNone');
        }
        return this;
    },
    saveCookieFunc:function(){
        $.cookie("uid",this.getUserID());
    }

});

var SkillMusic = Backbone.Model.extend({
    defaults:{
        title:"",
        lv:0,
        part:'',
        rate:0,
        point:0,
        rank:"",
        scope:"",
        scopeIndex:0
    },
});
var SkillUser = Backbone.Model.extend({
    defaults:{
        oldSkill:0,
        hotSkill:0,
        skillPoint:0,
    },
    getTotalAvg:function(){
        return Math.round(this.get('skillPoint') / (SKILL_TARGET_COUNT*2));
    },
    getOldSkillAvg:function(){
        return Math.round( this.get('oldSkill') / SKILL_TARGET_COUNT );

    },
    getHotSkillAvg:function(){
        return Math.round( this.get('hotSkill') / SKILL_TARGET_COUNT );
    }
});
var SkillList = Backbone.Collection.extend({
    defaults:{
        model:SkillMusic,
        comparator:'scope',
        targetLimit:true
    },
    getHotSkillMusic:function(){
        var tmp = this
        tmp = tmp.filter(function(model){
            return model.get('scopeIndex') < SKILL_TARGET_COUNT && model.get('scope') == 'hot';
        })
        return tmp;
    },
    getHotMusic:function(){
        var tmp = this
        tmp = tmp.filter(function(model){
            return model.get('scope') == 'hot';
        })
        return tmp;
    },
    getOldSkillMusic:function(){
        var tmp = this
        tmp = tmp.filter(function(model){
            return model.get('scopeIndex') < SKILL_TARGET_COUNT && model.get('scope') == 'old';
        })
        // console.log(tmp.toJSON())
        return tmp;
    },
    getOldMusic:function(){
        var tmp = this
        tmp = tmp.filter(function(model){
            return model.get('scope') == 'old';
        })
        return tmp;
    },
    getAllSkillMusic:function(){
        var tmp = this
        tmp = tmp.filter(function(model){
            return model.get('scopeIndex') < SKILL_TARGET_COUNT;
        })
        return tmp;
    },
    getSkillPoint:function(collection){
        var tmp = collection;
        var point = 0
        _.each(tmp,function(model){
            point += model.get('point');
        })
        return point;
    },
    getGenGraphData:function(x,y){
        /*
        x,y=>
                title:"",
                lv:0,
                part:'',
                rate:0,
                point:0,
        */

    },
});


/*1グラフにGraphDatas *2 (old/hot) + GraphTitleが必要*/
var GraphData = Backbone.Model.extend({
    defaults:{
        name:'',
        x:0,
        y:0
    }
});
var GraphDatas = Backbone.Collection.extend({
    model:GraphData,
    toArray:function(){
        return this.toJSON();
    },
    setGraphData:function(x,y){
        var i = 0;
        var data = [];
        var ax;
        var ay;
        var conversion = function(val){
            if(val == 'Lv'){
                console.log('model:setGraphData:lv - x>'+x+' , y>'+y)
                val = 'lv'
            }else if(val == '達成率'){
                console.log('model:setGraphData:rate - x>'+x+' , y>'+y)
                val = 'rate'
            }else if(val == 'Point'){
                console.log('model:setGraphData:point - x>'+x+' , y>'+y)
                val = 'point'
            }
            return val
        }
        ax = conversion(x);
        ay = conversion(y);
        console.log(ax+'|'+ay)
        this.each(function(model){
            data[i]={
                name:model.get('title'),
                x:toDecimalFunc(model.get(ax))*1,
                y:toDecimalFunc(model.get(ay))*1
            }
            i++
        })

        return data
    }

});

var GraphTitle = Backbone.Model.extend({
    defaults:{
        xKey:'',
        yKey:''
    }
});
var GraphConfig = Backbone.Model.extend({
    defaults:{
        axis:[],
        limitLength:true,
        axisReverse:false
    }
})
var AnalyzeCalcConfig = Backbone.Model.extend({
    defaults:{
        filter:null,
        under:null,
        upper:null,
    }
})

var Music = Backbone.Model.extend({});
var MusicList = Backbone.Collection.extend({});

var Calc = Backbone.Model.extend({});