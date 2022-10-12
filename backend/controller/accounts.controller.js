const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Account = require("../models/accountModel");
const authy = require("authy")(process.env.AUTHY_API_KEY);

/***
 * @desc Register
 * @route POST /v1/api/accounts/register
 * @access Public
 */
const apiRegister = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    emailSubscription,
    phone,
    countryCode,
  } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("please add all fields.");
  }

  if (password < 12) {
    res.status(400);
    throw new Error("Password should be at least 12 characters.");
  }

  const accountExist = await Account.findOne({ email });
  if (accountExist) {
    res.status(400);
    throw new Error("Account already exists.");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create account
  const account = await Account.create({
    email,
    firstName,
    lastName,
    emailSubscription,
    password: hashedPassword,
  });

  if (account) {
    authy.register_user(email, phone, countryCode, (err, regRes) => {
      if (err) {
        return res.json({ message: err.message });
      }
      account.authyId = regRes.user.id;
      account.save((err, user) => {
        if (err) {
          return res.json({ message: err.message });
        }
      });

      authy.request_sms(
        account.authyId,
        { force: true },
        function (err, smsRes) {
          if (err) {
            return res.json({
              message: "An error occurred while sending OTP to user",
            });
          }
        }
      );
      return res
        .status(200)
        .json({ email: account.email, message: "OTP sent to user" });
    });
  } else {
    res.status(400);
    throw new Error("Invalid account data");
  }
});

/***
 * @desc Login
 * @route POST /v1/api/accounts/login
 * @access Public
 */
const apiLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });
    if (account == null){
      throw new Error("Invalid credentials.");
    }

    if (account.lockedOut) {
        throw new Error("Your account has been locked.\nPlease contact the administrator.");        
    }

    if (account && (await bcrypt.compare(password, account.password))) {
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
      Account.updateOne({email: email},{ $set: {"loginTimes": 0}},function (err, result) {
        if (err){
            console.log("Set loginTimes failed. Error: " + err);
        }else{
            console.log("Success! loginTimes reset to 0: " + email)
            console.log(result)
        }
    });

      // REMOVE THIS CODE BELOW, BY RIGHT SHOULD ONLY RECEIVE EMAIL 
      res.status(200).json({
        _id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        token: generateToken(account._id),
        message: "Token is valid",
      });
    } else {            
      console.log("Failed login")
      // Get loginTimes from user that is logging in
      
      //const loginFailedCount = await Account.findOne({email: email}, {loginTimes:1, _id:0});
      //const isAccLocked = await Account.findOne({email: email}, {lockedOut:1, _id:0});

      // If user attempts to login 5 times and account is not locked, lock the account
      if (account.loginTimes > 3 && account.lockedOut == false) {
          console.log("Locking account: " + email);
          Account.updateOne({email: email},{ $set: {"lockedOut": true}},function (err, result) {
            if (err){
                console.log("Account lock failed. Error: " + err);
            }else{
                console.log("Success! Account locked: " + email)
                //console.log(result)
            }
        });
      }else {// Else increment loginTimes by 1
        console.log("Incrementing lockTimes: " + email);
        Account.updateOne({email: email},{ $inc: {"loginTimes": 1}},function (err, result) {
          if (err){
              console.log("loginTimes increment failed. Error: " + err);
          }else{
              console.log("Success! loginTimes incremented for: " + email)
              // console.log(result)
          }
      });
      }
      /*ACCOUNT LOCKING END*/
      const attemptsLeft = 4-account.loginTimes;
      if (attemptsLeft == 1){
        throw new Error("Invalid credentials.\nThis is your final attempt.");  
      }
      if (attemptsLeft > 0){
        throw new Error("Invalid credentials.\nAttempts left: " + attemptsLeft);
      }else{
        throw new Error("Your account has been locked.\nPlease contact the administrator.")
      }    
    }
  } catch (err) {
    res.status(400); 
    throw new Error(err); // NOTE: should not throw the specific error in production
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
      res.status(200).json({
        _id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        token: generateToken(account._id),
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
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  apiRegister,
  apiLogin,
  apiGetAccount,
  apiVerify2FA,
};
