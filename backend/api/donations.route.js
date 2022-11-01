const express = require("express");

const {
  apiAddDonations,
  apiGetTotal,
  apiGetDonations,
  apiGetTop5Donors,
  apiTopRecent,
} = require("../controller/donations.controller");

const { protect } = require("../middleware/authMiddleware");
const { body, validationResult } = require('express-validator')

const router = express.Router();

router.route("/").get(apiGetDonations);

router.route("/total").get(apiGetTotal);

router.route("/add").post(
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
    apiAddDonations(req, res)
  });

  router.route("/getTop5").get(apiGetTop5Donors);

  router.route("/topRecent").get(apiTopRecent);

module.exports = router;