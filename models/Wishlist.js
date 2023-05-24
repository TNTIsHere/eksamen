const mongoose = require("mongoose");

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    wish1: {
        type: String,
        unique: true,
    },
    wish2: {
        type: String,
        unique: true,
    },
    wish3: {
        type: String,
        unique: true,
    },
    wish4: {
        type: String,
        unique: true,
    },
    wish5: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;