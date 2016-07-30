describe("Ask", function() {
  var ask = null;

  beforeEach(function() {
    var requirejs = require('requirejs');

    requirejs.define("read", [], function(q) {
      return function(options, callback) {
        callback(undefined, "OK");
      };
    });

    ask = requirejs('./ask');
  });

  it("should reply with the user input", function(done) {
    ask.require("Key").then(function(key) {
      expect(key).toEqual("OK");
      done();
    });
  });
});

