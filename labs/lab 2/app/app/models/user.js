var database = require('../database');
var validator = require('../shared/validator');
var security = require('../shared/security');
var Promise = require('promise');

module.exports = {
    register(params) {
        return new Promise(function (resolve, reject) {
            var errors = validator.validate(params, {
                username: validator.isString,
                password: validator.isString,
                confirm_password: validator.isString,
                phone: validator.isString
            });

            if (errors) {
                reject({
                    error: true,
                    type: 'validation',
                    rejected_parameters: errors
                });
                return;
            }

            if (params.password != params.confirm_password) {
                reject({
                    error: true,
                    type: 'validation',
                    message: 'Passwords do not match'
                });
                return;
            }

            database.query({
                text: "SELECT COUNT(*) as count FROM Users WHERE username = $1",
                values: [params.username]
            }).then(function (results) {
                if (results[0].count > 0) {
                    reject({
                        error: 'Username already taken!'
                    });
                } else {
                    database.query({
                        text: 'INSERT INTO Users(Username, Password, Phone) VALUES ($1, $2, $3) returning User_ID',
                        values: [params.username, security.hashPassword(params.password), params.phone]
                    }).then(function (results) {
                        resolve({
                            user_id: parseInt(results[0].user_id),
                            username: params.username,
                            phone: params.phone
                        })
                    }, function (error) {
                        reject({
                            error: 'An unexpected error has occurred! Please try again later.',
                            dev_error: error
                        });
                    });
                }
            }, function () {
                reject({
                    error: 'Error generating account!'
                });
            })
        });
    },

    authenticate(params) {
        return new Promise(function (resolve, reject) {
            var errors = validator.validate(params, {
                username: validator.isString,
                password: validator.isString
            });

            if (errors) {
                reject({
                    error: true,
                    type: 'validation',
                    rejected_parameters: errors
                });
                return;
            }

            database.query({
                text: "SELECT * FROM Users WHERE Username = $1",
                values: [params.username]
            }).then(function (results) {
                if (results.length < 1) {
                    //Never tell the user account not found! Can be used to created an index of existing accounts for easy hacking
                    database.query({
                        text: "SELECT * FROM Users WHERE Admin_Username = $1",
                        values: [params.username]
                    }).then(function (results) {
                        if (results.length == 1 && results[0].admin_password && security.verifyPassword(params.password, results[0].admin_password)) {
                            delete results[0].password;
                            resolve(results[0]);
                        } else {
                            reject({
                                error: 'Invalid username or password!'
                            });
                        }
                    });
                } else if (security.verifyPassword(params.password, results[0].password)) {
                    delete results[0].password;
                    results[0].user_id = parseInt(results[0].user_id);
                    resolve(results[0]);
                } else {
                    reject({
                        error: 'Invalid username or password!'
                    });
                }
            }, function (error) {
                reject({
                    error: 'Error logging in, please try again later!',
                    dev_error: error
                });
            });
        });
    }

};
