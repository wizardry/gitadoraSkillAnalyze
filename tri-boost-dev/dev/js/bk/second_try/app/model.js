/* Modelやグローバル関数
Music
UserForm
SkillMusic
SkillUser
MusicList
SkillList
Calc
*/


AJAX_URL_BASE = 'http://xv-s.heteml.jp/skill/'
SKILL_URL = AJAX_URL_BASE+'gdod.php?uid='

var UserForm = Backbone.Model.extend({
    default:{
        id:"",
        part:"",
    },

});

var SkillMusic = Backbone.Model.extend({
    default:{
        title:"",
        lv:0,
        part:'',
        rate:0,
        point:0,
        rank:"",
        scope:"",
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
});
var SkillUser = Backbone.Model.extend({
    default:{
        oldSkill:0,
        hotskill:0,
        skillPoint:0
    }
});
var SkillList = Backbone.Collection.extend({
    default:{
        model:SkillMusic,
        comparator:'scope',
        targetLimit:true
    },
    getTargetSkill:function(){
        var hot = _.where(this,{scope:'hot'});
        _.sortBy(hot,'point');
        _.first(hot,25)

        var old = _.where(this,{scope:'old'});
        _.sortBy(old,'point');
        _.first(old,25)

        var hotold = hot.concat(old);
        return hotold;
        
    }
});

var Music = Backbone.Model.extend({});
var MusicList = Backbone.Collection.extend({});

var Calc = Backbone.Model.extend({});
