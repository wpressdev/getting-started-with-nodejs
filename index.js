var cool = require('cool-ascii-faces');
var express = require('express');
var app = module.exports = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('home', {sayHelloTo: 'world'});
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

if(!module.parent){
  app.listen(process.env.PORT || 3000, function(){
    console.log('up and running');
  });
}


