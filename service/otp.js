const validate = require("jsonschema").validate;
var config = require("config");
const _ = require('lodash');
const otp = require('../model/otp');
const user = require('./user');
const emailService = require('../util/util');

module.exports.save = (otpObject) => {
  return new Promise((resolve, reject) => {
    if (otpObject == 'null' && otpObject == 'undefined') {
      throw new Error("Input values are undefined or null");
    }
    otp.save(otpObject).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    })
  });
};

module.exports.create = (otpObject) => {
  return new Promise((resolve, reject) => {
    let message = {
      destinationEmail: otpObject.emailId,
      subject: "RTP_Demo_Application",
      text: `Your Verification Code is : ${otpObject.otp}`
    };
    emailService.sendMail(message).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports.verify = (otpObject) => {
  return new Promise((resolve, reject) => {
    var query = {
      "emailId": otpObject.emailId,
      "sessionId": otpObject.sessionId,
      "otp": otpObject.otp
    }
    otp.get(query).then((response) => {
      console.log("verify method inside service", response);
      if (!_.isEmpty(response[0])) {
        var token = response[0].otp;
        var expiredDate = response[0].expiredDate;
        var currentTime = new Date();
        if (expiredDate.getTime() < currentTime.getTime()) {
          resolve(`Your OTP valid expired`);
        } else {
          var userQuery = {
            "emailId": query.emailId
          }
          user.get(userQuery).then((response) => {
            response[0].verifiedFlag = "true";
            var updateObject = response[0];
            var id = { _id: updateObject._id };
            user.update(id, updateObject).then((res) => {
              resolve(res);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
        }
      } else {
        reject("Unable to find verification code");
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

