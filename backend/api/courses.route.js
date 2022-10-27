const express = require('express')
const {
    apiGetCourses,
    apiCreateCourse,
    apiUpdateCourse,
    apiDeleteCourse,} = require('../controller/courses.controller')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/").get(apiGetCourses)
router.route("/create").post(apiCreateCourse)
router.route("/update/:id").put(apiUpdateCourse)
router.route("/delete/:id").post(apiDeleteCourse)

module.exports = router