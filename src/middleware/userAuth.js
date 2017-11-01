'use strict';

var auth = require('basic-auth');
var {User} = require('../models/user'); 

//Check to see if user is in the database. If so, authorize user. 
function userAuth(req, res, next){
	let credentials = auth(req);
	if(!credentials){
		let error = new Error("Access Denied! You must have a valid username and password!");
		error.status = 401
		next(error.message);
	} else {
		//Check credentials against the authentication method
		User.userAuthentication(credentials.name, credentials.pass, function(err, user){
			if(err || !user){
				let error = new Error("Access Denied! There was a problem with your username and/or password!");
				res.status = 401
				next(error.message);
			} else {
				req.user = user;
				next();
			}
		});
	}
	
}

module.exports.userAuth = userAuth;