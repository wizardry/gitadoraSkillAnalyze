var React  = require('react');
var ReactDOM  = require('react-dom');

// var $ = require('jquery');
// var pluginXdmain = require('./lib/jquery.xdomainajax');
// var pluginCookie = require('./lib/jquery.cookie');
// pluginXdmain();

let Models = require('./model/app');
let models = new Models();

var View = require('./view/app');
var domready = require('domready')
domready(function(){
	ReactDOM.render(
		<View models={models} />,
		document.getElementById('reactRender')
	)
});