var _h = require('../tools/helper');
var mongoose = require('mongoose');
var CategoriesSchema = require('../models/categories');
var CategoriesModel = mongoose.model('Category', CategoriesSchema);

var categoryController = {
  // post new category
  post : function(req, res) {
    var category = new CategoriesModel(); // create a new instance of the Categories Schema model
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
    CategoriesModel.find().sort({name: 'ascending'}).find(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  }
}

module.exports = categoryController;
