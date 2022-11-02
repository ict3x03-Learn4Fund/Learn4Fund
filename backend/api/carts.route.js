const express =  require("express")

const {apiGetCart, apiAddCart, apiDeleteCart, apiGetNo, apiAddDonationToCart, apiClearDonation} = require("../controller/carts.controller")

const { protect } = require("../middleware/authMiddleware")
const { param, body, validationResult } = require('express-validator')

const router = express.Router()


  /***
 * @desc Get Cart items
 * @route Get /v1/api/carts/
 * @access Private
 */
router.route("/:id").get(protect,
  [
    param('id', 'Invalid course id')
      .notEmpty().bail()
      .isString().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
  ],  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: "Invalid request" });
    }
    apiGetCart(req, res)
})
  
/***
 * @desc Add cart
 * @route POST /v1/api/carts/add
 * @access Private
 */
router.route("/add").post(protect,
  [
    body('accountId', 'Invalid account id')
      .notEmpty().bail()
      .isString().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
    body('cartItem.courseId', 'Invalid course id')
      .notEmpty().bail()
      .isString().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
    body('cartItem.quantity', 'Invalid quantity')
      .notEmpty().bail()
      .isInt({ min: 1 }),
  ],  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errArray = errors.array();
        const errMessage = errArray.map((err) => err.msg).join("\n");
        return res.status(400).json({ errors: errMessage });
    }
    apiAddCart(req, res)
})

/***
 * @desc Delete Cart items
 * @route Post /v1/api/carts/delete
 * @access Private
 */
router.route("/delete").post(protect,
  [
    body('accountId', 'Invalid account id')
      .notEmpty().bail()
      .isString().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
    body('courseId', 'Invalid course id')
      .notEmpty().bail()
      .isString().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errArray = errors.array();
        const errMessage = errArray.map((err) => err.msg).join("\n");
        return res.status(400).json({ errors: errMessage });
    }
    apiDeleteCart(req, res)
})

/***
 * @desc Get Cart Total number
 * @route Get /v1/api/carts/:id/totalNo
 * @access Private
 */
router.route("/:id/totalNo").get(protect,
  [
    param('id', 'Invalid account')
      .notEmpty().bail()
      .isString().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const errMessage = errArray.map((err) => err.msg).join("\n");
      return res.status(400).json({ errors: errMessage });
    }
    apiGetNo(req, res)
});

/***
 * @desc Add Donations to cart
 * @route Post /v1/api/carts/addDonation
 * @access Private
 */
router.route("/addDonation").post(protect,
    [
        body('accountId', 'Account error')
          .notEmpty().bail()
          .isAlphanumeric(),
        body('donationAmt', 'Amount must be numeric')
          .notEmpty().bail()
          .isNumeric().bail()
          .trim(),
        body('showDonation', 'Boolean value required')
          .notEmpty().bail()
          .isBoolean(),
      ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errArray = errors.array();
          const errMessage = errArray.map((err) => err.msg).join("\n");
          return res.status(400).json({ errors: errMessage });
        }
        apiAddDonationToCart(req, res)
});

/***
 * @desc Remove Donations from cart
 * @route Post /v1/api/carts/clearDonation/:id
 * @access Private
 */
router.route("/clearDonation/:id").get(
  [
    param('id', 'Invalid account')
      .notEmpty().bail()
      .isAlphanumeric().bail()
      .isLength({ min: 24, max: 24 }),
  ],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const errMessage = errArray.map((err) => err.msg).join("\n");
      return res.status(400).json({ errors: errMessage });
    }
    apiClearDonation(req, res)
});

module.exports = router