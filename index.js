var http = require('http');
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.logger());

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  console.log('[support dash] processing get request')
  response.send('Hello World 2!');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(process.env.PORT, function () {
  console.log('***** exp listening on port: ' + process.env.PORT);
});


