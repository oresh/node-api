var _h = require('../tools/helper');
var mongoose = require('mongoose');
var ModulesSchema = require('../models/drupal');
var ModulesModel = mongoose.model('Drupal', ModulesSchema);

var modulesController = {
  // post new module
  post: function (req, res) {
  	var module = new ModulesModel();   // create a new instance of the ModulesModel model
    // get all request parameters
    module = _h.fill(req, module);

    module.save(function(err) {
      if (err) {
        var path = err.errors;
        if (path.hasOwnProperty('project_type')) {
          // error with project_type field. Check validators:
          // ModulesSchema.path('project_type'));
        }
      }
      if (err) res.send(err);
      res.json({ message: 'Module created!' });
    });
  },
  // get all modules
  get : function (req, res) {
  	ModulesModel.find().sort({_id: 'descending'}).populate('_category').exec(function (err, modules) {
      if (err) res.send(err);
      if (!modules.length) {
      	res.json({ message: 'No modules found.' });
      } else {
      	res.json(modules);
      }
    });
  },
  // get module by id
  getById : function(req, res) {
  	ModulesModel.findById(req.params.module_id).populate('_category').exec(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  },
  // upade module by id
  update: function (req, res) {
  	ModulesModel.findById(req.params.module_id, function(err, modules) {
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
  	ModulesModel.remove({
      _id: req.params.module_id
    }, function(err, modules) {
      if (err) res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  }
}

module.exports = modulesController;
