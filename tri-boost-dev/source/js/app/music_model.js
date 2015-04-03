var MusicConfig = Backbone.Model.extend({
    defaults:{
        type:'g'
        select:''
        sortVector:0
        filter:[]
    },
})
var MusicData = Backbone.Model.extend({
    defaults:{
        scope:'',
        title:'',
        part:'',
        lv:0
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