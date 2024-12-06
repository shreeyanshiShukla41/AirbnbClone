const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const { log } = require("console");

const sessionOptions = {
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.set("view engine", "ejs engine");
app.set("views", path.join(__dirname, "views"));

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  let { pagenumber = 9 } = req.query;
  req.session.pagenumber = pagenumber;
  console.log(req.session);

  if (name == "anonymous") {
    req.flash("error", "some error occurred");
  } else {
    req.flash("success", "successfully redirected");
  }

  res.redirect("/showFlash");
});

app.get("/showFlash", (req, res) => {
  // console.log(req.flash("success"));
  res.locals.messages = req.flash("success");
  res.locals.error = req.flash("error");

  res.render("flash.ejs", { pagenumber: req.session.pagenumber });
});

app.get("/test", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }

  res.send(
    `count=${req.session.count} and pagenumber is ${req.session.pagenumber} <hr/> ${messages}`
  );
});

app.listen(3000, () => {
  console.log("working at port 3000");
});
