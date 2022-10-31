const asyncHandler = require("express-async-handler");
const CreditCard = require("../models/creditCardModel");
const BillAddress = require("../models/billAddressModel");
const Transaction = require("../models/transactionModel");
const Course = require("../models/courseModel");
const Voucher = require("../models/voucherModel");
const Cart = require("../models/cartModel");
const Donation = require("../models/donationModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../middleware/mailer.js");
const Account = require("../models/accountModel");

//// encryption code
// let decryptedData = decipher.update(encryptedCode, "hex", "utf-8")
// decryptedData += decipher.final("utf8")

/***
 * @desc Get payment methods
 * @route GET /v1/api/payments/
 * @access Private
 */
const apiGetMethods = asyncHandler(async (req, res) => {
  try {
    const accountId = req.params.id;
    const creditCards = await CreditCard.find({ accountId: accountId });
    const billAddrs = await BillAddress.find({ accountId: accountId });
    const filteredCards = [];
    for (const card in creditCards) {
      const filteredCard = {
        _id: creditCards[card]._id,
        last4No: creditCards[card].last4No,
        cardType: creditCards[card].cardType,
        expiryDate: creditCards[card].expiryDate,
        name: creditCards[card].name,
      };
      filteredCards.push(filteredCard);
    }

    res.json({ accountId, billAddrs, filteredCards });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/***
 * @desc Make payment
 * @route POST /v1/api/payments/pay
 * @access Private
 */
const apiMakePayment = asyncHandler(async (req, res) => {
  try {
    const {
      accountId,
      donationAmount,
      showDonation,
      totalAmount,
      checkedOutCart,
      billAddressId,
      cardId,
      cardType,
      last4No,
    } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "AccountId cannot be null." });
    }
    const user = await Account.findById(accountId);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // reduce quantity from courses from checkedout cart
    const courses = await Course.find();
    for (const course in courses) {
      for (const purchased in checkedOutCart) {
        if (
          courses[course]._id == checkedOutCart[purchased].cartItem.courseId
        ) {
          if (
            courses[course].quantity >=
            checkedOutCart[purchased].cartItem.quantity
          ) {
            courses[course].quantity -=
              checkedOutCart[purchased].cartItem.quantity;
            console.log("Course purchased: ", courses[course].quantity);
            courses[course].save();
          } else {
            return res.status(400).json({
              message: "Quantity purchased more than the stocks left.",
            });
          }
        }
      }
    }

    // delete cart items that are in checkedout cart
    const existingCart = await Cart.findOne({ accountId: accountId });
    const idArray = [];
    for (const purchased in checkedOutCart) {
      idArray.push(checkedOutCart[purchased].cartItem.courseId);
    }
    let newCartList = existingCart.coursesAdded.filter(
      (cart) => !idArray.includes(cart.cartItem.courseId)
    );
    existingCart.donationAmt = 0;
    existingCart.coursesAdded = newCartList;
    existingCart.markModified("coursesAdded");
    existingCart.markModified("donationAmount");
    existingCart.save();

    // create transaction document
    const transaction = await Transaction.create({
      donationAmount: donationAmount,
      totalAmount: totalAmount,
      checkedOutCart: checkedOutCart,
      accountId: accountId,
      billAddressId: billAddressId,
      cardId: cardId,
      last4No: last4No,
      cardType: cardType,
    });

    // create donation document
    let donor = await Donation.findOne({ accountId: accountId });
    if (!donor) {
      donor = await Donation.create({ accountId: accountId });
    }
    if (donationAmount != 0) {
      const newDonation = {
        amount: donationAmount,
        showDonation: showDonation,
        date: new Date()
      };
      donor.donationList.push(newDonation);
      donor.markModified("donationList")
      donor.save();
    }

    // create vouchers using uuid
    // encrypt vouchers and save to voucher document
    const emailList = [];
    const voucherList = [];
    const expiryDate = new Date(+new Date() + 365 * 24 * 60 * 60 * 1000);
    for (const purchased in checkedOutCart) {
      const courseInfo = await Course.findById(
        checkedOutCart[purchased].cartItem.courseId
      );
      for (
        let quantity = 0;
        quantity < checkedOutCart[purchased].cartItem.quantity;
        quantity++
      ) {
        const code = uuidv4();
        const emailVoucher = {
          courseName: courseInfo.courseName,
          voucherCode: code,
          expiryDate: expiryDate,
        };
        emailList.push(emailVoucher);
        const salt = await bcrypt.genSalt(10);
        const hashedCode = await bcrypt.hash(code, salt);
        const voucher = await Voucher.create({
          courseId: checkedOutCart[purchased].cartItem.courseId,
          voucherCode: hashedCode,
          accountId: accountId,
          transactionId: transaction._id,
        });
        voucherList.push(voucher);
      }
    }
    console.log(emailList);

    let message = `Congratulations on your new purchases! \n The following are your course vouchers: \n`;
    let list = "";
    emailList.map((value) => {
      list = `${value.courseName}:  ${value.voucherCode} \n`;
      message += list;
    });
    message += `The expiry dates for all the vouchers are: ${emailList[0].expiryDate}. \nThanks for purchasing!`;

    // send vouchers to user's email
    const success = await sendEmail(
      user.email,
      "New Transaction Made",
      message
    );
    if (success) {
      return res.status(200).json({ transaction, voucherList });
    } else {
      return res.status(400).json({ message: "failed to send email" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/***
 * @desc Add payment method
 * @route POST /v1/api/payments/addCard
 * @access Private
 */
const apiAddCard = asyncHandler(async (req, res) => {
  try {
    const { accountId, creditCard } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Account Id not found" });
    }

    const existingCards = await CreditCard.find({ accountId: accountId });

    const last4No = creditCard.cardNo.slice(-4);

    //Hash Card No
    const salt = await bcrypt.genSalt(10);
    const hashedCardNo = await bcrypt.hash(creditCard.cardNo, salt);
    let newCreditCard;
    let cardFlag = false;

    for (const card in existingCards) {
      console.log(existingCards[card]);
      if (await bcrypt.compare(creditCard.cardNo, existingCards[card].cardNo)) {
        cardFlag = true;
      }
    }

    if (!cardFlag) {
      newCreditCard = await CreditCard.create({
        accountId: accountId,
        name: creditCard.name,
        cardNo: hashedCardNo,
        last4No: last4No,
        cardType: creditCard.cardType,
        expiryDate: creditCard.expiryDate,
      });
      return res.status(200).json({ id: newCreditCard._id });
    }
    return res.status(400).json({ message: "Card already exists." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/***
 * @desc Add payment method
 * @route POST /v1/api/payments/addAddr
 * @access Private
 */
const apiAddAddr = asyncHandler(async (req, res) => {
  try {
    const { accountId, billAddress } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Account Id not found" });
    }

    const existingBills = await BillAddress.find({ accountId: accountId });

    let newAddr;
    let billFlag = false;

    for (const bill in existingBills) {
      if (existingBills[bill].postalCode == billAddress.postalCode) {
        billFlag = true;
      }
    }
    if (!billFlag) {
      newAddr = await BillAddress.create({
        accountId: accountId,
        firstName: billAddress.firstName,
        lastName: billAddress.lastName,
        address: billAddress.address,
        unit: billAddress.unit,
        city: billAddress.city,
        postalCode: billAddress.postalCode,
      });
      return res.status(200).json({ id: newAddr._id });
    }
    return res.status(400).json({ message: "Address already exists." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/***
 * @desc Delete payment addr
 * @route GET /v1/api/payments/deleteAddr/:id
 * @access Private
 */
const apiDeleteAddr = asyncHandler(async (req, res) => {
  try {
    const addrId = req.params.id;
    const addr = await BillAddress.deleteOne({ _id: addrId });
    if (!addr) {
      return res.status(400).json({ message: "address not found." });
    }
    return res.status(200).json(`Address with id ${addrId} is deleted`);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

/***
 * @desc Delete payment card
 * @route GET /v1/api/payments/deleteCard/:id
 * @access Private
 */
const apiDeleteCard = asyncHandler(async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await CreditCard.deleteOne({ _id: cardId });
    if (!card) {
      return res.status(400).json({ message: "card not found." });
    }
    console.log(card);
    return res.status(200).json(`card ${card.last4No} is deleted`);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

/***
 * @desc Delete payment card
 * @route GET /v1/api/payments/deleteCard/:id
 * @access Private
 */
const apiGetTransactions = asyncHandler(async (req, res) => {
  try {
    const accountId = req.params.id;
    const transactions = await Transaction.find({
      accountId: accountId,
    })
      .populate("billAddressId")
      .populate({ path: "cardId", select: ["cardType", "last4No"] });

    const filteredTrans = transactions;
    console.log(transactions[0].checkedOutCart[0]);
    for (const transaction in transactions) {
      for (const cart in transactions[transaction].checkedOutCart) {
        // const courseInfo = await Course.findById()
        const courseId =
          transactions[transaction].checkedOutCart[cart].cartItem.courseId;
        const course = await Course.findById(courseId);
        const newCartItem = {
          courseId: courseId,
          courseName: course.courseName,
          quantity:
            transactions[transaction].checkedOutCart[cart].cartItem.quantity,
          totalPrice: (
            course.courseDiscountedPrice *
            transactions[transaction].checkedOutCart[cart].cartItem.quantity
          ).toFixed(2),
        };
        transactions[transaction].checkedOutCart[cart].cartItem = newCartItem;
        // transactions[transaction].checkedOutCart[cart].cartItem.courseName = course.CourseName;
      }
    }

    return res.status(200).json(transactions);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

module.exports = {
  apiMakePayment,
  apiAddAddr,
  apiAddCard,
  apiDeleteCard,
  apiDeleteAddr,
  apiGetMethods,
  apiGetTransactions,
};
