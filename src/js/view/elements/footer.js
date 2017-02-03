var React  = require('react');
var $ = require('jquery');

module.exports = class ScrapingFormView extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
            <div className="globalFooter">
                <div className="footerInner">
                    <p className="globalFooterCopyright">
                        <em>GITADORA Skill Analyze</em> copyright by GITADORA Skill Analyze / Developper is <a href="https://twitter.com/wiz_rein" target="_blank">@wiz_rein</a>
                    </p>
                </div>
            </div>
        );
	}
}