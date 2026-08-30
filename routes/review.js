const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("./middlewares.js");
const ReviewController = require("../controllers/review.js")



// reviews
// post route
router.post("/",isLoggedIn, validateReview ,wrapAsync(ReviewController.createReview));
// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReview));

module.exports =  router;