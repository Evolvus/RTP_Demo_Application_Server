var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    token: {
        type: String
    },
    sessionId: {
        type: String
    },
    emailId: {
        type: String
    },
    createdDateTime: {
        type: Date

    }
});
module.exports = sessionSchema;