'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PicSchema = new Schema ({
	name: {
		type: String,
		required: [true, 'Укажите описание картинки']
	},
	tech: {
		type: String,
		required: [true, 'Укажите технологии']
	},
	picPath: {
		type: String
	},
	picture: {
		type: String
	}
})

mongoose.model('pic', PicSchema);