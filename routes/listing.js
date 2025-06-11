const express = require('express');
const router = express.Router({mergeParams: true});
// ---------------------------------------------- Error Handling
const wrapAsync = require('../utils/wrapAsync.js');
// ---------------------------------------------- Models
const Listing = require('../models/listing.js');
const Review = require('../models/review');
// ---------------------------------------------- Middlewares
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");
// ---------------------------------------------- CONTROLLERS
const listingController = require('../controllers/listings.js');
// ---------------------------------------------- MULTER
const multer = require('multer');
// ---------------------------------------------- CLOUDINARY
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// ******************************************************************

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing , upload.single('listing[image]'), wrapAsync(listingController.createNewListing));

// New Route
router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
