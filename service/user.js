const validate = require("jsonschema").validate;
const serviceSchema = require("../service/userSchema").schema;
var config = require("config");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const user = require("../model/user");
const otp = require("./otp");
const email = require('../util/util');


module.exports.save = (userObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (userObject == null) {
        throw new Error("Input value is null or undefined");
      }
      userObject.emailId = userObject.emailId.toLowerCase();
      var errors = [];
      var result = validate(userObject, serviceSchema);
      if (result.errors.length > 0) {
        var errorObject = result.errors[0];
        if (errorObject.name == 'required') {
          errors.push({
            message: serviceSchema.properties[errorObject.argument].message[errorObject.name]
          });
        } else {
          var values = errorObject.property.split('.');
          errors.push({
            message: serviceSchema.properties[values[1]].message[errorObject.name]
          });
        }
      }
      if (errors.length != 0) {
        reject(errors[0]);
      } else {
        var userFilter = {
          "emailId": userObject.emailId
        };
        user.get(userFilter).then((result) => {
          if (!_.isEmpty(result[0])) {
            throw new Error(`${result[0].emailId} User already exist`);
          } else {
            this.encrpytion(userObject.userPassword).then((response) => {
              console.log(response, "responsee from bcrypt");
              userObject.saltString = response.salt;
              userObject.userPassword = response.hash;
              user.save(userObject).then((res) => {
                if (res) {
                  var otpValue = JSON.stringify(Math.random()).substring(2, 8);
                  var sessionId = Math.random().toString(36).substring(2, 10)
                  var currentDate = new Date();
                  currentDate.setMinutes(currentDate.getMinutes() + 20);
                  var expiredDate = currentDate.toISOString();
                  console.log(expiredDate, "expireddate");

                  var otpObject = {
                    "otp": otpValue,
                    "emailId": res.emailId,
                    "expiredDate": expiredDate,
                    "sessionId": sessionId
                  }
                  console.log(otpObject, "objectsss");
                  otp.save(otpObject).then((response) => {
                    if (response) {
                      otp.create(otpObject).then((response) => {
                        resolve(response);
                      }).catch((error) => {
                        reject(error);
                      });
                    }
                  }).catch((error) => {
                    reject(error);
                  });
                }
                resolve(res);
              }).catch((e) => {
                reject(e);
              });
            }).catch((error) => {
              reject(error);
            });
          }
        }).catch((err) => {
          reject(err);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.get = (filter) => {
  return new Promise((resolve, reject) => {
    try {
      // log.debug(`${logName} In get Service, Filter: ${JSON.stringify(filter)}`);
      console.log(filter, "ffffff");

      user.get(filter).then((users) => {
        resolve(users);
        console.log(users, "usersss");
      }).catch(err => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.encrpytion = (password) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("inside encryption", password);

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            reject({
              "status": "400",
              "description": "some thing went wrong"
            });
          } else {
            resolve({
              "salt": salt,
              "hash": hash
            });
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.update = (id, updateObject) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("inside model ", id, updateObject);
      user.update(id, updateObject).then((response) => {
        if (response) {
          resolve("User modified Successfully");
        }
      }).catch((error) => {
        reject(`Unable to verify User due to :${error}`);
      });
    } catch (error) {
      reject(error);
    }
  });
}
