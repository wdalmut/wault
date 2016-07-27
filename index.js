var _     = require('underscore'),
  ask     = require('./ask'),
  Cli     = require('wcli'),
  levelup = require('levelup'),
  Vault   = require('./archive'),
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

  var vault = new Vault(db, cli.options.password);

  var key, value;
  ask({prompt: "Key:"}).then(function(k) {
    key = k;
    return ask({prompt: "Value:"});
  }).then(function(v) {
    value = v;
    return vault.save(key.split(" "), value);
  }).then(function() {
    cli.info("Your key is stored securely".underline.green);
  }, function(err) {
    cli.error(err + "");
  });
};

cli.get = function(options, args) {
  var db = levelup(options.db);

  var vault = new Vault(db, cli.options.password);

  ask({prompt: "Key:"}).then(function(key) {
    return vault.get(key);
  }).then(function(line) {
    cli.info("Here your content:");
    line.values.forEach(function(value) {
      cli.info(" * " + value.underline.red);
    });
  }, function(err) {
    cli.error(err + "");
  });
};
