var Promise = require('bluebird'),
  crypt     = require('./aes256'),
  q         = require('q'),
  _         = require('underscore')
;

Archive = function(db, password) {
  Promise.promisifyAll(db);

  this.db = db;
  this.password = password;

  return this;
};

Archive.prototype.generateKey = function(key) {
  return key + "_" + this.password;
};

Archive.prototype.save = function(keys, value) {
  var self = this;
  var d = q.defer();

  var getPromises = [];
  var savePromises = [];
  keys.forEach(function(key) {
    getPromises.push(self.get(key));
  });

  q.all(getPromises).then(function(replies) {
    replies.forEach(function(line) {
      line.values.push(value);
      line.values = _.uniq(line.values);

      savePromises.push(self.saveKey(line.key, JSON.stringify(line.values)));
    });

    return q.all(savePromises);
  }).then(function() {
    d.resolve();
  }).fail(function(err) {
    d.reject(err);
  });

  return d.promise;
};

Archive.prototype.saveKey = function(key, value) {
  var self = this;

  key = self.generateKey(key);
  return self.db.putAsync(crypt.hash(key, 'hex'), crypt.encrypt(self.password, value));
};

Archive.prototype.get = function(key) {
  var d = q.defer();

  var self = this;

  var rekey = this.generateKey(key);

  this.db.getAsync(crypt.hash(rekey, 'hex')).then(function(value) {
    var decypted = crypt.decrypt(self.password, value);
    d.resolve({key: key, values: JSON.parse(decypted)});
  }, function(err) {
    if (err.notFound) {
      return d.resolve({key: key, values: []});
    }
    d.reject(err);
  });

  return d.promise;
};

Archive.prototype.del = function(key) {
  var d = q.defer();

  var self = this;

  var rekey = this.generateKey(key);

  this.db.delAsync(crypt.hash(rekey, 'hex')).then(function() {
    d.resolve(key);
  }, function(err) {
    d.reject(err);
  });

  return d.promise;
};

module.exports = Archive;
