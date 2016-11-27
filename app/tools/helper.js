var _helper = {
	// fill schema with req values
	fill: function(req, schema) {
		for (var prop in req.body) {
      if(!req.body.hasOwnProperty(prop)) continue;
      schema[prop] = req.body[prop];
    }
    return schema;
	},
	ObjtoArr: function(obj) {
		return arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
	}
}

module.exports = _helper;
