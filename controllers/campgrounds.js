const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const cloudinary = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};

module.exports.createNewCampground = async (req, res, next) => {
  // const geoData = await geocoder
  //   .forwardGeocode({
  //     query: "India",
  //     limit: 1,
  //   })
  //   .send();
  // console.log(geoData.body.features);
  // res.send("HI!!");
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground.images.length);
  req.flash("success", "Successfully created a new campground!!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find the campground you are looking for!!!");
    return res.redirect("/campgrounds");
  }
  console.log(campground.images);
  res.render("campgrounds/show.ejs", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find the campground you are looking for!!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit.ejs", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campground!!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!!!");
  res.redirect("/campgrounds");
};
