var express = require('express');
var router = express.Router();

router.use('/register', require('./unauthenticated/register'));
router.use('/login', require('./unauthenticated/login'));
router.use('/', require('./unauthenticated/welcome'));
router.use('/dashboard', require('./authenticated/dashboard'));
router.use('/logout', require('./authenticated/logout'));

module.exports = router;
