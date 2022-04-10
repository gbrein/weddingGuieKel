require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const helmet = require('helmet')

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
app.use(helmet())
//teste

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

hbs.registerPartials(__dirname + '/views/partials');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express ';

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "casamentokelegui.com.br"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Access-Control-Allow-Methods', 'GET,POST');
  next();
});

const index = require('./routes/index');
app.use('/', index);

hbs.registerHelper('isdefined', function (value) {
  if (value !== 'false') {
    return true;
  }
  else {
    return false
  }
});

module.exports = app;
