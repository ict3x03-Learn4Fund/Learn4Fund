const express =  require("express")

const { apiRegister, apiLogin, apiGetAccount, apiVerify2FA, apiGetAllAccounts, apiLockUnlockAccount, apiRemoveAccount} = require("../controller/accounts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.route('/register').post(apiRegister)
router.route('/login').post(apiLogin)
router.route('/verify2FA').post(apiVerify2FA)
router.route('/getAccount').get(protect, apiGetAccount)
router.route('/getAllAccounts').get(protect, apiGetAllAccounts)
router.route('/lockUnlockAccount').post(protect, apiLockUnlockAccount)
router.route('/removeAccount').post(apiRemoveAccount)

module.exports = router