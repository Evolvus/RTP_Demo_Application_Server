var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var otpSchema = new Schema({
    otp: {
        type: String
    },
    emailId: {
        type: String
    },
    sessionId: {
        type: String
    },
    expiredDate: {
        type: Date

    },
});
module.exports = otpSchema;