var userModelSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "userName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "pattern": "^[A-Za-z]+$",
      "message": {
        "required": "userName is required",
        "minLength": "userName does not meet minimum length of 4",
        "maxLength": "userName exceeds maximum length of 50",
        "pattern": "userName can contain only alphabets"
      }
    },
    "emailId": {
      "type": "string",
      "maxLength": 50,
      "format": "email",
      "message": {
        "required": "Email Id is required",
        "format": "Invalid Email Format",
        "maxLength": "Email Id exceeds maximum length of 50"
      }
    },
    "phoneNumber": {
      "type": "string"
    },
    "userPassword": {
      "type": "string",
      "minLength": 8,
      "pattern": "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$",
      "message": {
        "required": "Should have atleast one uppercase, one lowercase, one number and one special character",
        "minLength": "Password deos not meet minimum length 8"
      }
    },
    "creationDate": {
      "type": "string",
      "format": "date-time"
    },
    "updatedDate": {
      "type": "string",
      "format": "date-time"
    },
    "verifiedFlag": {
      "type": "string"
    }
  },
  "required": [
    "userName",
    "emailId",
    "userPassword"

  ]
};
module.exports.schema = userModelSchema;