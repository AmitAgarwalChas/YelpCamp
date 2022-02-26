const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegister = (req, res) => {
  res.render("users/register.ejs");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await new User({ email, username });
    const newUser = await User.register(user, password);
    req.logIn(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back to YelpCamp!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logOut();
  req.flash("success", "Good Bye!");
  res.redirect("/campgrounds");
};
