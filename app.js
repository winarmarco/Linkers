const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const { validateLink, validateUser } = require("./middleware/validate");
require("dotenv").config();

const userRouter = require(__dirname + "/routes/users.js");
const linkRouter = require(__dirname + "/routes/links.js");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    name: "linkers",
    secret: process.env.SESSIONSECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const User = require(__dirname + "/models/users.js");

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/linkers");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.post("/test", validateLink, (req, res) => {
  res.send("Validation passed");
});
// app.post("/registertest", validateUser,(req,res) => {res.send("Validation passed")});



app.use("/", userRouter);
app.use("/", linkRouter);

// landing page
app.get("/", (req, res) => {
  res.render("landing");
});

app.listen(port, () => {
  console.log("Connected to port " + port);
});
