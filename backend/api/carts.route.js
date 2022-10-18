const express =  require("express")

const {apiGetCart, apiAddCart, apiDeleteCart} = require("../controller/carts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/:id").get(apiGetCart)
router.route("/add").post(apiAddCart)
router.route("/delete").post(apiDeleteCart)

module.exports = router