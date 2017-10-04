var express = require('express');
var router = express.Router();

router.get('', function (req, res) {
    if (req.session.user && req.session.secondFactor) {
        res.redirect('/dashboard');
    } else {
        res.render('unauthenticated/welcome');
    }

});

module.exports = router;
