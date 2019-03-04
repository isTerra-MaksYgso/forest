'use strict';
var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	login: {
		type: String,
		require: [true, 'Please enter the login']
	},
	password: {
		type: String,
		require: [true, 'Please enter the password'],
		set: v => v == ''
			? v
			: crypto
				.createHash('md5')
				.update(v)
				.digest('hex')
	}
});

mongoose.model('user', UserSchema);