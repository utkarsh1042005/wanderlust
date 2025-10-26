const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const UserController=require("../controllers/user.js");

router.route("/signup")
.get(wrapAsync(UserController.renderSingUpForm))
.post(wrapAsync(UserController.signUp));

router.route("/login")
.get(wrapAsync(UserController.renderLoginForm))
.post(
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
    wrapAsync(UserController.login));
    
router.get("/logout",UserController.logout);

module.exports=router;