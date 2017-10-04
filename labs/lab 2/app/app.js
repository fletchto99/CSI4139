#!/usr/bin/env node

const express = require('express');
const morgan = require('morgan');
const database = require('./app/database');
const config = require('./config/app.json');

database.connect(config.database, null).then(() => {

    let lab = express();

    lab.use(morgan('combined'));
    lab.set('trust proxy', 1);

    lab.set('views', './app/views');
    lab.set('view engine', 'pug');
    console.log("Views loaded!")

    lab.use('/', require('./app/middleware'));
    console.log("Middleware loaded!")

    lab.use('/', require('./app/controllers'));
    console.log("Controllers loaded!")


    lab.listen(config.app.port, () => console.log("System ready!"));

}, () => {
    console.log("Error connecting to database!");
    process.exit(1);
});
