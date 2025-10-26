const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,validateListing,isOwner}=require("../middleware.js");
const ListingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage,cloudinary} = require("../cloudconfig.js");
const upload = multer({ storage });


router.route("/")
// Show route
.get(wrapAsync(ListingController.index))
//Create route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.createListing))


//new route
router.get("/new",isLoggedIn,ListingController.renderNewFrom);

router.route("/:id")
//show
.get(wrapAsync(ListingController.showListing))
//update
.put(isOwner,isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListing))
//delete
.delete(isOwner,isLoggedIn,wrapAsync(ListingController.destroyListing))

//edit
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(ListingController.renderEditForm));


module.exports=router;