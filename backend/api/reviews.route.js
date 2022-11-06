const express = require("express");
const { apiGetReviews, apiCreateReview, apiVerifyReview } = require("../controller/reviews.controller");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const { check, validationResult , param} = require("express-validator")

// @route   GET api/reviews/
router.route("/:id").get(apiGetReviews);

// @route   POST api/reviews/create
router.route("/create/:userId").post(protect,
    [
        param('userId', 'Invalid user Id')
        .notEmpty().bail()
        .isString().bail()
        .isAlphanumeric().bail()
        .isLength({ min: 24, max: 24 }),
        check("description", "Description is required").notEmpty().escape(), //[validation and sanitization]
        check("accountId", "Please login").notEmpty(), //[validation]
        check("courseId", "Error").notEmpty(), //[validation]
    ], (req, res) => {
        const errors = validationResult(req); //[Error message]
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            res.status(400).json({ message: errMessage }); //[Error message]
        }
        else {
            apiCreateReview(req, res); //[Create review]
        }
    });

// @route POST api/reviews/verifyReview
router.route("/verifyReview/:userId").post(protect, apiVerifyReview)


module.exports = router;