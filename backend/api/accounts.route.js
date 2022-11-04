const express = require("express");

const {
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
  apiUpdateSubscription,
} = require("../controller/accounts.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const axios = require("axios")

const { check, validationResult } = require("express-validator");     // [Validation, Sanitization]
const rateLimit = require("express-rate-limit");                      // [DoS] Prevent brute force attacks
const Account = require("../models/accountModel"); // to access the DB
const Logs = require("../models/logsModel");
const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/

const createAccountLimiter = rateLimit({                              // [DoS] Prevent mass account creation
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per hour
  message:
    "Too many accounts created from this IP, please try again after 1 hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, response) => {
    // Send logs to db
    Logs.create({
      email: request.body['email'],
      type: "auth",
      reason: "Attempt to register account " + request.body['email'] + " was rate limited.",
      time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
    });
    response.status(500).json({ message: "Too many accounts created from this IP, please try again after 1 hour" });
  }
});
const verify2FALimiter = rateLimit({                                  // [DoS] Prevent brute force attacks on 2FA
  windowMs: 3 * 60 * 1000, // 3 mins
  max: 5, // Limit each IP to 5 code verification requests per 3 mins
  message: "Too much tries, please try again in 3 mins",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, response) => {
    // Send logs to db
    Logs.create({
      userId: request.body["userId"],
      type: "auth",
      reason: "Attempt to verify 2fa from " + request.body['userId'] + " was rate limited.",
      time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
    });
    response.status(500).json({message: "Too much tries, please try again in 3 mins"})
  }
});
const resetPasswordLimiter = rateLimit({                                  // [DoS] Prevent brute force attacks on 2FA
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5, // Limit each IP to 5 code verification requests per 10 mins
  message: "Too much tries, please try again in 10 mins",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, response) => {
    // Send logs to db
    Logs.create({
      email: request.body["email"],
      type: "auth",
      reason: "Attempt to reset password was rate limited.",
      time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
    });
    response.status(500).json({ message: "Too much tries, please try again in 10 mins"})
  }
});

const loginRateLimiter = rateLimit({                              // [DoS] Prevent mass account creation
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5, // Limit each IP to 10 login requests per 10 mins
  message:
    "Multiple logins detected from this IP address, please try again after 10 mins",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, response) => {
    // Send logs to db
    Logs.create({
      email: request.body['email'],
      type: "auth",
      reason: "Login from " + request.body['email'] + " was rate limited.",
      time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
    });
    return response.status(500).json({ message: "Too many logins from this IP address, please try again after 10 mins" })
  }
});

// @route   POST api/accounts/register
router.route("/register").post(createAccountLimiter,

  [
    check("email", 'Invalid email')
      .notEmpty().bail()                             // [Validation] check if email is empty
      .trim()                                                         // [Sanitization] remove whitespace
      .isLength({ max: 255 }).bail()                                // [Validation] max length
      .isEmail()                                                    // [Validation] check if email is valid
      .normalizeEmail()                                               // [Sanitization] Sanitize email
      .custom(async (value) => {                                      // [Validation] Check if email already exists
        const accountExist = await Account.findOne({ email: value });
        if (accountExist) {
          throw new Error("Account already exists");
        }
        return true;
      }),
    check("password", "Invalid password")
      .notEmpty()
      .withMessage("Password is required").bail()                            // [Validation] check if password is empty
      .not().matches(emojiRegex).bail()
      .isLength({ max: 128 }),                                         // [Validation] check if password is at least 12 characters
    check("firstName", "Invalid First Name")
      .notEmpty()
      .withMessage("First name is required").bail()                          // [Validation] check if first name is empty
      .trim()                                                         // [Sanitization] remove whitespace
      .not().matches(emojiRegex)
      .withMessage("No emoji allowed").bail()                         // [Validation] check if first name contains emoji
      .isLength({ max: 25 }).bail()                                         // [Validation] max length
      .escape(),                                                       // [Sanitization] Escape HTML characters
    check("lastName", "Invalid Last Name")
      .notEmpty()
      .withMessage("Last name is required").bail()                           // [Validation] check if last name is empty
      .trim()                                                         // [Sanitization] Remove whitespace from both sides of a string
      .not().matches(emojiRegex)
      .withMessage("No emoji allowed").bail()                         // [Validation] check if first name contains emoji
      .isLength({ max: 25 })                                         // [Validation] max length
      .escape(),                                                       // [Sanitization] Escape HTML characters                                         // [Validation] max length
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid User Inputs" });
    }
    apiRegister(req, res);
  }
);

// @route   POST api/accounts/login
router.route("/login").post(loginRateLimiter,
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")                               // [Validation] check if email is empty
      .normalizeEmail()                                               // [Sanitization] Sanitize email
      .trim(),                                                        // [Sanitization] remove whitespace
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    apiLogin(req, res);
  });

// @route   POST api/accounts/verify2FA
router.route('/verify2FA').post(verify2FALimiter,
  [
    check('token', 'Invalid code')
      .isNumeric()                                               // [Validation] Check if token is a number
      .isLength({ min: 6, max: 6 }),                             // [Validation] 6 digits

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid code" });
    }
    apiVerify2FA(req, res);
  })

