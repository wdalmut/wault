beforeEach(function() {
  var requirejs = require('requirejs');

  requirejs.config({
      baseUrl: __dirname + "/../../",
      nodeRequire: require
  });
});

