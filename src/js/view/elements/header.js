var React  = require('react');
module.exports = class HeaderView extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
            <div className="globalHeader">
                <div className="globalHeaderLogos js-toHome">
                    <img alt="GITADORA SKILL ANALYZE" src="img/logo.png" />
                    <p className="logoCopy">
                        GITADORA Skill Analyze は GITADORA シリーズ の スキル解析や計算をサポートしてスキル アナライズします。
                    </p>
                </div>
            </div>
        );
	}
}