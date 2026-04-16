const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const {validateListing,isLoggedIn,isOwner} = require("../middleware.js")
const listingController = require("../controllers/listings.js")


router.route("/")
.get(wrapAsync(listingController.index)) // Index Route
.post(isLoggedIn, validateListing,wrapAsync(listingController.createListing)) //create route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))  // show route
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))//update route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))//delete route

// Edit Route
router.get("/:id/new", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;