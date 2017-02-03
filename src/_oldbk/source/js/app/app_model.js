//グローバル
var AJAX_URL_BASE = {
    'xv-od':'http://xv-s.heteml.jp/skill/',
    'mimi-tb':'http://tri.gfdm-skill.net/'
}
var SKILL_URL = {
        'xv-od':AJAX_URL_BASE['xv-od']+'gdod.php?uid=',
        'mimi-tb':AJAX_URL_BASE['mimi-tb']+'users/'
    };
var SKILL_TARGET_COUNT=25;

var AVG_LIST = { 
    'xv-od':{
        g:[{skill:9000 ,userId:180 },{skill:8900 ,userId:179 },{skill:8800 ,userId:178 },{skill:8700 ,userId:177 },{skill:8600 ,userId:176 },{skill:8500 ,userId:175 },{skill:8400 ,userId:174 },{skill:8300 ,userId:173 },{skill:8200 ,userId:172 },{skill:8100 ,userId:171 },{skill:8000 ,userId:170 },{skill:7900 ,userId:169 },{skill:7800 ,userId:168 },{skill:7700 ,userId:167 },{skill:7600 ,userId:166 },{skill:7500 ,userId:165 },{skill:7400 ,userId:164 },{skill:7300 ,userId:163 },{skill:7200 ,userId:162 },{skill:7100 ,userId:161 },{skill:7000 ,userId:160 },{skill:6900 ,userId:159 },{skill:6800 ,userId:158 },{skill:6700 ,userId:157 },{skill:6600 ,userId:156 },{skill:6500 ,userId:155 },{skill:6400 ,userId:154 },{skill:6300 ,userId:153 },{skill:6200 ,userId:152 },{skill:6100 ,userId:151 },{skill:6000 ,userId:150 },{skill:5900 ,userId:149 },{skill:5800 ,userId:148 },{skill:5700 ,userId:147 },{skill:5600 ,userId:146 },{skill:5500 ,userId:145 },{skill:5400 ,userId:144 },{skill:5300 ,userId:143 },{skill:5200 ,userId:142 },{skill:5100 ,userId:141 },{skill:5000 ,userId:140 },{skill:4900 ,userId:139 },{skill:4800 ,userId:138 },{skill:4700 ,userId:137 },{skill:4600 ,userId:136 },{skill:4500 ,userId:135 },{skill:4400 ,userId:134 },{skill:4300 ,userId:133 },{skill:4200 ,userId:132 },{skill:4100 ,userId:131 },{skill:4000 ,userId:130 },{skill:3900 ,userId:129 },{skill:3800 ,userId:128 },{skill:3700 ,userId:127 },{skill:3600 ,userId:126 },{skill:3500 ,userId:125 },{skill:3400 ,userId:124 },{skill:3300 ,userId:123 },{skill:3200 ,userId:122 },{skill:3100 ,userId:121 },{skill:3000 ,userId:120 }] ,
        d:[{skill:9000 ,userId:180 },{skill:8900 ,userId:179 },{skill:8800 ,userId:178 },{skill:8700 ,userId:177 },{skill:8600 ,userId:176 },{skill:8500 ,userId:175 },{skill:8400 ,userId:174 },{skill:8300 ,userId:173 },{skill:8200 ,userId:172 },{skill:8100 ,userId:171 },{skill:8000 ,userId:170 },{skill:7900 ,userId:169 },{skill:7800 ,userId:168 },{skill:7700 ,userId:167 },{skill:7600 ,userId:166 },{skill:7500 ,userId:165 },{skill:7400 ,userId:164 },{skill:7300 ,userId:163 },{skill:7200 ,userId:162 },{skill:7100 ,userId:161 },{skill:7000 ,userId:160 },{skill:6900 ,userId:159 },{skill:6800 ,userId:158 },{skill:6700 ,userId:157 },{skill:6600 ,userId:156 },{skill:6500 ,userId:155 },{skill:6400 ,userId:154 },{skill:6300 ,userId:153 },{skill:6200 ,userId:152 },{skill:6100 ,userId:151 },{skill:6000 ,userId:150 },{skill:5900 ,userId:149 },{skill:5800 ,userId:148 },{skill:5700 ,userId:147 },{skill:5600 ,userId:146 },{skill:5500 ,userId:145 },{skill:5400 ,userId:144 },{skill:5300 ,userId:143 },{skill:5200 ,userId:142 },{skill:5100 ,userId:141 },{skill:5000 ,userId:140 },{skill:4900 ,userId:139 },{skill:4800 ,userId:138 },{skill:4700 ,userId:137 },{skill:4600 ,userId:136 },{skill:4500 ,userId:135 },{skill:4400 ,userId:134 },{skill:4300 ,userId:133 },{skill:4200 ,userId:132 },{skill:4100 ,userId:131 },{skill:4000 ,userId:130 },{skill:3900 ,userId:129 },{skill:3800 ,userId:128 },{skill:3700 ,userId:127 },{skill:3600 ,userId:126 },{skill:3500 ,userId:125 },{skill:3400 ,userId:124 },{skill:3300 ,userId:123 },{skill:3200 ,userId:122 },{skill:3100 ,userId:121 },{skill:3000 ,userId:120 }] 
    },
    'mimi-tb':{
        none:true
    }
}
var MUSIC_LIST_SELECT = {
    16:[950,999],15:[900,949],14:[850,899],13:[800,849],12:[750,799],11:[700,749],10:[650,699],9:[600,649],8:[550,599],7:[500,549],
    6:[450,499],5:[400,449],4:[350,399],3:[300,349],2:[250,299],1:[150,199],0:[100,149],17:[100,999],
}
var MUSIC_LIST_CHECK = {0:'BSC-D', 1:'ADV-D', 2:'EXT-D', 3:'MAS-D', 4:'BSC-G', 5:'ADV-G', 6:'EXT-G', 7:'MAS-G', 8:'BSC-B', 9:'ADV-B', 10:'EXT-B', 11:'MAS-B', }

