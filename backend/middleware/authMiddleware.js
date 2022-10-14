const jwt = require('jsonwebtoken')
const asyncHandler  = require('express-async-handler')
const Account = require('../models/accountModel')

const protect = asyncHandler((req,res,next) =>{
    let token
    var authCookie = req.headers.cookie;
    authCookie = authCookie.split('; ');
    authCookie.forEach(async (cookie) => {
        if (cookie.startsWith('access_token')) {
            try {
                // Get token from header
                token = cookie.split('access_token=')[1]
            
                //verify token
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET,
                    { algorithm: "HS512" })

                //get user from token
                req.account = await Account.findById(decoded.id).select('-password')
                next()
            } catch (error) {
                console.log(error)
                res.status(401)
                throw new Error('Not Authorized')
            }
        }
    })
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = {protect}