// @route   GET api/getAccount
router.route("/getAccount").get(protect, apiGetAccount);

// @route POST api/accounts/reset (send link to email)
router.route("/reset").post(resetPasswordLimiter,
  [
    check("email", 'Email is invalid')
      .notEmpty().bail()
      .trim()
      .isLength({ max: 255 }).bail()
      .isEmail().bail()
      .normalizeEmail(),                                               // [Sanitization] Sanitize email
    check('token', 'Invalid code')
      .trim()
      .isInt().isLength({ min: 6, max: 6 }),                             // [Validation] 6 digits

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    else {
      apiResetPassword(req, res);
    }
  })

// @route GET api/accounts/reset/:id/:jwt (verify after click link in email)
router.route("/reset/:id/:jwt").get(resetPasswordLimiter,
  [
    check('id', 'Invalid account ID')
      .notEmpty().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
    check('jwt', 'Invalid token')
      .notEmpty().bail()
      .isJWT(),

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Error Reset Credentials" });
    }
    apiVerifyReset(req, res);
  })

// @route POST api/accounts/reset/:id/:jwt (after verify link)
router.route("/reset/:id/:jwt").post(resetPasswordLimiter,
  [
    check('id', 'Invalid account ID')
      .notEmpty().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
    check('jwt', 'Invalid token')
      .notEmpty().bail()
      .isJWT(),
    check("password", "Password is too long")
      .notEmpty()
      .withMessage("Password is required").bail()                            // [Validation] check if password is empty
      .not().matches(emojiRegex).bail()
      .isLength({ min: 12, max: 128 }),

  ], (req, res) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    apiChangePassword(req, res);
  });

// @route POST api/accounts/changePass
router.route("/changePass").post(protect,
  [
    check('userId', 'Invalid account')
      .notEmpty().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
    check('password', 'Invalid Password')
      .notEmpty().bail()
      .not().matches(emojiRegex).bail()
      .isLength({ min: 12, max: 128 }),

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    apiNormalChangePass(req, res);
  });

// @route POST api/accounts/uploadAvatar
router.route("/uploadAvatar").post(protect,
  [
    check('userId', 'Invalid account').notEmpty().bail().isAlphanumeric().bail().isLength({ min: 24, max: 24 }),
    check('imgId', 'Missing Image').notEmpty().bail().isAlphanumeric().bail().isLength({ min: 24, max: 24 }),

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Error: Image not uploaded" });
    }
    apiUploadAvatar(req, res);
  });

// @route POST api/accounts/update
router.route("/update").post(protect,
  [
    check('userId', 'Invalid account').notEmpty().bail().isAlphanumeric().bail().isLength({ min: 24, max: 24 }),
    check("email", 'Invalid email')
      .notEmpty().bail()                             // [Validation] check if email is empty
      .trim()                                                         // [Sanitization] remove whitespace
      .isEmail()                                                    // [Validation] check if email is valid
      .normalizeEmail()                                            // [Sanitization] Sanitize email
      .isLength({ max: 255 }).bail(),                              // [Validation] max length
    check("firstName", "Invalid First Name")
      .notEmpty()
      .withMessage("First name is required").bail()                          // [Validation] check if first name is empty
      .trim()                                                         // [Sanitization] remove whitespace
      .not().matches(emojiRegex)
      .withMessage("First name: Emoji detected").bail()                         // [Validation] check if first name contains emoji
      .isLength({ min: 2, max: 25 }).bail()                                         // [Validation] max length
      .escape(),                                                       // [Sanitization] Escape HTML characters
    check("lastName", "Invalid Last Name")
      .notEmpty()
      .withMessage("Last name is required").bail()                           // [Validation] check if last name is empty
      .trim()                                                         // [Sanitization] Remove whitespace from both sides of a string
      .not().matches(emojiRegex)
      .withMessage("Last name: Emoji detected").bail()                         // [Validation] check if first name contains emoji
      .isLength({ min: 2, max: 25 })                                         // [Validation] max length
      .escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      return res.status(400).json({ message: errArray });
    }
    apiUpdateDetails(req, res);
  })

// @route POST api/accounts/updateSubscription
router.route("/updateSubscription").post(protect,
  [
    check('emailSubscription', 'Try again later').notEmpty().bail().isBoolean(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Error updating subscription" });
    }
    apiUpdateSubscription(req, res);
  });

// @route POST api/accounts/delete/:id
router.route("/delete/:id").post(protect,
  [
    check('id', 'Invalid account ID').notEmpty().bail().isAlphanumeric().bail().isLength({ min: 24, max: 24 }),

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Error deleting account. Try again later" });
    }
    apiDelete(req, res);
  });

//Check captcha
router.post("/checkCaptcha", async (req, res) => {
  //Destructuring response token from request body
  const { token } = req.body;

  //sends secret key and response token to google
  await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
  );

  //check response status and send back to the client-side
  if (res.status(200)) {
    res.status(200).json({ message: "Success" });
  } else {
    res.status(400).json({ message: "Failed" });
  }
});

module.exports = router
