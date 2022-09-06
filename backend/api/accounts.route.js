import express from "express"
import AccountsCtrl from "../dao/controller/accounts.controller.js"

const router = express.Router()

router.route("/login").get(AccountsCtrl.apiLogin)
router.route("/getAll").get(AccountsCtrl.apiGetAll)

export default router