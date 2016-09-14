var http = require('http'),
    express = require("express"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser")
    passwordHash = require('password-hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    dateFormat = require("dateformat"),
    now = new Date(),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    flash = require('connect-flash');
    
var environment = process.env.ENVIRONMENT || "production";

var routes = require('./routes/index');
var signin = require('./routes/signin');
var feedbacks = require('./routes/feedbacks');

var app = express();
// Trusting Openshift proxy
app.enable('trust proxy');

app.set("env", environment);
app.set("logger", logger);


app.set('port', (process.env.PORT || 5000));

app.use('/', routes);
app.use('/signin', signin);
app.use('/feedbacks', feedbacks);
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'testCat',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/', function(req, res) {
  response.render('index');
});

app.get('/', function(req, res) {
  response.render('/cool');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


