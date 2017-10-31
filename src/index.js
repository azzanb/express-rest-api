'use strict';

var env = process.env.NODE_ENV || 'development';
console.log(env);

/* Set up environment variables to differentiate a test db from a development db. 
	This is to ensure the development db does not get deleted when testing. 
*/
if(env === 'development'){
	process.env.PORT === 5000;
	process.env.MONGODB_URI = "mongodb://localhost:27017/CourseRating";
} else if(env === 'test'){
	process.env.PORT === 5000;
	process.env.MONGODB_URI = "mongodb://localhost:27017/CourseRatingTest";
}


// load modules
var express = require('express');
var morgan = require('morgan');
var {mongoose} = require('./db/mongoose');
var seeder = require('mongoose-seeder');
var data = require('./data/data.json');
var session = require('express-session');
var app = express();
var {router} = require('./routes/routes');
var port = process.env.PORT;

//
var {User} = require('./models/user');
var {Review} = require('./models/review');
var {Course} = require('./models/course');

app.use(session({
	secret: "Secrets for course leaners",
	resave: true,
	saveUninitialized: false
}));

var db = mongoose.connection;
db.on('error', (err) => {
	console.log(err);
});

db.on('open', () => {
	seeder.seed(data).then(function(dbData) {
	}).catch(function(err) {
	    console.log(err);
	});
	console.log("Connected to MongoDB!");
});

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

//begin HTTP methods
app.use('/api/users', router);
app.use('/api/courses', router);


// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
  console.log(err);
});

// start listening on our port
app.listen(port, function() {
  console.log('Connected to port 5000!');
});


module.exports = {app};
