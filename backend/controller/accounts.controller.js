const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
//  Account Schema
const Account = require("../models/accountModel");
const Logs = require("../models/logsModel");
const authy = require("authy")(process.env.AUTHY_API_KEY);

/***
 * @desc Register
 * @route POST /v1/api/accounts/register
 * @access Public
 */
const apiRegister = asyncHandler(async (req, res) => {
  //  Getting the info from HTTP request body
  const {
    email,
    password,
    firstName,
    lastName,
    emailSubscription,
    phone,
    countryCode,
  } = req.body;

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creates new user in DB
  const account = await Account.create({
    email,
    firstName,
    lastName,
    emailSubscription,
    password: hashedPassword,
  });
  return res.status(200).json({
    _id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    role: account.role,
  });
  // ACCOUNT SUSPENDED FOR AUTHY, CANNOT WORK
  // if (account) {
  //   authy.register_user(email, phone, countryCode, (err, regRes) => {
  //     if (err) {
  //       return res.json({ message: err.message });
  //     }
  //     account.authyId = regRes.user.id;
  //     account.save((err, user) => {
  //       if (err) {
  //         return res.json({ message: err.message });
  //       }
  //     });

  //     authy.request_sms(
  //       account.authyId,
  //       { force: true },
  //       function (err, smsRes) {
  //         if (err) {
  //           return res.json({
  //             message: "An error occurred while sending OTP to user",
  //           });
  //         }
  //       }
  //     );
  //     return res
  //       .status(200)
  //       .json({ email: account.email, message: "OTP sent to user" });

  //   });

  // } else {
  //   res.status(400);
  //   throw new Error("Invalid account data");
  // }
});

/***
 * @desc Login
 * @route POST /v1/api/accounts/login
 * @access Public
 */
const apiLogin = asyncHandler(async (req, res) => {
  try {
    // Getting the info from HTTP request body
    const { email, password } = req.body;
    // Check if user exists in DB using Account schema (Mongoose -> MongoDB)
    const account = await Account.findOne({ email });

    if (account == null){                                                                 // [Authentication] Check if user exists in DB
      throw new Error("Invalid credentials.");
    }

    if (account.lockedOut) {                                                              // [Authentication] Check if user is locked out
        throw new Error("Your account has been locked.\nPlease contact the administrator.");        
    }

    if (account && (await bcrypt.compare(password, account.password))) {                  // [Authentication] Check if password is correct
      // uncheck the OTP for now, easier for development
      // authy.request_sms(
      //   account.authyId,
      //   { force: true },
      //   function (err, smsRes) {
      //     console.log("123");
      //     if (err) {
      //       res.json({
      //         message: err,
      //       });
      //     } else {
      //       res
      //       .status(200)
      //       .json({ email: account.email, message: "OTP sent to user" });
      //     }
        // }        
      // );
      // res
      // .status(200)
      // .json({ email: account.email, message: "OTP sent to user" });
      
      // IF SUCCEED RESET THE lockTimes
      Account.updateOne({email: email},{ $set: {"loginTimes": 0}},function (err, result) { // [Authentication] Reset the loginTimes
        if (err){
            console.log("Set loginTimes failed. Error: " + err);
        }else{
            console.log("Success! loginTimes reset to 0: " + email)
            console.log(result)
        }
    });

      // TODO: REMOVE THIS CODE BELOW, BY RIGHT SHOULD ONLY RECEIVE EMAIL 
      const access_token = generateToken(account._id)
      res.cookie("access_token", access_token, {
        httpOnly: true,                                 // [Prevent XSS] Cannot be accessed by client side JS
        // secure: process.env.JWT_SECRET,
        maxAge: 3600 * 1000,
        secure: true,
        sameSite: 'strict'                              // [Prevent CSRF] Cookie will only be sent in a first-party context and not be sent along with requests initiated by third party websites. 
      });
      return res.status(200).json({
        _id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        token: access_token,
        message: "Token is valid",
      });

    } else {            
      console.log("Failed login")

      /* ACCOUNT LOCKING START*/
      // If user attempts to login 5 times and account is not locked, lock the account
      if (account.loginTimes > 3 && account.lockedOut == false) {                           // [Logging] Check if user has attempted to login 5 times
          console.log("Locking account: " + email);
          Account.updateOne({email: email},{ $set: {"lockedOut": true}},function (err, result) {
            if (err){
                console.log("Account lock failed. Error: " + err);
            }else{
                console.log("Success! Account locked: " + email);
                //console.log(result)
                const sgDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
                
                // Send to logs db                
                Logs.create({ email: account.email, type: "auth", reason: "Account Lockout", time: sgDateTime});

                /* SEND EMAIL TO ADMIN START*/
                console.log("Sending email to admin...");                                   // [Alert] Send email to admin
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'learn4fund@gmail.com',
                    pass: process.env.NODEMAILER_GMAIL_PASS
                  }
                });                                

                var mailOptions = {
                  from: 'learn4fund@gmail.com',
                  to: 'learn4fundadm1n@gmail.com',
                  subject: 'ACCOUNT LOCK ISSUED at ' + sgDateTime,
                  text: 'The following account was locked at '+ sgDateTime +": " + email
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                /* SEND EMAIL TO ADMIN END*/
                });
            }
        });
      }
      else {
        console.log("Incrementing lockTimes: " + email);                                    // [Logging] Increment loginTimes by 1
        Account.updateOne({email: email},{ $inc: {"loginTimes": 1}},function (err, result) {
          if (err){
              console.log("loginTimes increment failed. Error: " + err);
          }else{
              console.log("Success! loginTimes incremented for: " + email)
          }
      });
      }      
      const attemptsLeft = 4-account.loginTimes;                                            // [Logging] Calculate login attempts left out of 5
      if (attemptsLeft == 1){
        throw new Error("Invalid credentials.\nThis is your final attempt.");  
      }
      if (attemptsLeft > 0){
        throw new Error("Invalid credentials.\nAttempts left: " + attemptsLeft);
      }else{        
        throw new Error("Your account has been locked.\nPlease contact the administrator.")
      }    
    }
    /*ACCOUNT LOCKING END*/
  } catch (err) {
    res.status(400).json({ message: err.message}) // NOTE: should not throw the specific error in production
  }
});

