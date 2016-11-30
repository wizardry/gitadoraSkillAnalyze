var React  = require('react');
var ReactDOM  = require('react-dom');
console.log(React);
console.log(ReactDOM);

var $ = require('jquery');
console.log($);

let Models = require('./model/app');
let models = new Models();
console.log(models) ;

class JSXTest extends React.Component {
	render() {
		// return React.createElement('div',null,'hello');
		return (<div>hello</div>);
	}
}
// var View = require('./view/app');
console.log(JSXTest)
var domready = require('domready')
domready(function(){

	ReactDOM.render(
		<JSXTest />,
		document.getElementById('masterView')
	)
});