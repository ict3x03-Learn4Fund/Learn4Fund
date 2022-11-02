const express = require("express");

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

router.route("/add").post(apiAddDonations);

router.route("/getTop5").get(apiGetTop5Donors);

router.route("/topRecent").get(apiTopRecent);

module.exports = router;