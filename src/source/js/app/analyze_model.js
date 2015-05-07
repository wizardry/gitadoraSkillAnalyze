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
        return this.getMusicFunc('hot',true)
    },
    getHotMusic:function(){
        return this.getMusicFunc('hot',false)
    },
    getOldSkillMusic:function(){
        return this.getMusicFunc('old',true)
    },
    getOldMusic:function(){
        return this.getMusicFunc('old',false)
    },
    getAllSkillMusic:function(){
        return this.getMusicFunc('all',true)
    },
    getMusicFunc:function(scope,limit){
        //scope = hot / old / all
        //limit = true / false
        var tmp = new SkillList();
        var tmp = this.clone()
        var res ;

        res = tmp.filter(function(model){
            if( scope == "hot" && limit){return model.get('scopeIndex') < SKILL_TARGET_COUNT && model.get('scope') == 'hot';}
            if( scope == "hot" && !limit){return model.get('scope') == 'hot';}
            if( scope == "old" && limit){return model.get('scopeIndex') < SKILL_TARGET_COUNT && model.get('scope') == 'old';}
            if( scope == "old" && !limit){return model.get('scope') == 'old';}
            if( scope == "all" && limit){return model.get('scopeIndex') < SKILL_TARGET_COUNT;}
        })

        tmp.reset(res)

        return tmp;

    },
    getSkillPoint:function(collection){
        var tmp = new SkillList;
        tmp = collection.clone();
        var point = 0

        tmp.each(function(model){
            point += model.get('point');
        })
        return point;
    },
    getTitle:function(){
        var tmp = this.getAllSkillMusic();
        return tmp.pluck('title')
    },
});
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
        this.each(function(model){
            data[i]={
                "name":model.get('title'),
                "x":toDecimalFunc(model.get(x))*1,
                "y":toDecimalFunc(model.get(y))*1
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
    },
    getStrAxis:function(val){
        var res;
        if(val == 0){ res = ['Lv','Point'] };
        if(val == 1){ res = ['Point','達成率'] };
        if(val == 2){ res = ['Lv','達成率'] };
        return res;
    },
    getKeyAxis:function(val){
        var res;
        if(val == 0){ res = ['lv','point'] };
        if(val == 1){ res = ['point','rate'] };
        if(val == 2){ res = ['lv','rate'] };
        return res;
    },
    setAxis:function(val){
        if(val == 0){ this.set( 'axis',['lv','point'] ) };
        if(val == 1){ this.set( 'axis',['point','rate'] ) };
        if(val == 2){ this.set( 'axis',['lv','rate'] ) };
    }

});
var AnalyzeCalcConfig = Backbone.Model.extend({
    defaults:{
        filter:0,
        under:null,
        upper:null,
    }
});

var AnalyzeRecMusic = Backbone.Model.extend({
    defaults:{
        title:'',
        level:0,
        part:'',
        regRate:0,
        scope:''
    },
})
var AnalyzeRecList = Backbone.Collection.extend({
    model:AnalyzeRecMusic,
    comparator:'regRate',
    checkUserOverlap:function(titleList){
        //既にスキル大量にある曲を削除（タイトル判断）
        //collectionからfilterかけたほうがコードはすっきりしそうだけどeachの回数が増えるためtitleからeachする
        this.checkOverlapFunc(titleList);
        return this
    },
    checkThisOverlap:function(){
        //this内での重複チェック
        var titleList = this.pluck('title');
        var minTitleList = titleList.filter(function(val , i , self){
            return self.indexOf(val) === i && i !== self.lastIndexOf(val)
        })
        this.checkOverlapFunc(minTitleList)
        return this;
    },
    checkOverlapFunc:function(titleList){
        var self = this
        var temp;
        $.each(titleList,function(i,d){
            self.remove(
                self.find(function(model){
                    return model.get('title') == d
                })
            )
        })
        
        return self;
    },
    filterPoint:function(hotUnder,oldUnder){
        //FCしても下限に入らないものを削る
        hot = this.where({scope:'hot'});
        old = this.where({scope:'old'});

        hot = _.filter(hot,function(model){
            return model.get('level') * 20 > hotUnder;
        })
        old = _.filter(old,function(model){
            return model.get('level') * 20 > oldUnder;
        })
        this.reset()
        this.add(old,{silent:true})
        this.add(hot,{silent:true})
        return this;
    }
})
var SubCalcSingleAvg = Backbone.Model.extend({
    defaults:{
        total:0,
        filter:0
    },
    math:function(){
        var result;
        var musics = this.get('filter') == 0 ? 50 : 25
        result = this.get('total') / musics
        return result;
    }
})
var subCalcSkillMath = Backbone.Model.extend({
    defaults:{
        lv:0,
        rate:0
    },
    math:function(){
        var result;
        var lv,rate,dicimalFlg,tmp;

        lv = this.get('lv');
        rate = this.get('rate');

        if(lv == '' || rate ==''){
            return null;
        }

        lv = dicimalCheck(lv);
        rate = dicimalCheck(rate);
        if(rate == 10000){
            rate = 1;
        }else{
            rate = parseFloat('0.'+rate);
        }
        result = (lv * 2) * rate / 10
        result = Math.round(result*100)/100;
        return result.toFixed(2);
    }
})
var subCalcRateMathPoint = Backbone.Model.extend({
    defaults:{
        lv:0,
        combo:0,
        perfect:0
    },
    rateMath:function(){
        var result;
        var combo,perfect,great,tmp;

        if(this.get('perfect') == '' || this.get('combo') == ''){
            return null;
        }

        perfect = this.get('perfect')*1;
        combo = this.get('combo')*1;
        great = 100-perfect

        //grが多すぎた場合Missもあると仮定して上限を設ける
        if(great > 10){
            great = 10
        }
        tmp = ( perfect * 85 ) + ( great * 25 )
        result = tmp+(combo*15)
        tmp = result+''
        result = tmp.slice(0,-2)+'.'+tmp.slice(-2)

        return result;
    },
    pointMath:function(){
        //subCalcSkillMath.math()同一
        var result;
        var lv,rate,dicimalFlg,tmp;

        if(this.get('lv') == '' || this.rateMath() == null){
            return null;
        }

        lv = this.get('lv');
        rate = this.rateMath();

        lv = dicimalCheck(lv);
        rate = dicimalCheck(rate);

        if(rate == 10000){
            rate = 1;
        }else{
            rate = parseFloat('0.'+rate);
        }

        result = (lv * 2) * rate / 10
        result = Math.round(result*100)/100;

        return result.toFixed(2);
    }
})