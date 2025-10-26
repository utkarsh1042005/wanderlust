if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");


const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const user=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MongoDb_URL=process.env.MongoAtlasDbUrl;
main()
.then(res  => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MongoDb_URL);
}

app.listen(8080,()=>{
    console.log("App is listening on port 8080")
});
const store=MongoStore.create({
    mongoUrl:MongoDb_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo store:",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        //1 week from now(in miliseconds)
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

// app.get("/",(req,res)=>{
//     res.send("root route working");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let demoUser=new User({
//         email:"utkarsh@gmail.com",
//         username:"utkarsh"
//     });
//     let user=await User.register(demoUser,"abc123");
//     res.send(user);
// });
app.use("/listing",listing);
app.use("/listing/:id/review",review);
app.use("/",user);


// error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}= err;
   
   res.status(statusCode).render("listing/error.ejs",{message});
});