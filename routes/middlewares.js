// const Listing = require("../models/listings.js");
// const Review = require("../models/review.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
// const review = require("../models/review.js");



// module.exports.isLoggedIn = (req,res,next) =>{
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl
//         req.flash("error","you must be logged in to create listing");
//         return res.redirect("/users/login");
//     }
//     next();
// };

// module.exports.saveRedirectUrl = (req,res,next) =>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next()
// };

// module.exports.isOwner = async (req,res,next)=>{
//     let {id} = req.params;
// let listing = await Listing.findById(id)
// if(!currUser && listing.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error","you are not the owner of this listing");
//     return res.redirect(`/listing/${id}`);
// }
// next();
// };

// module.exports.validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400,error);
//     } else{
//         next();
//     }
// }

// module.exports.validateReview = (req,res,next) =>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     } else {
//         next();
//     }
//     };


// module.exports.isReviewAuthor = async (req,res,next)=>{
//     let {id, reviewId} = req.params;
// let review = await Listing.findById(reviewId)
// if(!review.author.equals(res.locals.currUser._id)){
//     req.flash("error","you are not the author of this listing");
//     return res.redirect(`/listing/${id}`);
// }
// next();
// };

const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // FIX 2: corrected logic operator and variable name
    if(!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    // FIX 1: was Listing.findById, should be Review.findById
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};