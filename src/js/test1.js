var React  = require('react');
console.log(React);

var $ = require('jquery');
console.log($);

// var Config  = require('./config');
// import Config from './config';
// console.log(Config);
// console.log(URLS);
if(typeof Symbol === "function" && typeof Symbol() === "symbol"){
	console.log(0)
}else{
	console.log(1)
}
// import UserModelClass from './model/user.js';
var UserModel = require('./model/user');
var userModel = new UserModel();
userModel.model.set({test:1});
console.log(userModel);

var testModel = UserModel.call();
console.log(testModel)


