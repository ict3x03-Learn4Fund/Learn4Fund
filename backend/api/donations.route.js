const express = require("express");

const {
  apiAddDonations,
  apiGetTotal,
  apiGetDonations,
} = require("../controller/donations.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(apiGetDonations);
router.route("/total").get(apiGetTotal);
router.route("/add").post(apiAddDonations);

module.exports = router;