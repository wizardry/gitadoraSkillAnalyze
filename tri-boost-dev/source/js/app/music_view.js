var MusicListView = Backbone.View.extend({
    el:'#musicListView',
    constructor: function() {
        if (!MusicListView.instance) {
            MusicListView.instance = this;
            Backbone.View.apply(MusicListView.instance, arguments);
        }
        return MusicListView.instance;
    },
    events:{
        'change #musicListSaveToLocal':'cookieSave',
        'submit #musicListConfigForm':'useAjax',
        'submit #musicListDrawForm':'listRender',
    },
    model:{
        "config" : new MusicConfig(),
        "music" : new MusicData(),
    },
    collection:{
        "list" : new MusicList(),
    },
    initialize:function(){
        this.formView = new MusicFormView({
            model:{
                config:this.model.config,
                music:this.model.music,
            },
            collection:{
                list:this.collection.list
            }
        });
        this.listView = new MusicOutputView({
            model:{
                config:this.model.config,
                music:this.model.music,
            },
            collection:{
                list:this.collection.list
            }
        })

        this.listenTo(this.collection.list,'add',this.toListReady);

         if($.cookie('useLocal') != undefined ){
            if($.cookie('useLocal') == 'false'){
                $('#musicListSaveToLocal').prop('checked',false)
            }else{
                $('#musicListSaveToLocal').prop('checked',true)
            }
         }
    },
    toListReady:function(){
        this.listView.ready()
        this.formView.localSet()
    },
    loadDataFunc:function(){
        if(localStorage.getItem('musiclist') == undefined || $.cookie('useLocal') == 'false'){
            //ajax
            this.useAjax();
        }else{
            this.useLocalStorage();
        }
    },
    useAjax:function(e){
        this.collection.list.reset();
        loader(true)
        this.formView.loadFunc(e);
    },
    useLocalStorage:function(){
        this.collection.list.reset();
        this.formView.localLoad();
    },
    cookieSave:function(){
        $.cookie('useLocal',$('#musicListSaveToLocal').prop('checked'))
    },
    listRender:function(e){
        e.preventDefault();
        this.formView.setFormData();
        this.listView.render();
        return false
    }

})
var MusicFormView = Backbone.View.extend({
    el:'#musicFormView',
    loadFunc:function(e){
        localStorage.clear();
        this.getMusicData();
    },
    setFormData:function(e){
        e.preventDefault();
        var self = this;
        var filter = [];
        var vector = 0;

        $('[name="musicListPartFilters"]').each(function(){
            if(!$(this).prop('checked')){
                filter.push(MUSIC_LIST_CHECK[$(this).val()])
            }
        })

        if($('#musicListSortVector').prop('checked')){
            vector = 1;
        }
        
        this.model.config.set( 'type',$('#musicListType').val() )
        this.model.config.set( 'select',$('#musicListLv').val() )
        this.model.config.set( 'sortVector', vector)
        this.model.config.set( 'scope',$('#musicListScopeFilter').val() )
        this.model.config.set( 'filter',filter)
    },
    getMusicData:function(){
        //http://xv-s.heteml.jp/skill/music_gdod.php?k=new
        //http://xv-s.heteml.jp/skill/music_gdod.php?k=old
        var self = this;
        var musiclistFile = 'music_gdod.php';
        var ajaxOp1 ={
            type:'GET',
            async:true,
            url:AJAX_URL_BASE+musiclistFile+'?k=new',
            dataType:'html',
            cache:false
        }
        var ajaxOp2 ={
            type:'GET',
            async:true,
            url:AJAX_URL_BASE+musiclistFile+'?k=old',
            dataType:'html',
            cache:false
        }
        $.when(
            $.ajax(ajaxOp1),
            $.ajax(ajaxOp2)
        ).pipe(function(hotList,oldList){
            self.collection.list.reset();
            loader(false)
            self.setMusicData(hotList,false)
            self.setMusicData(oldList,true)
            //oldLListのsetMusicDataが終わるとcollectionのListenToからthis.draw()発火
        },function(){
            alert('接続に失敗しました。\n接続状況を見直し再度試みてください。');
        })
    },
    setMusicData:function(res,flg){
        var master = '<div>' + res[0].results + '</div>'
        var self = this;
        var scope = 'hot';
        var tmpList=[];
        var poptmp;
        if(flg) scope = 'old'

        $(master).find('table').eq(1).find('tr').not(':first-child,:nth-child(2)').each(function(i,d){
            var $d = $(d);
            var musicdata = [
                [$d.find('td').eq(2).text(),'BSC-D','d'],
                [$d.find('td').eq(3).text(),'ADB-D','d'],
                [$d.find('td').eq(4).text(),'EXT-D','d'],
                [$d.find('td').eq(5).text(),'MAS-D','d'],
                [$d.find('td').eq(6).text(),'BSC-G','g'],
                [$d.find('td').eq(7).text(),'ADV-G','g'],
                [$d.find('td').eq(8).text(),'EXT-G','g'],
                [$d.find('td').eq(9).text(),'MAS-G','g'],
                [$d.find('td').eq(10).text(),'BSC-B','g'],
                [$d.find('td').eq(11).text(),'ADV-B','g'],
                [$d.find('td').eq(12).text(),'EXT-B','g'],
                [$d.find('td').eq(13).text(),'MAS-B','g'],
            ]
            $.each(musicdata,function(ii,dd){
                if( dd[0].indexOf('.') != -1){//undefinedのものは処理しない。
                    musicdata[ii][0] = parseInt(dd[0].replace('.',''));
                    var tmp = {
                        scope:scope,
                        title:$d.find('td').eq(0).text(),
                        lv:dd[0],
                        part:dd[1],
                        type:dd[2]
                    }
                    tmpList.push(tmp)
                }

            })
        })
        if(flg){
            poptmp = tmpList.pop();
            this.collection.list.add(tmpList,{silent:true});
            this.collection.list.add(poptmp,{silent:false});
        }else{
            this.collection.list.add(tmpList,{silent:true});
        }
    },
    localSet:function(){
        if($('#musicListSaveToLocal').prop('checked')){
            localStorage.setItem('musiclist',JSON.stringify(this.collection.list));
        }
    },
    localLoad:function(){
        var musicList = JSON.parse(localStorage.getItem('musiclist'));
        var popList = musicList.pop();
        var self = this;
        this.collection.list.reset(musicList,{silent:true});
        this.collection.list.add(popList,{silent:false})
    }
})
var MusicOutputView = Backbone.View.extend({
    el:'#musicOutputView',
    events:{
    },
    ready:function(){
        //loader解除
    },
    render:function(){
        var list = this.getListData();
        var node =''
        var classname="";
        var lvText='';

        $.each(list,function(i,d){
            classname = d.get('part').slice(0,3).toLowerCase();
            lv = toDecimalFunc(d.get('lv'))
            node += '<tr class="'+classname+'">';
            node += '<td class="musicScope">'+d.get('scope')+'</td>'
            node += '<td class="musicTitle">'+d.get('title')+'</td>'
            node += '<td class="musicPart">'+d.get('part')+'</td>'
            node += '<td class="musicLv">'+lv+'</td>'
            node += '</tr>';
        })
        $('#musicOutputView table tbody').html(node);
    },
    getListData:function(){
        var self = this;
        var list,scope,filter;
        //対象曲とギタ/ドラタイプでフィルタリング
        if (this.model.config.get('scope') != "0"){
            scope = this.model.config.get('scope') == "1" ? 'hot' : 'old';
            list = this.collection.list.where({
                'type':this.model.config.get('type'),
                'scope':scope
            });
        }else{
            list = this.collection.list.where({
                'type':this.model.config.get('type'),
            });
        }

        filter = (self.model.config.get('select')*1)-1 // レベル帯。MUSIC_LIST_SELECTのindexをいれる。
        list = _.filter(list,function(v,i,o){
            return v.get('lv') >= MUSIC_LIST_SELECT[filter][0] && v.get('lv') <= MUSIC_LIST_SELECT[filter][1]
        })

        $.each(this.model.config.get('filter'),function(i,d){
            list = _.reject(list,function(v){
                return v.get('part') == d
            })
        })

        _.sortBy(list,function(model){
            return model.get('lv');
        })
        if(this.model.config.get('sortVector') != 0){
            list.reverse()
        }
        return list;
    }
})