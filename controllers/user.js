const User=require("../models/user.js");
module.exports.renderSingUpForm=async(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signUp=async(req,res)=>{
    try{    
        let {email,username,password}=req.body;
        const newUser=new User({email,username});
        let userRegistered=await User.register(newUser,password);
        console.log(userRegistered);
        req.login(userRegistered,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully,Welcome to Wanderlust");
            res.redirect("/listing");
        });  
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }

}
module.exports.renderLoginForm=async(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.login=async(req,res)=>{
        req.flash("success","Welcome to Wanderlust!,You are logged in");
        let redirectUrl=res.locals.redirectUrl || "/listing"
        res.redirect(redirectUrl);

}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listing");
    })
}