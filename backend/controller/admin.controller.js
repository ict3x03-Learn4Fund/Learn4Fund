const asyncHandler = require("express-async-handler");
//  Account Schema
const Account = require("../models/accountModel");
const Logs = require("../models/logsModel");

/***
 * @desc Get all logs
 * @route GET /v1/api/logs/getAllLogs
 * @access Private
 */
const apiGetAllLogs = asyncHandler(async (req, res) => {         // [Logging] Get all logs
  const log = await Logs.find();
  res.json(log);

});

/***
 * @desc Get Users
 * @route GET /v1/api/accounts/getAllAccounts
 * @access Private
 */
const apiGetAllAccounts = asyncHandler(async (req, res) => {     // [Logging] Get all accounts
  const accounts = await Account.find();
  res.json(accounts);
});

/***
 * @desc Add log entry
 * @route GET /v1/api/logs/addLog
 * @access Private
 */
const apiAddLog = asyncHandler(async (req, res) => {             // [Logging] Add log entry
  const { email, type, reason } = req.body;

  Logs.create({ type: type, email: email, reason: reason })
  res.status(200).json({ message: "success" });
  console.log(result);
});


/***
 * @desc Lock or unlock user
 * @route POST /v1/api/accounts/lockUnlockAccount
 * @access Private
 */
const apiLockUnlockAccount = asyncHandler(async (req, res) => {   // [Logging] Lock or unlock account
  console.log(req.body)
  const { email, lockedOut } = req.body;

  var isLock = null
  if (lockedOut == false) {
    isLock = true
    console.log("isLock is true")
  } else {
    isLock = false
    console.log("isLock is false")
  }
  if (email == null) {
    console.log(email)
    res.status(200).json({ message: "Failed" });
  } else {
    Account.updateOne({ email: email }, { $set: { "lockedOut": isLock } }, function (result) {
      res.status(200).json({ message: "success" });
      console.log(result);
    });
  }

});

/***
* @desc Remove a user
* @route POST /v1/api/accounts/deleteAccount
* @access Private
*/
const apiDeleteAccount = asyncHandler(async (req, res) => {     // [Logging] Delete account
  console.log(req.body)
  const { email } = req.body;

  Account.deleteOne({ email: email }, function (result) {
    res.status(200).json({ message: "success" });
    console.log(result);
  });

});

module.exports = {
  apiGetAllLogs,
  apiGetAllAccounts,
  apiAddLog,
  apiLockUnlockAccount,
  apiDeleteAccount,
};