var SkillListView = Backbone.View.extend({
    el:'#skillListView',
    constructor: function() {
        if (!SkillListView.instance) {
            SkillListView.instance = this;
            Backbone.View.apply(SkillListView.instance, arguments);
        }
        return SkillListView.instance;
    },
    events:{
        "submit #skillForm":"submit"
    },
    model:{
        'config':new SkillConfig()
    },
    collection:{

    },
    initialize:function(){
        this.formView = new SkillFormView({
            model:{
                config:this.model.config
            }
        });
        this.listView = new SkillOutputView({
            model:{
                config:this.model.config
            }
        });
        this.formView.cookieLoad();

    },
    submit:function(e){
        e.preventDefault();
        this.formView.setConfigData();
        this.listView.render();
    }

})
var SkillFormView = Backbone.View.extend({
    el:'#skillFormView',
    setConfigData:function(){
        var threshold;
        threshold = $('#skillListThreshold').val() == '' ? undefined : $('#skillListThreshold').val()*1;
        this.model.config.set('startLv',$('#skillListLevelMin').val()*1);
        this.model.config.set('endLv',$('#skillListLevelMax').val()*1);
        this.model.config.set('startRate',$('#skillListRateMin').val()*1);
        this.model.config.set('endRate',$('#skillListRateMax').val()*1);
        this.model.config.set('drawType',$('#skillListGenType').val()*1);
        this.model.config.set('threshold',threshold);
        this.cookieWraite()
    },
    cookieWraite:function(){
        $.cookie('skillView',JSON.stringify(this.model.config))
    },
    cookieLoad:function(){
        var self = this;
        var cookie = $.cookie('skillView')
        if(cookie != undefined){
            var cookie = JSON.parse($.cookie('skillView'))
            $.each(cookie,function(key,val){
                switch (key){
                    case 'startLv':
                        $('#skillListLevelMin').val(val)
                    break;
                    case 'endLv':
                        $('#skillListLevelMax').val(val)
                    break;
                    case 'startRate':
                        $('#skillListRateMin').val(val)
                    break;
                    case 'endRate':
                        $('#skillListRateMax').val(val)
                    break;
                    case 'threshold':
                        $('#skillListThreshold').val(val)
                    break;
                    case 'drawType':
                        $('#skillListGenType').val(val)
                    break;
                }
            })
        }
    }
})
var SkillOutputView = Backbone.View.extend({
    el:'#skillOutputView',
    render:function(){
        if( this.model.config.get('drawType') == 1 || this.model.config.get('drawType') == 0 ){
            $('#skillOutput').html(this.nodeGenType1_2())
        }
    },
    math:function(){
        var range={};

        range['lv'] = _.range(this.model.config.get('startLv'),this.model.config.get('endLv')+1);
        range['rate'] = _.range(this.model.config.get('startRate'),this.model.config.get('endRate')+1);
        range['math'] = function(lv,rate){
            var tmp;
            tmp = Math.round( (lv*2) * (rate / 100) * 100 ) / 100
            return ( tmp ).toFixed(2)
        }

        return range;
    },
    nodeGenType1_2:function(){
        var masterData = this.math();
        var data = [];
        var threshold = this.model.config.get('threshold');
        var genType = this.model.config.get('drawType');
        var nodeText = {
            title:'',
            keys:'',
            xkey:'',
            ykey:''
        }
        var node = '';
        var temp;
        if(genType == 0){
            data[0] = masterData.rate;
            data[1] = masterData.lv;
            nodeText.title = function(int){return 'Lv： '+int+' 台';}
            nodeText.keys = 'Lv/達成率';
            nodeText.xkey = function(int){ return int+'%';}
            nodeText.ykey = function(int){ return 'Lv'+int;}
        }else if(genType == 1){
            data[0] = masterData.lv;
            data[1] = masterData.rate;
            nodeText.title = function(int){return '達成率： '+int+' %';}
            nodeText.keys = '達成率/Lv';
            nodeText.xkey = function(int){ return 'Lv'+int;}
            nodeText.ykey = function(int){ return int+'%';}
        };
        var size = data[1].length

        $.each(data[1],function(yi,yd){
            if(yd % 5 == 0 || yi == 0){
                node += '<h2><b>'+nodeText.title(yd)+'</b></h2>\n';
                node += '<table>\n';
                $.each(data[0],function(xi,xd){
                    if(xi == 0 ){
                        node += '<th>'+nodeText.keys+'</th>'
                        node += '<th>'+nodeText.xkey(xd)+'</th>'
                    }else if( xi != 0 ){
                        node += '<th>'+nodeText.xkey(xd)+'</th>'
                    }
                })
            }

            node += '<tr>\n';

            $.each(data[0],function(xi,xd){
                if( xi == 0){
                    node += '<th>'+nodeText.ykey(yd)+'</th>'
                }
                temp = masterData.math(xd,yd);
                if(temp >= threshold){
                    node += '<td class="threshold">'+temp+'pt</td>';
                }else{
                    node += '<td>'+temp+'pt</td>';
                }
            })

            node += '</tr>'
            if(yd % 5 == 4 || yi == size-1){
                node += '</table>'
            }
        })
        return node;
    },

})