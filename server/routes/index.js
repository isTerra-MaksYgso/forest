var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');

router.get('/', function(req, res) {
	res.render('index');
});

router.post('/submit', function(req, res) {
	if (!req.body.login || !req.body.password) {
		return res.json({status: 'Укажите логин и пароль'});
	}

	var Model = mongoose.model('user');
	var password = crypto.createHash('md5').update(req.body.password).digest('hex');
	Model.findOne({login: req.body.login, password: password}).then(item => {
		if(!item) {
			res.json({status: 'Логин или/и пароль указаны неверно!'});
		} else {
			req.session.isAdmin = true;
			res.redirect('/admin');
			res.json({status: 501});
		}
	});
});

router.post('/del', (req, res) => {
	req.session.isAdmin = false;
	req.session.destroy();
	res.json({status: 502});
});

module.exports = router;