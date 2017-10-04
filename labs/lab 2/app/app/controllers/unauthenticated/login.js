var express = require('express');
var router = express.Router();

var text = require('../../shared/text');
var user = require('../../models/user');

router.get('', function (req, res) {
    if (req.session && req.session.user && !req.session.secondFactor) {
        res.render('unauthenticated/secondFactor');
    } else {
        res.render('unauthenticated/login');
    }
});

router.post('', function (req, res) {
    if (req.session != null && req.session.user != null && req.session.secondFactor) {
        res.redirect('/dashboard');
    } else if (req.session && req.session.user && !req.session.secondFactor) {
        if (parseInt(req.body.secondFactor) == req.session.secondFactorCode && req.body.action == "login") {
            req.session.secondFactor = true;
            res.redirect('/dashboard');
        } else if (req.body.action == "resend") {
            text.message(req.session.secondFactorCode, req.session.user.phone);
            res.redirect('/register')
        } else if (req.body.action == "cancel") {
            req.session.destroy(function (err) {
                res.redirect("/");
            });
        } else {
            res.render('unauthenticated/secondFactor', {
                error: 'Invalid second factor code'
            });
        }
    } else {
        user.authenticate(req.body).then(function (result) {
            req.session.user = result;
            req.session.secondFactorCode = Math.random().toString().slice(2,8);;
            req.session.secondFactor = false;
            text.message(req.session.secondFactorCode, req.session.user.phone);
            res.redirect('/login');
        }, function (error) {
            console.log(error);
            res.render('unauthenticated/login', {
                error: error.error
            })
        });
    }
});

module.exports = router;
