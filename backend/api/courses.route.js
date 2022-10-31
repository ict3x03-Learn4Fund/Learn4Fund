const express = require('express')
const {
    apiGetCourses,
    apiCreateCourse,
    apiUpdateCourse,
    apiDeleteCourse,} = require('../controller/courses.controller')
const { protect } = require('../middleware/authMiddleware')
const { param, body, validationResult } = require('express-validator')
const router = express.Router()

// GET /api/courses public
router.route("/").get(apiGetCourses)

// POST /api/courses private
router.route("/create").post(protect,               //TODO: Check if admin
    [
        body('courseName', 'Invalid course name')
            .notEmpty().bail()
            .isAscii().bail()
            .escape().trim(),
        //body('courseImg').isMIMEType('image/jpeg', 'image/png').bail(),
        body('courseOriginalPrice', 'Invalid price')
            .notEmpty().bail()
            .isNumeric(), // Checks if string is of a number format, can be int/float
        body('courseDiscountedPrice', 'Invalid discounted price')
            .notEmpty().bail()
            .isNumeric(),
        body('canBeDiscounted', 'Type Error')
            .isBoolean(),
        body('courseType', 'Invalid course type')
            .notEmpty().bail()
            .isString(),
        body('courseDescription', 'Invalid course description')
            .isString().bail()
            .escape().trim(),
        body('courseTutor', 'Tutor name is invalid')
            .notEmpty().bail()
            .isString().bail()
            .trim(),
        body('quantity', 'Invalid quantity')
            .notEmpty().bail()
            .isInt({min: 1}),
        body('company', 'Company is invalid')
            .if(body('company').notEmpty())
            .notEmpty().bail()
            .isString().bail()
            .isAlpha().trim(),

    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            return res.status(400).json({ errors: errMessage });
        }
        apiCreateCourse(req, res)
    }
) 
    
// PUT /api/courses/:id private
router.route("/update/:id").put(protect,
    [
        param('id', 'Invalid course id')
            .notEmpty().bail()
            .isString().bail()
            .isAlphanumeric().bail()
            .isLength({min: 24, max: 24}),
        body('courseName', 'Invalid course name')
            .if(body('courseName').notEmpty())
            .isAscii().bail()
            .escape().trim(),
        //body('courseImg').isMIMEType('image/jpeg', 'image/png').bail(),
        body('courseOriginalPrice', 'Invalid price')
            .if(body('courseOriginalPrice').notEmpty())
            .isNumeric(), // Checks if string is of a number format, can be int/float
        body('courseDiscountedPrice', 'Invalid discounted price')
            .if(body('courseDiscountedPrice').notEmpty())
            .notEmpty().bail()
            .isNumeric(),
        body('canBeDiscounted', 'Type Error')
            .if(body('canBeDiscounted').notEmpty())
            .isBoolean(),
        body('courseType', 'Invalid course type')
            .if(body('courseType').notEmpty())
            .notEmpty().bail()
            .isString(),
        body('courseDescription', 'Invalid course description')
            .if(body('courseDescription').notEmpty())
            .isString().bail()
            .escape().trim(),
        body('courseTutor', 'Tutor name is invalid')
            .if(body('courseTutor').notEmpty())
            .notEmpty().bail()
            .isString().bail()
            .trim(),
        body('company', 'Company is invalid')
            .if(body('company').notEmpty())
            .notEmpty().bail()
            .isString().bail()
            .isAlpha().trim(),
        body('quantity', 'Invalid quantity')
            .notEmpty().bail()
            .isInt({min: 1}),

    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            return res.status(400).json({ errors: errMessage });
        }
        apiUpdateCourse(req, res)
}) //TODO: Check if admin
    
// POST /api/courses/:id private
router.route("/delete/:id").post(protect,
    [
        param('id', 'Invalid course id')
            .notEmpty().bail()
            .isString().bail()
            .isAlphanumeric().bail()
            .isLength({ min: 24, max: 24 }),
    ],(req, res) => {
        console.log(req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errArray = errors.array();
            const errMessage = errArray.map((err) => err.msg).join("\n");
            return res.status(400).json({ errors: errMessage });
        }
        apiDeleteCourse(req, res)
    }) //TODO: Check if admin

module.exports = router