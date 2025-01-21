const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  // console.log(req.body);
  const allListings = await Listing.find({});
  // console.log(allListings)

  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    // console.log("add new listing");
    res.render("./listings/new.ejs");
  } catch (err) {
    next(err);
  }
};

module.exports.createNewListing = async (req, res, next) => {
  // let {title,description,image,price,country,location}=req.body;

  // console.log(req.body);
  let url = req.file.path;
  let filename = req.file.filename;

  const newlisting = new Listing(req.body.listing);
  console.log(req.user);

  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New Listing created");
  // console.log(newlisting);
  res.redirect("/listings");
};

module.exports.getDetailOfAListing = async (req, res) => {
  const { id } = req.params;
  // the listings' data is shown using this route

  // nested population so that review's data can also be viewed
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you are access does not exist");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing ,currUser:req.user});
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Sorry, the listing your requested does not exist");
    res.redirect("/listing")
  }
  let originalImage =listing.image.url
  originalImage= originalImage.replace("/upload","/upload/w_250")
  res.render("./listings/edit.ejs", { listing ,originalImage});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedlisting=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if((typeof req.file)!=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  updatedlisting.image={url,filename}

  await updatedlisting.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");

  // console.log(deletedListing);
  res.redirect("/listings");
};
