const express = require('express'),
 router = express.Router(),
 bodyParser = require('body-parser'),
 {mongoose} = require('./../db/mongoose');

const {Course} = require('./../models/course'), 
 {Review} = require('./../models/review'), 
 midAuth = require('../middleware/userAuth'); 

 router.use(bodyParser.json());

//GET courses and return only title and _id
router.get('/', (req, res, next) => {
	Course.find({}, 'title _id', (err, courses) => {
		if(err) return next(err);
		res.send(courses);
	});
});

//GET individual course and include deep population
router.get('/:courseId', (req, res, next) => {
	Course.findOne({_id: req.params.courseId}).populate('user reviews').exec((err, course) => {
		if(err){
			res.send(err);
			return next(err);
		} 
		res.send(course);
	});
});

//POST a new course
router.post('/', midAuth.userAuth, (req, res, next) => {
	var course = new Course({
		user: req.body.user._id,
		title: req.body.title,
		description: req.body.description,
		estimatedTime: req.body.estimatedTime,
		materialsNeeded: req.body.materialsNeeded,
		steps: req.body.steps
	});

	course.save((err, course) => {
		if(err){
			res.status(400);
			next(err);
		} else {
			res.location('/').status(201).json();
		}
	});
});

//PUT (update) an already existing course
router.put('/:courseId', midAuth.userAuth, (req, res, next) => {
	let options = {
		new: true
	};

	Course.findByIdAndUpdate(req.params.courseId, req.body, options, (err, course) => {
		if(err){
			res.send(err);
			next(err);
		} else {
			return res.status(204).json()
		}
	});
});

//POST a review to an existing course
router.post('/:courseId/reviews', midAuth.userAuth, (req, res, next) => {
	Course.findById(req.params.courseId).populate('user').exec((err, course) =>{
		if(err) return next(err);

		let doc = new Review(req.body);
	
		course.reviews.push(doc);

		doc.save(function(err){
          if (err) return next(err);
        });

		course.save(function(err){
          if (err) return next(err);
        });

		res.location('/' + req.params.courseId).status(201).json();
	});
});

module.exports = router;

