// [Admin Route] - Routes for admin page only

const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { apiGetAllLogs, apiGetAllAccounts, apiAddLog, apiLockUnlockAccount, apiDeleteAccount } = require("../controller/admin.controller")
const router = express.Router()

// @route   GET /api/admin/getAllLogs
router.route('/getAllLogs').get(protect, apiGetAllLogs)                 // [Logging] Get all logs

// @route   GET api/admin/getAllAccounts
router.route('/getAllAccounts').get(protect, apiGetAllAccounts)         // [Logging] Get all accounts

// @route   PUT api/admin/lockUnlockAccount
router.route('/lockUnlockAccount').post(protect, apiLockUnlockAccount)  // [Logging] Lock or unlock account

// @route   DELETE api/admin/deleteAccount
router.route('/deleteAccount').post(protect, apiDeleteAccount)          // [Logging] Delete account

// @route   POST api/admin/addLog
router.route('/addLog').post(protect, apiAddLog)                        // [Logging] Add log entry


module.exports = router