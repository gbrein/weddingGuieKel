const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const RsvpModel = require("../model/rsvpmodel");
const StoreModel = require("../model/storeModel");
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

router.post("/gifts1", (req, res, next) => {
  let { name, photo, price, quote } = req.body;
  StoreModel.findOne({ name }).then(gift => {
    if (gift) {
      res.redirect("/confirmation");
    } else {
      if (typeof name === "string") {
        new StoreModel({
          name,
          photo,
          price,
          quote
        })
          .save()
          .then(gift => res.redirect("/confirmation"));
      } else {
        name.forEach((element, idx) => {
          new StoreModel({
            name,
            photo,
            price,
            quote
          })
            .save()
            .then(result => console.log(result));
        });
        res.redirect("/confirmation");
      }
    }
  });
});

router.get("/gifts", (req, res, next) => {
  //desenvolver um find all no mongo para trazer todos os gifts // falta testar, é preciso criar registros no mongo
  StoreModel.find().then(gifts => {
    console.log(gifts);
    res.render("gifts", {
      title: "Gifts",
      gifts
    });
  });
});

router.get("/rsvp", (req, res, next) => {
  res.render("rsvp");
});

router.get("/when-where", (req, res, next) => {
  res.render("when-where");
});

router.get("/gallery", (req, res, next) => {
  res.render("gallery");
});

router.get("/confirmation", (req, res, next) => {
  res.render("confirmation");
});

router.post("/rsvp", (req, res, next) => {
  let { name, phone, email } = req.body;

  RsvpModel.findOne({ name: name[0] }).then(user => {
    if (user) {
      res.redirect("/confirmation");
    } else {
      if (typeof name === "string") {
        new RsvpModel({
          name: name,
          phone: phone,
          email: email
        })
          .save()
          .then(user => res.redirect("/confirmation"));
      } else {
        name.forEach((element, idx) => {
          new RsvpModel({
            name: name[idx],
            phone: phone[idx],
            email: email[idx]
          })
            .save()
            .then(result => console.log(result));
        });
        res.redirect("/confirmation");
      }
    }
  });
});

module.exports = router;
