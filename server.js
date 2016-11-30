var config = require('config'); //we load the db location from the JSON files
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var appConfig = require('./app/configs/config');
var jwt = require('jsonwebtoken');

var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};


// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect(config.DBHost, options); // connect to our database

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    //app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// controllers
var modulesController = require('./app/controllers/modules');
var vocabulariesController = require('./app/controllers/vocabularies');
var categoryController = require('./app/controllers/categories');
var UsersController = require('./app/controllers/users');

// ROUTES FOR OUR API
// =============================================================================

var validateToken = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, appConfig.secretToken, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// Categories
router.route('/categories')
  .post(function(req, res) { categoryController.post(req, res); })
  .get(function(req, res) { categoryController.get(req, res); });

// Vocabularies
router.route('/vocabularies')
  .post(function(req, res) { vocabulariesController.post(req, res); })
  .get(function(req, res) { vocabulariesController.get(req, res); });

// Modules
router.route('/modules')
  .post(function(req, res) { modulesController.post(req, res); })
  .get(function(req, res) { modulesController.get(req, res); })
  .delete(function(req, res) { modulesController.delete(req, res); });
router.route('/modules/:module_id')
  .get(function(req, res) { modulesController.getById(req, res); })
  .put(function(req, res) { modulesController.update(req, res); })
  .delete(function(req, res) { modulesController.delete(req, res); });

// Users
router.route('/users')
  .get(function(req, res) { UsersController.get(req, res); });

router.route('/user/register')
  .post(function(req, res) { UsersController.create(req, res); })
router.route('/user/login')
  .post(function(req, res) { UsersController.login(req, res); })

// token dependent routes
router.use(validateToken);

router.route('/user/edit')
  .put(function(req, res) { UsersController.edit(req, res); })


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app; // for testing
