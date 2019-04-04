var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userModelSchema = new Schema({
  userName: {
    type: String,
    minLength: 3,
    maxLength: 50
  },
  emailId: {
    type: String,
    maxLength: 50
  },
  phoneNumber: {
    type: String
  },
  userPassword: {
    type: String,
    minLength: 8
  },
  creationDate: {
    type: Date

  },
  updatedDate: {
    type: Date
  },
  verifiedFlag: {
    type: String
  },
  saltString: {
    type: String
  },
  loginDateTime: {
    type: String
  },
  logoutDateTime: {
    type: String
  }
});
module.exports = userModelSchema;