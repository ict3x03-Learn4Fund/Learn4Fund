const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
//  Account Schema
const Account = require("../models/accountModel");
const Logs = require("../models/logsModel");
const authy = require("authy")(process.env.AUTHY_API_KEY);
const speakEasy = require("speakeasy");
const {sendEmail} = require("../middleware/mailer.js")

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

  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const secret = speakEasy.generateSecret();

    // Creates new user in DB
    const account = await Account.create({
      email,
      firstName,
      lastName,
      emailSubscription,
      password: hashedPassword,
      secret: secret,
    });
    return res.status(200).json({
      _id: account.id,
      secret: account.secret.otpauth_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/***
 * @desc Verify 2FA Secret
 * @route POST /v1/api/accounts/verify2FA
 */
const apiVerify2FA = asyncHandler(async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await Account.findById(userId);
    if (!userId) {
      return res.status(400).json({ message: "UserId cannot be null." });
    }
    if (!user) {
      return res.status(400).json({ message: "User not registered yet." });
    }
    const { base32: secret } = user.secret;
    var verified = speakEasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
    
    if (process.env.CURRENT_ENV == 'testing'){           // [UI Testing] Skip 2fa verification for UI testing phase
      console.log('DEBUG: Current environment is "testing", skipping 2fa verification.')
      verified = true;
    }else{
      console.log('DEBUG: Current environment is "deployment", performing 2fa verification.')
    }
    
    if (verified) {
      const access_token = generateToken(userId);
      res.cookie("access_token", access_token, {
        httpOnly: true,                               // [Prevent XSS] Cannot be accessed by client side JS
        // maxAge: 3600 * 1000,
        secure: true,
        sameSite: "strict",                           // [Prevent CSRF] Cookie will only be sent in a first-party context and not be sent along with requests initiated by third party websites.
      });
      return res.status(200).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } else {
      return res.status(400).json({ verified: false });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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

    if (account == null) {                                            // [Authentication] Check if user exists in DB
      throw new Error("Invalid credentials.");
    }

    if (account.lockedOut) {                                          // [Authentication] Check if user is locked out
      throw new Error(
        "Your account has been locked.\nPlease contact the administrator."
      );
    }

    if (account && (await bcrypt.compare(password, account.password))) {
      // IF SUCCEED RESET THE lockTimes
      Account.updateOne(
        { email: email },
        { $set: { loginTimes: 0 } },
        function (err, result) {                                      // [Authentication] Reset the loginTimes
          if (err) {
            console.log("Set loginTimes failed. Error: " + err);
          } else {
            console.log("Success! loginTimes reset to 0: " + email);
            console.log(result);
          }
        }
      );
      return res.status(200).json({
        _id: account.id,
      });
    } else {
      console.log("Failed login");

      /* ACCOUNT LOCKING START*/
      // If user attempts to login 5 times and account is not locked, lock the account
      if (account.loginTimes > 3 && account.lockedOut == false) {   // [Logging] Check if user has attempted to login 5 times     
        console.log("Locking account: " + email);
        Account.updateOne(
          { email: email },
          { $set: { lockedOut: true } },
          function (err, result) {
            if (err) {
              console.log("Account lock failed. Error: " + err);
            } else {
              console.log("Success! Account locked: " + email);
              //console.log(result)
              const sgDateTime = new Date().toLocaleString("en-US", {
                timeZone: "Asia/Singapore",
              });

              // Send to logs db
              Logs.create({
                email: account.email,
                type: "auth",
                reason: "Account Lockout",
                time: sgDateTime,
              });

              /* SEND EMAIL TO ADMIN START*/
              console.log("Sending email to admin...");             // [Alert] Send email to admin
              var nodemailer = require("nodemailer");
              var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "learn4fund@gmail.com",
                  pass: process.env.NODEMAILER_GMAIL_PASS,
                },
              });

              var mailOptions = {
                from: "learn4fund@gmail.com",
                to: "learn4fundadm1n@gmail.com",
                subject: "ACCOUNT LOCK ISSUED at " + sgDateTime,
                text:
                  "The following account was locked at " +
                  sgDateTime +
                  ": " +
                  email,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
                /* SEND EMAIL TO ADMIN END*/
              });
            }
          }
        );
      } else {
        console.log("Incrementing lockTimes: " + email);        // [Logging] Increment loginTimes by 1
        Account.updateOne(
          { email: email },
          { $inc: { loginTimes: 1 } },
          function (err, result) {
            if (err) {
              console.log("loginTimes increment failed. Error: " + err);
            } else {
              console.log("Success! loginTimes incremented for: " + email);
            }
          }
        );
      }
      const attemptsLeft = 4 - account.loginTimes;              // [Logging] Calculate login attempts left out of 5
      if (attemptsLeft == 1) {
        throw new Error("Invalid credentials.\nThis is your final attempt.");
      }
      if (attemptsLeft > 0) {
        throw new Error("Invalid credentials.\nAttempts left: " + attemptsLeft);
      } else {
        throw new Error(
          "Your account has been locked.\nPlease contact the administrator."
        );
      }
    }
    /*ACCOUNT LOCKING END*/
  } catch (err) {
    res.status(400).json({ message: err.message }); // NOTE: should not throw the specific error in production
  }
});

