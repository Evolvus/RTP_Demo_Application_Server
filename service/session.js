const session = require('../model/session');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const user=require('./user');

module.exports.create = (emailId) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.sign({ emailId }, "UumeqVcirUmAsHJrMwIDAQABAoIBAQCYKw05YSNhXVPk", { expiresIn: "5m" }, (err, token) => {
                if (err) {
                    reject({
                        status: "500",
                        description: "Some thing went wrong"
                    });
                } else {
                    var sessionObject = {
                        token,
                        sessionId: shortId.generate(),
                        emailId: emailId,
                        createdDateTime: new Date().toISOString(),
                    };
                    session.save(sessionObject).then((response) => {
                        resolve({
                            description: "Session stored successfully",
                            data: response
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.verify = (token) => {
    return new Promise((resolve, reject) => {
        try {
            if (!_.isEmpty(token)) {
                jwt.verify(token, "UumeqVcirUmAsHJrMwIDAQABAoIBAQCYKw05YSNhXVPk", function (err, decoded) {                                       
                    if (err) {
                        var payload = jwt.decode(token, { complete: false });
                        console.log(payload,"payload");
                        var userQuery = {"emailId": payload.emailId};                     
                        user.get(userQuery).then((response)=>{
                            if(!_.isEmpty(response[0])){
                                console.log("inside get ",response[0]);                                
                                response[0].logoutDateTime=new Date().toISOString();
                                var updateObject= response[0];
                                var id={_id:updateObject._id};
                                user.update(id,updateObject).then((response)=>{
                                    console.log(response,"inside update method");                                    
                                    resolve(response);
                                }).catch((error)=>{
                                    reject(error);
                                    console.log(error,"error in update method");                                    
                                });
                            }
                        }).catch((error)=>{
                            console.log(error,"error in get method"); 
                            reject(error);
                        });                                                                                       
                        reject({
                            description: 'Invalid Session - Access Denied',
                            status: "401"
                        });
                    } else {
                        if ((decoded.exp - Math.ceil((new Date().getTime() / 1000))) <= 20) {
                            console.log("inisde iddddd");
                            // As the validity of the provided token is less than or equal to tokenRefreshTime, a fresh token generation is initiated
                            var payload = jwt.decode(token, { complete: false });
                            var mailId = payload.emailId;
                            module.exports.create(mailId).then((response) => {
                                resolve({
                                    token: response.token,
                                    description: response.description,
                                    status: "200"
                                });
                            }).catch((error) => {
                                reject(error);
                            });
                        } else {
                            // Returns the already provided valid token as the validity of token is greater than the tokenRefreshTime
                            resolve({
                                token,
                                description: 'Valid Session',
                                status: "200"
                            });
                        }
                    }
                });
            } else {
                reject({
                    description: 'Invalid Session - Access Denied',
                    status: "401"
                });  // As the provided token is invalid or expired
            }
        } catch (error) {
            console.log(error, "try catch");
            reject({
                description: "Something went wrong. Please try again later",
                status: "500"
            });
        }
    });
};