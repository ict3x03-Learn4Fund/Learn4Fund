const asyncHandler = require('express-async-handler')
const Voucher = require("../models/voucherModel");
const bcrypt = require("bcryptjs");


const apiVerifyVoucher = asyncHandler(async (req, res) => {

  try {
    const voucher = await Voucher.findOne({ _id: req.body.voucherId });
    if (!voucher) {
      throw new Error("Voucher doesn't exists");
    }
    const hashedCode = await bcrypt.hash(req.body.voucherCode, voucher.salt);

    if (!voucher.voucherCode === hashedCode) {
      throw new Error("Voucher code is invalid");
    }
    res.status(200).json({ message: 'Voucher Exist', accountId: voucher.accountId, courseId: voucher.courseId, expiryDate: voucher.expiryDate });
  } catch (e) {
    res.status(400).json(`message: ${e.message}`);
  }
});

module.exports = {
  apiVerifyVoucher
}
