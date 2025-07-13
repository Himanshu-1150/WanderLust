const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const Listing = require("../models/listing.js");

const listingsController = require("../controllers/listings.js");

router.route("/").get(wrapAsync(listingsController.index)).post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,

  wrapAsync(listingsController.createListing)
);

// new route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  );

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,

  wrapAsync(listingsController.renderEditForm)
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.destroyListing)
);

module.exports = router;
