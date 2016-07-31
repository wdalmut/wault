beforeEach(function() {
  var requirejs = require('requirejs');

  requirejs.config({
      baseUrl: __dirname + "/../../src",
      nodeRequire: require
  });
});

