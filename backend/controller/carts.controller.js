const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Course = require("../models/courseModel");


/***
 * @desc Add cart
 * @route POST /v1/api/carts/create
 * @access Private
 */
const apiAddCart = asyncHandler(async (req, res) => {
    const {
      cartItem,
      accountId
    } = req.body;
  
    let cart = await Cart.findOne({accountId: accountId})

    if (!cart)
      cart = await Cart.create({accountId: accountId})

    cart.coursesAdded.push({cartItem})
    console.log(cart.coursesAdded)
    cart.save()
    console.log(cart)
    
    return res.status(200).json({message: `added ${cartItem}`})
  
});

/***
 * @desc Get Cart items
 * @route Get /v1/api/carts/
 * @access Private
 */
const apiGetCart = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const account = await Account.findOne({ email });

  if (account && (await bcrypt.compare(password, account.password))) {
    authy.request_sms(account.authyId, { force: true }, function (err, smsRes) {
      if (err) {
        return res.json({
          message: "An error occurred while sending OTP to user",
        });
      }
    });
    return res
      .status(200)
      .json({ email: account.email, message: "OTP sent to user" });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

/***
 * @desc verify2FA
 * @route GET /v1/api/accounts/verify2FA
 * @access Public
 */
const apiVerify2FA = asyncHandler(async (req, res) => {
  try {
    const { email, token } = req.body;
    const account = await Account.findOne({ email });
    authy.verify(account.authyId, token, function (err, tokenRes) {
      if (err) {
        res.json({ message: "OTP verification failed" });
      }
      res.status(200).json({
        _id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        token: generateToken(account._id),
        message: "Token is valid",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/***
 * @desc Get User
 * @route GET /v1/api/accounts/getUser
 * @access Private
 */
const apiGetAccount = asyncHandler(async (req, res) => {
  const {
    _id,
    firstName,
    lastName,
    email,
    avatarImg,
    donation,
    emailSubscription,
    lockedOut,
    loginTimes,
    role,
  } = await Account.findById(req.account.id);
  res.status(200).json({
    id: _id,
    firstName,
    lastName,
    email,
    role,
    avatarImg,
    donation,
    emailSubscription,
    lockedOut,
    loginTimes,
  });
});

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  apiAddCart,
  apiGetCart
};
