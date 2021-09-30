const express = require("express");
const path = require("path");
const passport = require("passport");
const { catchAsync } = require("../utils");
const { validateLogin, validateRegister } = require("../middleware/validate");
const user = require(path.join(__dirname, "../controllers/users.js"));

const router = express.Router();

router.route("/login")
    .get(user.renderLogin)
    .post(validateLogin, user.login);

router.route("/register")
    .get(user.renderRegister)
    .post(validateRegister, user.register);

router.route("/logout")
    .get(catchAsync(user.logout));

module.exports = router;
