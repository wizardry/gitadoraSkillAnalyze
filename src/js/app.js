var React  = require('react');
var ReactDOM  = require('react-dom');
console.log(React);
console.log(ReactDOM);

var $ = require('jquery');
console.log($);

let Models = require('./model/app');
let models = new Models();
console.log(models) ;

var View = require('./view/app');
var domready = require('domready')
domready(function(){
	ReactDOM.render(
		<View />,
		document.getElementById('reactRender')
	)
});