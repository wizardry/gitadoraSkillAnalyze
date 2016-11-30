module.exports = function(){
	var TestModel = require('./model/user');
	var test = new TestModel();
	test.test = 'test2';
	console.log(test);
}