var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

var CategoriesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    min: 1,
    default: 1
  },
  _parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  _vid: {
    type: Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true
  }
});

CategoriesSchema.plugin(idvalidator);

module.exports = mongoose.model('Category', CategoriesSchema);