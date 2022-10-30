var nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "learn4fund@gmail.com",
      pass: process.env.NODEMAILER_GMAIL_PASS,
    },
  });

  var mailOptions = {
    from: "learn4fund@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = { sendEmail };
