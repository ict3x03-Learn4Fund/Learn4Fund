const express =  require("express")

const {apiGetCart, apiAddCart} = require("../controller/carts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/").get(apiGetCart)
router.route("/add").post(apiAddCart)


module.exports = router