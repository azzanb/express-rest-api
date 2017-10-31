//NOTES
//1) NEVER use arrow functions when accessing the 'this' object
/* 2) callbakc(null, user) - null means no errors. When a callback is successful, use null
	it's convention */

const mongoose = require("mongoose");
const validator = require('validator');
var bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true,
		validate: {
			isAsync: false,
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email!'
		}
	},
	password: {
		type: String,
		required: true
	} 
});

UserSchema.statics.userAuthentication = function(email, password, callback){
	let User = this;

	User.findOne({emailAddress: email}, function(err, user){
		if(err) return callback(err);
		else if(!user) return new Error("User Does Not Exist!");

		bcrypt.compare(password, user.password, (err, res) => {
			if(res === true) return callback(null, user);
			else if(res === false) return callback(err);
		});
	});
}


UserSchema.pre('save', function(next){
	let user = this;
	if(user.isModified('password')){
		bcrypt.hash(user.password, 10, function(err, hash) {
		  user.password = hash;
		  next(); 
		});
	}
});

let User = mongoose.model('User', UserSchema);

module.exports = {User};











