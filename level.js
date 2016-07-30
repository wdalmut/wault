define(["levelup", "./config", "bluebird"], function(levelup, config, Promise) {
  var db = levelup(config.db.path);

  Promise.promisifyAll(db);

  return db;
});
