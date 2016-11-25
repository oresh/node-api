var _h = require('../tools/helper');
var mongoose = require('mongoose');
var ModulesSchema = require('../models/drupal');

var modulesController = {
  // post new module
  post: function (req, res) {
  	var module = new ModulesSchema();   // create a new instance of the ModulesSchema model
    // get all request parameters
    module = _h.fill(req, module);

    module.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'Module created!' });
    });
  },
  // get all modules
  get : function (req, res) {
  	ModulesSchema.find().sort({_id: 'descending'}).find(function(err, modules) {
      if (err) res.send(err);
      if (!modules.length) res.json({ message: 'No modules found.' });
      else res.json(modules);
    });
  },
  // get module by id
  getById : function(req, res) {
  	ModulesSchema.findById(req.params.module_id, function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  },
  // upade module by id
  update: function (req, res) {
  	ModulesSchema.findById(req.params.module_id, function(err, modules) {
      if (err) res.send(err);

      for (var prop in req.body) {
        if(!req.body.hasOwnProperty(prop)) continue;
        module[prop] = req.body[prop];
    	}

      modules.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'Module updated!' });
      });
    });
  },
  // delete module by id
  delete : function (req, res) {
  	ModulesSchema.remove({
      _id: req.params.module_id
    }, function(err, modules) {
      if (err) res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  }
}

module.exports = modulesController;
