const express = require('express'),
 router = express.Router(),
 bodyParser = require('body-parser'),
 {mongoose} = require('./../db/mongoose');

const {Course} = require('./../models/course'), 
 {Review} = require('./../models/review'), 
 midAuth = require('../middleware/userAuth'); 

//GET courses and return only title and _id
router.get('/', (req, res) => {
	Course.find({}, 'title _id', (err, courses) => {
		if(err) return next(err);
		res.send(courses);
	});
});

//GET individual course and include deep population
router.get('/:courseId', (req, res) => {
	Course.findById(req.params.courseId).populate({
		path: 'user',
		select: 'fullName'
	}).populate({
		path: 'reviews',
		select: 'review'
	}).lean().exec((err, course) => {
		if(err) return res.send(err);
		console.log(course);
		res.send(res).json();
	});
});

//POST a new course
router.post('/', midAuth.userAuth, (req, res, next) => {
	let course = {
		user: req.user._id,
		title: req.body.title,
		description: req.body.description,
		estimatedTime: req.body.estimatedTime,
		materialsNeeded: req.body.materialsNeeded,
		steps: req.body.steps
	};

	Course.create(course, (err, course) => {
		if(err){
			console.log(req.user)
			res.send(400).json();
			next(err);
		}else {
			res.location('/');
			res.status(201).send();
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
			res.send(400).json();
			next(err);
		} else {
			console.log(course);
			return res.status(204).json();
		}
	});
});

//POST a review to an existing course
router.post('/:courseId/reviews', midAuth.userAuth, (req, res, next) => {
	Course.findById(req.params.courseId).populate('user').exec((err, course) =>{
		if(err) return next(err);


		let review = {
			user: course.user._id,
			rating: req.body.rating
		}
		let doc = new Review(review);
		console.log(course.user._id);
		

		// if(course.user._id.toString() === course.reviews._id.toString()){
		// 	let error = new Error("You've already reviewed this course!");
		// 	next(error);
		// } else {
			course.reviews.push(doc);
			console.log(course.reviews[0]._id);

			doc.save(function(err){
	          if (err) return next(err);
	        });

			course.save(function(err){
	          if (err) return next(err);
	        });

			res.location('/' + req.params.courseId).status(201).json();
		//}
	})
});

module.exports = router;

