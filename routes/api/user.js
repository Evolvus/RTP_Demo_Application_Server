const logName = "api:user:";
const _ = require("lodash");
var user = require("../../service/user");
var userAttributes = ["userName", "phoneNumber", "userPassword", "emailId"];

module.exports = (router) => {
  router.route('/user')
    .post((req, res, next) => {
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      let body = _.pick(req.body, userAttributes);
      var object = _.omitBy(body, function (value, key) {
        return value.startsWith("undefined") || value.startsWith("null") || value.length == 0;
      });
      try {
        object.creationDate = new Date().toISOString();
        object.updatedDate = new Date().toISOString();
        object.verifiedFlag = "false";
        object.applicationUsingTime = "";
        object.loginDateTime = "";
        object.logoutDateTime = "";
        user.save(object).then((resp) => {
          response.description = `User Saved Successfully!`;
          response.data = resp;
          res.send(response);
        }).catch(error => {
          response.status = "400";
          response.description = `Failed to save the User as ${error.message}`;
          res.status(400).send(response);
        });
      } catch (error) {
        response.status = "400";
        response.description = `Failed to save the User as ${error.message}`;
        res.status(400).send(response);
      }
    });
};


