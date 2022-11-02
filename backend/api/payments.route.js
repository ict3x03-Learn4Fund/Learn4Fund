const express = require('express')
const {
    apiMakePayment,
    apiAddAddr,
    apiAddCard,
    apiDeleteCard,
    apiDeleteAddr,
    apiGetMethods,
    apiGetTransactions} = require('../controller/payments.controller')
const { protect } = require('../middleware/authMiddleware')
const { param, body, validationResult } = require('express-validator')
const router = express.Router()

/***
 * @desc Get payment methods
 * @route GET /v1/api/payments/:id
 * @access Private
 */
router.route("/:id").get(protect,
    [
        param('id', 'Invalid account ID')
            .notEmpty().bail()
            .isAlphanumeric()
            .bail().isLength({ min: 24, max: 24 }),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid Request" });
        }
        apiGetMethods(req, res)
})

/***
 * @desc Make payment
 * @route POST /v1/api/payments/pay
 * @access Private
 */
router.route("/pay").post(protect,
    [
        body('accountId', 'Invalid account ID')
            .notEmpty().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
        body('donationAmount', 'Invalid donation amount')
            .if(body('donationAmount').notEmpty()).isNumeric(),
        body('showDonation', 'Invalid type').isBoolean(),
        body('totalAmount', 'Amount is required')
            .notEmpty().bail()
            .isFloat({ min: 0.01 }),
        body('last4No', 'Card No. is required')
            .notEmpty().bail()
            .isInt().isLength({ min: 4, max: 4 }),
        body('cardType', 'Invalid card type').notEmpty().bail().custom(value => {
            if (value !== 'VisaCard' && value !== 'MasterCard') {
                throw new Error('Invalid card type')
            }
            return true;
        }),
        body('cardId', 'Missing card ID')
            .if(('cardId').notEmpty())
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
        body('billAddressId', 'Missing billing address ID')
            .if(body('billAddressId').notEmpty())
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid payment request" });
        }
        apiMakePayment(req, res)
})
/***
 * @desc Add payment method
 * @route POST /v1/api/payments/addAddr
 * @access Private
 */
router.route("/addAddr").post(protect,
    [
        body('accountId', 'Invalid account ID')
            .notEmpty().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
        body('billAddress.firstName', 'First name is required')
            .notEmpty().bail()
            .isLength({ min: 2, max: 25 }).bail()
            .isString().escape().trim(),
        body('billAddress.lastName', 'Last name is required')
            .notEmpty().bail()
            .isLength({ min: 2, max: 25 }).bail()
            .isString().escape().trim(),
        body('billAddress.address', 'Invalid address')
            .notEmpty().bail()
            .isString().bail()
            .isLength({ min: 5, max: 100 })
            .escape().trim(),
        body('billAddress.city', 'Invalid city')
            .notEmpty().bail()
            .isString().isLength({ min: 2, max: 35 })
            .escape().trim(),
        body('billAddress.unit', 'Invalid unit')
            .notEmpty().bail().isString().trim(),
        body('billAddress.postalCode', 'Invalid postal code')
            .notEmpty().bail()
            .isInt().isLength({ min: 6, max: 6 }),

    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid address" });
        }
        apiAddAddr(req, res)
})

router.route("/addCard").post(protect,
    [
        body('accountId', 'Invalid account ID')
            .notEmpty().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
        body('creditCard.cardNo', 'Card No. is required')
            .notEmpty().bail()
            .isInt().isLength({ min: 16, max: 16 }).bail()
            .trim(),
        body('creditCard.name', 'Name is required')
            .notEmpty().bail()
            .isString().isLength({ max: 50 }).bail()
            .trim(),
        body('creditCard.cardType', 'Invalid card type')
            .notEmpty().bail()
            .custom(value => {
                if (value !== 'VisaCard' && value !== 'MasterCard') {
                    throw new Error('Invalid card type')
            }
            return true;
        }),
        body('creditCard.expiryDate', 'Invalid expiry date')
            .notEmpty().bail()
            .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid card" });
        }
        apiAddCard(req, res)
})
router.route("/deleteCard/:id").get(protect,
    [
        param('id', 'Invalid ID')
            .notEmpty().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        apiDeleteCard(req, res)
})

router.route("/deleteAddr/:id").get(protect,
    [
        param('id', 'Invalid ID')
            .notEmpty().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid Request" });
        }
        apiDeleteAddr(req, res)
})
router.route("/getTransactions/:id").get(protect,
    [
        param('id', 'Invalid ID')
            .notEmpty().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Invalid Request" });
        }
        apiGetTransactions(req, res)
})

module.exports = router