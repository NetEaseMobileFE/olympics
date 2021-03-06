var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

//app.use('/static', express.static(__dirname + '/dist'));
app.use('/src', express.static(__dirname + '/src'));

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/', express.static(__dirname + '/src'));

app.listen(3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
