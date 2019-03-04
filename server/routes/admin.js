var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var config = require('../config.json');
var mongoose = require('mongoose');

var isLoggedIn = (req, res, next) => {
	if (req.session.isAdmin) {
    	return next();
	}

	res.redirect('/');
};

router.get('/', isLoggedIn, function(req, res, next) {
	var obj = {};
	var Model = mongoose.model('skills');
	Model.find().then(skills => {
		Object.assign(obj, {skills: skills});
		res.render('admin', obj);
	}).catch(function (err){
		console.log(err);
		throw err;
	});
});

router.post('/fileUp', isLoggedIn, function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = config.upload;
	form.parse(req, function (err, fields, files) {

		if (err) return res.json({status: 'Не удалось загрузить картинку'});
		if (!fields.name || !fields.tech) return res.json({status: 'Не указано данные проекта'});

		var Model = mongoose.model('pic');

		fs.rename(files.photo.path, path.join(config.upload, files.photo.name), function (err) {
			if (err) {
				fs.unlink(path.join(config.upload, files.photo.name));
				fs.rename(files.photo.path, files.photo.name);
			}
			var dir = config.upload.substr(config.upload.indexOf('/'));

			var item = new Model({name: fields.name, tech: fields.tech, picPath: 'upload/'+files.photo.name});
			item.save().then(
				i => res.json({status: 'картинка успешно загружена'}),
				e => res.json({status: e.message})
			);
		});
	});
});

router.post('/blogAddArticle', isLoggedIn, function(req, res) {
	if (!req.body.name || !req.body.date || !req.body.text) {
		return res.json({status: 'Укажите данные'});
	}
	var Model = mongoose.model('blog');
	var item = new Model({title: req.body.name, date: req.body.date, text: req.body.text,});
	item.save().then(
		i => {
			return res.json({status: 'Запись успешно добавлена'});
		},
		e => {
			var error = Object
				.keys(e.errors)
				.map(key => e.errors[key].message)
				.join(', ');
			res.json({status: 'При добавлении записи произошла ошибка: ' + error});
		}
	);
});

router.post('/skills', isLoggedIn, function (req, res) {
	var Model = mongoose.model('skills');
	var skillsArray = JSON.parse(req.body.skillsArray);
	/*for (var i = 0; i < skillsArray.length; i++) {
		var item = new Model({cat: skillsArray[i].cat, name: skillsArray[i].title, val: skillsArray[i].val});
		item.save().then(
			i => {return res.json({status: 'Значение скила успешно добавленно'})},
			e => {res.json({status: 'При добавлении скилов произошла ошибка.'})}
		);
	}*/
	for (var i = 0; i < skillsArray.length; i++) {
		var item = new Model({cat: skillsArray[i].cat, name: skillsArray[i].title, val: skillsArray[i].val});
		Model.update({cat: skillsArray[i].cat, name: skillsArray[i].title, val: skillsArray[i].val}, {upsert: true})
		.then(
			i => {return res.json({status: 'Значение скила успешно обновленно'})},
			e => {res.json({status: 'При обновлении скилов произошла ошибка.'})}
		);
	}
});

module.exports = router;