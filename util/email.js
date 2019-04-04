const nodemailer = require("nodemailer");
var config = require("config");
var SMTPHostName = config.get('SMTP.host') || "smtp.gmail.com";
var SMTPPortNumber = config.get('SMTP.port') || 465;
var emailId = config.get('SMTP.emailId') || "springboottest2696@gmail.com";
var password = config.get('SMTP.password') || "spring@123";
var ejs = require("ejs");
var staticFilesPath = "./static/passwordMail.ejs";


let transporter = nodemailer.createTransport({
  host: SMTPHostName,
  port: SMTPPortNumber,
  secure: true, // true for 465, false for other ports
  auth: {
    user: emailId, // generated ethereal user
    pass: password // generated ethereal password
  }
});

module.exports.email = (data) => {
  return new Promise((resolve, reject) => {
    try {
      let mailOptions = {
        from: emailId, // sender address
        to: data.destinationEmail, // list of receivers
        subject: data.subject, // Subject line
        text: data.text // plain text body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });

    } catch (error) {
      reject(error);
    }
  });
};
