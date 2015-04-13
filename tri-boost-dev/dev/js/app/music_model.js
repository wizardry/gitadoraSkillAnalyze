var MusicConfig = Backbone.Model.extend({
    defaults:{
        type:'g',
        select:'',
        sortVector:0,
        scope:'',
        filter:[]
    },
})
var MusicData = Backbone.Model.extend({
    defaults:{
        scope:'',
        title:'',
        lv:0,
        part:'',
        type:'',
    }
})
var MusicList = Backbone.Collection.extend({
    model:MusicData,
    comparator:'lv',
    getList:function(config){
        // type:'g'
        // select:''
        // sortVector:0
        // filter:[]

    }

})
;
