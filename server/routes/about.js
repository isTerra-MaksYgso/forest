var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
	var obj = {};
	var Model = mongoose.model('skills');
	Model.find().then(skills => {
		Object.assign(obj, {skills: skills});
		res.render('about', obj);
	}).catch(function (err){
		console.log(err);
		throw err;
	});
});

module.exports = router;