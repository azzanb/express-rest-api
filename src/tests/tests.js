const expect = require('expect');
const mongoose = require('mongoose');
const request = require('supertest');
const {app} = require('./../index');
var seeder = require('mongoose-seeder');
var data = require('./../data/data.json');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');

const user = [
	{
		_id: new ObjectID(),
		fullname: "Azzan Braxton",
		emailAddress: "azzan@yahoo.com",
		password: "braxtons"
	}
];

beforeEach((done) => {
	mongoose.connect("mongodb://localhost:27017/CourseRatingTest", () => {
		useMongoClient: true;
	});
	var db = mongoose.connection;

	db.once('open', () => {
		seeder.seed(data).then(function(dbData) {
			console.log(dbData);
			done();
		}).catch(function(err) {
		    console.log(err);
		});
	});
});

afterEach((done) => {
	mongoose.connection.close();
	done(); 
});


describe('GET /users', () => {
	it('should return an athenticated user', (done) => {
		request(app)
			// .get('/api/users')
			// .expect(200)
			// .end((res) => {
			// 	expect(res).toBe('object');
			// })
			done();
	})
});