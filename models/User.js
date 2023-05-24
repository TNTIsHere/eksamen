const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "The password must be at least 6 characters long"]
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Hash/Salt user password on signup
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Login function with comparison against hashed + salted password
userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Username");
}

const User = mongoose.model("user", userSchema);

module.exports = User;