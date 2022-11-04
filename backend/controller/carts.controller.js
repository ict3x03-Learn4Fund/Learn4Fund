const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartModel");
const Course = require("../models/courseModel");

/***
 * @desc Add cart
 * @route POST /v1/api/carts/add
 * @access Private
 */
const apiAddCart = asyncHandler(async (req, res) => {
  try {
    const { cartItem, accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ message: "Account Id is null." });
    }

    let cart = await Cart.findOne({ accountId: accountId });
    console.log("cart: ", cart);
    if (!cart) cart = await Cart.create({ accountId: accountId });

    console.log("account id: ", accountId);

    let counterFlag = 0;
    cart.coursesAdded.some((existingCart) => {
      console.log("existing cart:", existingCart);
      if (existingCart.cartItem.courseId === cartItem.courseId) {
        existingCart.cartItem.quantity += cartItem.quantity;
        console.log(
          `${existingCart.cartItem.courseId} now has ${existingCart.cartItem.quantity}.`
        );
      } else {
        counterFlag++;
      }
    });
    console.log(
      `counter flag: ${counterFlag} length: ${cart.coursesAdded.length}`
    );
    if (counterFlag === cart.coursesAdded.length)
      cart.coursesAdded.push({ cartItem });
    cart.markModified("coursesAdded");
    cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json({ message: "Error adding to cart" });
  }
});

/***
 * @desc Get Cart items
 * @route Get /v1/api/carts/
 * @access Private
 */
const apiGetCart = asyncHandler(async (req, res) => {
  const accountId = mongoose.Types.ObjectId(req.params.id);
  try {
    let cart = await Cart.findOne({ accountId: accountId });

    if (!cart) cart = await Cart.create({ accountId: accountId });

    let cartArray = [];
    for (const existingCart in cart.coursesAdded) {
      const courseId = cart.coursesAdded[existingCart].cartItem.courseId;
      const quantity = cart.coursesAdded[existingCart].cartItem.quantity;
      courseDetails = await Course.findById(courseId);
      let cartItem = {
        courseId: courseId,
        quantity: quantity,
        courseName: courseDetails.courseName,
        usualPriceTotal: (quantity * courseDetails.courseOriginalPrice).toFixed(
          2
        ),
        currentPriceTotal: (
          quantity * courseDetails.courseDiscountedPrice
        ).toFixed(2),
      };
      cartArray.push(cartItem);
      console.log(cartItem);
    }

    return res
      .status(200)
      .json({
        accountId: accountId,
        coursesAdded: cartArray,
        donationAmt: cart.donationAmt,
        showDonation: cart.showDonation,
      });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

/***
 * @desc Get Cart Total number
 * @route Get /v1/api/carts/:id/totalNo
 * @access Private
 */
const apiGetNo = asyncHandler(async (req, res) => {
  try {
    const accountId = req.params.id
    let cart = await Cart.findOne({ accountId: accountId });

    if (!cart) cart = await Cart.create({ accountId: accountId });

    const total = cart.coursesAdded.length;

    return res.status(200).json({ accountId: accountId, totalNo: total });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

/***
 * @desc Delete Cart items
 * @route Post /v1/api/carts/delete
 * @access Private
 */
const apiDeleteCart = asyncHandler(async (req, res) => {
  const { accountId, courseId } = req.body;
  const accId = mongoose.Types.ObjectId(accountId);
  try {
    let cart = await Cart.findOne({ accountId: accId });
    if (!cart) {
      return res.status(400).json({ message: "No items found" });
    }
    for (const existingCart in cart.coursesAdded) {
      if (cart.coursesAdded[existingCart].cartItem.courseId == courseId) {
        cart.coursesAdded.splice(existingCart, 1);
      }
    }
    cart.markModified("coursesAdded");
    cart.save();

    let cartArray = [];
    for (const existingCart in cart.coursesAdded) {
      const courseId = cart.coursesAdded[existingCart].cartItem.courseId;
      const quantity = cart.coursesAdded[existingCart].cartItem.quantity;
      courseDetails = await Course.findById(courseId);
      let cartItem = {
        courseId: courseId,
        quantity: quantity,
        courseName: courseDetails.courseName,
        usualPriceTotal: (quantity * courseDetails.courseOriginalPrice).toFixed(
          2
        ),
        currentPriceTotal: (
          quantity * courseDetails.courseDiscountedPrice
        ).toFixed(2),
      };
      cartArray.push(cartItem);
      console.log(cartItem);
    }

    return res
      .status(200)
      .json({ accountId: accountId, coursesAdded: cartArray });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

/***
 * @desc Add Donations to cart
 * @route Post /v1/api/carts/addDonation
 * @access Private
 */
const apiAddDonationToCart = asyncHandler(async (req, res) => {
  try {
    const { accountId, donationAmt, showDonation } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Account Id cannot be null." })
    }
    let cart = await Cart.findOne({ accountId: accountId })
    if (!cart) {
      cart = await Cart.create({ accountId: accountId })
    }
    cart.showDonation = showDonation;
    cart.donationAmt = parseFloat(cart.donationAmt) + parseFloat(donationAmt);
    cart.save()
    return res.status(200).json(cart)
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
});
/***
 * @desc Remove Donations from cart
 * @route Post /v1/api/carts/clearDonation/:id
 * @access Private
 */
const apiClearDonation = asyncHandler(async (req, res) => {
  try {
    const accountId = req.params.id
    const cart = await Cart.findOne({ accountId: accountId })
    if (!cart) {
      return res.status(400).json({ message: "User not found." })
    }
    cart.donationAmt = 0
    cart.save()
    return res.status(200).json({ cart })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
});

module.exports = {
  apiAddCart,
  apiGetCart,
  apiDeleteCart,
  apiGetNo,
  apiAddDonationToCart,
  apiClearDonation
};
