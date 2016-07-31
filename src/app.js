define(["./cli"], function(cli) {
  return function() {
    cli().parse(process.argv.slice(2));
  };
});
