
const Listing = require("../models/listings")
const {config, geocoding} = require("@maptiler/client");
const mapToken = process.env.MAP_TOKEN;
config.apiKey = mapToken;
// let GeocodingControl = require( "@maptiler/geocoding-control/maptilersdk");
// import "@maptiler/sdk/dist/maptiler-sdk.css";

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({path: "reviews", populate: {path: "author"}})
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing YOU REQUESTED FOR DOES NOT EXIST");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) => {
    
    // FIX 1: Added req.file check to prevent crash if no image uploaded
    if (!req.file) {
        req.flash("error", "Please upload an image");
        return res.redirect("/listings/new");
    }
    const response = await geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.features[0].geometry;
    await newListing.save();
    console.log(newListing.geometry)
    req.flash("success", "New listing created");
    res.redirect("/listings");
};
module.exports.RenderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // FIX 1: added return
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl}); // FIX 2: removed leading slash
};

module.exports.updateListing = async(req, res) => {
    let {id} = req.params; // FIX 3: added missing id destructuring
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
        req.flash("success", "listing updated");
        return res.redirect("/listings"); // FIX 4: added return to stop double redirect
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`); // FIX 4: fixed typo /listing/ → /listings/
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
};