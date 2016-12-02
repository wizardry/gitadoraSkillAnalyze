var React  = require('react');
var $ = require('jquery');

module.exports = class ScrapingFormView extends React.Component {
	constructor(props){
		super(props);
	}
	submitHandler(e){
		e.preventDefalut();
		console.log('submit');
	}
	render(){
		return (
            <div className="globalFooter">
                <div className="footerInner">
                    <p className="globalFooterCopyright">
                        <em>GITADORA Skill Analyze</em> copyright by GITADORA Skill Analyze
                    </p>
                </div>
            </div>
        );
	}
}