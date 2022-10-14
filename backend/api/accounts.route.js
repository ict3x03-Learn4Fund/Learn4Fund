const express =  require("express")

const { apiRegister, apiLogin, apiGetAccount, apiVerify2FA, apiGetAllAccounts, apiLockUnlockAccount, apiRemoveAccount} = require("../controller/accounts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()


const { check, validationResult } = require('express-validator')
const Account = require("../models/accountModel");

router.route('/register').post(
    [
        check('email')
            .notEmpty().withMessage('Email is required')
            .isLength({ max: 255 }).withMessage('Email is too long')
            .isEmail().withMessage('Email is invalid')
            .custom(async (value) => {
                const accountExist = await Account.findOne({ email: value });
                if (accountExist) {
                    throw new Error("Account already exists");
                }
                return true;
            }),
        check('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 12 }).withMessage("Password is too weak"),
        check('firstName')
            .notEmpty().withMessage('First name is required')
            .isLength({ max: 20 }).withMessage('First name is too long')
            .isAlpha().withMessage('First name must be alphabetic'),
        check('lastName')
            .notEmpty().withMessage('Last name is required')
            .isLength({ max: 20 }).withMessage('Last name is too long')
            .isAlpha().withMessage('Last name must be alphabetic'),
        check('phone')
            .notEmpty().withMessage('Phone number is required')
            .isMobilePhone().withMessage('Phone number is invalid')
            .matches(/^[0-9]*$/).withMessage('Phone number is invalid'),
        check('countryCode')
            .notEmpty().withMessage("Country code is required")
            .matches(/^(\+\d{2,3})$/).withMessage("Country code is invalid"),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            res.status(400).json({ message: errMessage });
        }
        else {
            apiRegister (req, res);
        }
    })
router.route('/login').post(
    [
        check('email')
            .notEmpty().withMessage('Email is required'),
        check('password').notEmpty().withMessage('Password is required'),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            res.status(400).json({ message: errMessage });
        }
        else {
            apiLogin(req, res);
        }
    })
router.route('/verify2FA').post(apiVerify2FA)
router.route('/getAccount').get(protect, apiGetAccount)
router.route('/getAllAccounts').get(protect, apiGetAllAccounts)
router.route('/lockUnlockAccount').post(protect, apiLockUnlockAccount)
router.route('/removeAccount').post(apiRemoveAccount)

module.exports = router