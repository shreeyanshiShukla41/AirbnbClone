if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { linkSync } = require("fs");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const session = require("express-session");
const MongoStore=require("connect-mongo")
const flash = require("connect-flash");
const { log } = require("console");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const { env } = require("process");
const dbUrl=process.env.ATLASDB_URL

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET_CODE,
  },
  touchAfter:24*3600,
})

store.on("error",(err)=>{
  console.log("Error occurred in mongo store ",err);
  
})

const sessionOptions = {
  store,
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// app.get("/", (req, res) => {
//   res.send("working");
// });

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.currUser);

  next();
});

app.set("views engine", "ejs engine");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



main()
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

async function main() {
  await mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// app.get("/registeredUser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"s@gmail.com",
//     username:"student"
//   })
//   let registeredUser=await User.register(fakeUser,"password");
//   res.send(registeredUser);
// })

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews/", reviewsRouter);
app.use("/", userRouter);

// app.get("/test",async(req,res)=>{
//    const listing=new Listing({
//     title:"Test",
//     description:"testing",
//     price:100,
//     location:"xyz",
//     Country:"India"
//    })
//    await listing.save();
//    res.send("testing is successful")
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  console.log(err.name);
  next(err);
});

app.use((err, req, res, next) => {
  let { status = "500", message = "some error occurred" } = err;
  return res.status(status).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("listening at 8080");
});
