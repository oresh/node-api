var config = require('../configs/config');
var _h = require('../tools/helper');
var mongoose = require('mongoose');
var UsersSchema = require('../models/users');
var UsersModel = mongoose.model('User', UsersSchema);
var roles = require('./roles');

var jwt = require('jsonwebtoken');

var UsersController = {
  // create new user
  create : function (req, res) {
    var newUser = new UsersModel();   // create a new instance of the User Schema model
    newUser = _h.fill(req, newUser);  // set the newUser data (comes from the request)

    newUser.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'User created!', user: newUser });
    });
  },
  // get list of all users
  get : function (req, res) {
    UsersModel.find().sort({_id: 'descending'}).find(function(err, users) {
      if (err) res.send(err);
      res.json(users);
    });
  },
  // create new user
  edit : function (req, res) {
    var user_id = req.decoded._id;
    UsersModel.findByIdAndUpdate( user_id , { $set: req.body }, function(err, user) {
      if (err) res.send(err);
      res.json({ message: 'Your profile has been updated!', user: user });
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
      if (user === null) {
        res.json({ message: 'User does not exist' });
        return;
      }

      user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            var userObject = user.toObject();
            // if user is found and password is right create a token
            var token = jwt.sign(userObject, config.secretToken, {
              expiresIn: '1 day' // expires in 24 hours
            });
            res.json({
              message: 'Successfull login',
              user: user,
              token : token
            });
          } else {
            res.json({ message: 'Password incorrect' });
          }
      });

    });
  }
  // todo : update method with token validation.
  // https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
}

module.exports = UsersController;
