var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Drupal'); // connect to our database

// controllers
var modulesController = require('./app/controllers/modules');
var vocabulariesController = require('./app/controllers/vocabularies');
var categoryController = require('./app/controllers/categories');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening.');
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
  .get(function(req, res) { modulesController.get(req, res); });
router.route('/modules/:module_id')
  .get(function(req, res) { modulesController.getById(req, res); })
  .put(function(req, res) { modulesController.update(req, res); })
  .delete(function(req, res) { modulesController.delete(req, res); });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
