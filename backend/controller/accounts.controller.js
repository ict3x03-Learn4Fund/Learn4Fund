const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Account = require('../models/accountModel')

/***
   * @desc Register
   * @route POST /v1/api/accounts/register
   * @access Public
   */
const apiRegister = asyncHandler(async (req,res) => {
    const { email, password, firstName, lastName, emailSubscription} = req.body

    if (!firstName || !lastName || !email || !password){
        res.status(400)
        throw new Error('please add all fields.')
    }

    const accountExist = await Account.findOne({email})
    if (accountExist){
        res.status(400)
        throw new Error('Account already exists.')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create account
    const account = await Account.create({
        email,
        firstName,
        lastName,
        emailSubscription,
        password: hashedPassword
    })

    if (account){
        res.status(201).json({
            _id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            role: account.role,
            createdAt: account.createdAt,
            token: generateToken(account._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid account data')
    }

})

/***
   * @desc Login
   * @route POST /v1/api/accounts/login
   * @access Public
   */
 const apiLogin = asyncHandler(async (req,res) => {
    const { email, password} = req.body

    const account = await Account.findOne({email})

    if (account && (await bcrypt.compare(password, account.password)) ){
        res.json({
            _id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            role: account.role,
            token: generateToken(account._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }

})
/***
   * @desc Get User
   * @route GET /v1/api/accounts/getUser
   * @access Private
   */
 const apiGetAccount = asyncHandler(async (req,res) => {
    const {_id, firstName, lastName, email, avatarImg, donation, emailSubscription, lockedOut, loginTimes, role} = await Account.findById(req.account.id)
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
        loginTimes
    })

})

//Generate JWT
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

module.exports = {
    apiRegister,
    apiLogin,
    apiGetAccount,
}