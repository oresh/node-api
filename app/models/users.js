var roles = require('../controllers/roles');
var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UsersSchema = new Schema({
  email: {
    type: String,
    tolowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(v);
      }
    },
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  role: {
    type: String,
    enum: roles.getRoles(),
    default: roles.getDefault()
  }
});

UsersSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if (err) return next(err);
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

UsersSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = UsersSchema;
