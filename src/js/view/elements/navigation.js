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
                {text:'データ分析',className:'js-toAnalyze',id:'',isCurrent:true},
                {text:'曲一覧<sup>（難易度軸）</sup>',className:'',id:'toMusicListNav',isCurrent:false},
                {text:'Lv×達成率 一覧',className:'',id:'toSkillListNav',isCurrent:false},
            ],
            windowHeight:this.getWindowHeight()

        });


        $(window).on('resize', () => {
            console.log(0,self,self.getWindowHeight());
            self.setState({windowHeight:self.getWindowHeight()});
        });
    }
    getWindowHeight(){
        console.log(1,$(window).height());

        return $(window).height();
    }
    navClickHandler(e){
        e.preventDefault();
        console.log('nav click handler');
    }
	render(){
        console.log(this.state.anchorList)
        let anchorListDOM = this.state.anchorList.map((anchor) => {
            console.log(anchor);
            let item = <a className={anchor.className} href={anchor.href}>{anchor.text}</a>
            if(anchor.isCurrent){
                item = <span className={anchor.className} href={anchor.href}>{anchor.text}</span>
            }
            return( <li key={anchor.text}> {item} </li>);
        });

        let navListDOM = this.state.navList.map((nav) => {
            let current = '';
            if(nav.isCurrent){
                current = 'current';
            }
            return (<li className={current} key={nav.text}>
                <span className={nav.className} id={nav.id} onClick={this.navClickHandler} dangerouslySetInnerHTML={{__html: nav.text}} ></span>
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