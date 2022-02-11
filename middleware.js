module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Login to Create a New Campground!");
    return res.redirect("/login");
  }
  next();
};
