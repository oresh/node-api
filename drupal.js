var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port
var assert = require('assert');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Drupal'); // connect to our database
var ModulesSchema = require('./app/models/drupal');

var Vocabularies = require('./app/models/vocabularies');
var Categories = require('./app/models/categories');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' }); 
});

// Modules
router.route('/modules')
  .post(function(req, res) {
    var module = new ModulesSchema();   // create a new instance of the ModulesSchema model
    
    // get all request parameters
    for (var prop in req.body) {
        if(!req.body.hasOwnProperty(prop)) continue;
        module[prop] = req.body[prop];
    }

    module.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Module created!' });
    });
  })
  .get(function(req, res) {
    ModulesSchema.find().sort({_id: 'descending'}).find(function(err, modules) {
      if (err)
        res.send(err);

      res.json(modules);
    });
  });

// Categories
router.route('/categories')
  .post(function(req, res) {
    var category = new Categories();   // create a new instance of the ModulesSchema model
    category.name = req.body.name;  // set the modules name (comes from the request)
    
    category.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Category created!' });
    });
  })
  .get(function(req, res) {
    Categories.find().sort({name: 'ascending'}).find(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  });

// Vocabularies
router.route('/vocabularies')
  .post(function(req, res) {
    var vocabulary = new Vocabularies();   // create a new instance of the ModulesSchema model
    vocabulary.name = req.body.name;  // set the modules name (comes from the request)
    
    vocabulary.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'Vocabulary created!' });
    });
  })
  .get(function(req, res) {
    Vocabularies.find().sort({name: 'ascending'}).find(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  });


router.route('/modules/:module_id')
  // get the modules with that id
  .get(function(req, res) {
    ModulesSchema.findById(req.params.module_id, function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  })
  // update the modules with this id
  .put(function(req, res) {
    ModulesSchema.findById(req.params.module_id, function(err, modules) {
      if (err) res.send(err);

      modules.name = req.body.name;
      modules.description = req.body.description;

      modules.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Module updated!' });
      });

    });
  })
  // delete the modules with this id
  .delete(function(req, res) {
    ModulesSchema.remove({
      _id: req.params.module_id
    }, function(err, modules) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
