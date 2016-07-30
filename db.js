var Db = function(q, crypto, levelup, _) {
  this.q = q;
  this.crypto = crypto;
  this.levelup = levelup;
  this._ = _;
};

Db.prototype.generateKey = function(password, key) {
  return this.crypto.hash(key + "_" + password, "hex");
};

Db.prototype.save = function(password, key, value) {
  var _ = this._;
  var d = this.q.defer();
  var crypto = this.crypto;
  var levelup = this.levelup;

  var cryptoKey = this.generateKey(password, key);

  this.get(password, key).then(function(values) {
    values.push(value);
    values = _.uniq(values);

    return levelup.putAsync(
      cryptoKey,
      crypto.encrypt(password, JSON.stringify(values))
    );
  }).then(function() {
    d.resolve();
  }).fail(function(err) {
    d.reject(err);
  });

  return d.promise;
};

Db.prototype.get = function(password, key) {
  var d = this.q.defer();
  var crypto = this.crypto;
  var cryptoKey = this.generateKey(password, key);

  this.levelup.getAsync(cryptoKey).then(function(value) {
    var decrypted = crypto.decrypt(password, value);
    d.resolve(JSON.parse(decrypted));
  }, function(err) {
    if (err.notFound) {
      return d.resolve([]);
    }

    return d.reject(err);
  });

  return d.promise;
};

Db.prototype.del = function(password, key) {
  var d = this.q.defer();
  var crypto = this.crypto;
  var cryptoKey = this.generateKey(password, key);

  this.levelup.delAsync(cryptoKey).then(function() {
    d.resolve();
  }, function(err) {
    if (err.notFound) {
      return d.resolve();
    }

    return d.reject(err);
  });

  return d.promise;
};

define(["q", "./aes256", "./level", "underscore"], function(q, crypto, levelup, _) {
  return new Db(q, crypto, levelup, _);
});
