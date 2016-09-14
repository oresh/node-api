var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

// get the list of popular Drupal modules in categories.
var DrupalModulesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Module name is required'],
    unique: true,
    dropDups: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    required: [true, 'Module link is required']
  },
  favorite: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    min: [-1, "Order can't be less than -1"],
    max: [1000, "Order can't be more than 1000"],
    default: 1
  },
  _category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
});

DrupalModulesSchema.plugin(idvalidator);

module.exports = mongoose.model('Drupal', DrupalModulesSchema);
