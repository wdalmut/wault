var read = require("read"),
  q = require("q")
;

var Ask = function(options) {
  var d = q.defer();

  read(options, function(err, data) {
    if (err) {
      return d.reject(err);
    }

    return d.resolve(data);
  })

  return d.promise;
};

module.exports = Ask;
