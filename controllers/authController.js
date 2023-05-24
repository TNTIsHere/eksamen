const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { requireAuth, checkUser, loadWishList } = require("../middleware/authMiddleware");
require('dotenv').config();

// Custom error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username: "", password: ""};

    if (err.message === "Incorrect Username") {
        errors.username = "That username does not exist";
    }

    if (err.message === "Incorrect Password") {
        errors.password = "That password is incorrect";
    }

    if (err.code === 11000) {
        errors.username = "That username is already taken";
        return errors;
    }

    if (err.message.includes("users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// Create JWT token
const maxAge = 3 * 24 * 60 * 60;
const createJWT = (id) => {
    return jwt.sign({id}, process.env.JWTsecret, {
        expiresIn: maxAge
    });
}

// Get login/signup
module.exports.signup_get = (req, res) => {
    res.render("sign-up");
}

module.exports.login_get = (req, res) => {
    res.render("sign-in");
}

// Get user page with ID
module.exports.id_get = [checkUser, async (req,res) => {
    const id = req.params.id
    const list = await Wishlist.find({ username: id })
    const wishlists = () =>
              res.render('target', { wishlist: list, id })
          wishlists();
}]

// Get user home page with ID
module.exports.homepage_get = [checkUser, async (req,res) => {
    const id = req.params.id
    const list = await Wishlist.find({ username: id })
    const wishlists = () =>
              res.render('home', { wishlist: list, id })
          wishlists();
}];

// Delete wish
module.exports.deletewish_delete = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Wishlist.findByIdAndDelete(id);
        res.json({ redirect: `/deletewish/${id}` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "The developer sucks" })
    }
};

// Add wish
module.exports.addwish_post = [requireAuth, async (req, res) => {
    const { wish1, username } = req.body;
    try {
        const wishlist = await Wishlist.create({ wish1, username })
        res.status(201).json({wishlist: wishlist._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}];

// Update a wish
module.exports.updatewish_post = [requireAuth, async (req, res) => {
    const { wish1, id } = req.body;

    try {
        const result = await Wishlist.findByIdAndUpdate(id, { wish1 });
        res.status(200).json({response:"cool console response"});
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "the dev actually sucks" })
    }
}];

// Signup function for website
module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;
    try {
         const user = await User.create({ username, password })
         const token = createJWT(user._id);
         res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
         res.status(201).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

// Login function for website
module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createJWT(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
};

// Logout function for website
module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("isAdmin", "", { maxAge: 1 });
    res.redirect("/");
};