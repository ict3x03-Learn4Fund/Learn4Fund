const jwt = require('jsonwebtoken')
const asyncHandler  = require('express-async-handler')
const Account = require('../models/accountModel')

const protect = asyncHandler((req,res,next) =>{
    let token
    let url = req.baseUrl;                                                                  //[Authorization] Check if the request is for admin or user
    let authCookie = req.headers.cookie;
    if (authCookie) {
        authCookie = authCookie.split('; ');
        authCookie.forEach(async (cookie) => {
            if (cookie.startsWith('access_token')) {
                try {
                    // Get token from header
                    token = cookie.split('access_token=')[1]                                //[Authentication] Get token from cookie
                    if (token == null) {
                        return res.status(401).json({ message: 'Not logged in' })
                    }
            
                    //verify token
                    const decoded = jwt.verify(                                             //[Authentication] Verify token
                        token,
                        process.env.JWT_SECRET,
                        { algorithm: "HS512" })

                    //get user from token
                    req.account = await Account.findById(decoded.id)                        //[Authentication] Get user from token, and set as req.account

                    // Check if user is admin for admin routes
                    if (url === '/v1/api/admin'){                                           //[Authorization] Check if user is admin
                        if (req.account.role !== 'admin') {
                            return res.status(403).json({ message: 'Not authorized' });
                        }
                    }
                    
                    next() // Move on from the middleware
                } catch (error) {
                    return res.status(403).json({ message: 'Error' })
                }
            }
        })
    }
    if (!token) {
        return res.status(401).json({ message: 'Not logged in' })
    }
})

module.exports = {protect}