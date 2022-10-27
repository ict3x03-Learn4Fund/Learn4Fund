const express = require("express");

const {
  apiRegister,
  apiLogin,
  apiGetAccount,
  apiVerify2FA,
} = require("../controller/accounts.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const { check, validationResult } = require("express-validator"); // [Validation, Sanitization]
const rateLimit = require("express-rate-limit"); // [DoS] Prevent brute force attacks
const Account = require("../models/accountModel"); // to access the DB

const createAccountLimiter = rateLimit({
  // [DoS] Prevent mass account creation
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per hour
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const verify2FALimiter = rateLimit({
  // [DoS] Prevent brute force attacks on 2FA
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 3, // Limit each IP to 3 code verification requests per 15 mins
  message: "Too much tries, please try again in 15 mins",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// @route   POST api/accounts/register
router.route("/register").post(
  
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required") // [Validation] check if email is empty
      .isLength({ max: 255 })
      .withMessage("Email is too long") // [Validation] max length
      .isEmail()
      .withMessage("Email is invalid") // [Validation] check if email is valid
      .normalizeEmail() // [Sanitization] Sanitize email
      .trim() // [Sanitization] remove whitespace
      .custom(async (value) => {
        // [Validation] Check if email already exists
        const accountExist = await Account.findOne({ email: value });
        if (accountExist) {
          throw new Error("Account already exists");
        }
        return true;
      }),
    check("password", "Password is too weak")
      .notEmpty()
      .withMessage("Password is required") // [Validation] check if password is empty
      .isLength({ min: 12 }), // [Validation] check if password is at least 12 characters
    check("firstName", "First name is too long")
      .notEmpty()
      .withMessage("First name is required") // [Validation] check if first name is empty
      .isLength({ max: 20 }) // [Validation] max length
      .trim() // [Sanitization] remove whitespace
      .escape(), // [Sanitization] Escape HTML characters
    check("lastName", "Last name is too long")
      .notEmpty()
      .withMessage("Last name is required") // [Validation] check if last name is empty
      .isLength({ max: 20 }) // [Validation] max length
      .trim() // [Sanitization] Remove whitespace from both sides of a string
      .escape(), // [Sanitization] Escape HTML characters
    check("phone", "Phone number is invalid")
      .notEmpty()
      .withMessage("Phone number is required") // [Validation] check if phone number is empty
      .isMobilePhone() // [Validation] check if phone number is valid
      .isNumeric() // [Validation] check if phone number is number
      .isLength({ min: 6, max: 12 }) // [Validation] Check if phone number is between 6 and 12 digits
      .trim(), // Remove whitespace from both sides of a string
    check("countryCode", "Country code is invalid")
      .notEmpty()
      .withMessage("Country code is required") // [Validation] check if country code is empty
      .matches(/^(\+\d{2,3})$/) // [Validation] check if country code starts with + and has 2 or 3 digits
      .trim(), // [Sanitization] Remove whitespace from both sides of a string
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const errMessage = errArray.map((err) => err.msg).join("\n");
      res.status(400).json({ message: errMessage });
    } else {
      apiRegister(req, res);
    }
  }
);

// @route   POST api/accounts/login
router.route("/login").post(
  // Not protected by rate limiter since there is account lock
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required") // [Validation] check if email is empty
      .normalizeEmail() // [Sanitization] Sanitize email
      .trim(), // [Sanitization] remove whitespace
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const errMessage = errArray.map((err) => err.msg).join("\n");
      res.status(400).json({ message: errMessage });
    } else {
      apiLogin(req, res);
    }
  }
);

// TODO: Remember to test this route
// @route   POST api/accounts/verify2FA
router.route('/verify2FA').post(
    [
        check('token', 'Invalid code')
            .isNumeric()                                               // [Validation] Check if token is a number
            .isLength({ min: 6, max: 6 }),                             // [Validation] 6 digits
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            res.status(400).json({ message: errMessage });
        }
        else {
            apiVerify2FA(req, res);
        }
})


// @route   GET api/getAccount
router.route("/getAccount").get(protect, apiGetAccount);

module.exports = router;
