const express =  require("express")

const { apiRegister, apiLogin, apiGetAccount, apiVerify2FA} = require("../controller/accounts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.post('/register', apiRegister)
router.post('/login', apiLogin)
router.post('/verify2FA', apiVerify2FA)
router.get('/getAccount', protect, apiGetAccount)


module.exports = router