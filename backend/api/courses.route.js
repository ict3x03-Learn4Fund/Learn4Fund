const express = require('express')
const {
    apiGetCourses,
    apiCreateCourse,
    apiUpdateCourse,
    apiDeleteCourse, } = require('../controller/courses.controller')
const { protect } = require('../middleware/authMiddleware')
const { param, body, validationResult } = require('express-validator')
const router = express.Router()

// GET /api/courses public
router.route("/").get(apiGetCourses)

// POST /api/courses private
router.route("/create/:userId").post(protect,
    [
        param('userId', 'Invalid user Id')
        .notEmpty().bail()
        .isString().bail()
        .isAlphanumeric().bail()
        .isLength({ min: 24, max: 24 }),
        body('courseName', 'Invalid course name')
            .notEmpty().bail()
            .isString().bail()
            .isLength({ max: 100 })
            .escape().trim(),
        body('courseOriginalPrice', 'Invalid price')
            .notEmpty().bail()
            .isFloat({ min: 0 }),
        body('courseDiscountedPrice', 'Invalid discounted price')
            .notEmpty().bail()
            .isFloat({ min: 0 }),
        body('canBeDiscounted', 'Type Error')
            .isBoolean(),
        body('courseType', 'Invalid course type')
            .notEmpty().bail()
            .isString(),
        body('courseDescription', 'Invalid course description')
            .notEmpty().bail()
            .isString().bail()
            .isLength({ max: 500 })
            .escape().trim(),
        body('courseTutor', 'Tutor name is invalid')
            .notEmpty().bail()
            .isString().bail()
            .isLength({ max: 50 })
            .escape().trim(),
        body('quantity', 'Invalid quantity')
            .notEmpty().bail()
            .isInt({ min: 1 }),
        body('company', 'Company is invalid')
            .if(body('company').notEmpty())
            .notEmpty().bail()
            .isString().bail()
            .escape().trim(),

    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            return res.status(400).json({ message: errMessage });
        }
        apiCreateCourse(req, res)
    }
)

// PUT /api/courses/:id private
router.route("/update/:id/:userId").put(protect,
    [
        param('userId', 'Invalid user Id')
        .notEmpty().bail()
        .isString().bail()
        .isAlphanumeric().bail()
        .isLength({ min: 24, max: 24 }),
        param('id', 'Invalid course id')
            .notEmpty().bail()
            .isString().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
        body('courseName', 'Invalid course name')
            .if(body('courseName').notEmpty())
            .isString().bail()
            .isLength({ max: 100 })
            .escape().trim(),
        body('courseOriginalPrice', 'Invalid price')
            .if(body('courseOriginalPrice').notEmpty())
            .isFloat({ min: 0 }),
        body('courseDiscountedPrice', 'Invalid discounted price')
            .if(body('courseDiscountedPrice').notEmpty())
            .isFloat({ min: 0 }),
        body('canBeDiscounted', 'Type Error')
            .if(body('canBeDiscounted').notEmpty())
            .isBoolean(),
        body('courseType', 'Invalid course type')
            .if(body('courseType').notEmpty())
            .isString(),
        body('courseDescription', 'Invalid course description')
            .if(body('courseDescription').notEmpty())
            .isString().bail()
            .isLength({ max: 500 })
            .escape().trim(),
        body('courseTutor', 'Tutor name is invalid')
            .if(body('courseTutor').notEmpty())
            .isString().bail()
            .isLength({ max: 50 })
            .escape().trim(),
        body('company', 'Company is invalid')
            .if(body('company').notEmpty())
            .isString().bail()
            .escape().trim(),
        body('quantity', 'Invalid quantity')
            .if(body('quantity').notEmpty())
            .isInt({ min: 1 }),

    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            return res.status(400).json({ message: errMessage });
        }
        apiUpdateCourse(req, res)
    })

// POST /api/courses/delete/:id private
router.route("/delete/:id/:userId").post(protect,
    [
        param('userId', 'Invalid user Id')
        .notEmpty().bail()
        .isString().bail()
        .isAlphanumeric().bail()
        .isLength({ min: 24, max: 24 }),
        param('id', 'Invalid course id')
            .notEmpty().bail()
            .isString().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
    ], (req, res) => {
        console.log(req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            return res.status(400).json({ message: errMessage });
        }
        apiDeleteCourse(req, res)
    })
module.exports = router