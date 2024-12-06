let Listing=require("./models/listings")
let Review=require("./models/reviews")
const { listingSchema } = require("./schema.js");
const {  reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","Please login");
    return res.redirect("/login");
  }
  else{
    next()
  }
}


module.exports.redirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listingAuth=await Listing.findById(id);

    if(!listingAuth.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not authorized")
      // return will not allow lines of code after it to get executed
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not authorized")
      // return will not allow lines of code after it to get executed
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
  console.log(req.body);
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    // let {errormsg}=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  console.log(req.body);
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    // let {errormsg}=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
