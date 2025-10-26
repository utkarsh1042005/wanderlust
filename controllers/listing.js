const Listing=require("../models/listing.js");
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: process.env.NodeGeocoderapiKey
});
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listing/index",{allListings});
 }
module.exports.renderNewFrom=(req,res)=>{
    res.render("listing/new.ejs");
}
module.exports.createListing=async(req,res,next)=>{
   const result = await geocoder.geocode(req.body.listing.location, req.body.listing.country);
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    newListing.geometry = {
      type: "Point",
      coordinates: [result[0].longitude, result[0].latitude], // GeoJSON format: [longitude, latitude]
    };
    let savedlisitng=await newListing.save();
    console.log(savedlisitng);
    req.flash("success","New Listing Created");
    res.redirect("/listing");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
                .populate({path:"reviews",populate:{path:"author"}})
                .populate("owner");
    if(!listing){
         req.flash("error","Requested Listing Does not exist");
         res.redirect("/listing");
    };
    res.render("listing/show.ejs",{listing});
}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
         req.flash("error","Requested Listing Does not exist");
         res.redirect("/listing");
    };
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save()}
    req.flash("success"," Listing Updated");
    res.redirect(`/listing/${id}`)
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let dellisting=await Listing.findByIdAndDelete(id);
     req.flash("success"," Listing Deleted");
    res.redirect("/listing");
}