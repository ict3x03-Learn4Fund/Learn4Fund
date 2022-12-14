const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Account = require('../models/accountModel')
const Logs = require("../models/logsModel");

const protect = asyncHandler((req, res, next) => {
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
                    
                    if (req.params.userId != decoded.id){
                        return res.status(400).json({message: "Please do not use someone else's userId."})
                    }
                        
                    //get user from token
                    req.account = await Account.findById(decoded.id)                        //[Authentication] Get user from token, and set as req.account
                    
                    if(req.account.ipAddress != req.headers['x-forwarded-for']){
                        Logs.create({
                            ip: req.headers['x-forwarded-for'],
                            type: "ip-address fail to match",
                            reason: req.headers['x-forwarded-for'] + " tried to access " + req.url + " without authorization",
                            time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
                        });
                        return res.status(403).json({ message: 'Forbidden access', sessionTimeout: true })
                    }

                    if (url !== '/v1/api/accounts' || url !== '/v1/api/carts') {
                        //update user session timestamp
                        await Account.findByIdAndUpdate(decoded.id, { loggedTimestamp: Date.now() }) //[Authentication] Update user session timestamp
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
                                time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
                            });

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
        // Send to logs db
        Logs.create({
            ip: req.headers['x-forwarded-for'],
            type: "no auth token",
            reason: "Attempted to access " + req.url + " without authorization",
            time: new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", }),
        });
        return res.status(401).json({ message: 'Not logged in' })
    }
})

module.exports = { protect }