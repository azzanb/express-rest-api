/*------------------NOTES NOTES NOTES-----------------*/
//1) Make sure to use 'instance.save()' when PUT/POST/DELETE-ing, or else
	//the DB will just forget the requests!!


const express = require('express'),
 router = express.Router(),
 bodyParser = require('body-parser'),
 {mongoose} = require('./../db/mongoose');

const {User} = require('./../models/user'), 
 midAuth = require('../middleware/userAuth'); 

router.use(bodyParser.json());



//GET all users 
router.get('/users', midAuth.userAuth, (req, res) => {
	console.log(req.user);
	res.send(req.user).json();
});

//POST a new user -- this is posting a 200 and not a 201
router.post('/users', (req, res, next) => {
	let user = {
		fullName: req.body.fullName,
		emailAddress: req.body.emailAddress,
		password: req.body.password
	};
	User.create(user, (err, user) => {
		if(err){
			res.send(400).json();
			next(err);
		}else {
			res.location('/').status(201).json();
		}
	});
});

module.exports = {router};