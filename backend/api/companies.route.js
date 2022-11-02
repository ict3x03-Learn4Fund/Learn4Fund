const express = require('express')
const { apiGetCompanies, apiCreateCompany, apiVerifyVoucher } = require('../controller/companies.controller')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()
const { check, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");                      // [DoS] Prevent brute force attacks
const Company = require("../models/companyModel"); // to access the DB
const Logs = require("../models/logsModel");

const verifyVoucherLimiter = rateLimit({                                  // [DoS] Prevent brute force attacks on 2FA
    windowMs: 60 * 60 * 1000, // 15 mins
    max: 50, // Limit each IP to 5 code verification requests per 15 mins
    message: "Tries exceeded 50, please try again in 60 mins",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) => {
        // Send logs to db
        Logs.create({
            email: request.body["companyId"],
            type: "auth",
            reason: "Attempt to verify voucher was rate limited.",
            time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
        });
        response.status(options.statusCode).send(options.message)
    }
});

router.route("/").get(protect, apiGetCompanies)
router.route("/create").post(protect, apiCreateCompany)
router.route("/verifyVoucher").post(verifyVoucherLimiter,
    [
        check("companyId", "companyId is invalid")
            .notEmpty()
            .withMessage("companyId is required").bail()                        // [Validation] check if companyId is empty                                                                                             // [Validation] check if companyId is number
            .isLength({ min: 24, max: 24 }).bail()                      // [Validation] Check if companyId is between 24 digits
            .matches(/^[a-z0-9]+$/i).bail()                                   // [Validation] check if companyId is valid  
            .trim() // Remove whitespace from both sides of a string
            .custom(async (value) => {                                      // [Validation] Check if email already exists
                const companyExist = await Company.findOne({ _id: value });
                if (!companyExist) {
                    throw new Error("Company doesn't exists");
                }
                return true;
            }),
        check("voucherId", "voucherId is invalid")
            .notEmpty()
            .withMessage("voucherId is required").bail()                        // [Validation] check if companyId is empty                                                                                             // [Validation] check if companyId is number
            .isLength({ min: 24, max: 24 }).bail()                      // [Validation] Check if companyId is between 24 digits
            .isString().bail()                                   // [Validation] check if companyId is valid  
            .trim(), // Remove whitespace from both sides of a string
        check("voucherCode", "Voucher code is invalid")
            .notEmpty()
            .withMessage("Voucher code is required").bail()
            .isLength({ min: 36, max: 36 }).bail()
            .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)                                     // [Validation] check if country code starts with + and has 2 or 3 digits
            .trim(),                                                        // [Sanitization] Remove whitespace from both sides of a string
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            res.status(400).json({ message: errMessage });
        } else {
            apiVerifyVoucher(req, res);
        }
    }
)

module.exports = router