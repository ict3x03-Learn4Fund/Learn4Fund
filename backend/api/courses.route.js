import express from "express"
import CoursesCtrl from "../dao/controller/courses.controller.js"

const router = express.Router()

router.route("/").get(CoursesCtrl.apiGetCourses)

export default router