const jwt = require('jsonwebtoken')
const asyncHandler  = require('express-async-handler')
const Account = require('../models/accountModel')

const protect = asyncHandler(async(req,res,next) =>{
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]
            
            //verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET,
                { algorithm: "HS512", expiresIn: "1hr" })

            //get user from token
            req.account = await Account.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = {protect}