// /***
//  * @desc verify2FA
//  * @route GET /v1/api/accounts/verify2FA
//  * @access Public
//  */
// const apiVerify2FA = asyncHandler(async (req, res) => {
//   try {
//     const { email, token } = req.body;
//     const account = await Account.findOne({ email });
//     authy.verify(account.authyId, token, function (err, tokenRes) {
//       if (err) {
//         res.json({ message: "OTP verification failed" });
//       }
//       const access_token = generateToken(account._id)
//       res.cookie("access_token", access_token, {
//         httpOnly: true,                                  // [Prevent XSS] Cannot be accessed by client side JS
//         // secure: process.env.JWT_SECRET,
//         maxAge: 3600 * 1000,
//         secure: true,
//         sameSite: 'strict'                               // [Prevent CSRF] Cookie will only be sent in a first-party context and not be sent along with requests initiated by third party websites.
//       });
//       return res.status(200).json({
//         _id: account.id,
//         firstName: account.firstName,
//         lastName: account.lastName,
//         email: account.email,
//         role: account.role,
//         token: access_token,
//         message: "Token is valid",
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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

const apiResetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await Account.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists." });
    }
    const { base32: secret } = user.secret;
    const verified = speakEasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
    if (verified) {
      const jwt = generateToken(user._id);
      const link = `http://localhost:3000/reset/${user._id}/${jwt}`;
      const message = `Click on this link to reset your password: ${link}`
      const emailSuccess = await sendEmail(email, "Learn4Fund password reset", message);
      if (emailSuccess){
        return res.status(200).json({message: "An email has been sent to you to reset your password."});
      } else {
        return res.status(400).json({message: "Failed to sent email."});
      }
    } else {
      return res.status(400).json({message: "token not valid."});
    }
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
});

const apiVerifyReset = asyncHandler(async (req,res) => {
  try {
    const userId = req.params.id;
    const jwtToken = req.params.jwt;
    if (!jwtToken) {
      return res.status(400).json({message: "No token, authorization denied"});
    } 
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET, {algorithm:"HS512"});
    const user = await Account.findById(decoded.id)
    if (!user){
      return res.status(400).json({message: "Not authenticated, Invalid JWT token"});
    } else {
      return res.status(200).json({message: "Authentication Successful"})
    }
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
})

const apiChangePassword = asyncHandler(async (req,res) => {
  try {
    const userId = req.params.id;
    const jwtToken = req.params.jwt;
    const {password} = req.body;
    if (!jwtToken) {
      return res.status(400).json({message: "No token, authorization denied"});
    } 
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET, {algorithm:"HS512"});
    const user = await Account.findById(decoded.id)
    if (!user){
      return res.status(400).json({message: "Not authenticated, Invalid JWT token"});
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await Account.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            password: hashedPassword,
          }
        }
      )
      return res.status(200).json({message: "Password changed successfully."})
    }

  } catch (error) {
    return res.status(400).json({message: error.message})
  }
})

const apiNormalChangePass = asyncHandler(async (req,res) => {
  try {
    const {userId, password} = req.body;
    const user = await Account.findById(userId)
    if (!user){
      return res.status(400).json({message: "Not authenticated, Invalid JWT token"});
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await Account.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            password: hashedPassword,
          }
        }
      )
      return res.status(200).json({message: "Password changed successfully."})
    }

  } catch (error) {
    return res.status(400).json({message: error.message})
  }
})

// upload avatar
const apiUploadAvatar = asyncHandler(async (req,res) => {
  try {
    const {userId, imgId} = req.body;
    const user = await Account.findById(userId);
    if (!user) {
      return res.status(400).json({message: "User not found."});
    }
    if (!imgId) {
      return res.status(400).json({message: "Image not found."});
    }
    const updatedUser = await Account.findByIdAndUpdate({_id: userId}, {avatarImg: imgId});
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
})

const apiUpdateDetails = asyncHandler(async (req,res) => {
  try {
    const {userId, firstName, lastName, email} = req.body;
    const user = await Account.findById(userId);
    if (!firstName || !lastName || !email){
      return res.status(400).json({message: "details cannot be empty."})
    }
    if (!user){
      return res.status(400).json({message: "User is not found."})
    }
    if (user.firstName != firstName){
      user.firstName = firstName;
    }
    if (user.lastName != lastName){
      user.lastName = lastName;
    }
    if (user.email != email){
      user.email = email;
    }
    user.save()
    return res.status(200).json(user)

  } catch (error) {
    return res.status(400).json({message: error.message})
  }
})

const apiUpdateSubscription = asyncHandler(async (req,res) => {
  try {
    const {userId, emailSubscription} = req.body;
    const user = await Account.findById(userId);
    if (!user){
      return res.status(400).json({message: "User is not found."})
    }
    user.emailSubscription = emailSubscription
    user.save()
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
})

const apiDelete = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Account.findById(userId);
    if (!user){
      return res.status(400).json({message: "User is not found."})
    }
    const userDeleted = await Account.findByIdAndDelete(userId);
    return res.status(200).json(userDeleted)
  } catch (error) {
    return res.status(400).json(error.message)
  } 
})


//Generate JWT
const generateToken = (id) => {                       // [Session/Authentication] Generate JWT 
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "2h",
  });
};

module.exports = {
  apiRegister,
  apiLogin,
  apiGetAccount,
  apiVerify2FA,
  apiResetPassword,
  apiChangePassword,
  apiVerifyReset,
  apiUploadAvatar,
  apiNormalChangePass,
  apiUpdateDetails,
  apiDelete,
  apiUpdateSubscription 
};
