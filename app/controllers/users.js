var _h = require('../tools/helper');
var mongoose = require('mongoose');
var UsersSchema = require('../models/users');
var UsersModel = mongoose.model('User', UsersSchema);
var roles = require('./roles');

var UsersController = {
  // create new user
  create : function (req, res) {
  	var newUser = new UsersModel();   // create a new instance of the User Schema model
    newUser = _h.fill(req, newUser);  // set the newUser data (comes from the request)

    newUser.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'User created!' });
    });
  },
  // get list of all users
  get : function (req, res) {
  	UsersModel.find().sort({_id: 'descending'}).find(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  },
  // get list of all users
  login : function (req, res) {
  	var email = req.body.email;
  	if (!email) {
  		res.json({ message: 'Email is not specified' });
  		return;
  	}
  	var password = req.body.password;
  	if (!password) {
  		res.json({ message: 'Password is not specified' });
  		return;
  	}

  	UsersModel.findOne({ email: email }, function(err, user) {
  		if (err) throw err;

  		user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          console.log('Password match', isMatch);
          if (isMatch) {
	          res.json({ message: 'Successfull login' });
	        } else {
	        	res.json({ message: 'Password incorrect' });
	        }
      });

  	});

  }
}

module.exports = UsersController;
