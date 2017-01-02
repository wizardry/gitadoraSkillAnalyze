var React  = require('react');
var $  = require('jquery');

module.exports = class Navigations extends React.Component {
    constructor(props){
        super(props);
    }
    componentWillMount(){
        let self = this;
        this.setState({
            anchorList:[
                {text:'トップ',className:'js-toHome',href:'#',isCurrent:true},
                {text:'使い方',className:'',href:'#guide',isCurrent:false},
                {text:'リンク',className:'',href:'#link',isCurrent:false},
                {text:'ログ',className:'',href:'#news',isCurrent:false},
            ],
            navList:[
                {text:'データ分析',className:'js-toAnalyze',id:'',isCurrent:true , dataValue:'top'},
                {text:'曲一覧<sup>（難易度軸）</sup>',className:'',id:'toMusicListNav',isCurrent:false, dataValue:'musicList'},
                {text:'Lv×達成率 一覧',className:'',id:'toSkillListNav',isCurrent:false, dataValue:'skillList'},
            ],
            windowHeight:this.getNavigationHeight()

        });


        $(window).on('resize', () => {
            self.setState({windowHeight:self.getNavigationHeight()});
        });
    }
    getNavigationHeight(){
        // 100%で取れるので一律100％
        let height = '100%';
        return height;
    }
    navClickHandler(e){
        e.preventDefault();
        let path = $(e.currentTarget).data('value')
        // URLが変わるとSEO面で面倒なので旧URLに合わせる
        let urls = {
            top:'#!analyze',
            musicList:'#!songlist',
            skillList:'#!skillPointList'
        }
        location.hash = urls[path];
        this.props.models.model.viewStateModel.set({
            mode:path,
            path:urls[path]
        });

    }
    anchorHandler(e){
        e.preventDefault();
        let targetId = $(e.currentTarget).attr('href');
        $(window).scrollTop( $(targetId).offset().top )
    }
	render(){
        let anchorListDOM = this.state.anchorList.map((anchor) => {
            let item = <a className={anchor.className} href={anchor.href} onClick={this.anchorHandler.bind(this)} >{anchor.text}</a>
            if(anchor.isCurrent){
                item = <span className={anchor.className} href={anchor.href} onClick={this.anchorHandler.bind(this)}>{anchor.text}</span>
            }
            return( <li key={anchor.text}> {item} </li>);
        });

        let navListDOM = this.state.navList.map((nav) => {
            let current = '';
            if(nav.isCurrent){
                current = 'current';
            }
            return (<li className={current} key={nav.text}>
                <span className={nav.className} id={nav.id} onClick={this.navClickHandler.bind(this)} data-value={nav.dataValue} dangerouslySetInnerHTML={{__html: nav.text}} ></span>
            </li>);
        });


		return (
            <div className="navWrap js-navHeight" style={{height:this.state.windowHeight}}>
                <div className="subNavWrap">
                    <ul>
                        {anchorListDOM}
                    </ul>
                </div>
                <div className="globalNavWrap">
                    <ul>
                        {navListDOM}
                    </ul>
                </div>
                <div className="movePageNav">
                    <ul>
                        <li>
                            <a href="./bookmarklet.html"><span>ブックマークレット</span></a>
                        </li>
                    </ul>
                </div>
                <p className="navTrigger">メニュー</p>
            </div>
        );
	}
}