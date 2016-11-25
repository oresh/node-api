var _h = require('../tools/helper');
var mongoose = require('mongoose');
var VocabulariesSchema = require('../models/vocabularies');

var vocabulariesController = {
  // post new vocabulary
  post : function (req, res) {
  	var vocabulary = new VocabulariesSchema();   // create a new instance of the Vocabularies Schema model
    vocabulary = _h.fill(req, vocabulary);  // set the vocabulary name (comes from the request)

    vocabulary.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'Vocabulary created!' });
    });
  },
  // get list of all vocabularies
  get : function (req, res) {
  	VocabulariesSchema.find().sort({name: 'ascending'}).find(function(err, modules) {
      if (err) res.send(err);
      res.json(modules);
    });
  }
}

module.exports = vocabulariesController;
