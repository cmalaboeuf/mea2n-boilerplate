var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var winston = require('winston');
var mongoose = require('mongoose');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/'+ process.env.NODE_ENV + '.json');

let options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

mongoose.Promise = global.Promise;
mongoose.connect(config.database,options);

app.use(cors());

app.use(bodyParser.json());

var api = require('./routes/api');
app.get('/api', function (req, res) {
  res.json({ 'apiversion': 'v1' });
});
app.use('/api/v1', api);


let server = app.listen(config.nodePort, ()=> {
  winston.log('App Started on PORT' + config.nodePort );
});

module.exports = {
  app,
  server
};