const user = require('./user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var jwt = require('jsonwebtoken');
const shortId = require('shortId');
const session = require('./session');
const authAttributtes = ['emailId', 'userPassword'];

module.exports.authenticate = (emailId, password) => {
    return new Promise((resolve, reject) => {
        try {
            var email = { "emailId": emailId };
            user.get(email).then((respone) => {
                if (!_.isEmpty(respone[0])) {
                    bcrypt.compare(password, respone[0].userPassword, function (err, res) {
                        if (res == true) {
                            session.create(emailId).then((response) => {
                                user.get({ emailId: emailId }).then((response) => {
                                    if (!_.isEmpty(response[0])) {
                                        response[0].loginDateTime = new Date().toISOString();
                                        var updateObject = response[0];
                                        var id = { _id: updateObject._id };
                                        user.update(id, updateObject).then((response) => {
                                            resolve(response);
                                        }).catch((error) => {
                                            reject(error);
                                        });
                                    } else {
                                        reject({
                                            "status": "200",
                                            "description": "Unable to find user"
                                        });
                                    }
                                }).catch((error) => {
                                    reject(error);
                                });
                                resolve(response);
                            }).catch((error) => {
                                reject(error);
                            });
                        } else if (res == false) {
                            resolve({
                                "status": "200",
                                "description": "Password incorrect"
                            });
                        }
                        if (err) {
                            reject(err);
                        }
                    });
                } else {
                    reject({
                        "status": "200",
                        "description": "Unable to find user"
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}