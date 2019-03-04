var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res) {
	var obj = {};
	var Model = mongoose.model('blog');
	Model.find().then(articles => {
		Object.assign(obj, {articles: articles});
		res.render('blog', obj);
	}).catch(function (err){
		console.log(err);
		throw err;
	});
});

module.exports = router;