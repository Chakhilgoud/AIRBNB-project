// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
// const Listing = require("../models/listings.js");
// const {isLoggedIn,isOwner,validateListing} = require("../routes/middlewares.js")
// const listingController = require("../controllers/listings.js");
// const multer = require('multer');
// const {storage} = require("../cloudConfig.js");
// const upload = multer({storage});

// router
// .route("/")
// .get( wrapAsync(listingController.index))
// .post(
//      isLoggedIn,
//      upload.single("listing[image"),
//       validateListing,
//      wrapAsync(listingController.showListing));


     
// // New route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.route("/:id")
// .get(wrapAsync(listingController.showListing))
// .put(
//     isLoggedIn,
//     isOwner,
//      upload.single("listing[image"),
//       validateListing,
//      wrapAsync(listingController.updateListing))
// .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



// edit
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderNewForm))

// module.exports = router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../routes/middlewares.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),  // FIX 2: added missing ]
        validateListing,
        wrapAsync(listingController.createListing)  // FIX 1: was showListing
    );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),  // FIX 2: added missing ]
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// FIX 3: was renderNewForm, should be RenderEditForm
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.RenderEditForm));

module.exports = router;
