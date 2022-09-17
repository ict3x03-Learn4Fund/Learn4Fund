const express =  require("express")

const { apiRegister, apiLogin, apiGetAccount} = require("../controller/accounts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.post('/register', apiRegister)
router.post('/login', apiLogin)
router.get('/getAccount', protect, apiGetAccount)

module.exports = router