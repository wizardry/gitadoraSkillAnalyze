var React  = require('react');
var $ = require('jquery');

var ScrapingForm = require('./scrapingForm');

module.exports = class TopView extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<ScrapingForm />
		);		
	}
}