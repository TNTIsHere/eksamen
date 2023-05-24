const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const Wishlist = require("./models/Wishlist");
require('dotenv').config();

const app = express();

// Use cookieparser and set the static view to "public"
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Ejs as middleware
app.set("view engine", "ejs");

// Connecting to DB
const DBURL = `${process.env.DB_URL}`;
mongoose.connect(DBURL, { useNewUrlParser: true })
    .then(console.log("DB connected"))
    .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", (req, res) => {
    Wishlist.aggregate([
      { $sort: { _id: -1 } },
      { $group: { _id: "$username", wishlist: { $first: "$$ROOT" } } },
      { $limit: 5 }
    ])
      .then((wishlists) => {
        res.render("index", { wishlists });
      })
      .catch((error) => {
        console.error("Error fetching documents", error);
        res.render("index", { wishlists: [] });
      });
  });


app.use(authRoutes);
app.listen(process.env.PORT);