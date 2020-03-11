const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const RsvpModel = require("../model/rsvpmodel");
const StoreModel = require("../model/storeModel");
const mercadopago = require('mercadopago');
const uploadCloud = require('../config/cloudnary');
var cors = require('cors')

var whitelist = ['https://www.casamentoguiekel.com.br', 'https://casamentoguiekel.com.br']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

mercadopago.configure({
  access_token: process.env.MELI_TOKEN
});

// /* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post("/submit-code", cors(corsOptions), (req, res, next) => {
  let { verificationCode } = req.body;
  verificationCode === "guiekel1106"
    ? res.cookie("validWeddingCode", "SKFAAOWR!@", {
      maxAge: 900000,
      httpOnly: true
    })
    : false;
  res.redirect("index");
});

router.get("/index", cors(corsOptions), (req, res, next) => {
  if (req.cookies["validWeddingCode"]) {
    res.render("index2");
  } else {
    res.redirect("/");
  }
});

router.get("/giftcreate", cors(corsOptions), (req, res) => {
  res.render("giftcreate")
})

router.post("/giftcreate", cors(corsOptions), uploadCloud.single('photo'), (req, res) => {
  const { title, price } = req.body;
  console.log(req.file)
  const photo = req.file.url;
  const imgName = req.file.originalname;
  const quote = 1;
  const newGift = new StoreModel({ name: title, price, quote, photo, imgName })
  newGift.save()
    .then(gift => {
      res.redirect('/giftcreated');
    })
    .catch(error => {
      console.log(error);
    })
})

router.get("/giftcreated", cors(corsOptions), (req, res) => {
  res.render("giftcreated")
})

router.get("/gifts", cors(corsOptions), (req, res, next) => {
  StoreModel.find().then(gifts => {
    res.render("gifts", {
      title: "Gifts",
      gifts: gifts,
    });
  });
});


router.post("/buy/:_id", cors(corsOptions), (req, res, next) => {
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


router.get("/rsvp", cors(corsOptions), (req, res, next) => {
  res.render("rsvp", { have_register: false, });
});

router.get("/rsvpcreate", cors(corsOptions), (req, res, next) => {
  res.render("rsvpcreate");
});

router.get("/sucess/:_id", cors(corsOptions), (req, res, next) => {
  const id = req.params._id;
  StoreModel.findById({ _id: id }).remove().then(result => {
    res.render("sucess");
  })
});

router.get("/failure", cors(corsOptions), (req, res, next) => {
  res.render("failure");
});

router.get("/pending", cors(corsOptions), (req, res, next) => {
  res.render("pending");
});

router.get("/when-where", cors(corsOptions), (req, res, next) => {
  res.render("when-where");
});

router.get("/gallery",cors(corsOptions), (req, res, next) => {
  res.render("gallery");
});

router.get("/confirmation",cors(corsOptions), (req, res, next) => {
  res.render("confirmation");
});

router.post("/rsvp",cors(corsOptions), (req, res, next) => {
  let { names } = req.body;
  const regData = new RegExp(names, "i")
  RsvpModel.find({ names: { $regex: regData } }).then(users => {
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

router.post("/rsvp/:_id",cors(corsOptions), (req, res, next) => {
  const id = req.params._id;
  RsvpModel.findByIdAndUpdate({ _id: id }, { confirmation: "true" }).then(result => {
    res.render("sucessrsvp");
  })
});

router.post("/rsvpcreate",cors(corsOptions), (req, res, next) => {
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

router.get("/rsvpcreated",cors(corsOptions), (req, res) => {
  res.render("rsvpcreated")
})

module.exports = router;
