const asyncHandler = require('express-async-handler')
const Company = require("../models/companyModel");

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

module.exports = {
  apiGetCompanies,
  apiCreateCompany
}
