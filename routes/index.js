const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const RsvpModel = require("../model/rsvpmodel");
const StoreModel = require("../model/storeModel");
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MELI_TOKEN
});

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
            description,
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
  StoreModel.find().then(gifts => {
    res.render("gifts", {
      title: "Gifts",
      gifts: gifts,
    });
  });
});


router.post("/buy/:_id", (req, res, next) => {
  const id = req.params._id;
  StoreModel.findById({ _id: id }).then(gift => {
    console.log(gift)
    if (!gift) {
      alert('Produto não encontrado!')
      res.render("gifts")
    }
    else {
      let preference = {
        back_urls: {
          "success": `http://localhost:3001/sucess/${id}`,
          "failure": "http://localhost:3001/failure",
          "pending": "http://localhost:3001/pending"
        },
        items: [
          {
            title: gift.name,
            unit_price: gift.price,
            quantity: 1,
          }
        ]
      };

      mercadopago.preferences.create(preference)
        .then(function (response) {
          console.log(response.response)
          if (!response.response.sandbox_init_point) {
            res.redirect("/gifts")
          } else {
            res.redirect(response.response.sandbox_init_point)
          }
        }).catch(function (error) {
          console.log(error);
        });
    }
  })
})


router.get("/rsvp", (req, res, next) => {
  res.render("rsvp", { have_register: false, });
});

router.get("/rsvpcreate", (req, res, next) => {
  res.render("rsvpcreate");
});

router.get("/sucess/:_id", (req, res, next) => {
  const id = req.params._id;
  StoreModel.findById({ _id: id }).remove().then(result => {
    res.render("sucess");
  })
});

router.get("/failure", (req, res, next) => {
  res.render("failure");
});

router.get("/pending", (req, res, next) => {
  res.render("pending");
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
  let { name } = req.body;
  const regData = new RegExp(name, "i")
  RsvpModel.find({ name: { $regex: regData } }).then(users => {
    if (users.length >= 1) {
      res.render('rsvp', {
        users: users,
        have_register: true,
      });
    }
    else {
      res.render('rsvp', { have_register: false, });
    }
  })
})

router.post("/rsvp/:_id", (req, res, next) => {
  const id = req.params._id;
  RsvpModel.findByIdAndUpdate({ _id: id }, { confirmation: "true" }).then(result => {
    res.render("sucessrsvp");
  })
});

router.post("/rsvpcreate", (req, res, next) => {
  let { names, type_of_invitation } = req.body;
  RsvpModel.findOne({ names: names[0] }).then(user => {
    if (user) {
      res.redirect("/confirmation");
    } else {
      if (typeof names === "string") {
        new RsvpModel({
          names: names,
          type_of_invitation: type_of_invitation,
          confirmation: "false"
        })
          .save()
          .then(user => res.redirect("/rsvpcreated"));
      }
      res.redirect("/rsvpcreated");
    }
  }).catch(err => console.log(err))
});

router.get("/rsvpcreated", (req, res) => {
  res.render("rsvpcreated")
})

router.get("/payment", (req, res, next) => { });

module.exports = router;
