'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BlogSchema = new Schema ({
	title: {
		type: String,
		required: [true, 'Укажите заголовок статьи']
	},
	date: {
		type: String,
		required: [true, 'Укажите дату публикации']
	},
	text: {
		type: String,
		required: [true, 'Укажите содержимое статьи']
	}
});

mongoose.model('blog', BlogSchema);