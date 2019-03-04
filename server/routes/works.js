var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config');
var smtpTransport = require('nodemailer-smtp-transport');
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
	var obj = {};
	var Model = mongoose.model('pic');
	Model.find().then(pics => {
		Object.assign(obj, {pics: pics});
		res.render('works', obj);
	}).catch(function (err){
		console.log(err);
		throw err;
	});
});


router.post('/', function (req, res) {
	if (!req.body.name || !req.body.email || !req.body.text) {
		return res.json({status: "please give me your data"});
	}

	var transporter = nodemailer.createTransport(smtpTransport({
		service: 'gmail',
		auth: {
			user: config.mail.user,
			pass: config.mail.pass
		}
	}));

	var mailOptions = {
		from: req.body.email,
		to: config.mail.user,
		subject: config.mail.subject,
		text: req.body.name + "\n\n" + "Email: " + req.body.email + "\n\n" + req.body.text.trim().slice(0, 500)
	};
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
			return res.json({status: 'При отправке письма произошла ошибка'});
		}
		res.json({status: 'письмо успешно отправлено'});
	});
});

module.exports = router;