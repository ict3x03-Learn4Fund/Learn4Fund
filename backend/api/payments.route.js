const express = require('express')
const {
    apiMakePayment,
    apiAddAddr,
    apiAddCard,
    apiDeleteCard,
    apiDeleteAddr,
    apiGetMethods,
    apiGetTransactions} = require('../controller/payments.controller')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.route("/:id").get(apiGetMethods)
router.route("/pay").post(apiMakePayment)
router.route("/addAddr").post(apiAddAddr)
router.route("/addCard").post(apiAddCard)
router.route("/deleteCard/:id").get(apiDeleteCard)
router.route("/deleteAddr/:id").get(apiDeleteAddr)
router.route("/getTransactions/:id").get(apiGetTransactions)

module.exports = router