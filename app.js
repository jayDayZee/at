var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//My Stuff.. Put somewhere else

assert = require("assert");

process.on("unhandledRejection", function(error) {console.log(error); } );


var monk    = require("monk");
var db      = monk('localhost/@');
var atStore = db.get('@');

// atStore.index("id");


var AtRoot = require("./atSrc/at.js");
// AtTest = require("./atSrc/at.test.js");

console.log("loaded at.js module");

var atRoot = new AtRoot();

// atRoot.connectAtStore(atStore);

var index = require('./routes/index');
var users = require('./routes/users');
var thePlan = require("./routes/thePlan");

var app = express();

app.monk    = monk;
app.db      = db;
app.atRoot  = atRoot;
app.atStore = atStore;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.atRoot  = atRoot;
    req.atStore = atStore;
    req.twilioAtStore=atRoot.twilioAtStore;
    next();
});

app.use('/thePlan', thePlan);
app.use('/', index);

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
