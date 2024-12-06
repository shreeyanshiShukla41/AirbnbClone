const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

router.post(
  "",
  isLoggedIn,
  validateReview,
  asyncWrap(reviewsController.createReview)
);

// deleting reviews route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  asyncWrap(reviewsController.deleteReview)
);

module.exports = router;
