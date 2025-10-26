const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const ReviewController=require("../controllers/review.js");

//review route
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview));
//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));

module.exports = router;
