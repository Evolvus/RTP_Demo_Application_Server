const mongoose = require("mongoose");
var sessionSchema = require('./sessionSchema');
var sessionModel = mongoose.model('SESSION', sessionSchema);

module.exports.save = (sessionObject) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("inside session save model", sessionObject);

            model = new sessionModel(sessionObject);
            model.save().then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}