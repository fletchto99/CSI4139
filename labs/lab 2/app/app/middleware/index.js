const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const router = express.Router();
const databaseConfig = require('../../config/app.json').database;
const sessionObj = require('../../config/app.json').session;
var cookieParser = require('cookie-parser');

sessionObj.store = new pgSession({
    pg: pg,
    conString: `postgresql://${databaseConfig.user}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`,
    tableName: 'session'
});

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cookieParser());
router.use(session(sessionObj));
router.use('/dashboard', require('./auth'));

module.exports = router;
