var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/main/views/'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/main/js'));
app.use('/styles', express.static(__dirname + '/main/styles/'));

var port = process.env.PORT || 8080;
app.listen(port);

console.log('Server now listening on port ' + port);


app.get('/', function (request, response) {
  response(200, '/views/main.html' );
});








