#!/usr/bin/env node

var _     = require('underscore'),
  ask     = require('./ask'),
  Cli     = require('wcli'),
  levelup = require('levelup'),
  crypt   = require('./aes256'),
  Promise = require('bluebird')
  dbPath  = process.env.WAULT_PATH || "/tmp/wault.level"
;

var opts = {
  db: [false, "The database path", dbPath]
};

cli = new Cli({
  "store": _.defaults(opts, {}),
  "get": _.defaults(opts, {}),
});

ask({
    prompt: "Password:",
    timeout: 60*1000,
    silent: true,
}).then(function(password) {
  cli.options.password = password;

  cli.parse(process.argv.slice(2));
});

cli.store = function(options, args) {
  var db = levelup(options.db);
  Promise.promisifyAll(db);

  var key, value;
  ask({prompt: "Key:"}).then(function(k) {
    key = k;
    return ask({prompt: "Value:"});
  }).then(function(v) {
    value = v;
    return db.putAsync(crypt.hash(key, 'hex'), crypt.encrypt(cli.options.password, value));
  }).then(function() {
    cli.info("Your key is stored securely".underline.green);
  }, function(err) {
    cli.error(err + "");
  });
};

cli.get = function(options, args) {
  var db = levelup(options.db);
  Promise.promisifyAll(db);

  ask({prompt: "Key:"}).then(function(key) {
    return db.getAsync(crypt.hash(key, 'hex'));
  }).then(function(value) {
    cli.info("Here your content: " + crypt.decrypt(cli.options.password, value).underline.red);
  }, function(err) {
    cli.error(err + "");
  });
}
