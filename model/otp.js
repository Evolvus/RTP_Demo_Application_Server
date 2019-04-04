const mongoose = require("mongoose");
var otpSchema = require('./otpSchema');
var otpModel = mongoose.model('OTP', otpSchema);

module.exports.save = (otpObject) => {
    return new Promise((resolve, reject) => {
        console.log("inside otp");
        model = new otpModel(otpObject);
        model.save().then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });

    });
}

module.exports.get = (filter) => {
    return new Promise((resolve, reject) => {
        otpModel.find(filter).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}