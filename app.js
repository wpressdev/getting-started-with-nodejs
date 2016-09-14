var express = require('express');

var routes = require('./routes/index');
var signin = require('./routes/signin');
var feedbacks = require('./routes/feedbacks');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', routes);
app.use('/signin', signin);
app.use('/feedbacks', feedbacks);
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  response.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


