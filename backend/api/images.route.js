const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()
const { apiGetImg, uploadMiddleware, apiUpload } = require('../config/db')

router.route("/upload").post(protect, uploadMiddleware, apiUpload)
router.route("/getImg/:id").get(apiGetImg)

module.exports = router