const express =  require("express")

const { apiRegister, apiLogin, apiGetAccount, apiVerify2FA} = require("../controller/accounts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.route('/register').post(apiRegister)
router.route('/login').post(apiLogin)
router.route('/verify2FA').post(apiVerify2FA)
router.route('/getAccount').get(protect, apiGetAccount)

module.exports = router