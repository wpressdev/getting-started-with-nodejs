var http = require('http'),
    express = require("express"),
    favicon = require("serve-favicon"),
    mysql = require("mysql"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    passwordHash = require('password-hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    md5 = require('MD5'),
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

// Submitting feedback
app.post("/", function (req, res) {
    var feedback_date = dateFormat(now, "yyyy-mm-dd hh:MM:ss");
    var emailBody = 'Hello, <br><br> A new user has given the feedback. Following are the feedback information:<br><br><br>' +
                    'Name: ' + req.body.firstname+ ' ' +req.body.lastname + 
                    '<br><br> Email: ' + req.body.email + 
                    '<br><br> Options: ' + req.body.options + 
                    '<br><br> Satisfaction Level: ' + req.body.satisfaction + 
                    '<br><br> Comments: <br>' + req.body.comments + 
                    '<br><br> Date: ' + feedback_date + '<br><br><br><br>' +
                    '<br> Regards,<br><br>Admin<br>';

    objConn.query("INSERT INTO feedback (firstName,lastName,email,options,satisfaction_level,comments,feedback_date) VALUES (?,?,?,?,?,?,?)", [req.body.firstname,req.body.lastname,req.body.email,req.body.options,req.body.satisfaction,req.body.comments,feedback_date], function (err, content, fields) {
            if(err){
                if(err.code !== "ER_DUP_ENTRY"){
                    console.log(err);
                }
            }else{
                console.log(emailBody);
                // create reusable transporter object using the default SMTP transport
                var options = {
                    host: 'smtp.gmail.com', // hostname 
                    secureConnection: true, // use SSL    
                    service: 'gmail',
                    auth: {
                        user: AUTH_USERNAME,
                        pass: AUTH_PASSWORD
                    }
                  };
                  var transporter = nodemailer.createTransport(smtpTransport(options));

                  // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: req.body.email,
                    to: TO_EMAIL,
                    subject: 'User feedback',
                    html: emailBody
                };

                //var msg = 'Thank you for your feedback';
                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, res){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + msg);
                    }
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });
                //logger.info("Thank you for your feedback!");
                res.redirect("/");
            }
        });
    });
    
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


