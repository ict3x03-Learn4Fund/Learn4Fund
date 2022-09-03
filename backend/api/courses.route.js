import express from "express"
import CoursesCtrl from "../dao/courses.controller.js"

const router = express.Router()

router.route("/").get(CoursesCtrl.apiGetCourses)

export default router