var _helper = {
	// fill schema with req values
	fill: function(req, schema) {
		for (var prop in req.body) {
      if(!req.body.hasOwnProperty(prop)) continue;
      schema[prop] = req.body[prop];
    }
    return schema;
	}
}

module.exports = _helper;
