const express = require("express");
const { apiGetReviews, apiCreateReview } = require("../controller/reviews.controller");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/:id").get(apiGetReviews);
router.route("/create").post(apiCreateReview)

module.exports = router;
