const express =  require("express")

const {apiGetCart, apiAddCart, apiDeleteCart, apiGetNo, apiAddDonationToCart, apiClearDonation} = require("../controller/carts.controller")

const { protect } = require("../middleware/authMiddleware")
const { body, validationResult } = require('express-validator')

const router = express.Router()

router.route("/:id").get(apiGetCart)
router.route("/add").post(apiAddCart)
router.route("/delete").post(apiDeleteCart)
router.route("/:id/totalNo").get(protect, apiGetNo)
router.route("/addDonation").post(
    [
        body('accountId', 'Account error')
          .notEmpty().bail()
          .isAlphanumeric(),
        body('amount', 'Amount must be numeric')
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

router.route("/clearDonation/:id").get(apiClearDonation)

module.exports = router