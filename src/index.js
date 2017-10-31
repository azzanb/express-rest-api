'use strict';


/* Set up environment variables to differentiate a test db from a development db. 
	This is to ensure the development db does not get deleted when testing. 
*/
var env = process.env.NODE_ENV || 'development';
console.log(env);

if(env === 'development'){
	process.env.PORT === 5000;
	process.env.MONGODB_URI = "mongodb://localhost:27017/CourseRating";
} else if(env === 'test'){
	process.env.PORT === 5000;
	process.env.MONGODB_URI = "mongodb://localhost:27017/CourseRatingTest";
}


// load modules
const express = require('express'),
 morgan = require('morgan'),
 {mongoose} = require('./db/mongoose'),
 seeder = require('mongoose-seeder'),
 data = require('./data/data.json'),
 session = require('express-session'),
 app = express(),
 courseRoutes = require('./routes/course'),
 userRoutes = require('./routes/user'),
 port = process.env.PORT;

//
const {User} = require('./models/user'),
 {Review} = require('./models/review'),
 {Course} = require('./models/course');

app.use(session({
	secret: "Secrets for course leaners",
	resave: true,
	saveUninitialized: false
}));

const db = mongoose.connection;
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
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


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
