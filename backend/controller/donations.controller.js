const asyncHandler = require("express-async-handler");
const Donation = require("../models/donationModel");

/***
 * @desc Get All donations
 * @route GET /v1/api/donations/
 * @access Public
 */
const apiGetDonations = asyncHandler(async (req, res) => {
  try {
    const donationList = await Donation.find();
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
    let total = 0;
    donationList.map((donor) => {
      donor.donationList.map((object) => {
        total += parseInt(object.amount);
      })
    })
    res.status(200).json({ total: total });
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
    const donation = { amount, showDonation, date: new Date() };
    donator.donationList.push(donation);
    donator.markModified("donationList")
    donator.save();

    return res.status(200).json(donator);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// get top 5 donators based on donation amount in descending order
const apiGetTop5Donors = asyncHandler(async (req, res) => {
  try {
    const donors = await Donation.find().populate("accountId");
    let sortedList = [];
    donors.map((user) => {
      let totalAmt = 0
      let showDonation = false;
      const donationListLen = user.donationList.length
      user.donationList.map((donation, index) => {
        totalAmt += parseInt(donation.amount);
        if ((index +1 == donationListLen) && donation.showDonation){
          showDonation = true;
        }
      });
      if (showDonation){
        const date = new Date(user.updatedAt)
        const niceD = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        const firstName = user.accountId.firstName != null ? user.accountId.firstName : "Deleted Account"
        const donor = { name: firstName , amount: totalAmt, date: niceD }
        sortedList.push(donor)
      }
    });
    sortedList.sort((a, b) => {
      return b.amount - a.amount;
    })
    const top5donors = sortedList.slice(0, 5);
    return res.status(200).json(top5donors)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// get top 5 donators based on donation amount in descending order
const apiTopRecent = asyncHandler(async (req, res) => {
  try {
    const donors = await Donation.find().populate("accountId");
    let donorLists = [];
    donors.map((donor) => {
      donor.donationList.map((object) => {
        if (object.showDonation) {
          const d = object.date
          const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
          const firstName = donor.accountId.firstName != null ? donor.accountId.firstName : "Deleted Account"
          const newObject = { name: firstName, amount: object.amount, date: date }
          donorLists.push(newObject);
        }
      })
    })
    donorLists = donorLists.sort((a, b) => {
      return b.date - a.date
    })
    donorLists = donorLists.slice(0, 10)
    return res.status(200).json(donorLists)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// get recent donors 

module.exports = {
  apiAddDonations,
  apiGetTotal,
  apiGetDonations,
  apiGetTop5Donors,
  apiTopRecent
};
