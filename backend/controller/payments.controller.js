const asyncHandler = require("express-async-handler");
const CreditCard = require("../models/creditCardModel");
const BillAddress = require("../models/billAddressModel");
const Transaction = require("../models/transactionModel");
const bcrypt = require("bcryptjs");

/***
 * @desc Get payment methods
 * @route GET /v1/api/payments/
 * @access Private
 */
const apiGetMethods = asyncHandler(async (req, res) => {
  try {
    const accountId = req.params.id
    const creditCards = await CreditCard.find({accountId: accountId})
    const billAdrrs = await BillAddress.find({accountId: accountId})
    const filteredCards = []
    for (const card in creditCards){
      const filteredCard = {
        last4No: creditCards[card].last4No,
        cardType: creditCards[card].cardType,
        expiryDate: creditCards[card].expiryDate,
        name: creditCards[card].name
      }
      filteredCards.push(filteredCard)
    }
  
    res.json({accountId, billAdrrs, filteredCards});
  } catch (error) {
    res.status(400).json({message: error.message})
  }

});

/***
 * @desc Make payment
 * @route POST /v1/api/payments/
 * @access Private
 */
const apiMakePayment = asyncHandler(async (req, res) => {
  try {
    const {accountId, donationAmount, totalAmount, checkedOutCart} = req.body
    if (!accountId){
      return res.status(400).json({message: "AccountId cannot be null."})
    }
    
  } catch (error) {

  }
  res.json({ message: "make payment" });
});

/***
 * @desc Add payment method
 * @route POST /v1/api/courses/company
 * @access Private
 */
const apiAddMethod = asyncHandler(async (req, res) => {
  try {
    const { accountId, creditCard, billAddress } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Account Id not found"});
    }

    const existingCards = await CreditCard.find({accountId: accountId})
    const existingBills = await BillAddress.find({accountId: accountId})

    const last4No = creditCard.cardNo.slice(-4)

    //Hash Card No
    const salt = await bcrypt.genSalt(10);
    const hashedCardNo = await bcrypt.hash(creditCard.cardNo, salt);
    let newCreditCard;
    let newAddr;
    let cardFlag = false;
    let billFlag = false;

    for (const card in existingCards){
      console.log(existingCards[card])
      if (await bcrypt.compare(creditCard.cardNo, existingCards[card].cardNo)){
          cardFlag = true
      }
    }
    
    for (const bill in existingBills){
      if (existingBills[bill].postalCode == billAddress.postalCode){
          billFlag = true
      }
    }
    if (!cardFlag){
      newCreditCard = await CreditCard.create({
        accountId: accountId,
        name: creditCard.name,
        cardNo: hashedCardNo,
        last4No: last4No,
        cardType: creditCard.cardType,
        expiryDate: creditCard.expiryDate
      });
    }
    if (!billFlag){
      newAddr = await BillAddress.create({
        accountId: accountId,
        firstName: billAddress.firstName,
        lastName: billAddress.lastName,
        address: billAddress.address,
        unit: billAddress.unit,
        city: billAddress.city,
        postalCode: billAddress.postalCode
      })
    }

    res.status(200).json({newCreditCard, newAddr});
  } catch (e) {
    res.status(500).json(e.message);
  }
});

/***
 * @desc Delete payment method
 * @route DELETE /v1/api/payments/delete/:id
 * @access Private
 */
const apiDeleteMethod = asyncHandler(async (req, res) => {
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
  apiMakePayment,
  apiAddMethod,
  apiDeleteMethod,
  apiGetMethods,
};
