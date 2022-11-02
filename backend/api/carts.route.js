const express =  require("express")

const {apiGetCart, apiAddCart, apiDeleteCart, apiGetNo, apiAddDonationToCart, apiClearDonation} = require("../controller/carts.controller")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/:id").get(apiGetCart)
router.route("/add").post(apiAddCart)
router.route("/delete").post(apiDeleteCart)
router.route("/:id/totalNo").get(protect, apiGetNo)
router.route("/addDonation").post(apiAddDonationToCart)
router.route("/clearDonation/:id").get(apiClearDonation)

module.exports = router