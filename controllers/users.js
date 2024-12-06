const User = require("../models/user");

module.exports.signUpForm=(req, res) => {
  res.render("user/form.ejs");
}

module.exports.signUp=async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
         return next(err)
      }
      else{
        req.flash("success", "user was successfully registered");
        res.redirect("/listings");
      }
    })
   
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

module.exports.loginForm= (req, res) => {
  res.render("user/login.ejs");
}

module.exports.login=async (req, res) => {
  req.flash("success", "Welcome to Wanderlust,You're successfully logged in");
  let redirectUrlVal = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrlVal);
}

module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are successfully logged");
    res.redirect("/listings");
  });
}