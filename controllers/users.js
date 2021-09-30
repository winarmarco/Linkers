const { nextTick } = require("process");
const path = require("path");
const passport = require("passport");
const User = require(path.join(__dirname, "../models/users"));

module.exports.renderLogin = (req, res) => {
  res.render("login", {data : {username : {}, password: {}}, error : 0});
};

module.exports.login = (req,res,next) => {
  passport.authenticate("local", function (err, user,info) {
    if (err) {return next(err);}
    if (!user) { 
      req.body.username = { value: req.body.username, error: 0 };
      req.body.password = { value: req.body.password, error: 0 };
      // FAILED
      return res.render("login", {data : req.body, error : 1})
    }
    req.logIn(user, function(err) {
      if(err) {return next(err);}
      // SUCCESS
      return res.redirect("/links");
    })
  })(req,res,next);
}


module.exports.renderRegister = (req, res) => {
  res.render("register", {data : {username : {}, email : {}, password : {}}, error: ""});
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = new User({
      email,
      username,
    });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return nextTick(err);
    });

    req.flash("success", "Welcome to Linkers!");
    res.redirect("/links");
  } catch (error) {
    const checkEmail = await User.find({email : req.body.email});
    req.body.username = {value : req.body.username, error : 1};
    req.body.password = {value :req.body.password, error : 0};
    if (checkEmail) {error.message = "A user with given email and username is already registered"; req.body.email = {value : req.body.email, error : 1};}
    res.render("register", {data : req.body, error : error.message})
  }
};

module.exports.logout = async (req, res) => {
    req.logout();
    res.redirect("/");
};
