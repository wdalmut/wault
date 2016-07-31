var Ask = function(read, q) {
  this.read = read;
  this.q = q;
};

Ask.prototype.require = function(question, hide) {
  var q = this.q;
  var read = this.read;

  var d = q.defer();

  read({prompt: question, silent: ((hide) ? true : false), timeout: 60*1000}, function(err, data) {
    if (err) {
      return d.reject(err);
    }

    return d.resolve(data);
  });

  return d.promise;
};

define(["read", "q"], function(read, q) {
  return new Ask(read, q);
});
