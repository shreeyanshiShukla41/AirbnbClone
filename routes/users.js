const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const { redirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.get("/signup", userController.signUpForm);

router.post("/signup", asyncWrap(userController.signUp));

router.get("/login", userController.loginForm);

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
