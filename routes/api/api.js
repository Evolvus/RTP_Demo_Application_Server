module.exports = (router) => {
  require("./user")(router);
  require("./otp")(router);
  require("./auth")(router);
  require("./session")(router);
};