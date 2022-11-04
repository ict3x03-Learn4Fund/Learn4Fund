const jwt = require('jsonwebtoken')
const asyncHandler  = require('express-async-handler')
const Account = require('../models/accountModel')
const Logs = require("../models/logsModel");

const protect = asyncHandler((req,res,next) =>{
    let token
    let url = req.baseUrl;                                                                  //[Authorization] Check if the request is for admin or user
    let path = req.route.path;
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
                    
                    if(url !== '/v1/api/accounts/getAccount'){
                    //update user session timestamp
                    await Account.findByIdAndUpdate(decoded.id, {loggedTimestamp: Date.now()}) //[Authentication] Update user session timestamp
                    }
                    
                    // [Authorization] Check if user is admin
                    if (url === '/v1/api/admin' ||
                        (url === '/v1/api/courses' && (path === "/create" || path === "/update/:id" || path === "/delete/:id"))) { 
                        if (req.account.role !== 'admin') {
                            // Send to logs db
                            Logs.create({
                            email: req.account.email,
                            type: "auth",
                            reason: "Attempted to access " + req.url + " without authorization",
                            time: new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore",}),
                            });

                            return res.status(403).json({ message: 'Not authorized' });
                        }
                    }
                    
                    next() // Move on from the middleware
                } catch (error) {
                    console.log(error)
                    return res.status(403).json({ message: 'Error' })
                }
            }
        })
    }
    if (!token) {
        // Send to logs db
        Logs.create({
            email: req.ip,
            type: "auth",
            reason: "Attempted to access " + req.url + " without authorization",
            time: new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore",}),
        });
        return res.status(401).json({ message: 'Not logged in' })
    }
})

module.exports = {protect}