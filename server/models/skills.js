'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var skillsSchema = new Schema ({
	cat: {
		type: String
	},
	name: {
		type: String
	},
	val: {
		type: String
	}
})

mongoose.model('skills', skillsSchema);