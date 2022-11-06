// [Admin Route] - Routes for admin page only

const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { apiGetAllLogs, apiGetAllAccounts, apiAddLog, apiLockUnlockAccount, apiDeleteAccount } = require("../controller/admin.controller")
const router = express.Router()
const { check, validationResult } = require("express-validator"); // [Validation, Sanitization]

// @route   GET /api/admin/getAllLogs
router.route('/getAllLogs/:userId').get(protect,[
    check("userId", "Invalid account ID")
      .notEmpty()
      .bail()
      .isAlphanumeric()
      .bail()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error getting all logs. Try again later" });
    }
    apiGetAllLogs(req, res);
  })                 // [Logging] Get all logs

// @route   GET api/admin/getAllAccounts
router.route('/getAllAccounts/:userId').get(protect,[
    check("userId", "Invalid account ID")
      .notEmpty()
      .bail()
      .isAlphanumeric()
      .bail()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error getting all account. Try again later" });
    }
    apiGetAllAccounts(req, res);
  })         // [Logging] Get all accounts

// @route   PUT api/admin/lockUnlockAccount
router.route('/lockUnlockAccount/:userId').post(protect, [
    check("userId", "Invalid account ID")
      .notEmpty()
      .bail()
      .isAlphanumeric()
      .bail()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error unlocking account. Try again later" });
    }
    apiLockUnlockAccount(req, res);
  })  // [Logging] Lock or unlock account

// @route   DELETE api/admin/deleteAccount
router.route('/deleteAccount/:userId').post(protect, [
    check("userId", "Invalid account ID")
      .notEmpty()
      .bail()
      .isAlphanumeric()
      .bail()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error deleting account" });
    }
    apiDeleteAccount(req, res);
  })          // [Logging] Delete account

// @route   POST api/admin/addLog
router.route('/addLog/:userId').post(protect, [
    check("userId", "Invalid account ID")
      .notEmpty()
      .bail()
      .isAlphanumeric()
      .bail()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Error adding logs." });
    }
    apiAddLog(req, res);
  })                        // [Logging] Add log entry


module.exports = router