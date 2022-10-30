const asyncHandler = require("express-async-handler");
const Donation = require("../models/donationModel");
const Account = require("../models/accountModel");

/***
 * @desc Get All donations
 * @route GET /v1/api/donations/
 * @access Public
 */
const apiGetDonations = asyncHandler(async (req, res) => {
  try {
    const donationList = await Donation.find();

    // console.log(courses)
    res.status(200).json(donationList);
  } catch (error) {
    res.status(400).json(`message: ${error.message}`);
  }
});

/***
 * @desc Get Total Amount
 * @route GET /v1/api/donations/total
 * @access Public
 */
const apiGetTotal = asyncHandler(async (req, res) => {
  try {
    const donationList = await Donation.find();
    const total = donationList.reduce((total, a) => total + a.totalAmount, 0);
    total = total.toFixed(0);
    // console.log(courses)
    res.status(200).json(total);
  } catch (error) {
    res.status(400).json(`message: ${error.message}`);
  }
});

/***
 * @desc Add new donation
 * @route POST /v1/api/donations/add
 * @access Private
 */
const apiAddDonations = asyncHandler(async (req, res) => {
  try {
    const { accountId, amount, showDonation } = req.body;
    let donator = await Donation.findOne({ accountId: accountId }).populate({
      path: "accountId",
      select: ["firstName", "lastName"],
    });
    // if (!accountId) {
    //   return res.status(400).json({ message: "AccountId cannot be null." });
    // }
    if (!donator) {
      donator = await Donation.create({
        accountId,
      });
    }
    const donation = {amount, showDonation};
    donator.donationList.push(donation);
    donator.save();
    
    return res.status(200).json(donator);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

module.exports = {
  apiAddDonations,
  apiGetTotal,
  apiGetDonations,
};
