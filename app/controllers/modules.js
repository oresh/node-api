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
      res.json({ message: 'Module created!', module : module });
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
    var module_id = req.params.module_id;
    // To get the item back, use findByIdAndUpdate with 2nd parametr in callback
    ModulesModel.findByIdAndUpdate({ _id: module_id }, { $set: req.body }, function(err, module) {
      if (err) res.send(err);
      res.json({ message: 'Module updated!', module : module });
    });

    // As alternative you can find the record by id, edit and save.
  	/* ModulesModel.findById(module_id, function(err, modules) {
      if (err) res.send(err);
      modules = _h.fill(req, modules);
      modules.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'Module updated!' });
      });
    }); */

  },
  // delete module by id, or array of ids.
  // This can be the same request width different params, but wanted the
  // messages to be different :)
  delete : function (req, res) {
    if (typeof req.body.module_id == 'object') {
      var ids = _h.ObjtoArr(req.body.module_id);
      ModulesModel.remove({ _id: { $in: ids } }, function(err, modules) {
        if (err) res.send(err);
        if (!modules.length) res.json({ message: 'No modules found' });
        else res.json({ message: 'Modules successfully deleted.', deleted: true });
      });
    } else {
      var module_id = req.params.module_id ? req.params.module_id : req.body.module_id;
    	ModulesModel.remove({
        _id: module_id
      }, function(err, modules) {
        if (err) res.send(err);
        if (!modules.length) res.json({ message: 'No modules found' });
        else res.json({ message: 'Successfully deleted', deleted: true });
      });
    }
  },
}

module.exports = modulesController;
