const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

// /* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post("/submit-code", (req, res, next) => {
  let { verificationCode } = req.body;
  verificationCode === "guiekel1106"
    ? res.cookie("validWeddingCode", "SKFAAOWR!@", {
        maxAge: 900000,
        httpOnly: true
      })
    : false;

  res.redirect("index");
});

router.get("/index", (req, res, next) => {
  if (req.cookies["validWeddingCode"]) {
    res.render("index2");
  } else {
    res.redirect("/");
  }
});

router.get("/gifts", (req, res, next) => {
  console.log(req.cookies);
  res.render("gifts");
});

router.get("/rsvp", (req, res, next) => {
  console.log(req.cookies);
  res.render("rsvp");
});


router.get("/when-where", (req, res, next) => {
  res.render("when-where");
});

router.get("/gallery", (req, res, next) => {
  res.render("gallery");
});

module.exports = router;
