const asyncHandler = require('express-async-handler')
const Company = require("../models/companyModel");
const Voucher = require("../models/voucherModel");
const bcrypt = require("bcryptjs");
/***
 * @desc Get All companies
 * @route GET /v1/api/companies
 * @access Private
 */
const apiGetCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

/***
 * @desc Create new company
 * @route GET /v1/api/courses/company
 * @access Private
 */
const apiCreateCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.create({
      companyName: req.body.companyName,
      companyImg: req.body.companyImg,
      companyAddress: req.body.companyAddress,
    });
    res.status(200).json(company);
  } catch (e) {
    res.status(500).json(e);
  }
});

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
  apiGetCompanies,
  apiCreateCompany,
  apiVerifyVoucher
}
