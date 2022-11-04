const express = require("express");
const { protect } = require('../middleware/authMiddleware')
const { body, validationResult } = require('express-validator')

const {
  apiAddDonations,
  apiGetTotal,
  apiGetDonations,
  apiGetTop5Donors,
  apiTopRecent,
} = require("../controller/donations.controller");

const router = express.Router();

router.route("/").get(apiGetDonations);

router.route("/total").get(apiGetTotal);

router.route("/add").post(protect,
  [
    body("donationAmt", "Enter amount between 0.01 to 10 million").isLength({ min: 0, max: 8 }).isFloat({ min: 0.01, max: 10000000 }),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const errMessage = errArray.map((err) => err.msg).join("\n");
      return res.status(400).json({ message: errMessage });
    }
    apiAddDonations(req, res);
  });

router.route("/getTop5").get(apiGetTop5Donors);

router.route("/topRecent").get(apiTopRecent);

module.exports = router;