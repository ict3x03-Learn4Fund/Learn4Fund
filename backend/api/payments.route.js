const express = require('express')
const {
    apiMakePayment,
    apiAddMethod,
    apiDeleteMethod,
    apiGetMethods} = require('../controller/payments.controller')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/:id").get(apiGetMethods)
router.route("/pay").post(apiMakePayment)
router.route("/addMethod").post(apiAddMethod)
router.route("/deleteMethod").post(apiDeleteMethod)

module.exports = router