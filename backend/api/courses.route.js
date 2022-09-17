import express from "express"
import CoursesCtrl from "../controller/courses.controller.js"
import AccountsCtrl from "../controller/accounts.controller.js"
import CompaniesController from "../controller/companies.controller.js"
import asyncHandler from "express-async-handler"

const router = express.Router()


// verify login
router.route("/accounts/login").get(asyncHandler(AccountsCtrl.apiLogin))
// get all accounts <- for convenience, should delete later
router.route("/accounts/getAll").get(asyncHandler(AccountsCtrl.apiGetAll))

// get all courses
router.route("/getAll").get(asyncHandler(CoursesCtrl.apiGetCourses))

// create new course
router.route("/createCourse").post(asyncHandler(CoursesCtrl.apiCreateCourse))

// update existing course
router.route("/updateCourse/:id").put(asyncHandler(CoursesCtrl.apiUpdateCourse))

// delete existing course
router.route("/deleteCourse/:id").delete(asyncHandler(CoursesCtrl.apiDeleteCourse))


router.route("/company").get(asyncHandler(CompaniesController.apiGetCompanies))

export default router