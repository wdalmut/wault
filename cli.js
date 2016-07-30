define(["wcli", "archive", "./ask", "underscore"], function(Cli, archive, ask, _) {
  return function() {
    var opts = {};
    var cli = new Cli({
      "store": _.defaults(opts, {}),
      "get": _.defaults(opts, {}),
      "del": _.defaults(opts, {}),
    });

    cli.store = function(options, args) {
      var password, key, value;

      ask.require("Password:", true).then(function(pwd) {
        password = pwd;
        return ask.require("Keys:");
      }).then(function(k) {
        key = k;
        return ask.require("Value:");
      }).then(function(v) {
        value = v;
        return archive.save(password, key, value);
      }).then(function() {
        cli.info("OK");
      }).fail(function(err) {
        console.log(err);
      });
    };

    cli.get = function(options, args) {
      var key = "";
      ask.require("Password:", true).then(function(pwd) {
        password = pwd;
        return ask.require("Keys:");
      }).then(function(k) {
        key = k;
        return archive.get(password, key);
      }).then(function(v) {
        v = _.uniq(_.flatten(v));

        cli.info("Here your content:");

        v.forEach(function(value) {
          cli.info(" * " + value.underline.red);
        });
      });
    };

    cli.del = function(options, args) {
      var key = null;
      ask.require("Password:", true).then(function(pwd) {
        password = pwd;
        return ask.require("Keys:");
      }).then(function(k) {
        key = k;
        return archive.del(password, key);
      }).then(function(v) {
        cli.info("Keys: '" + key + "' deleted");
      });
    };

    return cli;
  };
});
