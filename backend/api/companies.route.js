const express = require('express')
const {apiGetCompanies, apiCreateCompany} = require('../controller/companies.controller')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/").get(protect, apiGetCompanies)
router.route("/create").post(protect, apiCreateCompany)

module.exports = router