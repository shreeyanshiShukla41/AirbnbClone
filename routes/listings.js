const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { Cursor } = require("mongoose");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

// middlewares for validating listings and reviews

router
  .route("/")
  .get(asyncWrap(listingController.index))
  .post(
    isLoggedIn,upload.single('listing[image]'),
    validateListing,
    asyncWrap(listingController.createNewListing));
  
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(asyncWrap(listingController.getDetailOfAListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.deleteListing));




// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.editListing)
);

module.exports = router;
