const _ = require('lodash');
const otp = require('../../service/otp');
const otpAttributes = ["otp", "emailId", "sessionId"];


module.exports = (router) => {
  router.route('/otp')
    .get((req, res, nxt) => {
      const resp = {
        "status": "200",
        "description": "",
        "data": ""
      }
      try {
        let body = _.pick(req.body, otpAttributes);
        var object = _.omitBy(body, function (value, key) {
          return value.startsWith("undefined") || value.startsWith("null") || value.length == 0;
        });
        otp.verify(object).then((response) => {
          resp.description = response
          res.send(resp);
        }).catch((error) => {
          resp.status = "400";
          resp.description = error;
          res.status(400).send(resp);
        });
      } catch (error) {
        resp.status = "400";
        resp.description = error;
        res.status(400).send(resp);
      }
    })
}