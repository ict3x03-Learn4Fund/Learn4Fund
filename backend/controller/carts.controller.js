const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartModel");
const Course = require("../models/courseModel");

/***
 * @desc Add cart
 * @route POST /v1/api/carts/create
 * @access Private
 */
const apiAddCart = asyncHandler(async (req, res) => {
  try {
    const { cartItem, accountId } = req.body;

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

    return res.status(200).json({ message: `Item added.` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
 * @desc Delete Cart items
 * @route Post /v1/api/carts/delete
 * @access Private
 */
const apiDeleteCart = asyncHandler(async (req, res) => {
  const { accountId, courseId } = req.body;
  const accId = mongoose.Types.ObjectId(accountId)
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

module.exports = {
  apiAddCart,
  apiGetCart,
  apiDeleteCart,
};
