var _h = require('../tools/helper');
var mongoose = require('mongoose');
var CategoriesSchema = require('../models/categories');

var categoryController = {
  // post new category
  post : function(req, res) {
    var category = new CategoriesSchema(); // create a new instance of the Categories Schema model
    category = _h.fill(req, category);

    category.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Category created!' });
    });
  },
  // get list of all categories
  get : function(req, res) {
    CategoriesSchema.find().sort({name: 'ascending'}).find(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  }
}

module.exports = categoryController;