//int/100の小数にして返す
var toDecimalFunc = function(int){
    var str = [int+''];
    str[1]= str[0].slice(0,-2);
    str[2]= str[0].slice(-2);
    return str[1]+'.'+str[2];
}
//小数を持っているかチェックして小数無しにして返す。
var dicimalCheck = function(str){
    var tmp
    if(str.indexOf('.') != -1){
        tmp = str.split('.');
        if(tmp[1].length == 1 ){
            str = parseInt(tmp[0]+tmp[1]+'0')
        }else{
            str = parseInt(tmp[0]+tmp[1])
        }
    }else{
        str = parseInt(str) *100
    }
    return str;
}
//loader処理
function loader(boo){
    if(boo){
        $('.loader').fadeIn(300);
    }else{
        $('.loader').fadeOut(300);
    }
    
}
//出し分け処理 CSSがメディアクエリーなので、それに合わせUAではなく端末サイズで取る。
function isSPFunc(){
    var windowWidth = $(window).width();
    if(windowWidth <= 720){
        return true;
    }else{
        return false;
    }
}
var isSP = isSPFunc();
$(window).resize(function(e){
    isSP = isSPFunc();
})


//----------------------------graph
var graphOp = function(datas,yKey,xKey){
    var option = {
        chart:{
            type:'scatter'
            ,zoomType:'xy'
        },title: {
            text:yKey+' × '+ xKey
        },subtitle:{
            text:''
        },xAxis:{
            title:{
                enabled: true
                ,title:xKey
            },startOnTick:true
            ,endOnTick:true
            ,showLastLavel:true
        },yAxis:{
            title:{text:yKey}
        },legend:{
            layout:'vertical'
            ,align:'right'
            ,verticalAlign:'top'
            ,x:5
            ,y:5
            ,floating:true
            ,backgroundColor:('#ccc')
            ,borderWidth:2
        },plotOptions:{
            scatter:{
                marker:{
                    radius:8
                    ,states:{
                        hover:{
                            enabled:true
                            ,lineColor:'rgb(100,100,100)'
                        }
                    }
                }
                ,states:{
                    hover:{
                        marker:{
                            enabled:true
                        }
                    }
                }
                ,tooltip:{
                    headerFormat:'{series.name} | {point.key}<br>'
                    ,pointFormat: yKey+'{point.y} | '+xKey+'{point.x}'
                }
            }
        },
        series:[{
                name:'HOT'
                ,color:'rgba(233,83,83,.5)'
                ,data:datas.hot
            },{
                name:'OLD'
                ,color:'rgba(119, 152, 191, .5)'
                ,data:datas.old
            }
        ]
    }
    return option;
}