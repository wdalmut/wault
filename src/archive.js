var Promise = require('bluebird'),
  crypt     = require('./aes256'),
  q         = require('q'),
  _         = require('underscore')
;

Archive = function(q, db) {
  this.q = q;
  this.db = db;
};

Archive.prototype.save = function(password, keys, value) {
  var db = this.db;

  var saves = [];
  keys.split(" ").forEach(function(key) {
    saves.push(db.save(password, key, value));
  });

  return this.q.all(saves);
};

Archive.prototype.get = function(password, keys) {
  var db = this.db;

  var gets = [];
  keys.split(" ").forEach(function(key) {
    gets.push(db.get(password, key));
  });

  return this.q.all(gets);
};

Archive.prototype.del = function(password, keys) {
  var db = this.db;

  var dels = [];
  keys.split(" ").forEach(function(key) {
    dels.push(db.del(password, key));
  });

  return this.q.all(dels);
};

define(["q", "./db"], function(q, db) {
  return new Archive(q, db);
});