/***
 * @desc verify2FA
 * @route GET /v1/api/accounts/verify2FA
 * @access Public
 */
const apiVerify2FA = asyncHandler(async (req, res) => {
  try {
    const { email, token } = req.body;
    const account = await Account.findOne({ email });
    authy.verify(account.authyId, token, function (err, tokenRes) {
      if (err) {
        res.json({ message: "OTP verification failed" });
      }
      const access_token = generateToken(account._id)
      res.cookie("access_token", access_token, {
        httpOnly: true,                                 // [Prevent XSS] Cannot be accessed by client side JS
        // secure: process.env.JWT_SECRET,
        maxAge: 3600 * 1000,
        secure: true,
        sameSite: 'strict'                             // [Prevent CSRF] Cookie will only be sent in a first-party context and not be sent along with requests initiated by third party websites. 
      });
      return res.status(200).json({
        _id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        token: access_token,
        message: "Token is valid",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/***
 * @desc Get User
 * @route GET /v1/api/accounts/getUser
 * @access Private
 */
const apiGetAccount = asyncHandler(async (req, res) => {
  const {
    _id,
    firstName,
    lastName,
    email,
    avatarImg,
    donation,
    emailSubscription,
    lockedOut,
    loginTimes,
    role,
  } = await Account.findById(req.account.id);
  res.status(200).json({
    id: _id,
    firstName,
    lastName,
    email,
    role,
    avatarImg,
    donation,
    emailSubscription,
    lockedOut,
    loginTimes,
  });
});

//Generate JWT
const generateToken = (id) => {                         // [Session] Generate JWT
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { algorithm: "HS512", expiresIn: "1h" }
  );

};

module.exports = {
  apiRegister,
  apiLogin,
  apiGetAccount,
  apiVerify2FA,
};
