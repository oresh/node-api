var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

// get the list of popular Drupal modules in categories.
var DrupalModulesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Module name is required'],
    unique: true,
    dropDups: true,
    // use minlength validation. this is an example
    validate: {
      // If your validator function takes 2 arguments, mongoose will assume
      // the 2nd argument is a callback.
      validator: function(v) {
        return v.length > 3;
      },
      message: '{VALUE} is too short. Module name must be at least 4 characters'
    },
  },
  project_type: {
    type: String,
    enum: ['Module', 'Theme', 'Translation'],
    default: 'Module'
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now,
    max: Date.now
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
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, retainKeyOrder: true }
);

// Virtual field. Is not stored in DB
DrupalModulesSchema.virtual('full_name').get(function () {
  return this.name;
});

// Validates ObjectId references
DrupalModulesSchema.plugin(idvalidator);

module.exports = DrupalModulesSchema;
