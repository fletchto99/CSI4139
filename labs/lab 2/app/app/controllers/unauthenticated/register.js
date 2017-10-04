var express = require('express');
var router = express.Router();

var text = require('../../shared/text');
var user = require('../../models/user');

router.get('', function (req, res) {
    if (req.session && req.session.user && !req.session.secondFactor) {
        res.render('unauthenticated/secondFactor');
    } else {
        res.render('unauthenticated/register');
    }
});

router.post('', function(req, res) {
    if (req.session != null && req.session.user != null && req.session.secondFactor) {
        res.redirect('/dashboard');
    } else if (req.session && req.session.user && !req.session.secondFactor) {
        if (parseInt(req.body.secondFactor) == req.session.secondFactorCode && req.body.action == "login") {
            req.session.secondFactor = true;
            res.redirect('/dashboard');
        } else if (req.body.action == "resend") {
            text.message(req.session.secondFactorCode, req.session.user.phone);
            res.redirect('/register');
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
        user.register(req.body).then(function (result) {
            req.session.user = result;
            req.session.secondFactorCode = Math.random().toString().slice(2,8);
            req.session.secondFactor = false;
            text.message(req.session.secondFactorCode, req.session.user.phone);
            res.redirect('/register');
        }, function (error) {
            console.log(error.dev_error);
            res.render('unauthenticated/register', {
                error: error.error
            });
        });
    }
});

module.exports = router;
