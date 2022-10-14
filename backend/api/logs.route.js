const express = require('express')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()
const { apiLog } = require('../config/db')
const Logs = require("../models/logsModel");
const asyncHandler = require("express-async-handler");

/***
 * @desc Get all logs
 * @route GET /v1/api/logs/getAllLogs
 * @access Private
 */
 const getAllLogs = asyncHandler(async (req, res) => {    
    const log = await Logs.find();
    res.json(log);        
  
  });

/***
 * @desc Add log entry
 * @route GET /v1/api/logs/addLog
 * @access Private
 */
 const addLog = asyncHandler(async (req, res) => {
  const { email, type, reason } = req.body;  

  Logs.create({ type: type, email: email, reason: reason })
  res.status(200).json({"msg": "success" });
    console.log(result);
});

router.route('/getAllLogs').get(protect, getAllLogs) // rmb to protect
router.route('/addLog').post(protect, addLog) // rmb to protect

module.exports = router