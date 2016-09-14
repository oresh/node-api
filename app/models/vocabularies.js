var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VocabulariesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    min: 1,
    default: 1
  },
});

module.exports = mongoose.model('Vocabulary', VocabulariesSchema);