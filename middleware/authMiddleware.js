const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Wishlist = require('../models/Wishlist');
require('dotenv').config();

// Check if JWT is valid, otherwise redirect
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWTsecret, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/sign-in");
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect("/sign-in");
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWTsecret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

const loadWishList = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({ wish1, username });

        res.locals.wishlist = wishlist;
        next();
    }
    catch (error) {
        res.locals.wishlist = null;
        next();
    }
}

module.exports = { requireAuth, checkUser, loadWishList };