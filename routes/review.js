const express = require('express');
const router = express.Router({mergeParams: true});
// ---------------------------------------------- Error Handling
const wrapAsync = require('../utils/wrapAsync.js');
// ---------------------------------------------- Models
const Listing = require('../models/listing.js');
const Review = require('../models/review');
// ---------------------------------------------- Middlewares
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// ********************************************************

// ---------------------------------------------- POST Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// ---------------------------------------------- DELETE Review
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;