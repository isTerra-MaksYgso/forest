'use strict';

var config = require('./config.json');
var mongoose = require('mongoose');
var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout});
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://MK-admin:qwertypion114MK@ds129720.mlab.com:29720/mk-test-db');

var login = '',
	password = '';

rl.question('login: ', answer => {
	login = answer;

	rl.question('password: ', answer => {
		password = answer;

		rl.close();
	});
});

rl.on('close', () => {
	require('./models/user');

	var User = mongoose.model('user'),
	adminUser = new User({login: login, password: password});

	User.findOne({login: login}).then(u => {
		if(u) {
			throw new Error('Такой пользователь уже существует!');
		}

		return adminUser.save();
	})
	.then(u => console.log('O.K.'), e => console.error(e.message))
	.then(() => process.exit(0));
});